import { EndpointsController } from '@api/controllers/endpoints.controller';
import { BackgroundProcessModule } from '@background-process/background-process.module';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Argument } from '@persistence/entities/argument.entity';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { Polling } from '@persistence/entities/polling.entity';
import { PersistenceModule } from '@persistence/persistence.module';
import { PollingsService } from '@persistence/services/pollings.service';

export const createTestingModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    controllers: [EndpointsController, PollingsService],
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        autoLoadEntities: true,
        synchronize: true,
      }),
      BackgroundProcessModule,
      PersistenceModule,
      TypeOrmModule.forFeature([Endpoint, Navigation, Argument, Polling]),
    ],
    providers: [],
  }).compile();
};
