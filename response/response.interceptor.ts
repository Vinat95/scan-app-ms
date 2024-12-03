import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseService } from './response.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly responseService: ResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Object && data.hasOwnProperty('success')) {
          return data;
        }

        return this.responseService.success(data);
      }),
      catchError((error) => throwError(() => this.handleError(error))),
    );
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      return new HttpException(
        this.responseService.error(statusCode, error.message),
        statusCode,
      );
    } else if (error instanceof Error) {
      return new HttpException(
        this.responseService.error(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Errore interno del server',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
