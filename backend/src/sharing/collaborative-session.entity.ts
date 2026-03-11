import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workout } from '../workouts/workout.entity';

@Entity('collaborative_sessions')
export class CollaborativeSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workoutId: string;

  @ManyToOne(() => Workout)
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column({ type: 'text' })
  participantIdsJson: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date;
}
