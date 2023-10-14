import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { EnvironmentConfig } from './environment-config'

@Injectable()
export class ConfigService extends NestConfigService {
  get<T extends keyof EnvironmentConfig>(key: T): EnvironmentConfig[T] {
    return super.get(key)
  }
}
