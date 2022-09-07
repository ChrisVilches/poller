import { IsString, MinLength } from "class-validator";

export class TagQueryDto {
  @IsString()
  @MinLength(1)
  name: string;
}
