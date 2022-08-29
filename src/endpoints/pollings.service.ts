import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { performPolling } from '../performPolling';
import { LessThan, Repository } from 'typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { Polling } from './entities/polling.entity';

@Injectable()
export class PollingsService {
  constructor(
    @InjectRepository(Polling)
    private pollingsRepository: Repository<Polling>,
  ) {}

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

  removeOlderThan(date: Date) {
    return this.pollingsRepository.delete({
      createdAt: LessThan(date)
    });
  }

  async poll(endpoint: Endpoint, manual: boolean): Promise<Polling | null> {
    const result = await this.pollAux(endpoint, manual);

    if (result !== null) {
      await this.pollingsRepository.save(result);
    }

    return result;
  }

  private async pollAux(
    endpoint: Endpoint,
    manual: boolean,
  ): Promise<Polling | null> {
    const { enabled = false } = endpoint;
    if (!enabled) {
      return null;
    }

    const polling: Polling = this.pollingsRepository.create({
      endpoint,
      manual,
    });

    try {
      const { status, shouldNotify } = await performPolling(endpoint);
      polling.responseCode = status;
      polling.shouldNotify = shouldNotify;
      return polling;
    } catch (e) {
      polling.error = e.message;
      return polling;
    }
  }
}
