import { Endpoint } from "./endpoint.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Polling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestCode: string

  @Column({ nullable: true })
  error: string

  @Column()
  shouldNotify: boolean

  @Column()
  manual: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Endpoint, endpoint => endpoint.navigations)
  endpoint: Endpoint

  // TODO: This one shouldn't be here.
  @Column()
  endpointId: number
}
