import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { RequestType } from '@persistence/enum/request-type.enum';

@Injectable()
export class RequestTypeStringToEnumPipe implements PipeTransform {
  transform(data: any, _metadata: ArgumentMetadata) {
    if (typeof data === 'object' && 'type' in data) {
      if (data.type.toLowerCase() === 'html') {
        data.type = RequestType.HTML;
      } else if (data.type.toLowerCase() === 'json') {
        data.type = RequestType.JSON;
      } else {
        data.type = RequestType.INVALID;
      }
    }
    return data;
  }
}
