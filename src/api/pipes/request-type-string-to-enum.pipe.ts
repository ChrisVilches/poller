import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { RequestType } from '@persistence/entities/endpoint.entity';

@Injectable()
export class RequestTypeStringToEnumPipe implements PipeTransform {
  transform(data: any, _metadata: ArgumentMetadata) {
    if (typeof data === 'object' && 'type' in data) {
      if(data.type.toLowerCase() === "html") {
        data.type = RequestType.HTML
      } else if(data.type.toLowerCase() === "json") {
        data.type = RequestType.JSON
      }
      // TODO: Add invalid case. Actually it seems it still works like this (for some reason),
      //       even without handling the invalid value.
    }
    return data;
  }
}
