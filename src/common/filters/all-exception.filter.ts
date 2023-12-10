import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common'
import { QueryFailedError } from 'typeorm'
import { PgErrorCodes } from '../../postgres/exceptions/pg-error-codes'
import { IsAlpha, IsArray } from 'class-validator'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'

    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        console.log('BadRequestException', exception)
        const response = exception.getResponse()
        const msg = response['message']
        status = HttpStatus.BAD_REQUEST
        message = msg
      } else {
        console.log('HttpException', exception)
        status = exception.getStatus()
        message = exception.message
      }
    } else if (exception instanceof QueryFailedError) {
      const { detail } = exception.driverError || {}
      switch (exception.driverError.code) {
        case PgErrorCodes.UniqueViolation:
          console.log('UniqueViolation', exception)
          status = HttpStatus.CONFLICT
          message = detail
          break
        default:
          console.log('QueryFailedError', exception)
          status = HttpStatus.BAD_REQUEST
          message = exception.message
          break
      }
    } else {
      console.log('Exception', exception)
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    })
  }
}
