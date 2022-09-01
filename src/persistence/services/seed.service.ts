import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArgType, Argument } from '@persistence/entities/argument.entity';
import { Endpoint, RequestType } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Endpoint)
    private endpointsRepository: Repository<Endpoint>,
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
        type: RequestType.HTML,
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
        // TODO: This code is garbage.
        a.type = typeof val === 'number' ? ArgType.NUMBER : (typeof val === 'boolean' ? ArgType.BOOLEAN : ArgType.STRING);
        a.value = String(val);
        return a;
      });

      await this.endpointsRepository.save(e);
    }
  }
}