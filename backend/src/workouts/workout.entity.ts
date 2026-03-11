import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { WorkoutSet } from './workout-set.entity';
import { Template } from '../templates/template.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  templateId: string;

  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ default: '' })
  notes: string;

  @OneToMany(() => WorkoutSet, (set) => set.workout)
  sets: WorkoutSet[];
}
