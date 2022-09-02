import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './../src/app.controller';
import { createTestingModule } from './helpers/createTestingModule';

describe(`${AppController.name} (e2e)`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingModule();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('The app is online! port 3000, test');
  });
});
