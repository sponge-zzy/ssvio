export type VideoCategory = 'movie' | 'tv' | 'anime'

export type Category = {
  id: VideoCategory
  name: string
}

export type Video = {
  id: string
  title: string
  category: VideoCategory
  coverUrl: string
  bannerUrl?: string
  description: string
  year: number
  region: string
  genres: string[]
  duration: string
  playCount: number
  playUrl: string
}
