import { Controller, Get, Param } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.endpointsService.findOne(+id);
  }
}
