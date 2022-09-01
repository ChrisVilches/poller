import { ArgType } from '@persistence/enum/arg-type.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Argument } from './argument.entity';
import { Navigation } from './navigation.entity';

const sortById = (arr: (Navigation | Argument)[]) =>
  arr.sort((a, b) => a.id - b.id);

const cleanArguments = (args: any[]) =>
  sortById(args || []).map((a: any) => {
    switch (a.type) {
      case ArgType.BOOLEAN:
        return a.value === 'true';
      case ArgType.STRING:
        return a.value;
      case ArgType.NUMBER:
        return +a.value;
      default:
        throw new Error('Wrong argument type came from the database');
    }
  });

const cleanNavigations = (nav: Navigation[]) =>
  sortById(nav).map((n: Navigation) => n.selector);

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({
    type: 'enum',
    enum: RequestType,
    default: RequestType.HTML,
  })
  @Transform((params: TransformFnParams) =>
    params.value === RequestType.HTML ? 'html' : 'json',
  )
  type: RequestType;

  @Column()
  url: string;

  @Column()
  rule: string;

  @Column({ default: false })
  not: boolean;

  @Column({ nullable: true })
  notificationMessage?: string;

  @Column({ default: 15 })
  periodMinutes: number;

  navigation() {
    return cleanNavigations(this.navigations);
  }

  args() {
    return cleanArguments(this.arguments);
  }

  formattedTitle() {
    return this.title || this.url;
  }

  @Transform((params: TransformFnParams) => cleanNavigations(params.value))
  @OneToMany(() => Navigation, (nav) => nav.endpoint, {
    cascade: ['insert', 'update'],
  })
  navigations: Navigation[];

  @Expose()
  @Transform((params: TransformFnParams) => cleanArguments(params.value))
  @OneToMany(() => Argument, (arg) => arg.endpoint, {
    cascade: ['insert', 'update'],
  })
  arguments: Argument[];

  @Column({ nullable: true, default: 60 })
  waitAfterNotificationMinutes?: number;

  @Column({ nullable: true })
  timeout?: Date;

  @Column({ default: true })
  staticHtml: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
