// https://www.last.fm/api/show/artist.getTopAlbums
export interface LastFmApiArtistGetTopAlbumsResponse {
  topalbums: {
    album:
      | {
          mbid: string
          name: string
          listeners: string
          url: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }
      | {
          mbid: string
          name: string
          listeners: string
          url: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }[]
  }
}
