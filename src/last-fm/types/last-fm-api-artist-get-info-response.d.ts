// https://www.last.fm/api/show/artist.getInfo
export interface LastFmApiArtistGetInfoResponse {
  artist: {
    name: string
    mbid: string
    url: string
    image: { '#text': string; size: string }[] | { '#text': string; size: string }
    streamable: string
    stats: { listeners: string; playcount: string }
    similar: {
      artist:
        | {
            name: string
            url: string
            image: { '#text': string; size: string }[] | { '#text': string; size: string }
          }[]
        | {
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
