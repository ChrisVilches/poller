import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { BackgroundProcessModule } from '@background-process/background-process.module';
import { ApiModule } from '@api/api.module';
import { getEnvFilePath } from '@util/env';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocketModule } from './events-gateway/socket.module';

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
    SocketModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
