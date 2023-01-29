import { FetchPendingEndpointsJob } from './fetch-pending-endpoints.job';
import { createTestingModule } from '@test/helpers/createTestingModule';
import { INestApplication } from '@nestjs/common';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { mockEndpointDto } from '@test/helpers/mock-data';

describe(FetchPendingEndpointsJob.name, () => {
  let app: INestApplication;
  let job: FetchPendingEndpointsJob;
  let endpointsService: EndpointsService;

  beforeEach(async () => {
    app = await createTestingModule();
    job = app.get<FetchPendingEndpointsJob>(FetchPendingEndpointsJob);
    endpointsService = app.get<EndpointsService>(EndpointsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('isTimedOut', () => {
    let endpoint: Endpoint;

    beforeEach(async () => {
      endpoint = await endpointsService.create(
        mockEndpointDto() as EndpointCreateDto,
      );
    });

    it('verifies the endpoint is not timed out (timeout is null)', async () => {
      endpoint.timeout = undefined;
      expect(job.isTimedOut(new Date('2022-01-05'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is not timed out (timeout is not null)', async () => {
      endpoint.timeout = new Date('2022-01-05');
      expect(job.isTimedOut(new Date('2022-01-08'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is timed out', async () => {
      endpoint.timeout = new Date('2022-01-05');
      expect(job.isTimedOut(new Date('2022-01-04'), endpoint)).toBeTruthy();
    });
  });
});
