import {
  Body,
  ClassSerializerInterceptor,
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
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { ApiTags } from '@nestjs/swagger';
import { convertEndpointDto } from '@util/endpoints';

@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ProcessErrorInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('endpoints')
@ApiTags('Endpoints')
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
  create(@Body() params: EndpointCreateDto) {
    return this.endpointsService.create(convertEndpointDto(params));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() params: EndpointUpdateDto,
  ) {
    return this.endpointsService.update(id, convertEndpointDto(params));
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
  async clearTimeout(@Param('id', ParseIntPipe) id: number): Promise<Endpoint> {
    await this.endpointsService.clearTimeout(id);
    return await this.endpointsService.findOne(id);
  }
}
