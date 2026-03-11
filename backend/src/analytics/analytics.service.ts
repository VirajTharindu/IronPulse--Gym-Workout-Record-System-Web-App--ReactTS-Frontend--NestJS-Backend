import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutSet } from '../workouts/workout-set.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(WorkoutSet)
    private setsRepo: Repository<WorkoutSet>,
  ) {}

  async getVolumeOverTime(
    userId: string,
    exerciseId?: string,
    days = 30,
  ): Promise<{ date: string; volume: number }[]> {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const qb = this.setsRepo
      .createQueryBuilder('set')
      .innerJoin('set.workout', 'w')
      .where('w.userId = :userId', { userId })
      .andWhere('set.completedAt IS NOT NULL')
      .andWhere('set.completedAt >= :start', { start: start.toISOString() });
    if (exerciseId) {
      qb.andWhere('set.exerciseId = :exerciseId', { exerciseId });
    }
    const sets = await qb.getMany();
    const byDate = new Map<string, number>();
    for (const s of sets) {
      const d = (s.completedAt as Date).toISOString().slice(0, 10);
      const vol = Number(s.reps) * Number(s.weightKg);
      byDate.set(d, (byDate.get(d) || 0) + vol);
    }
    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, volume]) => ({ date, volume }));
  }

  async getPersonalRecords(userId: string): Promise<
    { exerciseId: string; exerciseName: string; weight: number; reps: number }[]
  > {
    const result = await this.setsRepo
      .createQueryBuilder('set')
      .innerJoinAndSelect('set.workout', 'w')
      .innerJoinAndSelect('set.exercise', 'e')
      .where('w.userId = :userId', { userId })
      .andWhere('set.completedAt IS NOT NULL')
      .andWhere('set.weightKg > 0')
      .getMany();
    const filtered = result.filter(
      (s) => s.completedAt && Number(s.weightKg) > 0,
    );
    const byEx = new Map<
      string,
      { exerciseName: string; weight: number; reps: number }
    >();
    for (const s of filtered) {
      const w = Number(s.weightKg);
      const r = Number(s.reps);
      const cur = byEx.get(s.exerciseId);
      if (!cur || w > cur.weight) {
        byEx.set(s.exerciseId, {
          exerciseName: s.exercise?.name || '',
          weight: w,
          reps: r,
        });
      }
    }
    return Array.from(byEx.entries()).map(([exerciseId, v]) => ({
      exerciseId,
      ...v,
    }));
  }
}
