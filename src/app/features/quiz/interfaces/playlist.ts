export interface Playlist {
  data: PlaylistItem[]
  total: number
  next: string
}

export interface PlaylistItem {
  id: number
  title: string
  public: boolean
  nb_tracks: number
  link: string
  picture: string
  picture_small: string
  picture_medium: string
  picture_big: string
  picture_xl: string
  checksum: string
  tracklist: string
  creation_date: string
  add_date: string
  mod_date: string
  md5_image: string
  picture_type: string
  user: User
  type: string
}

export interface User {
  id: number
  name: string
  tracklist: string
  type: string
}