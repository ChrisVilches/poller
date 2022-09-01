import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ConvertEndpointArraysPipe implements PipeTransform {
  transform(data: any, _metadata: ArgumentMetadata) {
    if (typeof data === 'object') {
      if (data.arguments) {
        data.arguments = data.arguments.map((value: string) => ({ value }));
      }
      if (data.navigations) {
        data.navigations = data.navigations.map((selector: string) => ({
          selector,
        }));
      }
    }

    return data;
  }
}
