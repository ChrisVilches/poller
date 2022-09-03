import { EmptyReturnInterceptor } from '@api/interceptors/empty-return.interceptor';
import { ProcessErrorInterceptor } from '@api/interceptors/process-error.interceptor';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagDto } from '@persistence/dto/tag.dto';
import { TagsService } from '@persistence/services/tags.service';

@Controller('tags')
@UseInterceptors(EmptyReturnInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ProcessErrorInterceptor)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() tagDto: TagDto) {
    return this.tagsService.create(tagDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() tagDto: TagDto) {
    return this.tagsService.update(id, tagDto);
  }

  @Post(':id/add/:endpoint_id')
  add(
    @Param('id', ParseIntPipe) id: number,
    @Param('endpoint_id', ParseIntPipe) endpointId: number,
  ) {
    return this.tagsService.addEndpoint(id, endpointId);
  }

  @Delete(':id/remove/:endpoint_id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('endpoint_id', ParseIntPipe) endpointId: number,
  ) {
    return this.tagsService.removeEndpoint(id, endpointId);
  }
}
