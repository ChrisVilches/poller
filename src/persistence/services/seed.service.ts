import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { argTypeFromValue } from '@persistence/enum/arg-type.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
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
        a.type = argTypeFromValue(val);
        a.value = String(val);
        return a;
      });

      await this.endpointsRepository.save(e);
    }
  }
}
