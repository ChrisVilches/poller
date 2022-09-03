import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { catchError, Observable } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

const isArrayOf = (data: any, type: any) => {
  if (!(data instanceof Array)) {
    return false;
  }

  return data.reduce((accum, elem) => accum && elem instanceof type, true);
};

/**
 * This interceptor is used to transform some errors coming from other classes
 * (such as classes from the persistence module) into HTTP errors recognizable
 * by the HTTP client (such as 404, etc).
 *
 * Note: Not all validations can be done with pipes, so this is necessary.
 *
 * TODO: Try to use something from https://docs.nestjs.com/exception-filters
 */
@Injectable()
export class ProcessErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        if (err instanceof EntityNotFoundError) {
          throw new NotFoundException();
        }

        if (isArrayOf(err, ValidationError)) {
          throw new BadRequestException({
            statusCode: 400,
            message: err.flatMap((e: any) => Object.values(e.constraints)),
            error: 'Bad Request',
          });
        }
        throw err;
      }),
    );
  }
}
