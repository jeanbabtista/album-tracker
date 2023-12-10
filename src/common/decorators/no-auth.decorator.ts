import { Permission } from '../enums/permission'
import { applyDecorators, SetMetadata } from '@nestjs/common'

/**
 * Decorator to mark a route without authentication and set default permissions
 * @constructor
 */
export function Incognito() {
  return applyDecorators(
    SetMetadata('availablePermissions', [
      Permission.READ_ALBUM,
      Permission.READ_ALBUMS,
      Permission.SEARCH_ALBUM,
      Permission.SEARCH_ALBUMS,
      Permission.SEARCH_ARTIST,
      Permission.SEARCH_ARTISTS
    ])
  )
}
