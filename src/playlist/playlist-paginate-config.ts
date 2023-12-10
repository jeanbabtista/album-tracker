import { PaginateConfig } from 'nestjs-paginate'
import { Playlist } from './entities/playlist.entity'

export const PlaylistPaginateConfig: PaginateConfig<Playlist> = {
  sortableColumns: ['name', 'description'],
  defaultSortBy: [['name', 'ASC']],
  searchableColumns: ['name', 'description'],
  relations: ['albums']
}
