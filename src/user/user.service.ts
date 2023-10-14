import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../postgres/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { hash } from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.userRepository.save({ ...data, passwordHash: await hash(data.password) })
  }
}
