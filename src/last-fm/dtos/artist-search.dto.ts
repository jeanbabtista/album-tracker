import { IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'

export class ArtistSearchDto {
  @IsString()
  @Expose()
  name: string

  @IsString()
  @Expose()
  url: string

  @IsUrl()
  @Expose()
  image: string
}

export class ArtistsSearchDto {
  @ValidateNested({ each: true })
  @Type(() => ArtistSearchDto)
  @Expose()
  artists: ArtistSearchDto[]
}
