import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingModule } from './helpers/createTestingModule';
import { TagsController } from '@api/controllers/tags.controller';

describe(`${TagsController.name} (e2e)`, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingModule();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/tags/:id (GET)', () => {
    it('returns 404 if the ID does not exist', async () => {
      const res = await request(app.getHttpServer()).get('/tags/123128');
      expect(res.statusCode).toBe(404);
    });

    it('finds the correct tag if it exists', async () => {
      let res;
      res = await request(app.getHttpServer())
        .post('/tags')
        .send({ name: '  the tag ' });
      const id = res.body.id;

      res = await request(app.getHttpServer()).get(`/tags/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.name).toBe('the tag');
    });
  });

  describe('/tags (POST)', () => {
    it('verifies the name is unique', async () => {
      let res;
      res = await request(app.getHttpServer())
        .post('/tags')
        .send({ name: 'aaaa' });
      expect(res.statusCode).toBe(201);
      res = await request(app.getHttpServer())
        .post('/tags')
        .send({ name: 'aaaa' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message[0]).toBe("name 'aaaa' already exists");
    });

    it('verifies the name is unique (with trailing and leading spaces)', async () => {
      let res;
      res = await request(app.getHttpServer())
        .post('/tags')
        .send({ name: ' thename  ' });
      expect(res.statusCode).toBe(201);
      res = await request(app.getHttpServer())
        .post('/tags')
        .send({ name: '    thename ' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message[0]).toBe("name 'thename' already exists");
    });
  });

  describe('/tags/:id (PATCH)', () => {
    let id: number;
    let id2: number;

    beforeEach(async () => {
      id = (
        await request(app.getHttpServer())
          .post('/tags')
          .send({ name: 'some tag' })
      ).body.id;

      id2 = (
        await request(app.getHttpServer())
          .post('/tags')
          .send({ name: 'other tag' })
      ).body.id;
    });

    it('can update the tag using the same name', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/tags/${id}`)
        .send({ name: ' some tag ' });
      expect(res.statusCode).toBe(200);
    });

    it('accepts empty object (payload)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/tags/${id}`)
        .send({});
      expect(res.statusCode).toBe(200);
    });

    it('verifies the name is unique (with trailing and leading spaces)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/tags/${id2}`)
        .send({ name: ' some tag ' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message[0]).toBe("name 'some tag' already exists");
    });
  });
});
