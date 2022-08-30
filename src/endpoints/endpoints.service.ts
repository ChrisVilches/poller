import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { validateAndTransform } from '../util';
import { EntityManager, Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';

@Injectable()
export class EndpointsService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
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
    await this.entityManager
      .createQueryBuilder()
      .update(Endpoint)
      .set(await validateAndTransform(UpdateEndpointDto, updateEndpointDto))
      .where('id = :id', { id })
      .execute();

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

  updateTimeout(endpoint: Endpoint) {
    console.log(`TODO: Update timeout for endpoint ID ${endpoint.id}`);
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
