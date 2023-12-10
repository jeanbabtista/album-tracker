export enum Permission {
  READ_ALBUM = 'read:album',
  READ_ALBUMS = 'read:albums',
  SEARCH_ALBUM = 'search:album', // last-fm album info
  SEARCH_ALBUMS = 'search:albums', // last-fm album search
  CREATE_ALBUM = 'create:album',
  UPDATE_ALBUM = 'update:album',
  DELETE_ALBUM = 'delete:album',

  SEARCH_ARTIST = 'search:artist', // last-fm artist info
  SEARCH_ARTISTS = 'search:artists', // last-fm artist search

  READ_PLAYLIST = 'read:playlist',
  READ_PLAYLISTS = 'read:playlists',
  CREATE_PLAYLIST = 'create:playlist',
  ADD_ALBUMS_TO_PLAYLIST = 'create:playlist-albums',
  REMOVE_ALBUMS_FROM_PLAYLIST = 'delete:playlist-albums',
  UPDATE_PLAYLIST = 'update:playlist',
  DELETE_PLAYLIST = 'delete:playlist',

  READ_USER = 'read:user',
  READ_USERS = 'read:users',
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user'
}
