export type VideoCategory = 'movie' | 'tv' | 'anime'
export type ContentType = 'movie' | 'series' | 'anime'
export type VideoStatus = 'published' | 'draft'

export type Category = {
  id: VideoCategory
  name: string
}

export type Episode = {
  id: string
  title: string
  episodeNumber: number
  playUrl: string
  duration?: string
}

export type Video = {
  id: string
  title: string
  category: VideoCategory
  contentType: ContentType
  coverUrl: string
  bannerUrl?: string
  description: string
  year: number
  region: string
  genres: string[]
  duration: string
  playCount: number
  playUrl: string
  status: VideoStatus
  episodes: Episode[]
}

export type InitialVideo = Omit<Video, 'contentType' | 'episodes' | 'status'> & {
  contentType?: ContentType
  episodes?: Episode[]
  status?: VideoStatus
}
