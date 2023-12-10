import { PaginateConfig } from 'nestjs-paginate'
import { Album } from './entities/album.entity'

export const AlbumPaginateConfig: PaginateConfig<Album> = {
  sortableColumns: ['name', 'artist', 'releaseDate', 'listeners', 'playcount'],
  defaultSortBy: [['name', 'ASC']],
  searchableColumns: ['name', 'artist'],
  select: ['id', 'name', 'artist', 'url', 'image', 'releaseDate', 'listeners', 'playcount', 'summary']
}
