import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ArtistInfoSimilarArtistDto {
  @ApiProperty({ example: 'The Doors' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

  @ApiProperty({ example: 'https://www.last.fm/music/The+Doors' })
  @IsUrl()
  @IsNotEmpty()
  @Expose()
  url: string

  @ApiPropertyOptional({
    example: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
  })
  @IsOptional()
  @IsUrl()
  @Expose()
  image: string
}

export class ArtistInfoDto {
  @ApiProperty({ example: 'The Doors' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  artist: string

  @ApiProperty({ example: 'https://www.last.fm/music/The+Doors/The+Doors' })
  @IsUrl()
  @IsNotEmpty()
  @Expose()
  url: string

  @ApiPropertyOptional({
    example: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
  })
  @IsOptional()
  @IsUrl()
  @Expose()
  image: string

  @ApiPropertyOptional({ example: 11 })
  @IsNumber()
  @IsOptional()
  @Expose()
  listeners: number

  @ApiPropertyOptional({ example: 11 })
  @IsNumber()
  @IsOptional()
  @Expose()
  playcount: number

  @ApiPropertyOptional({ example: 'Summary' })
  @IsString()
  @IsOptional()
  @Expose()
  summary: string

  @ApiPropertyOptional({ example: 'Content' })
  @IsString()
  @IsOptional()
  @Expose()
  content: string

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ArtistInfoSimilarArtistDto)
  @Expose()
  similar: ArtistInfoSimilarArtistDto[]
}
