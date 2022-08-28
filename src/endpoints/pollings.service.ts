import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { Polling } from './entities/polling.entity';

@Injectable()
export class PollingsService {
  constructor(
    @InjectRepository(Polling)
    private pollingsRepository: Repository<Polling>,
  ) { }

  async create(createPollingDto: CreatePollingDto) {
    const polling = this.pollingsRepository.create(createPollingDto);
    await this.pollingsRepository.save(polling)
  }

  // TODO: Is it ok to add this?
  save(polling: Polling) {
    return this.pollingsRepository.save(polling)
  }

  findAll() {
    return `This action returns all pollings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} polling`;
  }

  update(id: number, updatePollingDto: UpdatePollingDto) {
    return `This action updates a #${id} polling`;
  }

  remove(id: number) {
    return `This action removes a #${id} polling`;
  }
}
