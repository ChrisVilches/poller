import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsIn } from 'class-validator';

export class ArgumentDto {
  @Expose()
  @IsIn(['number', 'string', 'boolean'])
  @Transform((params: TransformFnParams) => {
    return typeof params.obj.value;
  })
  type: string;

  @Transform((params: TransformFnParams) => {
    return `${params.value}`;
  })
  value: string;
}
