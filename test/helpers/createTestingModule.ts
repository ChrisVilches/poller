import { INestApplication } from '@nestjs/common';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { mockQueues } from './mockQueues';

// TODO:
// Also try to clean up some tests. The DTO ones probably are a bit messy
// although they pass. Do other things like deprecating (but not deleting necessarily)
// the controller one, that one has no pipes.

const buildModule = (): TestingModuleBuilder =>
  Test.createTestingModule({
    imports: [AppModule],
  });

export const createTestingModule = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await mockQueues(
    buildModule(),
  ).compile();
  const app: INestApplication = moduleFixture.createNestApplication();
  return await app.init();
};
