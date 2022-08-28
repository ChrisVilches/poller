import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { performPolling } from '../performPolling';
import { Repository } from 'typeorm';
import { CreatePollingDto } from './dto/create-polling.dto';
import { Endpoint } from './entities/endpoint.entity';
import { Polling } from './entities/polling.entity';

/*
TODO: Strange code... there's a "poll many" and a "poll one"
which calls the "poll many" with a single element array.
It can be refactored into a simpler way (just one function).
*/

@Injectable()
export class PollingsService {
  constructor(
    @InjectRepository(Polling)
    private pollingsRepository: Repository<Polling>,
  ) {}

  async create(createPollingDto: CreatePollingDto) {
    const polling = this.pollingsRepository.create(createPollingDto);
    await this.pollingsRepository.save(polling);
  }

  // TODO: Is it ok to add this?
  save(polling: Polling) {
    return this.pollingsRepository.save(polling);
  }

  findLatest(endpointId: number) {
    return this.pollingsRepository.findOne({
      where: {
        endpointId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async poll(endpoint: Endpoint, manual: boolean): Promise<Polling | null> {
    const result = await this.pollAux(endpoint, manual);

    if (result !== null) {
      this.create(result);
    }

    return result;
  }

  private async pollAux(
    endpoint: Endpoint,
    manual: boolean,
  ): Promise<Polling | null> {
    const { enabled = false, type } = endpoint;
    console.assert(type === 'html');

    const polling: Polling = this.pollingsRepository.create({
      endpoint,
      manual,
    });

    if (!enabled) {
      return null;
    }

    try {
      const { status, shouldNotify } = await performPolling(endpoint);
      polling.requestCode = status;
      polling.shouldNotify = shouldNotify;
      return polling;
    } catch (e) {
      polling.error = e.message;
      return polling;
    }
  }
}
