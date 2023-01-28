import { ApiProperty } from '@nestjs/swagger';
// TODO: Not sure if this TODO remains.
// TODO: Should be imported from Swagger.
//       Expected result: (1) Pass tests. (2) Generate docs correctly.
import { Trim } from '@transformations/trim.transformation';
import { IsString, MinLength } from 'class-validator';

export class TagUpsertDto {
  @IsString()
  @MinLength(1)
  @Trim()
  @ApiProperty()
  name: string;
}
