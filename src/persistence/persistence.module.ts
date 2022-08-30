import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { Argument } from "./entities/argument.entity";
import { Endpoint } from "./entities/endpoint.entity";
import { Navigation } from "./entities/navigation.entity";
import { Polling } from "./entities/polling.entity";
import { EndpointsService } from "./services/endpoints.service";
import { PollingsService } from "./services/pollings.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SQLITE_DB_FILE_PATH: Joi.string().required()
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB_FILE_PATH,
      entities: [Endpoint, Argument, Navigation, Polling], // TODO: Can I abbreviate this? (or remove)
      synchronize: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Endpoint, Polling]), // TODO: Necessary?
  ],
  providers: [EndpointsService, PollingsService],
  // TODO: Without this, it breaks. Learn about exports.
  exports: [EndpointsService, PollingsService]
})
export class PersistenceModule {
}
