import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator'
import { Expose } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAlbumDto {
  @ApiProperty({ example: 'The Dark Side of the Moon' })
  @IsString()
  @Expose()
  name: string

  @ApiProperty({ example: 'Pink Floyd' })
  @IsString()
  @Expose()
  artist: string

  @ApiProperty({ example: 'https://www.last.fm/music/Pink+Floyd/The+Dark+Side+of+the+Moon' })
  @IsString()
  @Expose()
  url: string

  @ApiProperty({ example: 'https://lastfm.freetls.fastly.net/i/u/300x300/7d6d3a6a2b7d4b9cacf6b7f0d1c8f0a9.png' })
  @IsUrl()
  @Expose()
  image: string

  @ApiPropertyOptional({
    example:
      'The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd, released on 1 March 1973 by Harvest Records.'
  })
  @IsString()
  @IsOptional()
  @Expose()
  summary: string
}
