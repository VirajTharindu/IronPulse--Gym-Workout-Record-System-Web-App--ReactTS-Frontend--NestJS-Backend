import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/user.entity';
import { Workout } from './workout.entity';
import { WorkoutSet } from './workout-set.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';
import { SharingService } from '../sharing/sharing.service';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepo: Repository<Workout>,
    @InjectRepository(WorkoutSet)
    private setsRepo: Repository<WorkoutSet>,
    private sharingService: SharingService,
  ) {}

  private async ensureAccess(workoutId: string, userId: string, edit = false) {
    const workout = await this.workoutsRepo.findOne({
      where: { id: workoutId },
      relations: ['sets', 'sets.exercise'],
    });
    if (!workout) throw new NotFoundException('Workout not found');
    if (workout.userId === userId) return workout;
    const hasAccess = await this.sharingService.canAccess(
      'workout',
      workoutId,
      userId,
      edit,
    );
    if (!hasAccess) throw new ForbiddenException('Access denied');
    return workout;
  }

  async findAll(userId: string): Promise<Workout[]> {
    const own = await this.workoutsRepo.find({
      where: { userId },
      relations: ['sets'],
      order: { startedAt: 'DESC' },
    });
    const shared = await this.sharingService.getSharedWorkoutIds(userId);
    if (shared.length === 0) return own;
    const sharedWorkouts = await this.workoutsRepo.find({
      where: { id: In(shared) },
      relations: ['sets'],
      order: { startedAt: 'DESC' },
    });
    const combined = [...own];
    for (const w of sharedWorkouts) {
      if (!combined.find((x) => x.id === w.id)) combined.push(w);
    }
    combined.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
    return combined;
  }

  async findOne(id: string, userId: string): Promise<Workout> {
    return this.ensureAccess(id, userId);
  }

  async create(dto: CreateWorkoutDto, userId: string): Promise<Workout> {
    const workout = this.workoutsRepo.create({
      userId,
      templateId: dto.templateId,
      notes: dto.notes || '',
    });
    return this.workoutsRepo.save(workout);
  }

  async update(
    id: string,
    dto: UpdateWorkoutDto,
    userId: string,
  ): Promise<Workout> {
    const workout = await this.ensureAccess(id, userId, true);
    if (dto.notes !== undefined) workout.notes = dto.notes;
    if (dto.completedAt !== undefined)
      workout.completedAt = new Date(dto.completedAt);
    return this.workoutsRepo.save(workout);
  }

  async remove(id: string, userId: string): Promise<void> {
    const workout = await this.ensureAccess(id, userId, true);
    await this.workoutsRepo.remove(workout);
  }

  async getSets(workoutId: string, userId: string): Promise<WorkoutSet[]> {
    const workout = await this.ensureAccess(workoutId, userId);
    return workout.sets || [];
  }

  async addSet(
    workoutId: string,
    dto: CreateWorkoutSetDto,
    userId: string,
  ): Promise<WorkoutSet> {
    await this.ensureAccess(workoutId, userId, true);
    const set = this.setsRepo.create({
      workoutId,
      exerciseId: dto.exerciseId,
      setOrder: dto.setOrder,
      reps: dto.reps,
      weightKg: dto.weightKg ?? 0,
    });
    return this.setsRepo.save(set);
  }

  async updateSet(
    workoutId: string,
    setId: string,
    dto: UpdateWorkoutSetDto,
    userId: string,
  ): Promise<WorkoutSet> {
    await this.ensureAccess(workoutId, userId, true);
    const set = await this.setsRepo.findOne({
      where: { id: setId, workoutId },
      relations: ['exercise'],
    });
    if (!set) throw new NotFoundException('Set not found');
    if (dto.setOrder !== undefined) set.setOrder = dto.setOrder;
    if (dto.reps !== undefined) set.reps = dto.reps;
    if (dto.weightKg !== undefined) set.weightKg = dto.weightKg;
    if (dto.completedAt !== undefined) {
      set.completedAt = new Date(dto.completedAt);
      set.completedByUserId = userId;
    }
    return this.setsRepo.save(set);
  }

  async removeSet(
    workoutId: string,
    setId: string,
    userId: string,
  ): Promise<void> {
    await this.ensureAccess(workoutId, userId, true);
    const set = await this.setsRepo.findOne({
      where: { id: setId, workoutId },
    });
    if (!set) throw new NotFoundException('Set not found');
    await this.setsRepo.remove(set);
  }

  async getWorkoutOwnerAndSharedUserIds(workoutId: string): Promise<string[]> {
    const workout = await this.workoutsRepo.findOne({ where: { id: workoutId } });
    if (!workout) return [];
    const shared = await this.sharingService.getUserIdsWithAccess(
      'workout',
      workoutId,
    );
    return [workout.userId, ...shared];
  }
}
