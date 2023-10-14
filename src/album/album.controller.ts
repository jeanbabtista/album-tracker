import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query
} from '@nestjs/common'
import { LastFmService } from '../last-fm/last-fm.service'
import { Observable } from 'rxjs'
import { AlbumsSearchDto } from '../last-fm/dtos/album-search.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AlbumInfoDto } from '../last-fm/dtos/album-info.dto'
import { Auth } from '../common/decorators/auth.decorator'
import { CreateAlbumDto } from './dtos/create-album.dto'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from '../postgres/entities/user.entity'
import { AlbumService } from './album.service'
import { Album } from '../postgres/entities/album.entity'

@Controller('album')
@ApiTags('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly lastFmService: LastFmService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  @ApiOperation({ summary: 'Returns all albums for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all albums for the current user',
    isArray: true,
    type: Album
  })
  async findAllAlbums(@RequestUser() user: User): Promise<Album[]> {
    return await this.albumService.findAllByUserId(user.id)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Returns an album by id for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an album by id for the current user',
    type: Album
  })
  async findAlbumById(@RequestUser() user: User, @Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    if (!id) throw new BadRequestException('Missing `id` query parameter')
    return await this.albumService.findOneById(id, user.id)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Auth()
  @ApiOperation({ summary: 'Creates an album for the current user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates an album for the current user',
    type: Album
  })
  async createAlbum(@RequestUser() user: User, @Body() body: CreateAlbumDto): Promise<{ album: Album }> {
    const album = await this.albumService.create(body, user.id)
    return { album }
  }

  @HttpCode(HttpStatus.OK)
  @Get('search')
  @Auth()
  @ApiOperation({ summary: 'Searches for albums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Searches for albums',
    type: AlbumsSearchDto
  })
  searchAlbums(@Query('query') query: string): Observable<AlbumsSearchDto> {
    if (!query) throw new BadRequestException('Missing `search` query parameter')
    return this.lastFmService.searchAlbums(query)
  }

  @HttpCode(HttpStatus.OK)
  @Get('info')
  @Auth()
  @ApiOperation({ summary: 'Returns album info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns album info',
    type: AlbumInfoDto
  })
  getAlbumInfo(@Query('artist') artist: string, @Query('album') album: string): Observable<AlbumInfoDto> {
    if (!artist) throw new BadRequestException('Missing `artist` query parameter')
    if (!album) throw new BadRequestException('Missing `album` query parameter')
    return this.lastFmService.getAlbumInfo(artist, album)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @Auth()
  @ApiOperation({ summary: 'Deletes an album by id for the current user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deletes an album by id for the current user'
  })
  async deleteAlbum(@RequestUser() user: User, @Query('id') id: string) {
    if (!id) throw new BadRequestException('Missing `id` query parameter')
    await this.albumService.delete(id, user.id)
  }
}
