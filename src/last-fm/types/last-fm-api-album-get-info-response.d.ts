export interface LastFmApiAlbumGetInfoResponse {
  album: {
    name: string
    artist: string
    url: string
    releasedate?: string
    listeners: string
    playcount: string
    image: { '#text': string; size: string }[] | { '#text': string; size: string }
    tracks:
      | { track: { name: string; url: string; duration: string; '@attr': { rank: string } }[] }
      | { track: { name: string; url: string; duration: string; '@attr': { rank: string } } }
    tags: { tag: { name: string; url: string }[] } | { tag: { name: string; url: string } }
    wiki?: { published: string; summary: string; content: string }
  }
}
