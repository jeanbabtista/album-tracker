// https://www.last.fm/api/show/artist.getTopAlbums
export interface LastFmApiArtistGetTopAlbumsResponse {
  topalbums: {
    album:
      | {
          name: string
          mbid: string
          listeners: string
          url: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }
      | {
          name: string
          mbid: string
          listeners: string
          url: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }[]
  }
}
