import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class NavigationDto {
  @IsString()
  @MinLength(1)

  // TODO: Too bad I have to verify the value is a string before applying the function.
  @Transform((params: TransformFnParams) =>
    typeof params.value === 'string' ? params.value.trim() : params.value,
  )
  selector: string;
}
