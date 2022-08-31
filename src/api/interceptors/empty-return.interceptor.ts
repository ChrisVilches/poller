import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Returns a 404 not found error when the controller action returns null or undefined.
 */
@Injectable()
export class EmptyReturnInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (data === null || typeof data === 'undefined')
          throw new NotFoundException();
      }),
    );
  }
}
