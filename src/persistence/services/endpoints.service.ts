import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateAndTransform } from '../../util';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import * as moment from 'moment';
import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { NavigationDto } from '@persistence/dto/navigation.dto';
import { ArgumentDto } from '@persistence/dto/argument.dto';
import { PartialType } from '@nestjs/mapped-types';

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

  async create(endpointDto: EndpointDto): Promise<Endpoint> {
    const created = await this.endpointsRepository.save({
      ...(await this.buildEndpoint(endpointDto)),
    });

    return await this.findOne(created.id);
  }

  private async buildEndpoint(obj: any, partial = false) {
    const convertNavigation = async (selector: string) => {
      const nav = new Navigation();
      Object.assign(
        nav,
        await validateAndTransform(NavigationDto, { selector }),
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
        await validateAndTransform(ArgumentDto, { type, value }),
      );
      return arg;
    };

    const returnObj: any = await validateAndTransform(
      partial ? PartialType(EndpointDto) : EndpointDto,
      obj,
    );

    if ('navigations' in obj) {
      returnObj.navigations = await Promise.all(
        (obj.navigations || [])?.map(convertNavigation),
      );
    }

    if ('arguments' in obj) {
      returnObj.arguments = await Promise.all(
        (obj.arguments || [])?.map(convertArgument),
      );
    }

    return returnObj;
  }

  async update(
    id: number,
    endpointDto: Partial<EndpointDto>,
  ): Promise<Endpoint> {
    if ((await this.findOne(id)) === null) {
      throw new EntityNotFoundError(Endpoint.name, {});
    }

    await this.endpointsRepository.save({
      id,
      ...(await this.buildEndpoint(endpointDto, true)),
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
