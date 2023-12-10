import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from './entities/user.entity'
import { UserDto } from './dtos/user.dto'
import { serialize } from '../common/utils/serialize'
import { Permission } from '../common/enums/permission'
import { UserService } from './user.service'
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { UserPaginateConfig } from './user-paginate-config'
import { UpdateUserDto } from './dtos/update-user.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(Permission.READ_USER)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current user',
    type: UserDto
  })
  getProfile(@RequestUser() user: User): UserDto {
    return serialize(user, UserDto)
  }

  @Auth(Permission.READ_USER, Permission.READ_USERS)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns all users' })
  @PaginatedSwaggerDocs(User, UserPaginateConfig)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all users',
    type: UserDto
  })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return await this.userService.findAllPaginated(query)
  }

  @Auth(Permission.UPDATE_USER)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates a user',
    type: UserDto
  })
  async updateById(@Param('id', new ParseUUIDPipe()) id: string, @Body() data: UpdateUserDto): Promise<UserDto> {
    return serialize(await this.userService.updateById(id, data), UserDto)
  }

  @Auth(Permission.DELETE_USER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deletes a user'
  })
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.userService.deleteById(id)
  }
}
