import { Module } from '@nestjs/common'
import { ArtistController } from './artist.controller'
import { LastFmModule } from '../last-fm/last-fm.module'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [LastFmModule, JwtModule, UserModule],
  controllers: [ArtistController]
})
export class ArtistModule {}
