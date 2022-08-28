import { Controller, Post, Param } from '@nestjs/common';
import { PollingsService } from './pollings.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { Polling } from './entities/polling.entity';
import { Endpoint } from '../endpoints/entities/endpoint.entity';
import { pollMany } from '../pollMany';
import { EndpointsService } from '../endpoints/endpoints.service';

@Controller('pollings')
export class PollingsController {
  constructor(private readonly pollingsService: PollingsService, private readonly endpointsService: EndpointsService) {}

  @Post(':id/poll')
  async poll(@Param('id') id: string) {
    const endpoint: Endpoint | null = await this.endpointsService.findOne(+id)
    
    if (endpoint === null) {
      // TODO: Error handling should be correct (and more concise)
      throw new Error('Not found')
    }

    return await this.pollingsService.pollOne(endpoint)
  }
}
