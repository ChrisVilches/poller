import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint])],
  controllers: [EndpointsController],
  providers: [EndpointsService]
})
export class EndpointsModule {}
