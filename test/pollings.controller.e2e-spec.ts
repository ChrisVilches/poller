import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EndpointsController } from '@api/controllers/endpoints.controller';
import { createTestingModule } from './helpers/createTestingModule';
import { PollingsService } from '@persistence/services/pollings.service';
import { mockEndpointDto, mockPollingDto } from './helpers/mock-data';

describe(`${EndpointsController.name} (e2e)`, () => {
  let app: INestApplication;
  let service: PollingsService;
  let endpointId: number;

  beforeEach(async () => {
    app = await createTestingModule();
    service = app.get<PollingsService>(PollingsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/pollings/:id (GET) with pagination', () => {
    beforeEach(async () => {
      endpointId = (
        await request(app.getHttpServer())
          .post('/endpoints/')
          .send(mockEndpointDto())
      ).body.id;

      for (let i = 0; i < 40; i++) {
        await service.create(mockPollingDto({ computedMessage: `msg ${i}` }));
      }
    });

    it('gets the correct amount per page', async () => {
      let res;
      res = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=1&pageSize=22`,
      );
      expect(res.body.data).toHaveLength(22);
      expect(res.body.count).toBe(40);

      res = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=2&pageSize=22`,
      );

      expect(res.body.data).toHaveLength(18);
      expect(res.body.count).toBe(40);
    });

    it('gets the correct information in each page', async () => {
      let res;
      res = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=1&pageSize=22`,
      );
      for (let i = 0; i < 22; i++) {
        expect(res.body.data[i].computedMessage).toBe(`msg ${i}`);
      }

      res = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=2&pageSize=22`,
      );

      for (let i = 0; i < 18; i++) {
        expect(res.body.data[i].computedMessage).toBe(`msg ${22 + i}`);
      }
    });

    it('handles page = 0 correctly', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=0&pageSize=22`,
      );
      expect(statusCode).toBe(400);
      expect(body.message[0]).toBe('page number must be 1 or greater');
    });

    it('high page number may return empty array (with OK status code)', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        `/pollings/${endpointId}?page=100&pageSize=22`,
      );
      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(0);
      expect(body.count).toBe(40);
    });
  });
});
