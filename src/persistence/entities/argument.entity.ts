import { ArgType } from '@persistence/enum/arg-type.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Argument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ArgType,
  })
  type: ArgType;

  @Column()
  value: string;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.arguments, {
    orphanedRowAction: 'delete',
    // TODO: When and why did I put this onDelete Cascade?
    // onDelete: 'CASCADE',
  })
  endpoint: Endpoint;
}
