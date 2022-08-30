import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { performPolling } from '../../performPolling';
import { LessThan, Repository } from 'typeorm';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Polling } from '@persistence/entities/polling.entity';
import { CreatePollingDto } from '@persistence/dto/create-polling.dto';
import { validateAndTransform } from '../../util';

@Injectable()
export class PollingsService {
  constructor(
    @InjectRepository(Polling)
    private pollingsRepository: Repository<Polling>,
  ) {}

  findAll() {
    return this.pollingsRepository.find();
  }

  findAllForEndpoint(endpointId: number) {
    return this.pollingsRepository.find({
      where: {
        endpointId,
      },
    });
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

  removeOlderThan(date: Date) {
    return this.pollingsRepository.delete({
      createdAt: LessThan(date),
    });
  }

  /**
   * Does not check whether the record is enabled or not.
   */
  async poll(endpoint: Endpoint, manual: boolean): Promise<Polling | null> {
    const result = await this.pollAux(endpoint, manual);
    return await this.create(result);
  }

  async create(createPollingDto: CreatePollingDto) {
    const polling: Polling = this.pollingsRepository.create(
      await validateAndTransform(CreatePollingDto, createPollingDto),
    );
    const saved: Polling = await this.pollingsRepository.save(polling);
    return await this.findOne(saved.id);
  }

  findOne(id: number) {
    return this.pollingsRepository.findOne({
      where: { id },
      relations: {
        endpoint: true,
      },
    });
  }

  private async pollAux(
    endpoint: Endpoint,
    manual: boolean,
  ): Promise<CreatePollingDto> {
    const polling = new CreatePollingDto();
    polling.endpointId = endpoint.id;
    polling.manual = manual;

    try {
      // TODO: This module is about persistence, so is it OK that this is executed here?
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
