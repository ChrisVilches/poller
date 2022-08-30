import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';
import { Polling } from '@persistence/entities/polling.entity';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { PollingsService } from '@persistence/services/pollings.service';

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
