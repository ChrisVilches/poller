import { PENDING_ENDPOINTS_QUEUE } from '@background-process/queues';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '@persistence/persistence.module';
import { getEnvFilePath } from '@util/env';
import * as Joi from 'joi';
import { EndpointsController } from './controllers/endpoints.controller';
import { PollingsController } from './controllers/pollings.controller';
import { TagsController } from './controllers/tags.controller';

@Module({
  imports: [
    PersistenceModule,
    BullModule.registerQueue({ name: PENDING_ENDPOINTS_QUEUE }),
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        REQUEST_DELAY_MS_MIN: Joi.number().default(0),
        REQUEST_DELAY_MS_MAX: Joi.number().default(0),
      }),
    }),
  ],
  controllers: [EndpointsController, PollingsController, TagsController],
  providers: [],
})
export class ApiModule {}
