import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { validateAndTransform } from '../../util';
import { EntityManager, Repository } from 'typeorm';
import { CreateEndpointDto } from '@persistence/dto/create-endpoint.dto';
import { UpdateEndpointDto } from '@persistence/dto/update-endpoint.dto';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';

/**
 * TODO: Make sure the name of the classes, filename and folder is consistent.
 * 
 * TODO: Try to implement it like this (extend a repository to make a custom one):
 *       https://github.com/nestjs/typeorm/issues/39
 *       Or like this example: https://deno.land/x/typeorm@v0.2.23-rc9/docs/custom-repository.md?code=&source=
 *       (But this example is different from NestJS since Nest uses injection.)
 * 
*/

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
