import { TestingModule } from '@nestjs/testing';
import { EndpointsService } from './endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { mockEndpoint } from '@test/helpers/mockEndpoint';
import { ValidationError } from 'class-validator';
import '@test/matchers/toThrowErrorType';
import { createTestingModule } from '@test/helpers/createTestingModule';

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
      endpoint = await service.create(mockEndpoint());
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

    it('rejects incorrect arguments', async () => {
      await expect(async () => {
        await service.update(
          endpoint.id,
          mockEndpoint({ arguments: [' a ', null, ' b ', ''] }),
        );
      }).toThrowErrorType(ValidationError);
    });
  });

  describe('findEnabled', () => {
    it('fetches only the enabled ones', async () => {
      await service.create(mockEndpoint({ enabled: true }));
      await service.create(mockEndpoint({ enabled: true }));
      await service.create(mockEndpoint({ enabled: false }));
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
      await service.create(mockEndpoint());
      endpoint = await service.findOne(1);
    });

    it('has a null default timeout value', async () => {
      expect(endpoint.timeout).toBeNull;
    });

    it('updates the timeout date', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 00:10:00.000Z'),
      );
    });

    it('updates the timeout date (larger wait time)', async () => {
      const now = new Date('2022-01-05');
      endpoint.waitAfterNotificationMinutes = 101;
      await service.updateTimeout(endpoint, now);
      expect((await service.findOne(1)).timeout).toStrictEqual(
        new Date('2022-01-05 01:41:00.000Z'),
      );
    });

    it('does not update the timeout date if the wait time is null', async () => {
      const now = new Date('2022-01-05');
      endpoint.waitAfterNotificationMinutes = undefined;
      await service.updateTimeout(endpoint, now);
      expect((await service.findOne(1)).timeout).toBeNull();
    });
  });
});
