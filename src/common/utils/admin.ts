import { UserService } from '../../user/user.service'
import { ConfigService } from '../../config/config.service'
import { Permission } from '../enums/permission'
import { Repository } from 'typeorm'
import { Playlist } from '../../playlist/entities/playlist.entity'
import { PostgresService } from '../../postgres/postgres.service'

export async function createAdminUser(configService: ConfigService, userService: UserService) {
  if (!configService.get('CREATE_ADMIN')) return

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
    Permission.UPDATE_PLAYLIST,
    Permission.DELETE_PLAYLIST,
    Permission.GLOBAL_PLAYLIST_READ,
    Permission.GLOBAL_PLAYLIST_UPDATE,
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

export async function createGlobalPlaylist(
  configService: ConfigService,
  userService: UserService,
  postgresService: PostgresService
) {
  if (!configService.get('CREATE_GLOBAL_PLAYLIST') || !configService.get('CREATE_ADMIN')) return
  const playlistRepository = postgresService.getRepository(Playlist)

  const name = configService.get('GLOBAL_PLAYLIST_NAME')
  const description = configService.get('GLOBAL_PLAYLIST_DESCRIPTION')

  const admin = await userService.findByEmail(configService.get('ADMIN_EMAIL'))
  const playlist = await playlistRepository.findOne({ where: { isGlobal: true } })
  if (!playlist) await playlistRepository.save({ name, description, albums: [], isGlobal: true, userId: admin.id })
}
