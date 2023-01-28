import { Injectable } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
// import { EndpointsService } from './endpoints.service';

@Injectable()
export class SeedService {
  constructor(private endpointsService: EndpointsService) {}

  async populateFromJson(jsonData: any[]) {
    console.log(jsonData);
    console.log(this.endpointsService);
    /*
    // TODO: Removed because it stopped compiling after the DTO revamp.
    const createdIds = [];

    for (const { enabled = false, ...endpointData } of jsonData) {
      const created = await this.endpointsService.create(
        convertEndpointDto(endpointData),
      );
      createdIds.push(created.id);

      await this.endpointsService.enable(created.id, enabled);
    }

    return createdIds;
    */
  }
}
