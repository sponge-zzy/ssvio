import type { VideoCategory } from '../types/video'

type RouteName =
  | 'home'
  | 'category'
  | 'search'
  | 'videoDetail'
  | 'watch'
  | 'profile'
  | 'adminHome'
  | 'adminVideos'
  | 'adminVideoNew'
  | 'adminVideoEdit'
  | 'notFound'

type AppRoute = {
  name: RouteName
  params: {
    category?: VideoCategory
    id?: string
    episodeId?: string
  }
}

const validCategories: VideoCategory[] = ['movie', 'tv', 'anime']

export function parseHashRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '') || '/'
  const parts = path.split('/').filter(Boolean)

  if (parts.length === 0) {
    return { name: 'home', params: {} }
  }

  if (parts[0] === 'search') {
    return { name: 'search', params: {} }
  }

  if (parts[0] === 'profile') {
    return { name: 'profile', params: {} }
  }

  if (parts[0] === 'admin') {
    if (parts.length === 1) {
      return { name: 'adminHome', params: {} }
    }

    if (parts[1] === 'videos' && parts.length === 2) {
      return { name: 'adminVideos', params: {} }
    }

    if (parts[1] === 'videos' && parts[2] === 'new') {
      return { name: 'adminVideoNew', params: {} }
    }

    if (parts[1] === 'videos' && parts[2] && parts[3] === 'edit') {
      return { name: 'adminVideoEdit', params: { id: parts[2] } }
    }
  }

  if (parts[0] === 'categories') {
    return { name: 'category', params: {} }
  }

  if (parts[0] === 'category' && isVideoCategory(parts[1])) {
    return { name: 'category', params: { category: parts[1] } }
  }

  if ((parts[0] === 'videos' || parts[0] === 'video') && parts[1]) {
    return { name: 'videoDetail', params: { id: parts[1] } }
  }

  if ((parts[0] === 'play' || parts[0] === 'watch') && parts[1]) {
    return { name: 'watch', params: { id: parts[1], episodeId: parts[2] } }
  }

  return { name: 'notFound', params: {} }
}

function isVideoCategory(value: string | undefined): value is VideoCategory {
  return validCategories.includes(value as VideoCategory)
}
