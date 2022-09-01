import { TestingModule } from '@nestjs/testing';
import { mockEndpoint } from '@test/helpers/mockEndpoint';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { EndpointsController } from './endpoints.controller';
import '@test/matchers/toThrowErrorType';
import { EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { createTestingModule } from '@test/helpers/createTestingModule';
import { convertNav } from '@test/helpers/convertNav';
import { convertArgs } from '@test/helpers/convertArgs';

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

// TODO: Some of these tests verify that the endpoints throw a validation error, but they don't validate that
//       the pipes are returning a Bad Request. Must test this as well (that pipes are working as expected).

describe(EndpointsController.name, () => {
  let moduleRef: TestingModule;
  let controller: EndpointsController;
  let endpoint: Endpoint;

  beforeEach(async () => {
    moduleRef = await createTestingModule();
    controller = moduleRef.get<EndpointsController>(EndpointsController);
  });

  beforeEach(async () => {
    endpoint = await controller.create(
      mockEndpoint({ title: '   endpoint title  ' }),
    );
  });

  afterEach(async () => {
    await moduleRef.close();
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
      const response = await controller.update(endpoint.id, {
        title: endpointStringsNonTrimmed.title,
        navigations: convertNav(endpointStringsNonTrimmed.navigations),
        arguments: convertArgs(endpointStringsNonTrimmed.arguments) as any,
      });
      expectStringsTrimmed(response);
    });

    it('transforms nested data', async () => {
      await controller.update(endpoint.id, {
        title: endpointStringsNonTrimmed.title,
        navigations: convertNav(endpointStringsNonTrimmed.navigations),
        arguments: convertArgs(endpointStringsNonTrimmed.arguments) as any,
      });
      expectStringsTrimmed((await controller.findOne(1)) as Endpoint);
    });

    it('validates navigation', async () => {
      await expect(async () => {
        await controller.update(endpoint.id, { navigations: convertNav(['']) });
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.update(endpoint.id, {
          navigations: convertNav(['hello']),
        });
      }).not.toThrowErrorType(ValidationError);
    });

    it('validates arguments', async () => {
      await expect(async () => {
        await controller.update(endpoint.id, { arguments: wrongArgs });
      }).toThrowErrorType(ValidationError);

      await expect(async () => {
        await controller.update(endpoint.id, {
          arguments: convertArgs(['hello', 111, true]) as any,
        });
      }).not.toThrowErrorType(ValidationError);
    });
  });
});
