import 'reflect-metadata';
import { PartialType } from '@nestjs/swagger';
import { EndpointCreateDto } from './endpoint-create.dto';
import { IsArray, IsInt, IsOptional, IsPositive } from 'class-validator';

export class EndpointUpdateDto extends PartialType(EndpointCreateDto) {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  tags?: number[]
}
