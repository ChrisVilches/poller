import { Endpoint } from './endpoint.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Polling {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Maybe it should be called "responseCode" instead of "request".
  @Column({ nullable: true })
  requestCode?: number;

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

  // TODO: This one shouldn't be here.
  @Column()
  endpointId: number;
}
