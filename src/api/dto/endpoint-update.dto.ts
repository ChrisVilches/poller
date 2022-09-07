import 'reflect-metadata';
import { PartialType } from '@nestjs/swagger';
import { EndpointCreateDto } from './endpoint-create.dto';

export class EndpointUpdateDto extends PartialType(EndpointCreateDto) {}
