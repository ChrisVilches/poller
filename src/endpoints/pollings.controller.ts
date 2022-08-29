import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { PollingsService } from './pollings.service';
import { EndpointsService } from '../endpoints/endpoints.service';
import { Polling } from './entities/polling.entity';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';

@UseInterceptors(NotFoundInterceptor)
@Controller('pollings')
export class PollingsController {
  constructor(
    private readonly pollingsService: PollingsService,
    private readonly endpointsService: EndpointsService,
  ) {}

  @Post(':id/poll')
  async poll(@Param('id', ParseIntPipe) id: number): Promise<Polling | null> {
    const endpoint = await this.endpointsService.findOne(id);

    if (endpoint === null) {
      return null;
    }

    return await this.pollingsService.poll(endpoint, true);
  }
}
