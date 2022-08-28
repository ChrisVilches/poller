import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selector: string;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.navigations)
  endpoint: Endpoint;
}
