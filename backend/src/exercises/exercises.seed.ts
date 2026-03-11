import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';

const defaultExercises = [
  { name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps', equipment: 'Cable' },
  { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable' },
];

@Injectable()
export class ExercisesSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepo: Repository<Exercise>,
  ) {}

  async onModuleInit() {
    const existing = await this.exercisesRepo.count();
    if (existing > 0) return;
    for (const ex of defaultExercises) {
      await this.exercisesRepo.save(
        this.exercisesRepo.create({
          ...ex,
          isCustom: false,
        }),
      );
    }
  }
}
