import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

// TODO:
// Also try to clean up some tests. The DTO ones probably are a bit messy
// although they pass. Do other things like deprecating (but not deleting necessarily)
// the controller one, that one has no pipes.

export const createTestingModule = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  await app.init();
  return app;
};
