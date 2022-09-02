import { ConvertEndpointArraysPipe } from '@api/pipes/convert-endpoint-arrays.pipe';
import { RequestTypeStringToEnumPipe } from '@api/pipes/request-type-string-to-enum.pipe';
import { Injectable } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';

@Injectable()
export class SeedService {
  constructor(private endpointsService: EndpointsService) {}

  async populateFromJson(jsonData: any[]) {
    const createdIds = [];

    for (const { enabled = false, ...endpointData } of jsonData) {
      const pipes = [
        new RequestTypeStringToEnumPipe(),
        new ConvertEndpointArraysPipe(),
      ];

      const converted = pipes.reduce(
        (accum, pipe: any) => pipe.transform(accum),
        endpointData,
      );

      const created = await this.endpointsService.create(converted);
      createdIds.push(created.id);

      await this.endpointsService.enable(created.id, enabled);
    }

    return createdIds;
  }
}
