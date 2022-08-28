import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pollMany } from '../pollMany';
import { Repository } from 'typeorm';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { Endpoint } from './entities/endpoint.entity';
import { Polling } from './entities/polling.entity';

/*
TODO: Strange code... there's a "poll many" and a "poll one"
which calls the "poll many" with a single element array.
It can be refactored into a simpler way (just one function).
*/

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

  findLatest(endpointId: number) {
    return this.pollingsRepository.findOne({
      where: {
        endpointId
      },
      order: {
        createdAt: "DESC"
      }
    })
  }

  async pollOne(endpoint: Endpoint) {
    const [result] = await pollMany([endpoint])

    if (Object.keys(result).length === 0) {
      return result
    }

    const polling = new Polling()
    polling.endpoint = endpoint

    if (result.error) {
      polling.error = result.error
    }

    polling.manual = true
    polling.requestCode = result.status
    polling.shouldNotify = result.shouldNotify

    const obj = {
      manual: true,
      requestCode: result.status || 0, // TODO: Status should be nullable
      shouldNotify: result.shouldNotify || false,
      error: result.error,
      endpoint
    }

    this.create(obj)

    return result
  }
}
