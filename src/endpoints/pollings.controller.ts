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

    const [result] = await pollMany([endpoint])

    if (Object.keys(result).length === 0) {
      return result
    }

    const polling = new Polling()
    polling.endpoint = endpoint

    if (result.error) {
      polling.error = result.error
    }

    polling.manual = true
    polling.requestCode = result.status
    polling.shouldNotify = result.shouldNotify

    const obj = {
      manual: true,
      requestCode: result.status,
      shouldNotify: result.shouldNotify,
      error: result.error,
      endpoint
    }

    this.pollingsService.create(obj)

    return result
  }
}
