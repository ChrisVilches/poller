import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
import { PollingsService } from './pollings.service';
import { EndpointsService } from '../endpoints/endpoints.service';
import { Polling } from './entities/polling.entity';

@Controller('pollings')
export class PollingsController {
  constructor(
    private readonly pollingsService: PollingsService,
    private readonly endpointsService: EndpointsService,
  ) {}

  @Post(':id/poll')
  async poll(@Param('id') id: string): Promise<Polling | null> {
    const endpoint = await this.endpointsService.findOne(+id);

    // TODO: Can I do this with some decorator magic?
    if (endpoint === null) {
      throw new NotFoundException();
    }

    return await this.pollingsService.poll(endpoint, true);
  }
}
