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
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.PG_HOST,
        port: +(process.env.PG_PORT as string),
        username: process.env.PG_USERNAME,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
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
