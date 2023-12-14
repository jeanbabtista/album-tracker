import { stringify } from 'qs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { HttpService } from '@nestjs/axios'
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs'
import { AxiosResponse } from 'axios'
import { SpotifyAuthResponse } from './types/spotify-auth-response'
import { SpotifyBrowseReleasesQueryDto } from './dtos/spotify-browse-releases-query.dto'
import { SpotifyAlbumsBrowseReleases } from './types/spotify-albums-browse-releases'
import { serialize } from '../common/utils/serialize'
import { AlbumInfoDto } from '../last-fm/dtos/album-info.dto'
import { SpotifyException } from '../common/exceptions/spotify.exception'

@Injectable()
export class SpotifyService {
  private readonly baseUrl = 'https://api.spotify.com/v1'
  private readonly SPOTIFY_CLIENT_ID: string
  private readonly SPOTIFY_CLIENT_SECRET: string
  private ACCESS_TOKEN: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.SPOTIFY_CLIENT_ID = this.configService.get('SPOTIFY_CLIENT_ID')
    this.SPOTIFY_CLIENT_SECRET = this.configService.get('SPOTIFY_CLIENT_SECRET')
  }

  getNewReleases(query: SpotifyBrowseReleasesQueryDto = {}): Observable<AlbumInfoDto[]> {
    const limit = this.configService.get('SEARCH_LIMIT')
    const params = stringify({ ...query, limit }, { addQueryPrefix: true, skipNulls: true })
    const url = `${this.baseUrl}/browse/new-releases${params}`

    return this.getAccessToken().pipe(
      switchMap((token) => this.httpService.get(url, { headers: { Authorization: `Bearer ${token}` } })),
      map((response: AxiosResponse<SpotifyAlbumsBrowseReleases>) => response.data),
      map((response: SpotifyAlbumsBrowseReleases) => response.albums),
      map((response: SpotifyAlbumsBrowseReleases['albums']) => {
        const albums: AlbumInfoDto[] = []
        for (const album of response.items)
          albums.push(
            serialize(album, AlbumInfoDto, (data) => ({
              name: data.name,
              url: data.external_urls.spotify,
              image: this.getImageUrl(data.images),
              tracks: [],
              tags: [],
              artist: data.artists[0]?.name || '',
              listeners: 0,
              playcount: 0,
              releaseDate: data.release_date,
              summary: ''
            }))
          )

        return albums
      }),
      catchError(() => throwError(() => new SpotifyException('Failed to fetch new releases')))
    )
  }

  private requestAccessToken(): Observable<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const auth: string = new Buffer.from(this.SPOTIFY_CLIENT_ID + ':' + this.SPOTIFY_CLIENT_SECRET).toString('base64')
    const url = 'https://accounts.spotify.com/api/token'
    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.httpService.post(url, { grant_type: 'client_credentials' }, { headers }).pipe(
      tap((response: AxiosResponse<SpotifyAuthResponse>) => (this.ACCESS_TOKEN = response.data.access_token)),
      map((response: AxiosResponse<SpotifyAuthResponse>) => response.data.access_token)
    )
  }

  private getAccessToken() {
    return this.ACCESS_TOKEN ? of(this.ACCESS_TOKEN) : this.requestAccessToken()
  }

  private getImageUrl(images: SpotifyAlbumsBrowseReleases['albums']['items'][0]['images']) {
    return images[0]?.url || ''
  }
}
