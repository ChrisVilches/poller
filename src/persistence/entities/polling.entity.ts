import { Endpoint } from './endpoint.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Polling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  responseCode?: number;

  @Expose()
  requestCompleted() {
    return this.responseCode !== null;
  }

  @Column({ nullable: true })
  error: string;

  @Column({ default: false })
  shouldNotify: boolean;

  @Column()
  manual: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.navigations)
  endpoint: Endpoint;

  @Column({ nullable: true })
  computedMessage?: string;

  @Exclude()
  @Column()
  endpointId: number;
}
