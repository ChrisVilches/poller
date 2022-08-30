import { IsString, MinLength } from 'class-validator';

export class CreateNavigationDto {
  @IsString()
  @MinLength(1)
  selector: string;
}
