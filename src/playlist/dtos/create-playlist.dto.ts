import { IsOptional, IsString } from 'class-validator'
import { Expose } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePlaylistDto {
  @ApiProperty({ example: 'My Balkan Playlist' })
  @IsString()
  @Expose()
  name: string

  @ApiPropertyOptional({
    example:
      'The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd, released on 1 March 1973 by Harvest Records.'
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string
}
