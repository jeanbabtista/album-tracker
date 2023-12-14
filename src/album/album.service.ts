import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from './entities/album.entity'
import { In, Repository } from 'typeorm'
import { CreateAlbumDto } from './dtos/create-album.dto'
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { AlbumPaginateConfig } from './album-paginate-config'

@Injectable()
export class AlbumService {
  constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {}

  async findOneById(id: string): Promise<Album> {
    return await this.albumRepository.findOne({ where: { id } })
  }

  async findOneByUrl(url: string): Promise<Album> {
    return await this.albumRepository.findOne({ where: { url } })
  }

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<Album>> {
    return paginate(query, this.albumRepository, AlbumPaginateConfig)
  }

  async findAllByIds(ids: string[]): Promise<Album[]> {
    return await this.albumRepository.find({ where: { id: In(ids) } })
  }

  async createOrUpdate(data: CreateAlbumDto): Promise<Album> {
    const album = await this.findOneByUrl(data.url)
    if (album) {
      // update
      album.name = data.name || album.name
      album.artist = data.artist || album.artist
      album.image = data.image || album.image
      album.summary = data.summary || album.summary
      album.releaseDate = data.releaseDate || album.releaseDate
      album.listeners = data.listeners || album.listeners
      album.playcount = data.playcount || album.playcount
      album.tracks = data.tracks || album.tracks
      album.tags = data.tags || album.tags
      return await this.albumRepository.save(album)
    }

    // create
    return await this.albumRepository.save(data)
  }

  async deleteById(id: string): Promise<void> {
    const album = await this.findOneById(id)
    if (!album) throw new NotFoundException()
    await this.albumRepository.delete(id)
  }
}
