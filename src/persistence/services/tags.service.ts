import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { Tag } from '@persistence/entities/tag.entity';
import { TagPartialDto, TagDto } from '@persistence/dto/tag.dto';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const countsQuery = this.dataSource
      .createQueryBuilder('tag', 't')
      .select('count(*)::int as "endpointsCount", t.id')
      .innerJoin('t.endpoints', 'e')
      .groupBy('t.id')
      .getRawMany();

    const allQuery = this.dataSource
      .getRepository(Tag)
      .createQueryBuilder()
      .select('id, name')
      .orderBy({ id: 'ASC' })
      .getRawMany();

    const [counts, all] = await Promise.all([countsQuery, allQuery]);

    const countMap = counts.reduce(
      (accum, { id, endpointsCount }) => ({
        ...accum,
        [id]: endpointsCount,
      }),
      {},
    );

    return all.map((record: any) => ({
      ...record,
      endpointsCount: countMap[record.id] || 0,
    }));
  }

  async findByName(name: string) {
    name = (name || '').trim();
    return this.tagsRepository.findOneBy({ name });
  }

  async create(tagDto: TagDto): Promise<Tag> {
    await this.checkCanUseName(tagDto.name);

    return this.tagsRepository.save(await transformAndValidate(TagDto, tagDto));
  }

  async update(id: number, tagDto: TagPartialDto): Promise<Tag> {
    await this.checkCanUseName(tagDto.name, id);

    await this.tagsRepository.update(
      { id },
      await transformAndValidate(TagPartialDto, tagDto),
    );

    return await this.findOne(id);
  }

  async addEndpoint(id: number, endpointId: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    const endpoint = await this.endpointsRepository.findOneBy({
      id: endpointId,
    });

    if (!tag || !endpoint) {
      return null;
    }

    if (tag.endpoints.find((e: Endpoint) => e.id === endpointId)) {
      return tag;
    }

    tag.endpoints.push(endpoint);
    return this.tagsRepository.save(tag);
  }

  async findOne(id: number): Promise<Tag> {
    const tag: Tag | null = await this.tagsRepository.findOneBy({ id });

    if (tag === null) {
      throw new EntityNotFoundError(Tag.name, {});
    }
    return tag;
  }

  async removeEndpoint(id: number, endpointId: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    const endpoint = await this.endpointsRepository.findOneBy({
      id: endpointId,
    });

    if (!tag || !endpoint) {
      return null;
    }

    tag.endpoints = tag.endpoints.filter((e: Endpoint) => e.id !== endpointId);
    return this.tagsRepository.save(tag);
  }

  /**
   * @throws {ValidationError}
   */
  private async checkCanUseName(name?: string, id?: number): Promise<void> {
    // Should be validated elsewhere.
    if (!name) return;
    name = (name || '').trim();

    const tag = await this.findByName(name);

    if (tag === null) {
      return;
    }

    if (tag.id === id) {
      return;
    }

    const err = new ValidationError();
    err.constraints = {
      nameUnique: `name '${name}' already exists`,
    };
    throw [err];
  }
}
