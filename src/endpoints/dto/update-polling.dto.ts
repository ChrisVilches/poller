import { PartialType } from '@nestjs/mapped-types';
import { CreatePollingDto } from './create-polling.dto';

export class UpdatePollingDto extends PartialType(CreatePollingDto) {}
