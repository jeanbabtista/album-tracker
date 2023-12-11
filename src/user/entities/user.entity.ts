import { Check, Column, Entity, OneToMany, Unique } from 'typeorm'
import { Playlist } from '../../playlist/entities/playlist.entity'
import { AbstractEntity } from '../../common/entities/abstract.entity'
import { Permission } from '../../common/enums/permission'

@Entity()
@Unique(['email'])
@Check(`"email" ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`)
export class User extends AbstractEntity {
  @Column('text', { name: 'password_hash' })
  passwordHash: string

  @Column('text')
  email: string

  @Column({ name: 'first_name', nullable: true })
  firstName: string

  @Column({ name: 'last_name', nullable: true })
  lastName: string

  @Column('text', {
    array: true,
    default: [
      Permission.READ_ALBUM,
      Permission.READ_ALBUMS,
      Permission.SEARCH_ALBUM,
      Permission.SEARCH_ALBUMS,
      Permission.SEARCH_ARTIST,
      Permission.SEARCH_ARTISTS,
      Permission.READ_PLAYLIST,
      Permission.CREATE_PLAYLIST,
      Permission.UPDATE_PLAYLIST,
      Permission.DELETE_PLAYLIST,
      Permission.GLOBAL_PLAYLIST_READ,
      Permission.READ_USER
    ]
  })
  permissions: Permission[]

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[]
}
