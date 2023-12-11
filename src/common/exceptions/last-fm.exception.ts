import { HttpException } from '@nestjs/common'
import { AxiosError } from 'axios'

export class LastFmException extends HttpException {
  constructor(error: AxiosError) {
    const title = error.message
    super(title, error.response?.status || error?.status || +error?.code || 500)
  }
}
