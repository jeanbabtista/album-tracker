import { EnvironmentConfig } from './environment-config'

export default (): EnvironmentConfig => ({
  PORT: parseInt(process.env.PORT) || 3000,
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: parseInt(process.env.PG_PORT) || 5432,
  PG_USERNAME: process.env.PG_USERNAME || 'album-tracker',
  PG_PASSWORD: process.env.PG_PASSWORD || 'album-tracker',
  PG_DATABASE: process.env.PG_DATABASE || 'album-tracker',
  SEARCH_LIMIT: parseInt(process.env.SEARCH_LIMIT) || 10,
  LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  CREATE_ADMIN: process.env.CREATE_ADMIN === '1' || false,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || null,
  CREATE_GLOBAL_PLAYLIST: process.env.CREATE_GLOBAL_PLAYLIST === '1' || false,
  GLOBAL_PLAYLIST_NAME: process.env.GLOBAL_PLAYLIST_NAME || null,
  GLOBAL_PLAYLIST_DESCRIPTION: process.env.GLOBAL_PLAYLIST_DESCRIPTION || null
})
