import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateAndTransform } from '../../util';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from '@persistence/dto/create-endpoint.dto';
import { UpdateEndpointDto } from '@persistence/dto/update-endpoint.dto';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import * as moment from 'moment';
import { CreateNavigationDto } from '@persistence/dto/create-navigation.dto';
import { CreateArgumentDto } from '@persistence/dto/create-argument.dto';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) {}

  async populateFromJson(jsonData: any[]) {
    for (const endpoint of jsonData) {
      const {
        rule,
        title,
        url,
        enabled,
        periodMinutes,
        notificationMessage,
        not,
      } = endpoint;
      const e = this.endpointsRepository.create({
        rule,
        title,
        url,
        enabled,
        periodMinutes,
        notificationMessage,
        not,
        type: 'html',
        navigations: [],
        arguments: [],
      });

      e.navigations = (endpoint.navigation || []).map((selector: string) => {
        const n = new Navigation();
        n.selector = selector;
        return n;
      });

      e.arguments = (endpoint.args || []).map((val: string) => {
        const a = new Argument();
        a.type = typeof val;
        a.value = String(val);
        return a;
      });

      await this.endpointsRepository.save(e);
    }
  }

  async create(createEndpointDto: CreateEndpointDto) {
    const endpoint: Endpoint = this.endpointsRepository.create(
      await validateAndTransform(CreateEndpointDto, createEndpointDto),
    );
    return this.endpointsRepository.save(endpoint);
  }

  async update(
    id: number,
    updateEndpointDto: UpdateEndpointDto,
  ): Promise<Endpoint | null> {
    // TODO: Test validations in pipes (manual testing is OK). <--- I think this one is DONE.
    // TODO: Test validations in isolated service (without pipes).
    const convertNavigation = async (selector: string) => {
      const nav = new Navigation();
      Object.assign(
        nav,
        await validateAndTransform(CreateNavigationDto, { selector }),
      );
      return nav;
    };

    const convertArgument = async (value: string | number | boolean) => {
      const arg = new Argument();
      const type = typeof value;
      value = `${value}`;
      Object.assign(
        arg,
        { type, value },
        await validateAndTransform(CreateArgumentDto, { type, value }),
      );
      return arg;
    };

    const navigations: Navigation[] = await Promise.all(
      (updateEndpointDto.navigations || [])?.map(convertNavigation),
    );
    const argumentArray: Argument[] = await Promise.all(
      (updateEndpointDto.arguments || [])?.map(convertArgument),
    );

    await this.endpointsRepository.save({
      id,
      ...(await validateAndTransform(UpdateEndpointDto, updateEndpointDto)),
      navigations,
      arguments: argumentArray,
    });

    return await this.findOne(id);
  }

  findAll() {
    return this.endpointsRepository.find({
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

  async updateTimeout(endpoint: Endpoint, now = new Date()) {
    const wait = endpoint.waitAfterNotificationMinutes;

    if (wait === null || typeof wait === 'undefined') {
      return;
    }

    const newTimeoutDate: Date = moment(now).add(wait, 'minutes').toDate();
    await this.endpointsRepository.update(
      { id: endpoint.id },
      { timeout: newTimeoutDate },
    );
  }

  countAll() {
    return this.endpointsRepository.count();
  }

  findOne(id: number) {
    return this.endpointsRepository.findOne({
      where: { id },
      relations: {
        arguments: true,
        navigations: true,
      },
    });
  }
}
