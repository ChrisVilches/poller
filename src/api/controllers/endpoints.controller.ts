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
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';
import { CreateEndpointDto } from '@persistence/dto/create-endpoint.dto';
import { UpdateEndpointDto } from '@persistence/dto/update-endpoint.dto';
import { EndpointsService } from '@persistence/services/endpoints.service';

@UseInterceptors(NotFoundInterceptor)
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.endpointsService.findOne(id);
  }

  @Post()
  create(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointsService.create(createEndpointDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEndpointDto: UpdateEndpointDto,
  ) {
    return this.endpointsService.update(id, updateEndpointDto);
  }
}