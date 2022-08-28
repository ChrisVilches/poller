import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';

import * as seedData from './seed.json'

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) { }

  create(createEndpointDto: CreateEndpointDto) {
    return 'This action adds a new endpoint';
  }

  // TODO: Extremely bad code.
  async seed() {
    for (let endpoint of seedData) {
      const e = new Endpoint()
      e.rule = endpoint.rule
      e.title = endpoint.title
      e.not = endpoint.not || false
      e.type = 'html'
      e.url = endpoint.endpoint
      e.enabled = endpoint.enabled
      e.periodMinutes = endpoint.periodMinutes || 15
      e.notificationMessage = endpoint.notificationMessage
      e.navigations = []
      e.arguments = []

      const added = await this.endpointsRepository.save(e)

      for (let selector of endpoint.navigation || []) {
        const n = new Navigation()
        n.endpoint = added
        n.selector = selector
        added.navigations.push(n)
      }

      for (let val of endpoint.args || []) {
        const a = new Argument()
        a.endpoint = added
        a.type = typeof val
        a.value = String(val)
        added.arguments.push(a)
      }

      await this.endpointsRepository.save(added)
    }
  }

  async findAll() {
    return this.endpointsRepository.find({
      relations: {
        arguments: true,
        navigations: true
      },
    });
  }

  findOne(id: number) {
    return this.endpointsRepository.findOne({
      where: { id },
      relations: {
        arguments: true,
        navigations: true
      }
    })
  }

  update(id: number, updateEndpointDto: UpdateEndpointDto) {
    return `This action updates a #${id} endpoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} endpoint`;
  }
}
