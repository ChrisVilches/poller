import { ArgType } from '@persistence/enum/arg-type.enum';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { Allow, IsIn } from 'class-validator';
import { valueToArgType } from '../../../src/util';

export class ArgumentDto {
  // TODO: If I convert it to string, the next time the transformations
  //       are applied (they execute multiple times, sadly) the type would
  //       become string. So the only workaround is to simply leave it as is,
  //       and expect the value to be inserted in the database without problems
  //       (converted to string since that's the column type in Postgres)
  // @ToString()
  @Allow()
  value: string | number | boolean;

  @Expose()
  @Allow()
  @IsIn([ArgType.BOOLEAN, ArgType.NUMBER, ArgType.STRING], {
    message: 'Only numbers, strings, or booleans allowed',
  })
  @Transform((params: TransformFnParams) => valueToArgType(params.obj.value))
  type: ArgType;
}
