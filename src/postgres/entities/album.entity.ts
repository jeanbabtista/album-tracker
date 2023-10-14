import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from './user.entity'

@Entity()
@Unique(['userId', 'url'])
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  name: string

  @Column('varchar', { length: 255 })
  artist: string

  @Column('text', { nullable: true })
  url: string

  @Column('text', { nullable: true })
  image: string

  @Column('text', { nullable: true })
  summary: string

  @ManyToOne(() => User, (user) => user.savedAlbums)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column('uuid', { name: 'user_id' })
  userId: string
}
