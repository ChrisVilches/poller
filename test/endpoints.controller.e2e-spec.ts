import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EndpointsController } from '@api/controllers/endpoints.controller';
import { createTestingModule } from './helpers/createTestingModule';

const payload = {
  url: 'https://www.myurl.com',
  title: '  new title ',
  notificationMessage: '  the message ',
  rule: 'HasOccurrencesRule',
  type: 'html',
  method: 'get',
};

describe(`${EndpointsController.name} (e2e)`, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingModule();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/endpoints (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/endpoints');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  describe('/endpoints/:id (GET)', () => {
    it('fails if ID is not numeric', async () => {
      const res = await request(app.getHttpServer()).get('/endpoints/1ee');
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('returns 404 if the ID does not exist', async () => {
      const res = await request(app.getHttpServer()).get('/endpoints/123128');
      expect(res.statusCode).toBe(404);
    });

    it('finds the correct endpoint if it exists', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/endpoints')
        .send({
          ...payload,
          title: ' endpoint to find ',
        });
      const createdId = body.id;
      const res = await request(app.getHttpServer()).get(
        `/endpoints/${createdId}`,
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('endpoint to find');
    });
  });

  describe('/endpoints (POST)', () => {
    it('returns 201 created code', () => {
      return request(app.getHttpServer())
        .post('/endpoints')
        .send(payload)
        .expect(201);
    });

    it('adds endpoints correctly', async () => {
      const prevCount = (await request(app.getHttpServer()).get('/endpoints'))
        .body.length;
      const { body } = await request(app.getHttpServer())
        .post('/endpoints')
        .send(payload);
      const nextCount = (await request(app.getHttpServer()).get('/endpoints'))
        .body.length;
      expect(prevCount + 1).toBe(nextCount);

      expect(typeof body.id).toBe('number');
      expect(body.url).toBe('https://www.myurl.com');
      expect(body.title).toBe('new title');
      expect(body.notificationMessage).toBe('the message');
      expect(body.rule).toBe('HasOccurrencesRule');
      expect(body.type).toBe('HTML');
      expect(body.enabled).toBeFalsy();
      expect(body.argumentList).toBeUndefined();
      expect(body.arguments).toStrictEqual([]);
      expect(body.navigationList).toBeUndefined();
      expect(body.navigations).toStrictEqual([]);
      expect(body.not).toStrictEqual(false);
    });

    it('invalidates wrong argument array', async () => {
      for (const arg of [null, undefined, () => 0, {}]) {
        const { statusCode } = await request(app.getHttpServer())
          .post('/endpoints')
          .send({
            ...payload,
            arguments: [arg],
          });
        expect(statusCode).toBe(400);
      }
    });

    it('invalidates wrong navigation array', async () => {
      for (const nav of ['', true, 1, '     ']) {
        const { statusCode } = await request(app.getHttpServer())
          .post('/endpoints')
          .send({
            ...payload,
            navigations: [nav],
          });
        expect(statusCode).toBe(400);
      }
    });

    it('converts strings', async () => {
      const res = await request(app.getHttpServer())
        .post('/endpoints')
        .send(payload);
      expect(res.body.title).toBe('new title');
      expect(res.body.notificationMessage).toBe('the message');
    });

    it('invalidates properties that should not exist', async () => {
      for (const prop of ['aa', 'navigation', 'titlex', 'uRl']) {
        const res = await request(app.getHttpServer())
          .post('/endpoints')
          .send({
            ...payload,
            [prop]: 'some value',
          });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBeInstanceOf(Array);
        expect(res.body.message[0]).toBe(`property ${prop} should not exist`);
      }
    });

    it('invalidates properties that should not exist, returns array of messages', async () => {
      const res = await request(app.getHttpServer())
        .post('/endpoints')
        .send({
          ...payload,
          aa: 'some value',
          navigation: 'some value',
          Title: 'some value',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message[0]).toBe('property aa should not exist');
      expect(res.body.message[1]).toBe('property navigation should not exist');
      expect(res.body.message[2]).toBe('property Title should not exist');
    });

    it('accepts request type as string', async () => {
      let res = await request(app.getHttpServer())
        .post('/endpoints')
        .send({
          ...payload,
          type: 'HTmL',
        });

      expect(res.body.type).toBe('HTML');

      res = await request(app.getHttpServer())
        .post('/endpoints')
        .send({
          ...payload,
          type: 'JsOn',
        });
      expect(res.body.type).toBe('JSON');
    });

    it('returns the created endpoint with converted navigation and argument arrays', async () => {
      const nav = ['nav1', '  nav2 ', 'nav3   '];
      const arg = [1, 2, true, 'str', 'aa', 2];

      const { body } = await request(app.getHttpServer())
        .post('/endpoints')
        .send({
          ...payload,
          navigations: nav,
          arguments: arg,
        });

      expect(body.navigationList).toBeUndefined();
      expect(body.navigations).toStrictEqual(['nav1', 'nav2', 'nav3']);
      expect(body.argumentList).toBeUndefined();
      expect(body.arguments).toStrictEqual(arg);
    });
  });

  describe('/endpoints/:id (PATCH)', () => {
    let id: number;

    beforeEach(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/endpoints/')
        .send(payload);
      id = body.id;
    });

    it('returns 200 ok code', () => {
      return request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send(payload)
        .expect(200);
    });

    it('updates endpoints correctly', async () => {
      await request(app.getHttpServer()).patch(`/endpoints/${id}`).send({
        url: 'https://www.newurl.com/hello/world',
      });
      const { body } = await request(app.getHttpServer()).get(
        `/endpoints/${id}`,
      );
      expect(body.id).toBe(id);
      expect(body.url).toBe('https://www.newurl.com/hello/world');
    });

    it('invalidates wrong argument array', async () => {
      for (const arg of [null, undefined, () => 0, {}]) {
        const { statusCode } = await request(app.getHttpServer())
          .patch(`/endpoints/${id}`)
          .send({
            ...payload,
            arguments: [arg],
          });
        expect(statusCode).toBe(400);
      }
    });

    it('invalidates wrong navigation array', async () => {
      for (const nav of ['', true, 1, '     ']) {
        const { statusCode } = await request(app.getHttpServer())
          .patch(`/endpoints/${id}`)
          .send({
            ...payload,
            navigations: [nav],
          });
        expect(statusCode).toBe(400);
      }
    });

    it('converts strings', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send(payload);
      expect(res.body.title).toBe('new title');
      expect(res.body.notificationMessage).toBe('the message');
    });

    it('invalidates properties that should not exist', async () => {
      for (const prop of ['aa', 'navigation', 'titlex', 'uRl']) {
        const res = await request(app.getHttpServer())
          .patch(`/endpoints/${id}`)
          .send({
            ...payload,
            [prop]: 'some value',
          });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBeInstanceOf(Array);
        expect(res.body.message[0]).toBe(`property ${prop} should not exist`);
      }
    });

    it('invalidates properties that should not exist, returns array of messages', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          aa: 'some value',
          navigation: 'some value',
          Title: 'some value',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message[0]).toBe('property aa should not exist');
      expect(res.body.message[1]).toBe('property navigation should not exist');
      expect(res.body.message[2]).toBe('property Title should not exist');
    });

    it('accepts request type as string', async () => {
      let res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          type: 'HTML',
        });

      expect(res.body.type).toBe('HTML');

      res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          type: 'JsOn',
        });
      expect(res.body.type).toBe('JSON');

      res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          type: 'dHTMl',
        });
      expect(res.body.type).toBe('DHTML');
    });

    it('validates request type', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          type: 'invalid',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message[0]).toBe(
        'type must be one of the following values: HTML, DHTML, JSON',
      );
    });

    it('accepts method as string', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          method: 'deLEtE',
        });

      expect(res.body.method).toBe('DELETE');
    });

    it('returns the created endpoint with converted navigation and argument arrays', async () => {
      const nav = ['nav1', '  nav2 ', 'nav3   '];
      const arg = [1, 2, true, 'str', 'aa', 2];
      const { body } = await request(app.getHttpServer())
        .patch(`/endpoints/${id}`)
        .send({
          ...payload,
          navigations: nav,
          arguments: arg,
        });
      expect(body.navigationList).toBeUndefined();
      expect(body.navigations).toStrictEqual(['nav1', 'nav2', 'nav3']);
      expect(body.argumentList).toBeUndefined();
      expect(body.arguments).toStrictEqual(arg);
    });
  });
});
