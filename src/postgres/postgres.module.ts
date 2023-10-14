import { Module } from '@nestjs/common'
import { PostgresService } from './postgres.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { DataSource } from 'typeorm'

@Module({
  providers: [PostgresService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PG_HOST'),
        port: config.get('PG_PORT'),
        username: config.get('PG_USERNAME'),
        password: config.get('PG_PASSWORD'),
        database: config.get('PG_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      dataSourceFactory: async (options) =>
        await new DataSource(options).initialize()
    })
  ]
})
export class PostgresModule {}
