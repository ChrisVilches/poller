import { IsIn, IsString, MinLength } from 'class-validator';

export class ArgumentDto {
  @IsString()
  @MinLength(1)
  @IsIn(['string', 'boolean', 'number'])
  type: string;

  @IsString()
  value: string;
}
