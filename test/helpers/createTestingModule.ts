import { INestApplication } from '@nestjs/common';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { configureApp } from '../../src/configureApp';
import { AppModule } from '../../src/app.module';
import { mockQueues } from './mockQueues';

const buildModule = (): TestingModuleBuilder =>
  Test.createTestingModule({
    imports: [AppModule],
  });

export const createTestingModule = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await mockQueues(
    buildModule(),
  ).compile();
  const app: INestApplication = moduleFixture.createNestApplication();
  configureApp(app);

  return await app.init();
};
