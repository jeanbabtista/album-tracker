// noinspection HttpUrlsUsage

import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { HttpService } from '@nestjs/axios'
import { catchError, map, throwError } from 'rxjs'
import { AxiosError, AxiosResponse } from 'axios'
import { LastFmApiAlbumSearchResponse } from './types/last-fm-api-album-search-response'
import { serialize } from '../common/utils/serialize'
import { AlbumsSearchDto } from './dtos/album-search.dto'
import { LastFmApiAlbumGetInfoResponse } from './types/last-fm-api-album-get-info-response'
import { LastFmException } from '../common/exceptions/last-fm.exception'
import { AlbumInfoDto } from './dtos/album-info.dto'
import { LastFmApiArtistSearchResponse } from './types/last-fm-api-artist-search-response'
import { ArtistsSearchDto } from './dtos/artist-search.dto'
import { LastFmApiArtistGetInfoResponse } from './types/last-fm-api-artist-get-info-response'
import { ArtistInfoDto } from './dtos/artist-info.dto'
import { LastFmApiArtistGetTopAlbumsResponse } from './types/last-fm-api-artist-get-top-albums-response'
import { ArtistTopAlbumsDto } from './dtos/artist-get-top-albums.dto'
import { LastFmApiArtistGetSimilarResponse } from './types/last-fm-api-artist-get-similar-response'
import { ArtistsSimilarDto } from './dtos/artist-similar.dto'

@Injectable()
export class LastFmService {
  private readonly baseUrl = 'http://ws.audioscrobbler.com/2.0'
  private readonly apiKey: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.get('LAST_FM_API_KEY')
  }

  searchAlbums(query: string) {
    const params = {
      method: 'album.search',
      album: query,
      limit: this.configService.get('SEARCH_LIMIT'),
      autocorrect: 1,
      ...this.getParams()
    }

    return this.httpService.get<LastFmApiAlbumSearchResponse>(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiAlbumSearchResponse>) => response.data),
      map((response: LastFmApiAlbumSearchResponse) => response.results),
      map((response: LastFmApiAlbumSearchResponse['results']) => {
        if (!response?.albummatches) return { albums: [] }

        return serialize(response, AlbumsSearchDto, (data) => ({
          albums: Array.isArray(data.albummatches.album)
            ? data.albummatches.album.map((album) => ({
                name: album.name || '',
                artist: album.artist || '',
                url: album.url,
                image: this.getImageUrl(album.image)
              }))
            : []
        }))
      }),
      catchError((error: AxiosError) => throwError(() => new LastFmException(error)))
    )
  }

  getAlbumInfo(artist: string, album: string) {
    const params = {
      method: 'album.getinfo',
      artist,
      album,
      ...this.getParams()
    }

    return this.httpService.get(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiAlbumGetInfoResponse>) => response.data),
      map((response: LastFmApiAlbumGetInfoResponse) => response.album),
      map((response: LastFmApiAlbumGetInfoResponse['album']) => {
        if (!response) throw new NotFoundException(`Album "${album}" by "${artist}" not found`)

        return serialize(response, AlbumInfoDto, (data) => ({
          name: data.name,
          artist: data.artist,
          url: data.url,
          image: this.getImageUrl(data.image),
          releaseDate: data.releasedate || null,
          listeners: isNaN(+data.listeners) ? 0 : +data.listeners,
          playcount: isNaN(+data.playcount) ? 0 : +data.playcount,
          summary: data.wiki?.summary || ''
        }))
      }),
      catchError((error: AxiosError) => throwError(() => new LastFmException(error)))
    )
  }

  searchArtists(query: string) {
    const params = {
      method: 'artist.search',
      artist: query,
      limit: this.configService.get('SEARCH_LIMIT'),
      autocorrect: 1,
      ...this.getParams()
    }

    return this.httpService.get<LastFmApiArtistSearchResponse>(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiArtistSearchResponse>) => response.data),
      map((response: LastFmApiArtistSearchResponse) => response.results),
      map((response: LastFmApiArtistSearchResponse['results']) => {
        if (!response?.artistmatches) return { artists: [] }

        return serialize(response, ArtistsSearchDto, (data) => ({
          artists: Array.isArray(data.artistmatches.artist)
            ? data.artistmatches.artist.map((artist) => ({ ...artist, image: this.getImageUrl(artist.image) }))
            : []
        }))
      })
    )
  }

  getArtistInfo(artist: string) {
    const params = {
      method: 'artist.getinfo',
      artist,
      autocorrect: 1,
      ...this.getParams()
    }

    return this.httpService.get(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiArtistGetInfoResponse>) => response.data),
      map((response: LastFmApiArtistGetInfoResponse) => response.artist),
      map((response: LastFmApiArtistGetInfoResponse['artist']) => {
        if (!response) throw new NotFoundException(`Artist ${artist} not found`)

        return serialize(response, ArtistInfoDto, (data) => ({
          artist: data.name,
          url: data.url,
          image: this.getImageUrl(data.image),
          listeners: +data.stats.listeners,
          playcount: isNaN(+data.stats.playcount) ? 0 : +data.stats.playcount,
          summary: data.bio?.summary || '',
          content: data.bio?.content || '',
          similar: Array.isArray(data.similar?.artist)
            ? data.similar.artist.map((artist) => ({
                mbid: artist.mbid,
                name: artist.name,
                url: artist.url,
                image: this.getImageUrl(artist.image)
              }))
            : data.similar?.artist
            ? [
                {
                  name: data.similar.artist.name,
                  url: data.similar.artist.url,
                  image: this.getImageUrl(data.similar.artist.image)
                }
              ]
            : []
        }))
      }),
      catchError((error: AxiosError) => throwError(() => new LastFmException(error)))
    )
  }

  getArtistTopAlbums(artist: string) {
    const params = {
      method: 'artist.gettopalbums',
      artist,
      limit: this.configService.get('SEARCH_LIMIT'),
      autocorrect: 1,
      ...this.getParams()
    }

    return this.httpService.get<LastFmApiArtistGetTopAlbumsResponse>(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiArtistGetTopAlbumsResponse>) => response.data),
      map((response: LastFmApiArtistGetTopAlbumsResponse) => response.topalbums),
      map((response: LastFmApiArtistGetTopAlbumsResponse['topalbums']) =>
        serialize(response, ArtistTopAlbumsDto, (data) => ({
          albums: Array.isArray(data.album)
            ? data.album.map((album) => ({
                name: album.name,
                url: album.url,
                listeners: isNaN(+album.listeners) ? 0 : +album.listeners,
                image: this.getImageUrl(album.image)
              }))
            : []
        }))
      ),
      catchError((error: AxiosError) => throwError(() => new LastFmException(error)))
    )
  }

  getSimilarArtists(artist: string) {
    const params = {
      method: 'artist.getsimilar',
      artist,
      limit: 3,
      autocorrect: 1,
      ...this.getParams()
    }

    return this.httpService.get<LastFmApiArtistGetSimilarResponse>(this.baseUrl, { params }).pipe(
      map((response: AxiosResponse<LastFmApiArtistGetSimilarResponse>) => response.data),
      map((response: LastFmApiArtistGetSimilarResponse) => response.similarartists),
      map((response: LastFmApiArtistGetSimilarResponse['similarartists']) =>
        serialize(response, ArtistsSimilarDto, (data) => ({
          artists: Array.isArray(data.artist)
            ? data.artist.map((artist) => ({
                name: artist.name,
                url: artist.url,
                image: this.getImageUrl(artist.image)
              }))
            : []
        }))
      ),
      catchError((error: AxiosError) => throwError(() => new LastFmException(error)))
    )
  }

  private getParams() {
    return { api_key: this.apiKey, format: 'json' }
  }

  private getImageUrl(images: LastFmApiAlbumGetInfoResponse['album']['image']): string {
    const FAIL_URL =
      'https://lastfm.freetls.fastly.net/i/u/770x0/b45b895b22fa6c1501c51ab9e4a4f38c.jpg#b45b895b22fa6c1501c51ab9e4a4f38c'

    if (!images) return FAIL_URL
    if (Array.isArray(images)) return images[images.length - 1]?.['#text'] || FAIL_URL
    return images['#text'] || FAIL_URL
  }
}
