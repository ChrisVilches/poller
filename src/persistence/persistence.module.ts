import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvFilePath, isTest, isDev } from '@util/env';
import * as Joi from 'joi';
import { Argument } from './entities/argument.entity';
import { Endpoint } from './entities/endpoint.entity';
import { Navigation } from './entities/navigation.entity';
import { Polling } from './entities/polling.entity';
import { Tag } from './entities/tag.entity';
import { EndpointsService } from './services/endpoints.service';
import { PollingsService } from './services/pollings.service';
import { TagsService } from './services/tags.service';

const entities = [Endpoint, Argument, Navigation, Polling, Tag];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      validationSchema: Joi.object({
        PG_DATABASE_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        url: process.env.PG_DATABASE_URL,
        entities,
        synchronize: isTest() || isDev(),
        dropSchema: isTest(),
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [EndpointsService, PollingsService, TagsService],
  exports: [EndpointsService, PollingsService, TagsService],
})
export class PersistenceModule {}
