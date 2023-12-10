import { PaginateConfig } from 'nestjs-paginate'
import { User } from './entities/user.entity'

export const UserPaginateConfig: PaginateConfig<User> = {
  sortableColumns: ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['firstName', 'lastName', 'email']
}
