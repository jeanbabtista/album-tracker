import { IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TagInfoDto, TrackInfoDto } from '../../last-fm/dtos/album-info.dto'

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
}
