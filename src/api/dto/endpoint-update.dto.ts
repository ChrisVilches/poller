import 'reflect-metadata';
import { PartialType } from '@nestjs/mapped-types';
import { EndpointCreateDto } from './endpoint-create.dto';

export class EndpointUpdateDto extends PartialType(EndpointCreateDto) {}
