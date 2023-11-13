import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../common/decorators/auth.decorator'
import { RequestUser } from '../common/decorators/request-user.decorator'
import { User } from '../postgres/entities/user.entity'
import { Playlist } from '../postgres/entities/playlist.entity'
import { CreatePlaylistDto } from './dtos/create-playlist.dto'
import { UpdatePlaylistDto } from './dtos/update-playlist.dto'
import { AlbumIdsDto } from '../album/dtos/album-ids.dto'

@Controller('playlist')
@ApiTags('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Returns a playlist by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a playlist by id',
    type: Playlist
  })
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Playlist> {
    return await this.playlistService.findOneById(id)
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Returns all playlists in database' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all playlists in database',
    type: [Playlist]
  })
  async findAll(): Promise<Playlist[]> {
    return await this.playlistService.findAll()
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/all')
  @Auth()
  @ApiOperation({ summary: 'Returns all playlists for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all playlists for a user',
    type: [Playlist]
  })
  async findAllByUserId(@RequestUser() user: User): Promise<Playlist[]> {
    return await this.playlistService.findAllByUserId(user.id)
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  @ApiOperation({ summary: 'Creates a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Creates a playlist',
    type: Playlist
  })
  async create(@RequestUser() user: User, @Body() body: CreatePlaylistDto): Promise<Playlist> {
    return await this.playlistService.create(body, user.id)
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Auth()
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

  @HttpCode(HttpStatus.OK)
  @Post(':id/albums')
  @Auth()
  @ApiOperation({ summary: 'Adds albums to a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Adds albums to a playlist',
    type: Playlist
  })
  async addAlbums(
    @RequestUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AlbumIdsDto
  ): Promise<Playlist> {
    return await this.playlistService.addAlbums(id, body.albumIds, user.id)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/albums')
  @Auth()
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

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Deletes a playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes a playlist',
    type: Playlist
  })
  async deleteById(@RequestUser() user: User, @Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.playlistService.deleteById(id, user.id)
  }
}
