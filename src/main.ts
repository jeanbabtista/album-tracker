import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from './config/config.service'
import { setupSwagger } from './common/utils/swagger'
import { GlobalExceptionFilter } from './common/filters/all-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new GlobalExceptionFilter())
  setupSwagger(app)

  const config = app.get(ConfigService)
  const logger = new Logger(bootstrap.name)

  const port = config.get('PORT')
  await app.listen(port)
  logger.log(`http://localhost:${port}/api`)
}

bootstrap()
