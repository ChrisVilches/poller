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

@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ProcessErrorInterceptor)
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

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
}
