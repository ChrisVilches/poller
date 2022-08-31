import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { catchError, Observable } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

/**
 * This interceptor is used to transform some errors coming from other classes
 * (such as classes from the persistence module) into HTTP errors recognizable
 * by the HTTP client (such as 404, etc).
 */
@Injectable()
export class ProcessErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        if (err instanceof EntityNotFoundError) {
          throw new NotFoundException();
        }
        if (err instanceof ValidationError) {
          throw new UnprocessableEntityException();
        }
        throw err;
      }),
    );
  }
}
