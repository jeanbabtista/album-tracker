import { IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class ArtistTopAlbumDto {
  @IsString()
  @Expose()
  name: string

  @IsString()
  @Expose()
  url: string

  @ApiPropertyOptional({ example: 11 })
  @IsNumber()
  @IsOptional()
  @Expose()
  listeners: number

  @IsUrl()
  @Expose()
  image: string
}

export class ArtistTopAlbumsDto {
  @ValidateNested({ each: true })
  @Type(() => ArtistTopAlbumDto)
  @Expose()
  albums: ArtistTopAlbumDto[]
}
