import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// TODO: This middleware is only for testing. Should be removed in the future.
//       Or at least use a good logging middleware, not this one.

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(context.switchToHttp().getRequest().url);
    return next.handle();
  }
}
