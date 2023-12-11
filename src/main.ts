import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { setupSwagger } from './common/utils/swagger'
import { GlobalExceptionFilter } from './common/filters/all-exception.filter'
import { UserService } from './user/user.service'
import { createAdminUser, createGlobalPlaylist } from './common/utils/admin'
import { PostgresService } from './postgres/postgres.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new GlobalExceptionFilter())
  setupSwagger(app)

  const configService = app.get(ConfigService)
  const userService = app.get(UserService)
  const postgresService = app.get(PostgresService)

  const logger = new Logger(bootstrap.name)
  await createAdminUser(configService, userService)
  await createGlobalPlaylist(configService, userService, postgresService)

  const port = configService.get('PORT')
  await app.listen(port)
  logger.log(`http://localhost:${port}/api`)
}

bootstrap()
