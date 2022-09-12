import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selector: string;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.navigations, {
    orphanedRowAction: 'delete',
    // TODO: When and why did I put this onDelete Cascade?
    // onDelete: 'CASCADE',
  })
  endpoint: Endpoint;
}
