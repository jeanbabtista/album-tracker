import { Module } from '@nestjs/common'
import { AlbumController } from './album.controller'
import { LastFmModule } from '../last-fm/last-fm.module'
import { AlbumService } from './album.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Album } from './entities/album.entity'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { SpotifyModule } from '../spotify/spotify.module'

@Module({
  imports: [LastFmModule, SpotifyModule, TypeOrmModule.forFeature([Album]), JwtModule, UserModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService]
})
export class AlbumModule {}
