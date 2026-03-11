import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../exercises/exercise.entity';

@Entity('workout_sets')
export class WorkoutSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workoutId: string;

  @ManyToOne(() => Workout, (workout) => workout.sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column()
  exerciseId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column({ default: 0 })
  setOrder: number;

  @Column({ default: 0 })
  reps: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  weightKg: number;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  completedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
