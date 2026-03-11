import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export interface TemplateExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps?: number;
  targetWeightKg?: number;
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text' })
  exercisesJson: string;

  @CreateDateColumn()
  createdAt: Date;
}
