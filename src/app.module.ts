import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EndpointsModule } from './endpoints/endpoints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './endpoints/entities/endpoint.entity';
import { Argument } from './endpoints/entities/argument.entity';
import { Navigation } from './endpoints/entities/navigation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type :"sqlite",
      database: "polling_db",
      entities: [Endpoint, Argument, Navigation],
      synchronize: true // TODO: Disable for production
    }),
    EndpointsModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
