import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';


export enum ArgType {
  NUMBER,
  STRING,
  BOOLEAN,
  INVALID
}

@Entity()
export class Argument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ArgType
  })
  type: ArgType;

  @Column()
  value: string;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.arguments, {
    orphanedRowAction: 'delete',
  })
  endpoint: Endpoint;
}
