import { TestingModule } from '@nestjs/testing';
import { FetchPendingEndpointsJob } from './fetch-pending-endpoints.job';
import { createTestingModule } from '@test/helpers/createTestingModule';
import { mockEndpointInstance } from '@test/helpers/mockEndpoint';

describe(FetchPendingEndpointsJob.name, () => {
  let moduleRef: TestingModule;
  let job: FetchPendingEndpointsJob;

  beforeEach(async () => {
    moduleRef = await createTestingModule();
    job = moduleRef.get<FetchPendingEndpointsJob>(FetchPendingEndpointsJob);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('isTimedOut', () => {
    it('verifies the endpoint is not timed out (timeout is null)', async () => {
      const endpoint = await mockEndpointInstance();
      endpoint.timeout = undefined;
      expect(job.isTimedOut(new Date('2022-01-05'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is not timed out (timeout is not null)', async () => {
      const endpoint = await mockEndpointInstance();
      endpoint.timeout = new Date('2022-01-05');
      expect(job.isTimedOut(new Date('2022-01-08'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is timed out', async () => {
      const endpoint = await mockEndpointInstance();
      endpoint.timeout = new Date('2022-01-05');
      expect(job.isTimedOut(new Date('2022-01-04'), endpoint)).toBeTruthy();
    });
  });
});
