import { IsOptional, IsString, Length } from 'class-validator'
import { Expose } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SpotifyBrowseReleasesQueryDto {
  @IsOptional()
  @ApiPropertyOptional({ example: 'SI' })
  @IsString()
  @Length(2, 2, { message: 'Country must be 2 characters long' })
  @Expose()
  public country?: string
}
