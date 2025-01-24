import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();

        const errorResponse = exception.getResponse();
        // Retorna la respuesta con los errores de validación, pero sin imprimirlos en consola
        response.status(status).json({
            statusCode: status,
            errorResponse,
        });
    }
}
