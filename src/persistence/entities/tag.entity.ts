import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Endpoint, { eager: true, cascade: true })
  @JoinTable()
  endpoints: Endpoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
