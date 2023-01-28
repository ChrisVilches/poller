import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import * as moment from 'moment';
import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { endpointDtoToEntity } from '@util/endpoints';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) {}

  async create(dto: EndpointCreateDto): Promise<Endpoint> {
    const entity = await endpointDtoToEntity(EndpointCreateDto, dto);

    const created = await this.endpointsRepository.save(entity);
    return await this.findOne(created.id);
  }

  async clearTimeout(id: number) {
    await this.endpointsRepository.update({ id }, { timeout: null } as any);
  }

  async update(id: number, dto: EndpointUpdateDto): Promise<Endpoint> {
    if ((await this.findOne(id)) === null) {
      throw new EntityNotFoundError(Endpoint.name, {});
    }

    const entity = await endpointDtoToEntity(EndpointUpdateDto, dto);

    await this.endpointsRepository.save({
      ...entity,
      id,
    } as any);

    return await this.findOne(id);
  }

  findAll() {
    return this.endpointsRepository.find({
      order: {
        id: 'ASC',
      },
      relations: {
        argumentList: true,
        navigationList: true,
      },
    });
  }

  findEnabled() {
    return this.endpointsRepository.find({
      where: {
        enabled: true,
      },
      relations: {
        argumentList: true,
        navigationList: true,
      },
    });
  }

  async delete(id: number): Promise<Endpoint> {
    const endpoint: Endpoint = await this.findOne(id);
    this.endpointsRepository.delete({
      id: endpoint.id,
    });
    return endpoint;
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

  /**
   * @throws {EntityNotFoundError}
   */
  async findOne(id: number): Promise<Endpoint> {
    const endpoint: Endpoint | null = await this.endpointsRepository.findOne({
      where: { id },
      relations: {
        argumentList: true,
        navigationList: true,
      },
    });

    if (endpoint === null) {
      throw new EntityNotFoundError(Endpoint.name, {});
    }

    return endpoint;
  }
}
