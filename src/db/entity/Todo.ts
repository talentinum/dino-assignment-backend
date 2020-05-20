import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({ length: 64, nullable: false })
  title!: string;

  @Column({ length: 256, nullable: false })
  desc!: string;

  @Column()
  accomplished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  @Index()
  modifiedAt!: Date;
}
