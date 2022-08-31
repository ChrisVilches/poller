import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockEndpoint } from '@test/helpers/mockEndpoint';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { EndpointsController } from './endpoints.controller';
import '@test/matchers/toThrowErrorType';
import { EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';

const wrongArgs: any = [1, null, 'aaaa'];

const endpointStringsNonTrimmed = {
  title: ' new title  ',
  navigations: [' nav1  ', ' nav2  '],
  arguments: [11, '  abc  ', true],
};

const expectStringsTrimmed = (endpoint: Endpoint) => {
  expect(endpoint.title).toBe('new title');
  expect(endpoint.navigation()).toStrictEqual(['nav1', 'nav2']);
  expect(endpoint.args()).toStrictEqual([11, '  abc  ', true]);
};

describe(EndpointsController.name, () => {
  let controller: EndpointsController;
  let endpoint: Endpoint;

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

  beforeEach(async () => {
    endpoint = await controller.create(
      mockEndpoint({ title: '   endpoint title  ' }),
    );
  });

  describe('findOne', () => {
    it('should error when the record does not exist', async () => {
      await expect(async () => await controller.findOne(1000)).toThrowErrorType(
        EntityNotFoundError,
      );
    });

    it('should return the record when it exists', async () => {
      const found = await controller.findOne(endpoint.id);
      expect(found.id).toBe(1);
      expect(found.title).toBe('endpoint title');
    });
  });

  describe('create', () => {
    it('validates periodMinutes', async () => {
      await expect(async () => {
        await controller.create(mockEndpoint({ periodMinutes: -1 }));
      }).toThrowErrorType(ValidationError);
    });

    it('returns the transformed data', async () => {
      const response = await controller.create(
        mockEndpoint(endpointStringsNonTrimmed),
      );
      expectStringsTrimmed(response);
    });

    it('transforms nested data', async () => {
      const response = await controller.create(
        mockEndpoint(endpointStringsNonTrimmed),
      );
      expectStringsTrimmed(response);
    });

    it('validates navigation', async () => {
      await expect(async () => {
        await controller.create(
          mockEndpoint({
            navigations: [''],
          }),
        );
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.create(
          mockEndpoint({
            navigations: ['hello'],
          }),
        );
      }).not.toThrowErrorType(ValidationError);
    });

    it('validates arguments', async () => {
      await expect(async () => {
        await controller.create(mockEndpoint({ arguments: wrongArgs }));
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.create(
          mockEndpoint({
            arguments: ['hello', 111, true],
          }),
        );
      }).not.toThrowErrorType(ValidationError);
    });
  });

  describe('update', () => {
    it('validates periodMinutes', async () => {
      await expect(async () => {
        await controller.update(
          endpoint.id,
          mockEndpoint({ periodMinutes: -1 }),
        );
      }).toThrowErrorType(ValidationError);
    });

    it('returns the transformed data', async () => {
      const response = await controller.update(
        endpoint.id,
        endpointStringsNonTrimmed,
      );
      expectStringsTrimmed(response);
    });

    it('transforms nested data', async () => {
      await controller.update(endpoint.id, endpointStringsNonTrimmed);
      expectStringsTrimmed((await controller.findOne(1)) as Endpoint);
    });

    it('validates navigation', async () => {
      await expect(async () => {
        await controller.update(endpoint.id, { navigations: [''] });
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.update(endpoint.id, {
          navigations: ['hello'],
        });
      }).not.toThrowErrorType(ValidationError);
    });

    it('validates arguments', async () => {
      await expect(async () => {
        await controller.update(endpoint.id, { arguments: wrongArgs });
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.update(endpoint.id, {
          arguments: ['hello', 111, true],
        });
      }).not.toThrowErrorType(ValidationError);
    });
  });
});
