import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ProcessErrorInterceptor } from '../interceptors/process-error.interceptor';
import { EmptyReturnInterceptor } from '../interceptors/empty-return.interceptor';
import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';

@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ProcessErrorInterceptor)
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  @Get()
  findAll() {
    return this.endpointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.findOne(id);
  }

  @Post()
  create(@Body() endpointDto: EndpointDto) {
    return this.endpointsService.create(endpointDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() endpointDto: Partial<EndpointDto>,
  ) {
    return this.endpointsService.update(id, endpointDto);
  }

  @Patch(':id/enable')
  enable(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.enable(id, true);
  }

  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.enable(id, false);
  }

  @Patch(':id/clear_timeout')
  async clearTimeout(@Param('id') id: number): Promise<Endpoint> {
    await this.endpointsService.clearTimeout(id);
    return await this.endpointsService.findOne(id);
  }
}
