import { ApiProperty } from '@nestjs/swagger';
// TODO: Should be imported from Swagger.
//       Expected result: (1) Pass tests. (2) Generate docs correctly.
import { PartialType } from '@nestjs/mapped-types';
import { Trim } from '@transformations/trim.transformation';
import { IsString, MinLength } from 'class-validator';

export class TagDto {
  @IsString()
  @MinLength(1)
  @Trim()
  @ApiProperty()
  name: string;
}

export class TagPartialDto extends PartialType(TagDto) {}
