import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { INestApplication, INestApplicationContext } from '@nestjs/common';

export const runApp = (callback: (app: INestApplication) => Promise<void>) => {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(0);

    await callback(app);
    await app.close();
  }
  bootstrap();
};

export const runContext = (
  callback: (app: INestApplicationContext) => Promise<void>,
) => {
  async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });

    await callback(app);
    await app.close();
  }
  bootstrap();
};
