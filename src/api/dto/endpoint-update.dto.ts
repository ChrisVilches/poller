import 'reflect-metadata';
// TODO: Should be imported from Swagger.
//       Expected result: (1) Pass tests. (2) Generate docs correctly.
import { PartialType } from '@nestjs/mapped-types';
import { EndpointCreateDto } from './endpoint-create.dto';
import { IsArray, IsInt, IsOptional, IsPositive } from 'class-validator';

export class EndpointUpdateDto extends PartialType(EndpointCreateDto) {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  tags?: number[];
}
