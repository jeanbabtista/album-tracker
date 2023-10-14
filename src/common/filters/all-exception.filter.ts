import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { QueryFailedError } from 'typeorm'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = exception.message
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST
      message = exception.message
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    })
  }
}
