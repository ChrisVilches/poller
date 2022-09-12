import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { BackgroundProcessModule } from '@background-process/background-process.module';
import { ApiModule } from '@api/api.module';
import { getEnvFilePath } from '@util/env';
import { EventsGateway } from './sockets/events-gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'production', 'test', 'provision'),
        PORT: Joi.number().required(),
        PUSH_NOTIFICATION_MESSAGE_MAX_LENGTH: Joi.number().required(),
      }),
    }),
    ApiModule,
    BackgroundProcessModule,

    // TODO: Should create a module for sockets so that
    //       only that module imports this, not the main module.
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [EventsGateway],
})
export class AppModule {}
