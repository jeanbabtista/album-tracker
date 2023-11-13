// https://www.last.fm/api/show/artist.search
export interface LastFmApiArtistSearchResponse {
  results: {
    'opensearch:Query': {
      '#text': string
      role: string
      searchTerms: string
      startPage: string
    }
    'opensearch:totalResults': string
    'opensearch:startIndex': string
    'opensearch:itemsPerPage': string
    artistmatches: {
      artist:
        | {
            mbid: string
            name: string
            url: string
            streamable: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
          }[]
        | {
            mbid: string
            name: string
            url: string
            streamable: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
          }
    }
  }
}
