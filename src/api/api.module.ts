import { Module } from '@nestjs/common';
import { PersistenceModule } from '@persistence/persistence.module';
import { EndpointsController } from './controllers/endpoints.controller';
import { PollingsController } from './controllers/pollings.controller';

// TODO: The way the app is structured (modules and their imports, etc)
//       is really bad right now. The documentation says that modules
//       can be closely related. So that means I should be able to
//       connect two modules that aren't 100% related (for example
//       endpoints & polling)
//
//       Also there are many features that I'm not using, like DTO,
//       pipes, injectors, middlewares, etc. Try to use as many as possible.

@Module({
  imports: [PersistenceModule],
  controllers: [EndpointsController, PollingsController],
  providers: [],
})
export class ApiModule {}
