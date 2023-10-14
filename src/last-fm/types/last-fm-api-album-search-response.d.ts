export interface LastFmApiAlbumSearchResponse {
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
    albummatches: {
      album:
        | {
            name: string
            artist: string
            url: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
            streamable: string
            mbid: string
          }[]
        | {
            name: string
            artist: string
            url: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
            streamable: string
            mbid: string
          }
    }
    '@attr': {
      for: string
    }
  }
}
