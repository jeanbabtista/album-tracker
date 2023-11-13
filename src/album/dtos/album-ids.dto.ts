import { IsArray, IsUUID } from 'class-validator'
import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class AlbumIdsDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  @Expose()
  albumIds: string[]
}
