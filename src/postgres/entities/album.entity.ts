import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Playlist } from './playlist.entity'

@Entity()
@Unique(['url'])
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

  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: string

  @Column('int', { nullable: true, default: 0 })
  listeners: number

  @Column('int', { nullable: true, default: 0 })
  playcount: number

  @ManyToMany(() => Playlist, (playlist) => playlist.albums, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  playlists: Playlist[]
}
