// https://www.last.fm/api/show/artist.getInfo
export interface LastFmApiArtistGetInfoResponse {
  artist: {
    mbid: string
    name: string
    url: string
    image: { '#text': string; size: string }[] | { '#text': string; size: string }
    streamable: string
    stats: { listeners: string; playcount: string }
    similar: {
      artist:
        | {
            mbid: string
            name: string
            url: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
          }[]
        | {
            mbid: string
            name: string
            url: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
          }
    }
    tags: {
      tag: { name: string; url: string }[] | { name: string; url: string }
    }
    bio: { published: string; summary: string; content: string }
  }
}
