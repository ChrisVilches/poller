import { ArgType } from '@persistence/enum/arg-type.enum';
import { Method } from '@persistence/enum/method.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
import { enumKeysToString, sortById } from '@util/misc';
import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Argument } from './argument.entity';
import { Navigation } from './navigation.entity';
import { Tag } from './tag.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({ type: 'enum', enum: RequestType })
  @Transform((params: TransformFnParams) => RequestType[params.value])
  type: RequestType;

  @Column({ type: 'enum', enum: Method })
  @Transform((params: TransformFnParams) => Method[params.value])
  method: Method;

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

  @Expose()
  navigations(): string[] {
    return sortById(this.navigationList).map((n: Navigation) => n.selector);
  }

  @Expose()
  arguments(): (number | string | boolean)[] {
    return sortById(this.argumentList || []).map((a: any) => {
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
  }

  methodLowerCase() {
    return enumKeysToString(Method, [this.method])[0].toLowerCase();
  }

  typeFormatted() {
    return enumKeysToString(RequestType, [this.type])[0].toLowerCase();
  }

  formattedTitle() {
    return this.title || this.url;
  }

  toString(): string {
    return `${this.formattedTitle()} (${this.typeFormatted()}, ${this.methodLowerCase()})`;
  }

  @Exclude()
  @OneToMany(() => Navigation, (nav) => nav.endpoint, {
    cascade: ['insert', 'update'],
  })
  navigationList: Navigation[];

  @Exclude()
  @OneToMany(() => Argument, (arg) => arg.endpoint, {
    cascade: ['insert', 'update'],
  })
  argumentList: Argument[];

  @Column({ nullable: true, default: 60 })
  waitAfterNotificationMinutes?: number;

  @Column({ nullable: true })
  timeout?: Date;

  @ManyToMany(() => Tag, (tag) => tag.endpoints, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  tags: Tag[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
