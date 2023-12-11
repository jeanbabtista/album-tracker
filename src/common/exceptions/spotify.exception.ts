import { HttpException } from '@nestjs/common'

export class SpotifyException extends HttpException {
  constructor(message: string) {
    super(message, 400)
  }
}
