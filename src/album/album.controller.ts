import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { LastFmService } from '../last-fm/last-fm.service'
import { firstValueFrom } from 'rxjs'
import { AlbumsSearchDto } from '../last-fm/dtos/album-search.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from '../postgres/entities/user.entity'
import { AlbumService } from './album.service'
import { Album } from '../postgres/entities/album.entity'
import { CreateAlbumDto } from './dtos/create-album.dto'
import { serialize } from '../common/utils/serialize'
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { AlbumPaginateConfig } from './album-paginate-config'
import { ConfigService } from '../config/config.service'

@Controller('album')
@ApiTags('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly lastFmService: LastFmService,
    private readonly configService: ConfigService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Returns an album by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an album by id',
    type: Album
  })
  async findById(@RequestUser() user: User, @Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    return await this.albumService.findOneById(id)
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Returns all albums in database' })
  @PaginatedSwaggerDocs(Album, AlbumPaginateConfig)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all albums in database',
    type: [Album]
  })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Album>> {
    return await this.albumService.findAllPaginated(query)
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-fm/search')
  @Auth()
  @ApiOperation({ summary: 'Searches for albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Searches for albums',
    type: AlbumsSearchDto
  })
  async search(@Query('query') query: string): Promise<Album[]> {
    if (!query) throw new BadRequestException('Missing `search` query parameter')

    const albums: Album[] = []

    // fetch albums from last.fm
    const result = await firstValueFrom(this.lastFmService.searchAlbums(query))

    // save albums to our database
    const limit = this.configService.get('LAST_FM_SEARCH_LIMIT')
    for (const data of result.albums) {
      const album = await this.albumService.createOrUpdate(
        serialize(data, CreateAlbumDto, (data) => ({
          name: data.name,
          artist: data.artist,
          url: data.url,
          image: data.image,
          releaseDate: null,
          listeners: 0,
          playcount: 0,
          summary: ''
        }))
      )

      albums.push(album)
      if (albums.length >= limit) break
    }

    return albums
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-fm/info')
  @Auth()
  @ApiOperation({ summary: 'Returns album info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns album info',
    type: Album
  })
  async getInfo(@Query('artist') artist: string, @Query('album') album: string): Promise<Album> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')
    if (!album) throw new BadRequestException('Missing `album` query parameter')

    // fetch album info from last.fm
    const info = await firstValueFrom(this.lastFmService.getAlbumInfo(artist, album))

    // save album to our database
    return await this.albumService.createOrUpdate(
      serialize(info, CreateAlbumDto, (data) => ({
        name: data.name,
        artist: data.artist,
        url: data.url,
        image: data.image,
        releaseDate: data.releaseDate || null,
        listeners: data.listeners || null,
        playcount: data.playcount || null,
        summary: data.summary || null
      }))
    )
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-fm/similar')
  @Auth()
  @ApiOperation({ summary: 'Returns similar albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns similar albums',
    type: [Album]
  })
  async getSimilar(@Query('artist') artist: string): Promise<Album[]> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')

    const data: Album[] = []

    // fetch similar artists
    const { artists } = await firstValueFrom(this.lastFmService.getSimilarArtists(artist))

    // for each similar artist, fetch top albums
    const limit = this.configService.get('LAST_FM_SEARCH_LIMIT')
    for (const { name } of artists) {
      const result = await firstValueFrom(this.lastFmService.getArtistTopAlbums(name))
      for (const lastFmAlbum of result.albums) {
        // save album to our database
        const album = await this.albumService.createOrUpdate(
          serialize(lastFmAlbum, CreateAlbumDto, (data) => ({
            name: data.name,
            artist: artist,
            url: data.url,
            image: data.image,
            releaseDate: null,
            listeners: 0,
            playcount: 0,
            summary: ''
          }))
        )

        data.push(album)
        if (data.length >= limit) break
      }
    }

    return data
  }
}
