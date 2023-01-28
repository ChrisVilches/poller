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
  // TODO: Should be called "tagIds" I think (but I'd have to modify the frontend as well)
  tags?: number[];
}
