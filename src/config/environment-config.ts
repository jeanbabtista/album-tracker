import { IsNumber, IsString } from 'class-validator'

export interface EnvConfig {
  PORT: number
}

export interface PostgresConfig {
  PG_HOST: string
  PG_PORT: number
  PG_USERNAME: string
  PG_PASSWORD: string
  PG_DATABASE: string
}

export interface LastFmApiConfig {
  LAST_FM_API_KEY: string
  LAST_FM_SEARCH_LIMIT: number
}

export interface AuthConfig {
  JWT_SECRET: string
}

export class EnvironmentConfig implements EnvConfig, PostgresConfig, LastFmApiConfig, AuthConfig {
  @IsNumber()
  PORT: number

  @IsString()
  PG_HOST: string

  @IsString()
  PG_PORT: number

  @IsString()
  PG_USERNAME: string

  @IsString()
  PG_PASSWORD: string

  @IsString()
  PG_DATABASE: string

  @IsString()
  LAST_FM_API_KEY: string

  @IsNumber()
  LAST_FM_SEARCH_LIMIT: number

  @IsString()
  JWT_SECRET: string
}
