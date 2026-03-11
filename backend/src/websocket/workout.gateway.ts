import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WorkoutsService } from '../workouts/workouts.service';
import { SharingService } from '../sharing/sharing.service';

interface AuthenticatedSocket extends Partial<{ userId: string }> {}

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/ws',
})
export class WorkoutGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WorkoutGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private workoutsService: WorkoutsService,
    private sharingService: SharingService,
  ) {}

  async handleConnection(client: any) {
    try {
      const token =
        client.handshake?.auth?.token ||
        client.handshake?.query?.token ||
        client.handshake?.headers?.authorization?.replace?.('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      (client as AuthenticatedSocket).userId = userId;
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    const userId = (client as AuthenticatedSocket).userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async emitToWorkoutAccess(workoutId: string, event: string, data: any) {
    const userIds = await this.workoutsService.getWorkoutOwnerAndSharedUserIds(workoutId);
    for (const uid of userIds) {
      const sockets = this.userSockets.get(uid);
      if (sockets) {
        for (const socketId of sockets) {
          this.server.to(socketId).emit(event, data);
        }
      }
    }
  }

  async emitToSession(sessionId: string, event: string, data: any) {
    const session = await this.sharingService.getSessionById(sessionId);
    if (!session) return;
    const participantIds = this.sharingService.getSessionParticipantIds(session);
    for (const uid of participantIds) {
      const sockets = this.userSockets.get(uid);
      if (sockets) {
        for (const socketId of sockets) {
          this.server.to(socketId).emit(event, data);
        }
      }
    }
  }

  broadcastWorkoutCreated(workoutId: string, workout: any) {
    this.emitToWorkoutAccess(workoutId, 'workout:created', workout);
  }

  broadcastWorkoutUpdated(workoutId: string, workout: any) {
    this.emitToWorkoutAccess(workoutId, 'workout:updated', workout);
  }

  broadcastSetAdded(workoutId: string, set: any) {
    this.emitToWorkoutAccess(workoutId, 'set:added', set);
  }

  broadcastSetUpdated(workoutId: string, set: any) {
    this.emitToWorkoutAccess(workoutId, 'set:updated', set);
  }

  broadcastSetCompleted(workoutId: string, sessionId: string | null, set: any) {
    this.emitToWorkoutAccess(workoutId, 'set:completed', set);
    if (sessionId) {
      this.emitToSession(sessionId, 'session:set:completed', set);
    }
  }

  @SubscribeMessage('session:join')
  async handleSessionJoin(client: any, payload: { sessionId: string }) {
    const userId = (client as AuthenticatedSocket).userId;
    if (!userId) return;
    client.join(`session:${payload.sessionId}`);
  }

  @SubscribeMessage('session:leave')
  handleSessionLeave(client: any, payload: { sessionId: string }) {
    client.leave(`session:${payload.sessionId}`);
  }
}
