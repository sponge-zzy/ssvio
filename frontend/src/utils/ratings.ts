import type { RatingItem } from '../types/interactions'
import { readStorageList, writeStorageList } from './localStorage'

const RATINGS_KEY = 'videonet_ratings'

export function getRatings() {
  return readStorageList<RatingItem>(RATINGS_KEY)
}

export function getRating(videoId: string) {
  return getRatings().find((item) => item.videoId === videoId)
}

export function saveRating(videoId: string, score: number) {
  const currentRatings = getRatings()
  const ratingsWithoutCurrentVideo = currentRatings.filter(
    (item) => item.videoId !== videoId,
  )

  const newRating: RatingItem = {
    videoId,
    score,
    ratedAt: new Date().toISOString(),
  }

  writeStorageList(RATINGS_KEY, [newRating, ...ratingsWithoutCurrentVideo])
}
