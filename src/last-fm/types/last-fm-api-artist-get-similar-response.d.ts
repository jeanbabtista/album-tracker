// https://www.last.fm/api/show/artist.getSimilar
export interface LastFmApiArtistGetSimilarResponse {
  similarartists: {
    artist:
      | {
          mbid: string
          name: string
          url: string
          match: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }
      | {
          mbid: string
          name: string
          url: string
          match: string
          image: { '#text': string; size: string }[] | { '#text': string; size: string }
        }[]
  }
}
