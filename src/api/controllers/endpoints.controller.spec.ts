import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockEndpoint } from '@test/helpers/mockEndpoint';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { EndpointsController } from './endpoints.controller';

describe(EndpointsController.name, () => {
  let controller: EndpointsController;

  beforeEach(async () => {
    // TODO: Make it lighter. Recycle some code.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndpointsController],
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

    controller = module.get<EndpointsController>(EndpointsController);
  });

  describe('findOne', () => {
    it('should return null when the record does not exist', async () => {
      expect(await controller.findOne(1000)).toBe(null);
    });

    it('should return the record when it exists', async () => {
      await controller.create(mockEndpoint({ title: '   endpoint title  ' }));
      const endpoint = await controller.findOne(1);
      expect(endpoint?.id).toBe(1);
      expect(endpoint?.title).toBe('endpoint title');
    });

    it('validates periodMinutes', async () => {
      // TODO: Test the pipes as well.
    });
  });
});
