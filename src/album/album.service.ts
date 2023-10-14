import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from '../postgres/entities/album.entity'
import { Repository } from 'typeorm'
import { CreateAlbumDto } from './dtos/create-album.dto'

@Injectable()
export class AlbumService {
  constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {}

  async findOneById(id: string, userId: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id }, relations: { user: true } })
    if (userId !== album?.user.id) throw new UnauthorizedException()
    return album
  }

  async findAllByUserId(userId: string): Promise<Album[]> {
    return await this.albumRepository
      .createQueryBuilder('album')
      .leftJoin('album.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany()
  }

  async create(data: CreateAlbumDto, userId: string): Promise<Album> {
    return await this.albumRepository.save({ ...data, userId })
  }

  async delete(id: string, userId: string): Promise<void> {
    const album = await this.findOneById(id, userId)
    if (!album) throw new NotFoundException()
    await this.albumRepository.delete(id)
  }
}
