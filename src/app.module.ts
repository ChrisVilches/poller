import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dist/polling_db',
      entities: [Endpoint, Argument, Navigation, Polling],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    EndpointsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
