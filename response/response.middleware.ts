import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ResponseService } from './response.service';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  constructor(private readonly responseService: ResponseService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res['success'] = (
      data: any,
      message: string = 'Operazione completata con successo',
      statusCode: number = 200,
    ) => {
      res
        .status(statusCode)
        .json(this.responseService.success(data, message, statusCode));
    };

    res['error'] = (code: number, message: string, details?: string) => {
      res.status(code).json(this.responseService.error(code, message, details));
    };

    next();
  }
}
