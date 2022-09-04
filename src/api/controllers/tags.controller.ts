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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagPartialDto, TagDto } from '@persistence/dto/tag.dto';
import { TagsService } from '@persistence/services/tags.service';

@Controller('tags')
@ApiTags('Tags')
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
  create(@Body() params: TagDto) {
    return this.tagsService.create(params);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() params: TagPartialDto) {
    return this.tagsService.update(id, params);
  }

  @Post(':id/add/:endpointId')
  add(
    @Param('id', ParseIntPipe) id: number,
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ) {
    return this.tagsService.addEndpoint(id, endpointId);
  }

  @Delete(':id/remove/:endpointId')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ) {
    return this.tagsService.removeEndpoint(id, endpointId);
  }
}
