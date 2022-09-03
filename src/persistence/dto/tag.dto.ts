import { PartialType } from '@nestjs/mapped-types';
import { Trim } from '@persistence/transformations/trim.transformation';
import { IsString, MinLength } from 'class-validator';

export class TagDto {
  @IsString()
  @MinLength(1)
  @Trim()
  name: string;
}

export class PartialTagDto extends PartialType(TagDto) {}
