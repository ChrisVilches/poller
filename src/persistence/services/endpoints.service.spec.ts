import { TestingModule } from '@nestjs/testing';
import { EndpointsService } from './endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { mockEndpoint } from '@test/helpers/mockEndpoint';
import { ValidationError } from 'class-validator';
import '@test/matchers/toThrowErrorType';
import { createTestingModule } from '@test/helpers/createTestingModule';
import { convertNav } from '@test/helpers/convertNav';
import { convertArgs } from '@test/helpers/convertArgs';

describe(EndpointsService.name, () => {
  let service: EndpointsService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await createTestingModule();
    service = moduleRef.get<EndpointsService>(EndpointsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates an endpoint', async () => {
      expect(await service.countAll()).toBe(0);
      await service.create(mockEndpoint());
      expect(await service.countAll()).toBe(1);
    });

    it('validates input (rejects incorrect input)', async () => {
      await expect(
        async () => await service.create(mockEndpoint({ url: '...' })),
      ).toThrowErrorType(ValidationError);
    });

    it('validates input (accepts correct input)', async () => {
      await expect(
        async () =>
          await service.create(mockEndpoint({ url: 'https://www.hello.com' })),
      ).not.toThrowErrorType(ValidationError);
    });

    it('trims the title and content message', async () => {
      const endpoint = await service.create(
        mockEndpoint({ title: '   some title  ' }),
      );
      expect(endpoint.title).toBe('some title');
    });

    it('saves nested navigations', async () => {
      const endpoint = await service.create(
        mockEndpoint({ navigations: [' a ', ' b '] }),
      );
      expect(endpoint.navigation()).toStrictEqual(['a', 'b']);
    });

    it('saves nested arguments', async () => {
      const endpoint = await service.create(
        mockEndpoint({ arguments: [' a ', ' b ', true, 123] }),
      );
      expect(endpoint.args()).toStrictEqual([' a ', ' b ', true, 123]);
    });

    it('rejects incorrect navigation', async () => {
      await expect(async () => {
        await service.create(mockEndpoint({ navigations: [' a ', ' b ', ''] }));
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments', async () => {
      await expect(async () => {
        await service.create(
          mockEndpoint({ arguments: [' a ', null, ' b ', ''] }),
        );
      }).toThrowErrorType(ValidationError);
    });
  });

  describe('update', () => {
    let endpoint: Endpoint;

    beforeEach(async () => {
      endpoint = await service.create(
        mockEndpoint({
          navigations: [' abc ', ' def  '],
          arguments: ['xyz', 1],
        }),
      );
    });

    it('trims the strings', async () => {
      const updatedEndpoint = await service.update(endpoint.id, {
        title: '   new title      ',
      });
      expect(updatedEndpoint.title).toBe('new title');
    });

    it('validates input', async () => {
      await expect(
        async () => await service.update(1, mockEndpoint({ url: '...' })),
      ).toThrowErrorType(ValidationError);
    });

    it('saves nested navigations', async () => {
      const updated = await service.update(
        endpoint.id,
        mockEndpoint({ navigations: [' a ', ' b '] }),
      );
      expect(updated.navigation()).toStrictEqual(['a', 'b']);
    });

    it('saves nested arguments', async () => {
      const updated = await service.update(
        endpoint.id,
        mockEndpoint({ arguments: [' a ', ' b ', true, 123] }),
      );
      expect(updated.args()).toStrictEqual([' a ', ' b ', true, 123]);
    });

    it('rejects incorrect navigation', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpoint({ navigations: [' a ', ' b ', ''] }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect navigation (trim function does not crash)', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpoint({ navigations: [' a ', true] }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpoint({ arguments: [' a ', null, ' b '] }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('rejects incorrect arguments (includes function)', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpoint({
            arguments: [
              ' a ',
              ' b ',
              () => {
                console.log();
              },
            ],
          }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('keeps previous navigations/arguments when the data to patch omits those properties', async () => {
      await service.update(endpoint.id, { title: ' ....new title.... ' });
      const found = await service.findOne(endpoint.id);
      expect(found.title).toBe('....new title....');
      expect(found.navigation()).toStrictEqual(['abc', 'def']);
      expect(found.args()).toStrictEqual(['xyz', 1]);
    });

    it('keeps previous navigations if the data omits that property', async () => {
      await service.update(endpoint.id, {
        arguments: convertArgs(['text', 123]) as any,
      });
      const found = await service.findOne(endpoint.id);
      expect(found.navigation()).toStrictEqual(['abc', 'def']);
      expect(found.args()).toStrictEqual(['text', 123]);
    });

    it('keeps previous arguments if the data omits that property', async () => {
      await service.update(endpoint.id, {
        navigations: convertNav([' nav1 ', 'nav2 ']),
      });
      const found = await service.findOne(endpoint.id);
      expect(found.navigation()).toStrictEqual(['nav1', 'nav2']);
      expect(found.args()).toStrictEqual(['xyz', 1]);
    });
  });

  describe('findEnabled', () => {
    it('fetches only the enabled ones', async () => {
      const e1 = await service.create(mockEndpoint());
      const e2 = await service.create(mockEndpoint());
      const e3 = await service.create(mockEndpoint());
      await service.enable(e1.id, true);
      await service.enable(e2.id, true);
      await service.enable(e3.id, false);
      expect(await service.findEnabled()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await service.create(mockEndpoint());
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
      await service.create(
        mockEndpoint({
          periodMinutes: 25,
          waitAfterNotificationMinutes: 107,
        }),
      );
      endpoint = await service.findOne(1);
    });

    it('has a null default timeout value', async () => {
      expect(endpoint.timeout).toBeNull;
    });

    it('uses periodMinutes when there is no notification', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(false, endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 00:25:00.000Z'),
      );
    });

    it('chooses largest value (periodMinutes, has notification)', async () => {
      const now = new Date('2022-01-05');
      endpoint.periodMinutes = 200;
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 03:20:00.000Z'),
      );
    });

    it('chooses largest value (waitAfterNotificationMinutes, has notification)', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 01:47:00.000Z'),
      );
    });

    it('chooses the only value (waitAfterNotificationMinutes not defined, has notification)', async () => {
      const now = new Date('2022-01-05');
      endpoint.periodMinutes = 19;
      endpoint.waitAfterNotificationMinutes = undefined;
      await service.updateTimeout(true, endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 00:19:00.000Z'),
      );
    });
  });
});
