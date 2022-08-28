import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Argument } from './argument.entity';
import { Navigation } from './navigation.entity';

// TODO: Must add timestamps to every table

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ default: true })
  enabled: boolean;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column()
  rule: string;

  @Column({ default: true })
  not: boolean;

  @Column({ nullable: true })
  notificationMessage?: string

  @Column()
  periodMinutes: number

  @OneToMany(() => Argument, arg => arg.endpoint, { cascade: ['insert', 'update'] })
  arguments: Argument[];

  @OneToMany(() => Navigation, nav => nav.endpoint, { cascade: ['insert', 'update'] })
  navigations: Navigation[];
}
