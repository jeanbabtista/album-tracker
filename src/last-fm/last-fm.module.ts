import { Module } from '@nestjs/common'
import { LastFmService } from './last-fm.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [LastFmService],
  exports: [LastFmService]
})
export class LastFmModule {}
