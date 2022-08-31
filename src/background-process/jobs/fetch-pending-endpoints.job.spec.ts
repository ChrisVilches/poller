import { TestingModule } from '@nestjs/testing';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { mockEndpoint, mockEndpointInstance } from '@test/helpers/mockEndpoint';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { FetchPendingEndpointsJob } from './fetch-pending-endpoints.job';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Polling } from '@persistence/entities/polling.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { shuffle } from 'lodash';
import { createTestingModule } from '@test/helpers/createTestingModule';

describe(FetchPendingEndpointsJob.name, () => {
  let moduleRef: TestingModule;
  let job: FetchPendingEndpointsJob;
  let pollingsRepository: Repository<Polling>;
  let endpointsService: EndpointsService;

  beforeEach(async () => {
    moduleRef = await createTestingModule();
    job = moduleRef.get<FetchPendingEndpointsJob>(FetchPendingEndpointsJob);
    pollingsRepository = moduleRef.get<Repository<Polling>>(
      getRepositoryToken(Polling),
    );
    endpointsService = moduleRef.get<EndpointsService>(EndpointsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('isTimedOut', () => {
    it('verifies the endpoint is not timed out (timeout is null)', async () => {
      const endpoint = await mockEndpointInstance({ timeout: null });
      expect(job.isTimedOut(new Date('2022-01-05'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is not timed out (timeout is not null)', async () => {
      const endpoint = await mockEndpointInstance({
        timeout: new Date('2022-01-05'),
      });
      expect(job.isTimedOut(new Date('2022-01-08'), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint is timed out', async () => {
      const endpoint = await mockEndpointInstance({
        timeout: new Date('2022-01-05'),
      });
      expect(job.isTimedOut(new Date('2022-01-04'), endpoint)).toBeTruthy();
    });
  });

  describe('hasRecentPoll', () => {
    let endpoint: Endpoint;

    beforeEach(async () => {
      endpoint = await endpointsService.create(
        mockEndpoint({
          periodMinutes: 15,
        }),
      );
    });

    it('verifies the endpoint has no polls', async () => {
      expect(await pollingsRepository.count()).toBe(0);
      expect(await job.hasRecentPoll(new Date(), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint has no recent polls', async () => {
      await pollingsRepository.insert({
        manual: true,
        createdAt: moment().subtract(16, 'minutes').toDate(),
        endpointId: 1,
      });
      expect(await pollingsRepository.count()).toBe(1);
      expect(await job.hasRecentPoll(moment().toDate(), endpoint)).toBeFalsy();
    });

    it('verifies the endpoint has a recent poll', async () => {
      for (const t of shuffle([14, 16])) {
        await pollingsRepository.insert({
          manual: true,
          createdAt: moment().subtract(t, 'minutes').toDate(),
          endpointId: 1,
        });
      }

      expect(await pollingsRepository.count()).toBe(2);
      expect(await job.hasRecentPoll(moment().toDate(), endpoint)).toBeTruthy();
    });
  });
});
