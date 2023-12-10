import { UserService } from '../../user/user.service'
import { ConfigService } from '../../config/config.service'
import { Permission } from '../enums/permission'

export async function createAdminUser(configService: ConfigService, userService: UserService) {
  const email = configService.get('ADMIN_EMAIL')
  const password = configService.get('ADMIN_PASSWORD')
  const permissions = [
    Permission.READ_ALBUM,
    Permission.READ_ALBUMS,
    Permission.SEARCH_ALBUM,
    Permission.SEARCH_ALBUMS,
    Permission.CREATE_ALBUM,
    Permission.UPDATE_ALBUM,
    Permission.DELETE_ALBUM,
    Permission.SEARCH_ARTIST,
    Permission.SEARCH_ARTISTS,
    Permission.READ_PLAYLIST,
    Permission.READ_PLAYLISTS,
    Permission.CREATE_PLAYLIST,
    Permission.ADD_ALBUMS_TO_PLAYLIST,
    Permission.REMOVE_ALBUMS_FROM_PLAYLIST,
    Permission.UPDATE_PLAYLIST,
    Permission.DELETE_PLAYLIST,
    Permission.READ_USER,
    Permission.READ_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER
  ]

  let admin = await userService.findByEmail(email)
  if (!admin)
    admin = await userService.create({
      firstName: 'Admin',
      lastName: 'User',
      email,
      password
    })

  admin.permissions = permissions
  await userService.updateById(admin.id, admin)
}
