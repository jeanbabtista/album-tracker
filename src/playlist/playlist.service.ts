import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Playlist } from '../postgres/entities/playlist.entity'
import { CreatePlaylistDto } from './dtos/create-playlist.dto'
import { AlbumService } from '../album/album.service'
import { UpdatePlaylistDto } from './dtos/update-playlist.dto'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
    private readonly albumService: AlbumService
  ) {}

  async findOneById(id: string): Promise<Playlist> {
    return await this.playlistRepository.findOne({ where: { id }, relations: ['albums'] })
  }

  async findAll(): Promise<Playlist[]> {
    return await this.playlistRepository.find({ relations: ['albums'] })
  }

  async findAllByUserId(userId: string): Promise<Playlist[]> {
    return await this.playlistRepository.find({ where: { userId }, relations: ['albums'] })
  }

  async create(data: CreatePlaylistDto, userId: string): Promise<Playlist> {
    const { name, description } = data
    return await this.playlistRepository.save({ userId, name, description, albums: [] })
  }

  async addAlbums(id: string, albumIds: string[], userId: string): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException()
    if (playlist.userId !== userId) throw new UnauthorizedException()

    const albums = await this.albumService.findAllByIds(albumIds)
    playlist.albums = [...playlist.albums, ...albums]

    return await this.playlistRepository.save(playlist)
  }

  async removeAlbums(id: string, albumIds: string[], userId: string): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (!playlist) throw new NotFoundException()
    if (playlist.userId !== userId) throw new UnauthorizedException()

    const albums = await this.albumService.findAllByIds(albumIds)
    playlist.albums = playlist.albums.filter((album) => !albums.includes(album))

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
