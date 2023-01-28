import { ArgType } from '@persistence/enum/arg-type.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Endpoint } from './endpoint.entity';

const typeMap = {
  string: ArgType.STRING,
  boolean: ArgType.BOOLEAN,
  number: ArgType.NUMBER,
};

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

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.argumentList, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  endpoint: Endpoint;

  static fromValue(value: string | number | boolean): Argument {
    const arg = new Argument();
    arg.value = String(value);

    if (!(typeof value in typeMap)) {
      throw new Error(`Incorrect type (${typeof value}), value: ${value}`);
    }

    arg.type = typeMap[typeof value as keyof typeof typeMap];
    return arg;
  }
}
