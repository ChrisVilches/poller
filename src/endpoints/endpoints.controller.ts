import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';

@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  @Post()
  create(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointsService.create(createEndpointDto);
  }

  @Get('seed')
  seed() {
    this.endpointsService.seed();
    return 'ok'
  }

  @Get()
  findAll() {
    return this.endpointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.endpointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEndpointDto: UpdateEndpointDto) {
    return this.endpointsService.update(+id, updateEndpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.endpointsService.remove(+id);
  }
}
