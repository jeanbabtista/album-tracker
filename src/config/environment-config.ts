import { IsBooleanString, IsNumber, IsString } from 'class-validator'

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

export interface AdminConfig {
  CREATE_ADMIN: boolean
  ADMIN_EMAIL: string
  ADMIN_PASSWORD: string
}

export class EnvironmentConfig implements EnvConfig, PostgresConfig, LastFmApiConfig, AuthConfig, AdminConfig {
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

  @IsBooleanString()
  CREATE_ADMIN: boolean

  @IsString()
  ADMIN_EMAIL: string

  @IsString()
  ADMIN_PASSWORD: string

  @IsBooleanString({})
  CREATE_GLOBAL_PLAYLIST: boolean

  @IsString()
  GLOBAL_PLAYLIST_NAME: string

  @IsString()
  GLOBAL_PLAYLIST_DESCRIPTION: string
}
