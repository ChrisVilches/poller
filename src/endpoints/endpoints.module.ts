import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { PollingsService } from './pollings.service';
import { PollingsController } from './pollings.controller';
import { Polling } from './entities/polling.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Polling])],
  controllers: [EndpointsController, PollingsController],
  providers: [EndpointsService, PollingsService]
})
export class EndpointsModule {}
