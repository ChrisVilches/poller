import { PartialType } from '@nestjs/swagger';
import { Trim } from '@transformations/trim.transformation';
import { IsString, MinLength } from 'class-validator';

export class TagDto {
  @IsString()
  @MinLength(1)
  @Trim()
  name: string;
}

export class TagPartialDto extends PartialType(TagDto) {}
