import { IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'

export class AlbumSearchDto {
  @IsString()
  @Expose()
  name: string

  @IsString()
  @Expose()
  artist: string

  @IsString()
  @Expose()
  url: string

  @IsUrl()
  @Expose()
  image: string
}

export class AlbumsSearchDto {
  @ValidateNested({ each: true })
  @Type(() => AlbumSearchDto)
  @Expose()
  albums: AlbumSearchDto[]
}
