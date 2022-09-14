import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Polling } from '@persistence/entities/polling.entity';
import { PollingDto } from '@persistence/dto/polling.dto';
import { transformAndValidate } from 'class-transformer-validator';
import { PaginatedQueryDto } from '@api/dto/paginated-query.dto';
import { PaginatedResultDto } from '@api/dto/paginated-result.dto';
import { withPagination } from './util';

@Injectable()
export class PollingsService {
  constructor(
    @InjectRepository(Polling)
    private pollingsRepository: Repository<Polling>,
  ) {}

  async findAll(
    query: PaginatedQueryDto,
    endpointId?: number
  ): Promise<PaginatedResultDto<Polling>> {
    const where: any = {}

    if (endpointId) {
      where.endpointId = endpointId;
    }

    return {
      data: await this.pollingsRepository.find(withPagination(query, { where, relations: ['endpoint'] })),
      count: await this.pollingsRepository.count({ where })
    };
  }

  findLatest(endpointId: number) {
    return this.pollingsRepository.findOne({
      where: {
        endpointId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  removeOlderThan(date: Date) {
    return this.pollingsRepository.delete({
      createdAt: LessThan(date),
    });
  }

  async create(createPollingDto: PollingDto): Promise<Polling> {
    const polling: Polling = this.pollingsRepository.create(
      await transformAndValidate(PollingDto, createPollingDto),
    );

    const saved: Polling = await this.pollingsRepository.save(polling);
    return (await this.findOne(saved.id)) as Polling;
  }

  findOne(id: number) {
    return this.pollingsRepository.findOne({
      where: { id },
      relations: {
        endpoint: true,
      },
    });
  }
}
