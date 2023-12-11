export interface SpotifyAlbumsBrowseReleases {
  albums: {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: {
      album_type: string
      name: string
      total_tracks: number
      release_date: string
      release_date_precision: string
      type: string
      uri: string
      available_markets: string[]
      href: string
      id: string
      artists: {
        href: string
        id: string
        name: string
        type: string
        uri: string
        external_urls: { spotify: string }
      }[]
      external_urls: { spotify: string }
      images: { height: number; url: string; width: number }[]
    }[]
  }
}
