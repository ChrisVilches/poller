import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  Get,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EmptyReturnInterceptor } from '../interceptors/empty-return.interceptor';
import { ProcessErrorInterceptor } from '../interceptors/process-error.interceptor';
import { Polling } from '@persistence/entities/polling.entity';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { PollingsService } from '@persistence/services/pollings.service';
import { performPolling } from '@scraping/performPolling';
import { PollingDto } from '@persistence/dto/polling.dto';
import { ApiTags } from '@nestjs/swagger';
import { PENDING_ENDPOINTS_QUEUE } from '@background-process/queues';
import { PendingEndpoint } from '@interfaces/PendingEndpoint';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { PaginatedResultDto } from '@api/dto/paginated-result.dto';
import { PollingPaginatedQueryDto } from '@api/dto/polling-paginated-query.dto';

@UseInterceptors(ProcessErrorInterceptor)
@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('pollings')
@ApiTags('Pollings')
export class PollingsController {
  constructor(
    private readonly pollingsService: PollingsService,
    private readonly endpointsService: EndpointsService,
    @InjectQueue(PENDING_ENDPOINTS_QUEUE)
    private pendingEndpointsQueue: Queue<PendingEndpoint>,
  ) {}

  @Get()
  findAll(
    @Query() query: PollingPaginatedQueryDto,
  ): Promise<PaginatedResultDto<Polling>> {
    return this.pollingsService.findAll(query);
  }

  @Get(':endpointId')
  findAllForEndpoint(
    @Param('endpointId', ParseIntPipe) endpointId: number,
    @Query() query: PollingPaginatedQueryDto,
  ): Promise<PaginatedResultDto<Polling>> {
    return this.pollingsService.findAll(query, endpointId);
  }

  @Get(':endpointId/latest')
  findLatest(@Param('endpointId', ParseIntPipe) endpointId: number) {
    return this.pollingsService.findLatest(endpointId);
  }

  @Post(':endpointId/enqueue')
  async enqueue(
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ): Promise<Endpoint | null> {
    const endpoint = await this.endpointsService.findOne(endpointId);
    this.pendingEndpointsQueue.add({
      endpointId: endpoint.id,
      manual: true,
    });
    return endpoint;
  }

  @Post(':endpointId/poll')
  async poll(
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ): Promise<Polling | null> {
    const endpoint = await this.endpointsService.findOne(endpointId);
    const pollingDto: PollingDto = await performPolling(endpoint, true);
    return await this.pollingsService.create(pollingDto);
  }
}
