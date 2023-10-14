import { HttpException } from '@nestjs/common'
import { AxiosError } from 'axios'

export class LastFmException extends HttpException {
  constructor(error: AxiosError) {
    const data = error.response?.data

    const title = error.message
    const message =
      typeof data === 'string' && data.trim().startsWith('<')
        ? data.split('<h2>')[1].split('<p>')[0].trim()
        : data || 'Something went wrong'

    console.error(error)
    super(title, error.response?.status || 500)
  }
}
