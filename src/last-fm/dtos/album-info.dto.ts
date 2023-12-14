import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class TrackInfoDto {
  @ApiProperty({ example: 'The End' })
  @IsString()
  @Expose()
  name: string

  @ApiProperty({ example: 'https://www.last.fm/music/The+Doors/_/The+End' })
  @IsUrl()
  @Expose()
  url: string

  @ApiProperty({ example: 11 })
  @IsNumber()
  @Expose()
  duration: number
}

export class TagInfoDto {
  @ApiProperty({ example: 'rock' })
  @IsString()
  @Expose()
  name: string

  @ApiProperty({ example: 'https://www.last.fm/tag/rock' })
  @IsUrl()
  @Expose()
  url: string
}

export class AlbumInfoDto {
  @ApiProperty({ example: 'The Doors' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

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

  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => TrackInfoDto)
  @Expose()
  tracks: TrackInfoDto[]

  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => TagInfoDto)
  @Expose()
  tags: TagInfoDto[]

  @ApiPropertyOptional({ example: '1967-01-04' })
  @IsString()
  @IsOptional()
  @Expose()
  releaseDate: string

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
}
