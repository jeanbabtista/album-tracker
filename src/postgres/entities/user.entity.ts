import { Check, Column, Entity, OneToMany, Unique } from 'typeorm'
import { Playlist } from './playlist.entity'
import { AbstractEntity } from '../../common/entities/abstract.entity'

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

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[]
}
