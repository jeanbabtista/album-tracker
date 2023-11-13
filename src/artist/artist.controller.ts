import { Controller, Get, HttpCode, HttpStatus, Query, BadRequestException } from '@nestjs/common'
import { Auth } from '../common/decorators/auth.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { firstValueFrom, Observable } from 'rxjs'
import { LastFmService } from '../last-fm/last-fm.service'
import { ArtistsSearchDto } from '../last-fm/dtos/artist-search.dto'
import { AlbumService } from '../album/album.service'
import { CreateAlbumDto } from '../album/dtos/create-album.dto'
import { serialize } from '../common/utils/serialize'
import { Album } from '../postgres/entities/album.entity'
import { ArtistInfoDto } from '../last-fm/dtos/artist-info.dto'

@Controller('artist')
@ApiTags('artist')
export class ArtistController {
  constructor(
    private readonly lastFmService: LastFmService,
    private readonly albumService: AlbumService
  ) {}

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
  async getArtistInfo(@Query('artist') artist: string): Promise<ArtistInfoDto & { topAlbums: Album[] }> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')

    const artistInfo = await firstValueFrom(this.lastFmService.getArtistInfo(artist))
    const topAlbums = await firstValueFrom(this.lastFmService.getArtistTopAlbums(artist))

    // save each top album to database if it doesn't exist yet
    const albums: Album[] = []
    for (const topAlbum of topAlbums.albums) {
      const album = await this.albumService.createOrUpdate(
        serialize(topAlbum, CreateAlbumDto, (data) => ({
          name: data.name,
          artist,
          image: data.image,
          url: data.url,
          listeners: data.listeners || 0,
          playcount: 0,
          releaseDate: null,
          summary: null
        }))
      )

      albums.push(album)
    }

    return { ...artistInfo, topAlbums: albums }
  }
}
