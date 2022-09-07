import { PENDING_ENDPOINTS_QUEUE } from '@background-process/queues';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PersistenceModule } from '@persistence/persistence.module';
import { EndpointsController } from './controllers/endpoints.controller';
import { PollingsController } from './controllers/pollings.controller';
import { TagsController } from './controllers/tags.controller';

@Module({
  imports: [
    PersistenceModule,
    BullModule.registerQueue({ name: PENDING_ENDPOINTS_QUEUE }),
  ],
  controllers: [EndpointsController, PollingsController, TagsController],
  providers: [],
})
export class ApiModule {}
