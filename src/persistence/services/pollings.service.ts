import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { performPolling } from '@scraping/performPolling';
import { LessThan, Repository } from 'typeorm';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Polling } from '@persistence/entities/polling.entity';
import { PollingDto } from '@persistence/dto/polling.dto';
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
  async poll(endpoint: Endpoint, manual: boolean): Promise<Polling> {
    const result = await this.pollAux(endpoint, manual);
    return await this.create(result);
  }

  async create(createPollingDto: PollingDto): Promise<Polling> {
    const polling: Polling = this.pollingsRepository.create(
      await validateAndTransform(PollingDto, createPollingDto),
    );

    const saved: Polling = await this.pollingsRepository.save(polling);
    return (await this.findOne(saved.id)) as Polling;
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
  ): Promise<PollingDto> {
    const polling = new PollingDto();
    polling.endpointId = endpoint.id;
    polling.manual = manual;
    polling.shouldNotify = false;

    try {
      // TODO: This module is about persistence, so is it OK that this is executed here?
      //       It's also not OK if I move it to the background process module, because polling
      //       is not necessarily a background job (it can be done manually too). So where?
      //       Maybe it's own POJO model (it doesn't depend on NestJS).
      const { status, shouldNotify, computedMessage } = await performPolling(
        endpoint,
      );
      polling.responseCode = status;
      polling.shouldNotify = shouldNotify;
      polling.computedMessage = computedMessage;
      return polling;
    } catch (e) {
      polling.error = e.message;
      return polling;
    }
  }
}
