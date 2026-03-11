import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Share, ResourceType, Permission } from './share.entity';
import { CollaborativeSession } from './collaborative-session.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SharingService {
  constructor(
    @InjectRepository(Share)
    private sharesRepo: Repository<Share>,
    @InjectRepository(CollaborativeSession)
    private sessionsRepo: Repository<CollaborativeSession>,
  ) {}

  async canAccess(
    resourceType: ResourceType,
    resourceId: string,
    userId: string,
    needEdit: boolean,
  ): Promise<boolean> {
    const share = await this.sharesRepo.findOne({
      where: {
        resourceType,
        resourceId,
        sharedWithId: userId,
      },
    });
    if (!share) return false;
    if (needEdit && share.permission !== 'edit') return false;
    return true;
  }

  async getSharedWorkoutIds(userId: string): Promise<string[]> {
    const shares = await this.sharesRepo.find({
      where: { sharedWithId: userId, resourceType: 'workout' },
    });
    return shares.map((s) => s.resourceId);
  }

  async getSharedTemplateIds(userId: string): Promise<string[]> {
    const shares = await this.sharesRepo.find({
      where: { sharedWithId: userId, resourceType: 'template' },
    });
    return shares.map((s) => s.resourceId);
  }

  async getUserIdsWithAccess(
    resourceType: ResourceType,
    resourceId: string,
  ): Promise<string[]> {
    const shares = await this.sharesRepo.find({
      where: { resourceType, resourceId },
    });
    return shares.map((s) => s.sharedWithId);
  }

  async share(
    resourceType: ResourceType,
    resourceId: string,
    ownerId: string,
    sharedWithId: string,
    permission: Permission,
  ): Promise<Share> {
    const existing = await this.sharesRepo.findOne({
      where: { resourceType, resourceId, sharedWithId },
    });
    if (existing) {
      existing.permission = permission;
      return this.sharesRepo.save(existing);
    }
    const share = this.sharesRepo.create({
      resourceType,
      resourceId,
      ownerId,
      sharedWithId,
      permission,
    });
    return this.sharesRepo.save(share);
  }

  async getSharedWithMe(userId: string): Promise<Share[]> {
    return this.sharesRepo.find({
      where: { sharedWithId: userId },
    });
  }

  async revokeShare(
    shareId: string,
    ownerId: string,
  ): Promise<void> {
    const share = await this.sharesRepo.findOne({
      where: { id: shareId, ownerId },
    });
    if (!share) throw new NotFoundException('Share not found');
    await this.sharesRepo.remove(share);
  }

  async createCollaborativeSession(
    workoutId: string,
    userId: string,
  ): Promise<CollaborativeSession> {
    const participants = [userId];
    const session = this.sessionsRepo.create({
      workoutId,
      participantIdsJson: JSON.stringify(participants),
    });
    return this.sessionsRepo.save(session);
  }

  async joinCollaborativeSession(
    sessionId: string,
    userId: string,
  ): Promise<CollaborativeSession> {
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.endedAt) throw new ForbiddenException('Session has ended');
    const participants: string[] = JSON.parse(session.participantIdsJson);
    if (!participants.includes(userId)) {
      participants.push(userId);
      session.participantIdsJson = JSON.stringify(participants);
      await this.sessionsRepo.save(session);
    }
    return session;
  }

  async leaveCollaborativeSession(
    sessionId: string,
    userId: string,
  ): Promise<void> {
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    const participants: string[] = JSON.parse(session.participantIdsJson);
    const idx = participants.indexOf(userId);
    if (idx >= 0) {
      participants.splice(idx, 1);
      session.participantIdsJson = JSON.stringify(participants);
      if (participants.length === 0) {
        session.endedAt = new Date();
      }
      await this.sessionsRepo.save(session);
    }
  }

  async getSession(sessionId: string, userId: string): Promise<CollaborativeSession> {
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    const participants: string[] = JSON.parse(session.participantIdsJson);
    if (!participants.includes(userId)) {
      throw new ForbiddenException('Not a participant');
    }
    return session;
  }

  getSessionParticipantIds(session: CollaborativeSession): string[] {
    return JSON.parse(session.participantIdsJson);
  }

  async getSessionById(sessionId: string): Promise<CollaborativeSession | null> {
    return this.sessionsRepo.findOne({ where: { id: sessionId } });
  }
}
