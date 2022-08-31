import { Module } from '@nestjs/common';
import { PersistenceModule } from '@persistence/persistence.module';
import { EndpointsController } from './controllers/endpoints.controller';
import { PollingsController } from './controllers/pollings.controller';

@Module({
  imports: [PersistenceModule],
  controllers: [EndpointsController, PollingsController],
  providers: [],
})
export class ApiModule {}
