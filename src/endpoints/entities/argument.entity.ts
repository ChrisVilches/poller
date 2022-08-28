import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Argument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  value: string;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.arguments)
  endpoint: Endpoint;
}
