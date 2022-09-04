import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import * as moment from 'moment';
import { EndpointDto, EndpointPartialDto } from '@persistence/dto/endpoint.dto';
import { transformAndValidate } from 'class-transformer-validator';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) {}

  async create(endpointDto: EndpointDto): Promise<Endpoint> {
    const created = await this.endpointsRepository.save(
      (await transformAndValidate(EndpointDto, endpointDto)) as Endpoint,
    );

    return await this.findOne(created.id);
  }

  async clearTimeout(id: number) {
    await this.endpointsRepository.update({ id }, { timeout: null } as any);
  }

  async update(id: number, endpointDto: EndpointPartialDto): Promise<Endpoint> {
    if ((await this.findOne(id)) === null) {
      throw new EntityNotFoundError(Endpoint.name, {});
    }

    await this.endpointsRepository.save({
      id,
      ...(await transformAndValidate(EndpointPartialDto, endpointDto)),
    } as any);

    return await this.findOne(id);
  }

  findAll() {
    return this.endpointsRepository.find({
      order: {
        id: 'ASC',
      },
      relations: {
        arguments: true,
        navigations: true,
      },
    });
  }

  findEnabled() {
    return this.endpointsRepository.find({
      where: {
        enabled: true,
      },
      relations: {
        arguments: true,
        navigations: true,
      },
    });
  }

  async updateTimeout(
    notification: boolean,
    endpoint: Endpoint,
    now = new Date(),
  ) {
    let minutesFromNow: number = endpoint.periodMinutes;

    if (notification) {
      minutesFromNow = Math.max(
        minutesFromNow,
        endpoint.waitAfterNotificationMinutes || 0,
      );
    }

    const newTimeoutDate = moment(now).add(minutesFromNow, 'minutes').toDate();

    await this.endpointsRepository.update(
      { id: endpoint.id },
      { timeout: newTimeoutDate },
    );
  }

  countAll() {
    return this.endpointsRepository.count();
  }

  async enable(id: number, enabledValue: boolean): Promise<boolean> {
    const endpoint = await this.findOne(id);
    endpoint.enabled = enabledValue;
    const saved = await this.endpointsRepository.save(endpoint);
    return saved.enabled;
  }

  async findOne(id: number): Promise<Endpoint> {
    const endpoint: Endpoint | null = await this.endpointsRepository.findOne({
      where: { id },
      relations: {
        arguments: true,
        navigations: true,
      },
    });

    if (endpoint === null) {
      throw new EntityNotFoundError(Endpoint.name, {});
    }

    return endpoint;
  }
}
