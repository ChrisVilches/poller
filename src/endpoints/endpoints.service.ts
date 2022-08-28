import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
  ) {}

  // TODO: Extremely bad code.
  //       I refactored it a bit but haven't tested.
  //       For more refactoring, code while testing.
  async populateFromJson(jsonData: any[]) {
    for (const endpoint of jsonData) {
      const { rule, title, url, enabled, periodMinutes, notificationMessage, not } = endpoint
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
        return n
      })

      e.arguments = (endpoint.args || []).map((val: string) => {
        const a = new Argument();
        a.type = typeof val;
        a.value = String(val);
        return a
      })

      await this.endpointsRepository.save(e);
    }
  }

  async create(createEndpointDto: CreateEndpointDto) {
    console.log(createEndpointDto)
    const endpoint = this.endpointsRepository.create(createEndpointDto)
    return this.endpointsRepository.save(endpoint)
  }

  async findAll() {
    return this.endpointsRepository.find({
      relations: {
        // TODO: This data should be sorted by ID
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
        // TODO: This data should be sorted by ID
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
