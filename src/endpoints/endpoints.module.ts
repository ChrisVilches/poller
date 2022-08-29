import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { PollingsService } from './pollings.service';
import { PollingsController } from './pollings.controller';
import { Polling } from './entities/polling.entity';

// TODO: The way the app is structured (modules and their imports, etc)
//       is really bad right now. The documentation says that modules
//       can be closely related. So that means I should be able to
//       connect two modules that aren't 100% related (for example
//       endpoints & polling)
//
//       Also there are many features that I'm not using, like DTO,
//       pipes, injectors, middlewares, etc. Try to use as many as possible.
@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Polling])],
  controllers: [EndpointsController, PollingsController],
  providers: [EndpointsService, PollingsService],
})
export class EndpointsModule {}
