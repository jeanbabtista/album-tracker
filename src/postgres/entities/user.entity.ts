import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { Album } from './album.entity'

@Entity()
@Unique(['email'])
@Check(`"email" ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { name: 'password_hash' })
  passwordHash: string

  @Column('text')
  email: string

  @Column({ name: 'first_name', nullable: true })
  firstName: string

  @Column({ name: 'last_name', nullable: true })
  lastName: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Album, (album) => album.user)
  savedAlbums: Album[]
}
