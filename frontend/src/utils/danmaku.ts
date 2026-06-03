import type { DanmakuItem } from '../types/interactions'
import { readStorageList, writeStorageList } from './localStorage'

const DANMAKU_KEY = 'videonet_danmaku'

export function getDanmakuItems() {
  return readStorageList<DanmakuItem>(DANMAKU_KEY)
}

export function getDanmakuByVideo(videoId: string) {
  return getDanmakuItems().filter((item) => item.videoId === videoId)
}

export function addDanmaku(videoId: string, content: string, time: number) {
  const newDanmaku: DanmakuItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    videoId,
    content,
    time,
    createdAt: new Date().toISOString(),
  }

  writeStorageList(DANMAKU_KEY, [...getDanmakuItems(), newDanmaku])
}
