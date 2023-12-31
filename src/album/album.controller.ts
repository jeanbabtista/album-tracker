import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { LastFmService } from '../last-fm/last-fm.service'
import { firstValueFrom } from 'rxjs'
import { AlbumsSearchDto } from '../last-fm/dtos/album-search.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { AlbumService } from './album.service'
import { Album } from './entities/album.entity'
import { CreateAlbumDto } from './dtos/create-album.dto'
import { serialize } from '../common/utils/serialize'
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { AlbumPaginateConfig } from './album-paginate-config'
import { ConfigService } from '../config/config.service'
import { Incognito } from '../common/decorators/incognito.decorator'
import { Permission } from '../common/enums/permission'
import { SpotifyService } from '../spotify/spotify.service'
import { SpotifyBrowseReleasesQueryDto } from '../spotify/dtos/spotify-browse-releases-query.dto'

@Controller('album')
@ApiTags('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly lastFmService: LastFmService,
    private readonly spotifyService: SpotifyService,
    private readonly configService: ConfigService
  ) {}

  @Incognito()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Returns an album by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an album by id',
    type: Album
  })
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    return await this.albumService.findOneById(id)
  }

  @Incognito()
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

  @Auth(Permission.SEARCH_ALBUM, Permission.SEARCH_ALBUMS)
  @HttpCode(HttpStatus.OK)
  @Get('last-fm/search')
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
    const limit = this.configService.get('SEARCH_LIMIT')
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
          summary: '',
          tracks: [],
          tags: []
        }))
      )

      albums.push(album)
      if (albums.length >= limit) break
    }

    return albums
  }

  @Auth(Permission.READ_ALBUM)
  @HttpCode(HttpStatus.OK)
  @Get('last-fm/info')
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
        summary: data.summary || null,
        tracks: data.tracks || [],
        tags: data.tags || []
      }))
    )
  }

  @Auth(Permission.READ_ALBUM, Permission.READ_ALBUMS)
  @HttpCode(HttpStatus.OK)
  @Get('last-fm/similar')
  @ApiOperation({ summary: 'Returns similar albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns similar albums',
    type: [Album]
  })
  async getSimilar(@Query('artist') artist: string): Promise<Album[]> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')

    // fetch similar artists
    const data: Album[] = []
    const { artists } = await firstValueFrom(this.lastFmService.getSimilarArtists(artist))
    const limit = this.configService.get('SEARCH_LIMIT')

    // for each similar artist, fetch top albums
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
            summary: '',
            tracks: [],
            tags: []
          }))
        )

        data.push(album)
        if (data.length >= limit) break
      }
    }

    return data
  }

  @Auth(Permission.READ_ALBUM, Permission.READ_ALBUMS)
  @HttpCode(HttpStatus.OK)
  @Get('spotify/new-releases')
  @ApiOperation({ summary: 'Returns new releases' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns new releases',
    type: [Album]
  })
  async getNewReleases(@Query() query: SpotifyBrowseReleasesQueryDto): Promise<Album[]> {
    const response = await firstValueFrom(this.spotifyService.getNewReleases(query))

    const limit = this.configService.get('SEARCH_LIMIT')
    const data: Album[] = []
    for (const album of response) {
      data.push(await this.albumService.createOrUpdate(serialize(album, CreateAlbumDto)))
      if (data.length >= limit) break
    }

    return data
  }
}
