import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProcessErrorInterceptor } from '../interceptors/process-error.interceptor';
import { EmptyReturnInterceptor } from '../interceptors/empty-return.interceptor';
import { EndpointDto, PartialEndpointDto } from '@persistence/dto/endpoint.dto';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { ConvertEndpointArraysPipe } from '@api/pipes/convert-endpoint-arrays.pipe';
import { RequestTypeStringToEnumPipe } from '@api/pipes/request-type-string-to-enum.pipe';

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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UsePipes(new ConvertEndpointArraysPipe())
  @UsePipes(new RequestTypeStringToEnumPipe())
  create(@Body() endpointDto: EndpointDto) {
    return this.endpointsService.create(endpointDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UsePipes(new ConvertEndpointArraysPipe())
  @UsePipes(new RequestTypeStringToEnumPipe())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() endpointDto: PartialEndpointDto,
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
