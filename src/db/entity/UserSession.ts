import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 256, unique: true, nullable: false })
  token!: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column({ nullable: false })
  usedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
