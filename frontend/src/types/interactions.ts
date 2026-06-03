import type { VideoCategory } from './video'

export type WatchHistoryItem = {
  id: string
  title: string
  coverUrl: string
  category: VideoCategory
  region: string
  year: number
  watchedAt: string
}

export type FavoriteItem = {
  id: string
  title: string
  coverUrl: string
  category: VideoCategory
  region: string
  year: number
  favoritedAt: string
}

export type RatingItem = {
  videoId: string
  score: number
  ratedAt: string
}

export type CommentItem = {
  id: string
  videoId: string
  content: string
  createdAt: string
}

export type DanmakuItem = {
  id: string
  videoId: string
  content: string
  time: number
  createdAt: string
}
