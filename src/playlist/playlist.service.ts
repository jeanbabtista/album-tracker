import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Playlist } from './entities/playlist.entity'
import { CreatePlaylistDto } from './dtos/create-playlist.dto'
import { AlbumService } from '../album/album.service'
import { UpdatePlaylistDto } from './dtos/update-playlist.dto'
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { PlaylistPaginateConfig } from './playlist-paginate-config'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
    private readonly albumService: AlbumService
  ) {}

  async findOneById(id: string): Promise<Playlist> {
    return await this.playlistRepository.findOne({ where: { id }, relations: ['albums'] })
  }

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<Playlist>> {
    return await paginate(query, this.playlistRepository, PlaylistPaginateConfig)
  }

  async findAllByUserIdPaginated(userId: string, query: PaginateQuery): Promise<Paginated<Playlist>> {
    return paginate(query, this.playlistRepository, { ...PlaylistPaginateConfig, where: { userId } })
  }

  async create(data: CreatePlaylistDto, userId: string): Promise<Playlist> {
    const { name, description } = data
    return await this.playlistRepository.save({ userId, name, description, albums: [] })
  }

  async addAlbums(id: string, albumIds: string[], userId: string): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException('Playlist not found')
    if (playlist.userId !== userId) throw new UnauthorizedException()

    const albums = await this.albumService.findAllByIds(albumIds)
    playlist.albums = [...playlist.albums, ...albums]

    return await this.playlistRepository.save(playlist)
  }

  async removeAlbums(id: string, albumIds: string[], userId: string): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException('Playlist not found')
    if (playlist.userId !== userId) throw new UnauthorizedException()

    const albums = await this.albumService.findAllByIds(albumIds)
    playlist.albums = playlist.albums.filter((album) => !albums.map(({ id }) => id).includes(album.id))

    return await this.playlistRepository.save(playlist)
  }

  async updateById(id: string, data: UpdatePlaylistDto, userId: string): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException()
    if (playlist.userId !== userId) throw new UnauthorizedException()

    const { name, description } = data
    playlist.name = name || playlist.name
    playlist.description = description || playlist.description

    return await this.playlistRepository.save(playlist)
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException()
    if (playlist.userId !== userId) throw new UnauthorizedException()

    await this.playlistRepository.delete(id)
  }
}
