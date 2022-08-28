import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';

import * as seedData from './seed.json';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) {}

  create(createEndpointDto: CreateEndpointDto) {
    return 'This action adds a new endpoint';
  }

  // TODO: Extremely bad code.
  //       I refactored it a bit but haven't tested.
  //       For more refactoring, code while testing.
  async seed() {
    for (const endpoint of seedData) {
      const e = this.endpointsRepository.create({
        rule: endpoint.rule,
        title: endpoint.title,
        not: endpoint.not || false,
        type: 'html',
        url: endpoint.endpoint,
        enabled: endpoint.enabled,
        periodMinutes: endpoint.periodMinutes || 15,
        notificationMessage: endpoint.notificationMessage,
        navigations: [],
        arguments: [],
      });

      for (const selector of endpoint.navigation || []) {
        const n = new Navigation();
        n.selector = selector;
        e.navigations.push(n);
      }

      for (const val of endpoint.args || []) {
        const a = new Argument();
        a.type = typeof val;
        a.value = String(val);
        e.arguments.push(a);
      }

      await this.endpointsRepository.save(e);
    }
  }

  async findAll() {
    return this.endpointsRepository.find({
      relations: {
        arguments: true,
        navigations: true,
      },
    });
  }

  async findEnabled() {
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

  async countAll() {
    return this.endpointsRepository.count()
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
