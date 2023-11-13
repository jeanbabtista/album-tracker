import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from '../postgres/entities/album.entity'
import { In, Repository } from 'typeorm'
import { CreateAlbumDto } from './dtos/create-album.dto'

@Injectable()
export class AlbumService {
  constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {}

  async findOneById(id: string): Promise<Album> {
    return await this.albumRepository.findOne({ where: { id } })
  }

  async findOneByUrl(url: string): Promise<Album> {
    return await this.albumRepository.findOne({ where: { url } })
  }

  async findAll(): Promise<[Album[], number]> {
    return await this.albumRepository.findAndCount()
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
