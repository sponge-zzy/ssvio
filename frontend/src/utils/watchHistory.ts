import type { WatchHistoryItem } from '../types/interactions'
import type { Video } from '../types/video'
import { readStorageList, writeStorageList } from './localStorage'

const WATCH_HISTORY_KEY = 'videonet_watch_history'

export function getWatchHistory() {
  return readStorageList<WatchHistoryItem>(WATCH_HISTORY_KEY)
}

export function saveWatchHistory(video: Video) {
  const currentHistory = getWatchHistory()
  const historyWithoutCurrentVideo = currentHistory.filter(
    (item) => item.id !== video.id,
  )

  const newHistoryItem: WatchHistoryItem = {
    id: video.id,
    title: video.title,
    coverUrl: video.coverUrl,
    category: video.category,
    region: video.region,
    year: video.year,
    watchedAt: new Date().toISOString(),
  }

  writeStorageList(WATCH_HISTORY_KEY, [
    newHistoryItem,
    ...historyWithoutCurrentVideo,
  ])
}
