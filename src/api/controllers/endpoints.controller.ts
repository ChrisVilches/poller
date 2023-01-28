import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
import { TagsService } from '@persistence/services/tags.service';

@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ProcessErrorInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('endpoints')
@ApiTags('Endpoints')
export class EndpointsController {
  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly tagsService: TagsService,
  ) {}

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
    return this.endpointsService.create(params);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() params: EndpointUpdateDto,
  ) {
    return this.endpointsService.update(id, params);
  }

  @Patch(':id/enable')
  enable(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.enable(id, true);
  }

  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.enable(id, false);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.delete(id);
  }

  @Patch(':id/clear_timeout')
  async clearTimeout(@Param('id', ParseIntPipe) id: number): Promise<Endpoint> {
    await this.endpointsService.clearTimeout(id);
    return await this.endpointsService.findOne(id);
  }

  @Get('/:id/tags')
  tags(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findAllEndpointTags(id);
  }
}
