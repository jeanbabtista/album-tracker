import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from '../postgres/entities/user.entity'
import { UserDto } from './dtos/user.dto'
import { serialize } from '../common/utils/serialize'

@Controller('user')
@ApiTags('user')
export class UserController {
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOperation({ summary: 'Returns the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current user',
    type: UserDto
  })
  getProfile(@RequestUser() user: User): UserDto {
    return serialize(user, UserDto)
  }
}
