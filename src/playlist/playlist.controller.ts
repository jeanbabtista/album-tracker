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
import { User } from '../postgres/entities/user.entity'
import { Playlist } from '../postgres/entities/playlist.entity'
import { CreatePlaylistDto } from './dtos/create-playlist.dto'
import { UpdatePlaylistDto } from './dtos/update-playlist.dto'
import { AlbumIdsDto } from '../album/dtos/album-ids.dto'
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { PlaylistPaginateConfig } from './playlist-paginate-config'

@Controller('playlist')
@ApiTags('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Auth()
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

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Returns all playlists in database' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all playlists in database',
    type: [Playlist]
  })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Playlist>> {
    return await this.playlistService.findAllPaginated(query)
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/all')
  @Auth()
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
    @Body() { albumIds }: AlbumIdsDto
  ): Promise<Playlist> {
    return await this.playlistService.addAlbums(id, albumIds, user.id)
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
