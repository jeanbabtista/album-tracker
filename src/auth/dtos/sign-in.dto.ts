import { PickType } from '@nestjs/mapped-types'
import { CreateUserDto } from '../../user/dtos/create-user.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export class SignInDto extends PickType(CreateUserDto, ['email', 'password'] as const) {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string
}
