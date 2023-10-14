import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception'
import { verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { JwtAccessToken } from './types/jwt-access-token'
import { JwtPayload } from './types/jwt-payload'
import { SignUpDto } from './dtos/sign-up.dto'
import { User } from '../postgres/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(data: SignUpDto): Promise<User> {
    return await this.userService.create(data)
  }

  async signIn(email: string, password: string): Promise<JwtAccessToken> {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UserNotFoundException()

    const valid = await verify(user.passwordHash, password)
    if (!valid) throw new UnauthorizedException()

    const payload: JwtPayload = { sub: user.id }
    return { access_token: await this.jwtService.signAsync(payload) }
  }
}
