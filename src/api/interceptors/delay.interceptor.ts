import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, delay } from 'rxjs';

const DELAY_MS_MIN = +(process.env['REQUEST_DELAY_MS_MIN'] ?? 0);
const DELAY_MS_MAX = +(process.env['REQUEST_DELAY_MS_MAX'] ?? 0);

const randomRange = (from: number, to: number) => {
  const a = Math.min(from, to);
  const b = Math.max(from, to);
  const length = b - a;
  return Math.round(Math.random() * length + a);
};

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    if (DELAY_MS_MIN === 0 && DELAY_MS_MAX === 0) {
      return next.handle();
    } else {
      const delayMs = randomRange(DELAY_MS_MIN, DELAY_MS_MAX);
      return next.handle().pipe(delay(delayMs));
    }
  }
}
