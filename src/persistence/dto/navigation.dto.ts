import { Trim } from '@persistence/transformations/trim.transformation';
import { IsString, MinLength } from 'class-validator';

export class NavigationDto {
  @IsString()
  @MinLength(1)
  @Trim()
  selector: string;
}
