import { IsString, IsUrl, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'

export class ArtistSimilarDto {
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

export class ArtistsSimilarDto {
  @ValidateNested({ each: true })
  @Type(() => ArtistSimilarDto)
  @Expose()
  artists: ArtistSimilarDto[]
}
