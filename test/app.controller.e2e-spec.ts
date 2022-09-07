import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './../src/app.controller';
import { createTestingModule } from './helpers/createTestingModule';

describe(`${AppController.name} (e2e)`, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingModule();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(`The app is online! port ${process.env.PORT}, test`);
  });
});
