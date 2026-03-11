import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type ResourceType = 'workout' | 'template';
export type Permission = 'view' | 'edit';

@Entity('shares')
export class Share {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resourceType: ResourceType;

  @Column()
  resourceId: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  sharedWithId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sharedWithId' })
  sharedWith: User;

  @Column({ default: 'view' })
  permission: Permission;

  @CreateDateColumn()
  createdAt: Date;
}
