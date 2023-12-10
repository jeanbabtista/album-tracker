import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dtos/sign-in.dto'
import { SignUpDto } from './dtos/sign-up.dto'
import { serialize } from '../common/utils/serialize'
import { UserDto } from '../user/dtos/user.dto'
import { JwtAccessToken } from './types/jwt-access-token'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'Registers a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registers a user',
    type: UserDto
  })
  async signUp(@Body() data: SignUpDto): Promise<UserDto> {
    const user = await this.authService.signUp(data)
    return serialize(user, UserDto)
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  @ApiOperation({ summary: 'Signs in a user' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Signs in a user'
  })
  signIn(@Body() { email, password }: SignInDto): Promise<JwtAccessToken> {
    return this.authService.signIn(email, password)
  }
}
