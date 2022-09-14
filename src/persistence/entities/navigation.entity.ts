import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selector: string;

  // TODO: There are orphans in this table and argument, it seems.
  //       I have to make sure they are deleted.
  @ManyToOne(() => Endpoint, (endpoint) => endpoint.navigations, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  endpoint: Endpoint;
}
