import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from '../user/entities/user.entity'
import { Playlist } from './entities/playlist.entity'
import { CreatePlaylistDto } from './dtos/create-playlist.dto'
import { UpdatePlaylistDto } from './dtos/update-playlist.dto'
import { AlbumIdsDto } from '../album/dtos/album-ids.dto'
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { PlaylistPaginateConfig } from './playlist-paginate-config'
import { Permission } from '../common/enums/permission'
import { Incognito } from '../common/decorators/incognito.decorator'

@Controller('playlist')
@ApiTags('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Auth(Permission.READ_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Returns a playlist by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a playlist by id',
    type: Playlist
  })
  async findById(@RequestUser() user: User, @Param('id', new ParseUUIDPipe()) id: string): Promise<Playlist> {
    const playlist = await this.playlistService.findOneById(id)
    if (playlist.userId !== user.id) throw new NotFoundException('Playlist not found')
    return playlist
  }

  @Auth(Permission.READ_PLAYLIST)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns all playlists in database' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all playlists in database',
    type: [Playlist]
  })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Playlist>> {
    return await this.playlistService.findAllPaginated(query)
  }

  @Auth(Permission.READ_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Get('me/all')
  @ApiOperation({ summary: 'Returns all playlists for a user' })
  @PaginatedSwaggerDocs(Playlist, PlaylistPaginateConfig)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all playlists for current user',
    type: [Playlist]
  })
  async findAllByUserId(@RequestUser() user: User, @Paginate() query: PaginateQuery): Promise<Paginated<Playlist>> {
    return await this.playlistService.findAllByUserIdPaginated(user.id, query)
  }

  @Auth(Permission.CREATE_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Creates a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Creates a playlist',
    type: Playlist
  })
  async create(@RequestUser() user: User, @Body() body: CreatePlaylistDto): Promise<Playlist> {
    return await this.playlistService.create(body, user)
  }

  @Auth(Permission.UPDATE_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiOperation({ summary: 'Updates a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates a playlist',
    type: Playlist
  })
  async updateById(
    @RequestUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePlaylistDto
  ): Promise<Playlist> {
    return await this.playlistService.updateById(id, body, user.id)
  }

  @Auth(Permission.UPDATE_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Post(':id/albums')
  @ApiOperation({ summary: 'Adds albums to a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Adds albums to a playlist',
    type: Playlist
  })
  async addAlbums(
    @RequestUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { albumIds }: AlbumIdsDto
  ): Promise<Playlist> {
    return await this.playlistService.addAlbums(id, albumIds, user.id)
  }

  @Auth(Permission.UPDATE_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Delete(':id/albums')
  @ApiOperation({ summary: 'Removes albums from a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Removes albums from a playlist',
    type: Playlist
  })
  async removeAlbums(
    @RequestUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AlbumIdsDto
  ): Promise<Playlist> {
    return await this.playlistService.removeAlbums(id, body.albumIds, user.id)
  }

  @Auth(Permission.DELETE_PLAYLIST)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes a playlist',
    type: Playlist
  })
  async deleteById(@RequestUser() user: User, @Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.playlistService.deleteById(id, user.id)
  }

  @Incognito()
  @Get('global/get')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns the global playlists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the global playlists',
    type: Playlist,
    isArray: true
  })
  async getGlobalPlaylist(): Promise<Playlist[]> {
    return await this.playlistService.findGlobal()
  }
}
