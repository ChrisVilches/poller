import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';

// TODO:
// Also try to clean up some tests. The DTO ones probably are a bit messy
// although they pass. Do other things like deprecating (but not deleting necessarily)
// the controller one, that one has no pipes.

// TODO: I think this sends the test queue a message each time it's initialized.
//       Redis for testing should be a different one (or simply avoid using queues,
//       since they are not tested.). Issue confirmed (added the env to the test queue log)

export const createTestingModule = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();
  return app;
};
