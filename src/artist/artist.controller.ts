import { Controller, Get, HttpCode, HttpStatus, Query, BadRequestException } from '@nestjs/common'
import { Auth } from '../common/decorators/auth.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, Observable } from 'rxjs'
import { LastFmService } from '../last-fm/last-fm.service'
import { ArtistsSearchDto } from '../last-fm/dtos/artist-search.dto'
import { ArtistInfoDto } from '../last-fm/dtos/artist-info.dto'
import { ArtistTopAlbumDto } from '../last-fm/dtos/artist-get-top-albums.dto'

@Controller('artist')
@ApiTags('artist')
export class ArtistController {
  constructor(private readonly lastFmService: LastFmService) {}

  @HttpCode(HttpStatus.OK)
  @Get('last-fm/search')
  @Auth()
  @ApiOperation({ summary: 'Searches for artists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Searches for artists',
    type: ArtistsSearchDto
  })
  searchArtists(@Query('query') query: string): Observable<ArtistsSearchDto> {
    if (!query) throw new BadRequestException('Missing `search` query parameter')
    return this.lastFmService.searchArtists(query)
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-fm/info')
  @Auth()
  @ApiOperation({ summary: 'Returns artist info and top albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns artist info and top albums'
  })
  async getArtistInfo(@Query('artist') artist: string): Promise<ArtistInfoDto & { topAlbums: ArtistTopAlbumDto[] }> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')

    const artistInfo = await firstValueFrom(this.lastFmService.getArtistInfo(artist))
    const topAlbums = await firstValueFrom(this.lastFmService.getArtistTopAlbums(artist))

    return { ...artistInfo, topAlbums: topAlbums.albums }
  }
}
