import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, delay } from 'rxjs';

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const delayValue = Math.round(Math.random() * 300 + 200);
    console.log(`Delay used: ${delayValue}`);

    return next.handle().pipe(delay(delayValue));
  }
}
