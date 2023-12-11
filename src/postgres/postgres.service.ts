import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { AbstractEntity } from '../common/entities/abstract.entity'

@Injectable()
export class PostgresService {
  constructor(private readonly dataSource: DataSource) {}

  getRepository<T extends AbstractEntity>(entity: new () => T): Repository<T> {
    return this.dataSource.getRepository(entity)
  }
}
