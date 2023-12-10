import { Module } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { Playlist } from './entities/playlist.entity'
import { AlbumModule } from '../album/album.module'

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), JwtModule, UserModule, AlbumModule],
  controllers: [PlaylistController],
  providers: [PlaylistService]
})
export class PlaylistModule {}
