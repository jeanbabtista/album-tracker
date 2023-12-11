import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Album } from '../../album/entities/album.entity'
import { AbstractEntity } from '../../common/entities/abstract.entity'

@Entity()
export class Playlist extends AbstractEntity {
  @Column('varchar', { length: 255 })
  name: string

  @Column('text')
  description?: string

  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column('uuid', { name: 'user_id' })
  userId: string

  @Column('bool', { name: 'is_global', default: false })
  isGlobal: boolean

  @ManyToMany(() => Album, (album) => album.playlists, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'playlist_album',
    joinColumn: { name: 'playlist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' }
  })
  albums: Album[]
}
