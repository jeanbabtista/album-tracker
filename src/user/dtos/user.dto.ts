import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { Expose } from 'class-transformer'

export class UserDto {
  @ApiProperty({ example: 'b3d7c2e0-5e5a-4b1a-9f1a-0e9c9c6a2a1e' })
  @IsUUID()
  @Expose()
  id: string

  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string

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

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDate()
  @Expose()
  createdAt: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  @IsDate()
  @Expose()
  updatedAt: Date
}
