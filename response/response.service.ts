import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(
    data: any,
    message: string = 'Operazione completata con successo',
    statusCode: number = 200,
  ) {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  }

  error(code: number, message: string, details?: string) {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      statusCode: code,
    };
  }
}
