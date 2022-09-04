import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Method } from '@persistence/enum/method.enum';

@Injectable()
export class MethodStringToEnumPipe implements PipeTransform {
  transform(data: any, _metadata: ArgumentMetadata) {
    if (typeof data !== 'object' || !('method' in data)) {
      return data;
    }

    const map = {
      GET: Method.GET,
      POST: Method.POST,
      PUT: Method.PUT,
      PATCH: Method.PATCH,
      DELETE: Method.DELETE,
    };

    const sanitized = (data.method || '').toUpperCase().trim();

    const method = map[sanitized as keyof typeof map];

    if (typeof method === 'undefined') {
      data.method = Method.INVALID;
    } else {
      data.method = method;
    }

    return data;
  }
}
