import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseIntPipe,
  Get,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EmptyReturnInterceptor } from '../interceptors/empty-return.interceptor';
import { ProcessErrorInterceptor } from '../interceptors/process-error.interceptor';
import { Polling } from '@persistence/entities/polling.entity';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { PollingsService } from '@persistence/services/pollings.service';

@UseInterceptors(ProcessErrorInterceptor)
@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('pollings')
export class PollingsController {
  constructor(
    private readonly pollingsService: PollingsService,
    private readonly endpointsService: EndpointsService,
  ) {}

  @Get()
  findAll() {
    return this.pollingsService.findAll();
  }

  @Get(':endpointId')
  findAllForEndpoint(@Param('endpointId', ParseIntPipe) endpointId: number) {
    return this.pollingsService.findAllForEndpoint(endpointId);
  }

  @Get(':endpointId/latest')
  findLatest(@Param('endpointId', ParseIntPipe) endpointId: number) {
    return this.pollingsService.findLatest(endpointId);
  }

  @Post(':id/poll')
  async poll(@Param('id', ParseIntPipe) id: number): Promise<Polling | null> {
    const endpoint = await this.endpointsService.findOne(id);
    return await this.pollingsService.poll(endpoint, true);
  }
}
