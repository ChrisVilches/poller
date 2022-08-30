import { IsIn, IsString, MinLength } from 'class-validator';

export class CreateArgumentDto {
  @IsString()
  @MinLength(1)
  @IsIn(['string', 'boolean', 'number'])
  type: string;

  @IsString()
  value: string;
}
