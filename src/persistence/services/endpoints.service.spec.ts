import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndpointsService } from './endpoints.service';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import '@test/matchers/toHaveValidationError';
import { mockEndpoint } from '@test/helpers/mockEndpoint';

describe(EndpointsService.name, () => {
  let service: EndpointsService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Endpoint, Navigation, Argument]),
      ],
      providers: [EndpointsService],
    }).compile();

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
      ).toHaveValidationError();
    });

    it('validates input (accepts correct input)', async () => {
      await expect(
        async () =>
          await service.create(mockEndpoint({ url: 'https://www.hello.com' })),
      ).not.toHaveValidationError();
    });

    it('trims the title and content message', async () => {
      const endpoint = await service.create(
        mockEndpoint({ title: '   some title  ' }),
      );
      expect(endpoint.title).toBe('some title');
    });
  });

  describe('update', () => {
    it('trims the strings', async () => {
      const endpoint = await service.create(mockEndpoint());
      expect(endpoint.id).toBe(1);
      const updatedEndpoint = await service.update(endpoint.id, {
        title: '   new title      ',
      });
      expect(updatedEndpoint?.title).toBe('new title');
    });

    it('validates input', async () => {
      const endpoint = await service.create(mockEndpoint());
      expect(endpoint.id).toBe(1);
      await expect(
        async () => await service.update(1, mockEndpoint({ url: '...' })),
      ).toHaveValidationError();
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
      endpoint = (await service.findOne(1)) as Endpoint;
    });

    it('has a null default timeout value', async () => {
      expect(endpoint.timeout).toBeNull;
    });

    it('updates the timeout date', async () => {
      const now = new Date('2022-01-05');
      await service.updateTimeout(endpoint, now);
      endpoint = (await service.findOne(1)) as Endpoint;
      expect(endpoint.timeout).toStrictEqual(
        new Date('2022-01-05 00:10:00.000Z'),
      );
    });

    it('updates the timeout date (larger wait time)', async () => {
      const now = new Date('2022-01-05');
      endpoint.waitAfterNotificationMinutes = 101;
      await service.updateTimeout(endpoint, now);
      endpoint = (await service.findOne(1)) as Endpoint;
      expect(endpoint.timeout).toStrictEqual(
        new Date('2022-01-05 01:41:00.000Z'),
      );
    });

    it('does not update the timeout date if the wait time is null', async () => {
      const now = new Date('2022-01-05');
      endpoint.waitAfterNotificationMinutes = undefined;
      await service.updateTimeout(endpoint, now);
      endpoint = (await service.findOne(1)) as Endpoint;
      expect(endpoint.timeout).toBeNull();
    });
  });
});
