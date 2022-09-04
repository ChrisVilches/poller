import { Injectable } from '@nestjs/common';
import { convertEndpointDto } from '@util/endpoints';
import { EndpointsService } from './endpoints.service';

@Injectable()
export class SeedService {
  constructor(private endpointsService: EndpointsService) {}

  async populateFromJson(jsonData: any[]) {
    const createdIds = [];

    for (const { enabled = false, ...endpointData } of jsonData) {
      const created = await this.endpointsService.create(
        convertEndpointDto(endpointData),
      );
      createdIds.push(created.id);

      await this.endpointsService.enable(created.id, enabled);
    }

    return createdIds;
  }
}
