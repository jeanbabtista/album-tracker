import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { hash } from 'argon2'
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { UserPaginateConfig } from './user-paginate-config'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.userRepository, UserPaginateConfig)
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.userRepository.save({ ...data, passwordHash: await hash(data.password) })
  }

  async updateById(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data)
    return await this.findById(id)
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}
