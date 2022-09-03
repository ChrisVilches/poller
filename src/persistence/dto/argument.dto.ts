import { ArgType } from '@persistence/enum/arg-type.enum';
import { valueToArgType } from '@util/misc';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { Allow, IsIn } from 'class-validator';

export class ArgumentDto {
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
