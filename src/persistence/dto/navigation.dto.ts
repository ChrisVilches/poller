import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class NavigationDto {
  @IsString()
  @MinLength(1)
  @Transform((params: TransformFnParams) => params.value.trim())
  selector: string;
}
