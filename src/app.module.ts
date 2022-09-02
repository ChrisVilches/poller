import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { BackgroundProcessModule } from '@background-process/background-process.module';
import { ApiModule } from '@api/api.module';
import { getEnvFilePath } from './util';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'production', 'test', 'provision'),
        PORT: Joi.number().required(),
      }),
    }),
    ApiModule,
    BackgroundProcessModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
