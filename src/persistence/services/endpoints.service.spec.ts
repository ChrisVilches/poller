import { EndpointsService } from './endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { ValidationError } from 'class-validator';
import '@test/matchers/toThrowErrorType';
import { createTestingModule } from '@test/helpers/createTestingModule';
import { INestApplication } from '@nestjs/common';
import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { mockEndpointDto } from '@test/helpers/mock-data';

describe(EndpointsService.name, () => {
  let app: INestApplication;
  let service: EndpointsService;

  beforeEach(async () => {
    app = await createTestingModule();
    service = app.get<EndpointsService>(EndpointsService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates an endpoint', async () => {
      expect(await service.countAll()).toBe(0);
      await service.create(mockEndpointDto() as EndpointCreateDto);
      expect(await service.countAll()).toBe(1);
    });

    it('validates input (rejects incorrect input)', async () => {
      await expect(
        async () =>
          await service.create(
            mockEndpointDto({ url: '...' }) as EndpointCreateDto,
          ),
      ).toThrowErrorType(ValidationError);
    });

    it('validates input (accepts correct input)', async () => {
      await expect(
        async () =>
          await service.create(
            mockEndpointDto({
              url: 'https://www.hello.com',
            }) as EndpointCreateDto,
          ),
      ).not.toThrowErrorType(ValidationError);
    });

    it('trims the title and content message', async () => {
      const endpoint = await service.create(
        mockEndpointDto({ title: '   some title  ' }) as EndpointCreateDto,
      );
      expect(endpoint.title).toBe('some title');
    });

    it('saves navigations', async () => {
      const endpoint = await service.create(
        mockEndpointDto({ navigations: [' a ', ' b '] }) as EndpointCreateDto,
      );
      expect(endpoint.navSelectors()).toStrictEqual(['a', 'b']);
    });

    it('saves arguments', async () => {
      const endpoint = await service.create(
        mockEndpointDto({
          arguments: [' a ', ' b ', true, 123],
        }) as EndpointCreateDto,
      );
      expect(endpoint.argPrimitives()).toStrictEqual([' a ', ' b ', true, 123]);
    });

    it('rejects incorrect navigation', async () => {
      await expect(async () => {
        await service.create(
          mockEndpointDto({
            navigations: [' a ', ' b ', ''],
          }) as EndpointCreateDto,
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments', async () => {
      await expect(async () => {
        await service.create(
          mockEndpointDto({
            arguments: [' a ', null, ' b ', ''] as any,
          }) as EndpointCreateDto,
        );
      }).toThrowErrorType(ValidationError);
    });
  });

  describe('update', () => {
    let endpoint: Endpoint;

    beforeEach(async () => {
      endpoint = await service.create(
        mockEndpointDto({
          navigations: [' abc ', ' def  '],
          arguments: ['xyz', 1],
        }) as EndpointCreateDto,
      );
    });

    it('trims the strings', async () => {
      const updatedEndpoint = await service.update(endpoint.id, {
        title: '   new title      ',
      });
      expect(updatedEndpoint.title).toBe('new title');
    });

    it('validates url', async () => {
      await expect(
        async () => await service.update(1, mockEndpointDto({ url: '...' })),
      ).toThrowErrorType(ValidationError);
    });

    it('validates request type', async () => {
      await expect(
        async () =>
          await service.update(1, mockEndpointDto({ type: 'invalid' })),
      ).toThrowErrorType(ValidationError);
    });

    it('saves nested navigations', async () => {
      const updated = await service.update(
        endpoint.id,
        mockEndpointDto({ navigations: [' a ', ' b '] }),
      );
      expect(updated.navSelectors()).toStrictEqual(['a', 'b']);
    });

    it('saves nested arguments', async () => {
      const updated = await service.update(
        endpoint.id,
        mockEndpointDto({ arguments: [' a ', ' b ', true, 123] }),
      );
      expect(updated.argPrimitives()).toStrictEqual([' a ', ' b ', true, 123]);
    });

    it('rejects incorrect navigation', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpointDto({ navigations: [' a ', ' b ', ''] }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect navigation (trim function does not crash)', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpointDto({ navigations: [' a ', true] as any }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpointDto({ arguments: [' a ', null, ' b '] as any }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments (includes function)', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpointDto({
            arguments: [' a ', ' b ', () => 0] as any,
          }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('keeps previous navigations/arguments when the data to patch omits those properties', async () => {
      await service.update(endpoint.id, { title: ' ....new title.... ' });
      const found = await service.findOne(endpoint.id);
      expect(found.title).toBe('....new title....');
      expect(found.navSelectors()).toStrictEqual(['abc', 'def']);
      expect(found.argPrimitives()).toStrictEqual(['xyz', 1]);
    });

    it('keeps previous navigations if the data omits that property', async () => {
      await service.update(endpoint.id, {
        arguments: ['text', 123],
      });
      const found = await service.findOne(endpoint.id);
      expect(found.navSelectors()).toStrictEqual(['abc', 'def']);
      expect(found.argPrimitives()).toStrictEqual(['text', 123]);
    });

    it('keeps previous arguments if the data omits that property', async () => {
      await service.update(endpoint.id, {
        navigations: [' nav1 ', 'nav2 '],
      });
      const found = await service.findOne(endpoint.id);
      expect(found.navSelectors()).toStrictEqual(['nav1', 'nav2']);
      expect(found.argPrimitives()).toStrictEqual(['xyz', 1]);
    });
  });

  describe('findEnabled', () => {
    it('fetches only the enabled ones', async () => {
      const e1 = await service.create(mockEndpointDto() as EndpointCreateDto);
      const e2 = await service.create(mockEndpointDto() as EndpointCreateDto);
      const e3 = await service.create(mockEndpointDto() as EndpointCreateDto);
      await service.enable(e1.id, true);
      await service.enable(e2.id, true);
      await service.enable(e3.id, false);
      expect(await service.findEnabled()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await service.create(mockEndpointDto() as EndpointCreateDto);
    });
    it('fetches the navigation array', async () => {
      expect(await service.countAll()).toBe(1);
      expect(await service.findOne(1)).toHaveProperty('navigations');
    });
    it('fetches the arguments array', async () => {
      expect(await service.countAll()).toBe(1);
      expect(await service.findOne(1)).toHaveProperty('arguments');
    });
  });

  describe('updateTimeout', () => {
    let endpoint: Endpoint;
    beforeEach(async () => {
      endpoint = await service.create(
        mockEndpointDto({
          periodMinutes: 25,
          waitAfterNotificationMinutes: 107,
        }) as EndpointCreateDto,
      );
    });

    it('has a null default timeout value', async () => {
      expect(endpoint.timeout).toBeNull;
    });

    it('uses periodMinutes when there is no notification', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(false, endpoint, now);
      expect((await service.findOne(endpoint.id)).timeout).toStrictEqual(
        new Date('2022-01-05 00:25:00.000Z'),
      );
    });

    it('chooses largest value (periodMinutes, has notification)', async () => {
      const now = new Date('2022-01-05');
      endpoint.periodMinutes = 200;
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(endpoint.id)).timeout).toStrictEqual(
        new Date('2022-01-05 03:20:00.000Z'),
      );
    });

    it('chooses largest value (waitAfterNotificationMinutes, has notification)', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(endpoint.id)).timeout).toStrictEqual(
        new Date('2022-01-05 01:47:00.000Z'),
      );
    });

    it('chooses the only value (waitAfterNotificationMinutes not defined, has notification)', async () => {
      const now = new Date('2022-01-05');
      endpoint.periodMinutes = 19;
      endpoint.waitAfterNotificationMinutes = undefined;
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(endpoint.id)).timeout).toStrictEqual(
        new Date('2022-01-05 00:19:00.000Z'),
      );
    });
  });
});
