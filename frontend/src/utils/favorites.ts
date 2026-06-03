import type { FavoriteItem } from '../types/interactions'
import type { Video } from '../types/video'
import { readStorageList, writeStorageList } from './localStorage'

const FAVORITES_KEY = 'videonet_favorites'

export function getFavorites() {
  return readStorageList<FavoriteItem>(FAVORITES_KEY)
}

export function isFavorite(videoId: string) {
  return getFavorites().some((item) => item.id === videoId)
}

export function addFavorite(video: Video) {
  const currentFavorites = getFavorites()
  const favoritesWithoutCurrentVideo = currentFavorites.filter(
    (item) => item.id !== video.id,
  )

  const newFavorite: FavoriteItem = {
    id: video.id,
    title: video.title,
    coverUrl: video.coverUrl,
    category: video.category,
    region: video.region,
    year: video.year,
    favoritedAt: new Date().toISOString(),
  }

  writeStorageList(FAVORITES_KEY, [
    newFavorite,
    ...favoritesWithoutCurrentVideo,
  ])
}

export function removeFavorite(videoId: string) {
  const nextFavorites = getFavorites().filter((item) => item.id !== videoId)

  writeStorageList(FAVORITES_KEY, nextFavorites)
}
