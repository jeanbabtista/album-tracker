import { IsNotEmpty, IsString, IsUrl, IsUUID, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

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
