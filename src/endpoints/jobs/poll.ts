import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EndpointsService } from '../endpoints.service';
import { Endpoint } from '../entities/endpoint.entity';
import { PollingsService } from '../pollings.service';

const minutesDifference = (startDate: Date, endDate: Date) => (endDate.getTime() - startDate.getTime()) / 60000

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);

  constructor(private readonly endpointsService: EndpointsService, private readonly pollingsService: PollingsService) {}
  
  @Cron('*/5 * * * * *')
  async handleCron() {
    const endpoints = await this.endpointsService.findEnabled();

    const toPoll: Endpoint[] = []
    
    for (const endpoint of endpoints) {
      if (await this.shouldPoll(new Date(), endpoint)) {
        toPoll.push(endpoint)
      }
    }

    this.logger.debug(`Polling ${toPoll.length} endpoints`);

    for(const endpoint of toPoll) {
      const result = await this.pollingsService.pollOne(endpoint)
      delete result.endpoint

      this.logger.debug(`Poll result: ${JSON.stringify(result)}`);
    }
  }

  private async shouldPoll(now: Date, endpoint: Endpoint): Promise<boolean> {
    const lastPoll = await this.pollingsService.findLatest(endpoint.id);

    if (lastPoll === null) {
      return true
    }
  
    return endpoint.periodMinutes <= minutesDifference(lastPoll.createdAt, now)
  }
}
