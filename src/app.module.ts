import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PostgresModule } from './postgres/postgres.module'
import { AlbumModule } from './album/album.module'
import { ArtistModule } from './artist/artist.module'
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [PostgresModule, AuthModule, UserModule, AlbumModule, ArtistModule, PlaylistModule]
})
export class AppModule {}
