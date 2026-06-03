import type { VideoCategory } from '../types/video'

export function getCategoryName(category: VideoCategory) {
  if (category === 'movie') return '电影'
  if (category === 'tv') return '电视剧'
  return '动漫'
}
