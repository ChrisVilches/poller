import { ArgType } from '@persistence/enum/arg-type.enum';
import { ToString } from '@persistence/transformations/to-string.transformation';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { Allow, IsIn } from 'class-validator';

const argEnumValue = (value: any): ArgType => {
  if (typeof value === 'number') {
    return ArgType.NUMBER;
  }
  if (typeof value === 'boolean') {
    return ArgType.BOOLEAN;
  }
  if (typeof value === 'string') {
    return ArgType.STRING;
  }

  return ArgType.INVALID;
};

export class ArgumentDto {
  @ToString()
  @Allow()
  value: string;

  @Expose()
  @Allow()
  @IsIn([ArgType.BOOLEAN, ArgType.NUMBER, ArgType.STRING], {
    message: 'Only numbers, strings, or booleans allowed',
  })
  @Transform((params: TransformFnParams) => argEnumValue(params.obj.value))
  type: ArgType;
}
export const a = Expose;
