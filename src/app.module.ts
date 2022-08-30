import { Module, OnModuleInit } from '@nestjs/common';
import { EndpointsModule } from './endpoints/endpoints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './endpoints/entities/endpoint.entity';
import { Argument } from './endpoints/entities/argument.entity';
import { Navigation } from './endpoints/entities/navigation.entity';
import { Polling } from './endpoints/entities/polling.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PollingSuccessListener } from './listeners/polling-success.listener';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { NotificationConsumer } from './consumers/notification.consumer';
import { TestConsumer } from './consumers/test.consumer';
import { Queue } from 'bull';
import { FetchPendingEndpointsJob } from './endpoints/jobs/fetch-pending-endpoints.job';
import { PollingsService } from './endpoints/pollings.service';
import { EndpointsService } from './endpoints/endpoints.service';
import { PendingEndpointsConsumer } from './consumers/pending-endpoints.consumer';
import { CleanOldPollingRecordsJob } from './endpoints/jobs/clean-old-polling-records.job';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        CLEAN_POLLING_OLDER_THAN_DAYS: Joi.number()
          .default(10)
          .min(3)
          .max(1000),
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    // TODO: Set queue worker count (should be 1 or so, since I may
    //       get banned from the endpoints I'm scraping)
    BullModule.registerQueue({ name: 'notifications' }),
    BullModule.registerQueue({ name: 'test' }),
    BullModule.registerQueue({ name: 'pending-endpoints' }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dist/polling_db',
      entities: [Endpoint, Argument, Navigation, Polling],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Endpoint, Polling]),
    EndpointsModule,
  ],
  controllers: [AppController],
  providers: [
    PollingSuccessListener,
    NotificationConsumer,
    TestConsumer,
    PendingEndpointsConsumer,
    EndpointsService,
    PollingsService,
    FetchPendingEndpointsJob,
    CleanOldPollingRecordsJob,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectQueue('test') private testQueue: Queue) {}

  onModuleInit() {
    this.testQueue.add({});
  }
}
