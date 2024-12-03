import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let message;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    switch (status) {
      case 404:
        message = `Utente non trovato.`;
        break;
      case 400:
        message = `Richiesta non valida: Dati non conformi`;
        break;
      case 401:
        message = "Accesso negato.";
        break;
      case 403:
        message = "Accesso negato.";
        break;
      default:
        message = `Errore del server`;
    }

    const errorResponse = {
      statusCode: status,
      message: message,
    };

    // Restituisci la risposta
    response.status(status).json(errorResponse);
  }
}
