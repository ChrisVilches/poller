import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndpointsService } from './endpoints.service';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';

const mockEndpoint = (props: object = {}) => ({
  title: 'endpoint mock',
  url: 'https://www.some-url.com',
  notificationMessage: 'my message',
  type: 'html',
  rule: 'UndefinedRule',
  periodMinutes: 15,
  not: false,
  ...props,
});

describe('EndpointsService', () => {
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
});
