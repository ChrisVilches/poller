import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { Queue } from 'bull';
import { PersistenceModule } from '@persistence/persistence.module';
import { NotificationConsumer } from './consumers/notification.consumer';
import { PendingEndpointsConsumer } from './consumers/pending-endpoints.consumer';
import { TestConsumer } from './consumers/test.consumer';
import { CleanOldPollingRecordsJob } from './jobs/clean-old-polling-records.job';
import { FetchPendingEndpointsJob } from './jobs/fetch-pending-endpoints.job';
import { PollingSuccessListener } from './listeners/polling-success.listener';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath } from '../../src/util';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        CLEAN_POLLING_OLDER_THAN_DAYS: Joi.number().min(3).max(1000).required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({ name: 'notifications' }),
    BullModule.registerQueue({ name: 'test' }),
    BullModule.registerQueue({ name: 'pending-endpoints' }),
    PersistenceModule,
  ],
  controllers: [],
  providers: [
    PollingSuccessListener,
    NotificationConsumer,
    TestConsumer,
    PendingEndpointsConsumer,
    FetchPendingEndpointsJob,
    CleanOldPollingRecordsJob,
  ],
})
export class BackgroundProcessModule implements OnModuleInit {
  constructor(@InjectQueue('test') private testQueue: Queue) {}

  onModuleInit() {
    this.testQueue.add(new Date());
  }
}
