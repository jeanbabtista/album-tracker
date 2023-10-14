import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
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

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  lastName: string
}
