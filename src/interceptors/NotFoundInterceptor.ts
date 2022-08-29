import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(tap(data => {
        if (data === null || typeof data === 'undefined') throw new NotFoundException();
      }));
  }
}
