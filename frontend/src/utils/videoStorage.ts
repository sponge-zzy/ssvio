import { mockVideos } from '../mocks/videos'
import type {
  ContentType,
  Episode,
  InitialVideo,
  Video,
  VideoCategory,
  VideoStatus,
} from '../types/video'

const VIDEOS_STORAGE_KEY = 'videonet_videos'

export type VideoFormValues = {
  title: string
  description: string
  category: VideoCategory
  contentType: ContentType
  region: string
  year: number
  coverUrl: string
  playUrl: string
  genres: string[]
  status: VideoStatus
  episodes: Episode[]
}

export function getVideos() {
  const savedValue = localStorage.getItem(VIDEOS_STORAGE_KEY)

  if (savedValue === null) {
    return initializeVideos()
  }

  try {
    const parsedValue = JSON.parse(savedValue) as InitialVideo[]

    if (!Array.isArray(parsedValue)) {
      return initializeVideos()
    }

    const videos = parsedValue.map(normalizeVideo)
    writeVideos(videos)
    return videos
  } catch {
    return initializeVideos()
  }
}

export function getPublishedVideos() {
  return getVideos().filter((video) => video.status === 'published')
}

export function getVideoById(videoId: string, options?: { includeDraft?: boolean }) {
  const video = getVideos().find((item) => item.id === videoId)

  if (!video) {
    return undefined
  }

  if (!options?.includeDraft && video.status !== 'published') {
    return undefined
  }

  return video
}

export function createVideo(values: VideoFormValues) {
  const videoId = createVideoId()
  const episodes = normalizeEpisodes({
    id: videoId,
    title: values.title,
    category: values.category,
    contentType: values.contentType,
    coverUrl: values.coverUrl,
    description: values.description,
    year: values.year,
    region: values.region,
    genres: values.genres,
    duration: '待填写',
    playCount: 0,
    playUrl: values.playUrl,
    status: values.status,
    episodes: values.episodes,
  })

  const newVideo: Video = {
    id: videoId,
    title: values.title,
    description: values.description,
    category: values.category,
    contentType: values.contentType,
    region: values.region,
    year: values.year,
    coverUrl: values.coverUrl,
    bannerUrl: values.coverUrl,
    playUrl: getMainPlayUrl(values.playUrl, episodes),
    genres: values.genres,
    duration: '待填写',
    playCount: 0,
    status: values.status,
    episodes,
  }

  writeVideos([newVideo, ...getVideos()])
  return newVideo
}

export function updateVideo(videoId: string, values: VideoFormValues) {
  const nextVideos = getVideos().map((video) => {
    if (video.id !== videoId) {
      return video
    }

    const episodes = normalizeEpisodes({
      ...video,
      title: values.title,
      contentType: values.contentType,
      playUrl: values.playUrl,
      episodes: values.episodes,
    })

    return {
      ...video,
      title: values.title,
      description: values.description,
      category: values.category,
      contentType: values.contentType,
      region: values.region,
      year: values.year,
      coverUrl: values.coverUrl,
      bannerUrl: values.coverUrl,
      playUrl: getMainPlayUrl(values.playUrl, episodes),
      genres: values.genres,
      status: values.status,
      episodes,
    }
  })

  writeVideos(nextVideos)
}

export function toggleVideoStatus(videoId: string) {
  const nextVideos = getVideos().map((video) => {
    if (video.id !== videoId) {
      return video
    }

    const nextStatus: VideoStatus =
      video.status === 'published' ? 'draft' : 'published'

    return {
      ...video,
      status: nextStatus,
    }
  })

  writeVideos(nextVideos)
}

export function deleteVideo(videoId: string) {
  const nextVideos = getVideos().filter((video) => video.id !== videoId)

  writeVideos(nextVideos)
}

function initializeVideos() {
  const initialVideos = mockVideos.map(normalizeVideo)
  writeVideos(initialVideos)
  return initialVideos
}

function normalizeVideo(video: InitialVideo): Video {
  const contentType = video.contentType ?? getDefaultContentType(video.category)
  const episodes = normalizeEpisodes({
    ...video,
    contentType,
    status: video.status ?? 'published',
  })

  return {
    ...video,
    contentType,
    playUrl: getMainPlayUrl(video.playUrl, episodes),
    status: video.status ?? 'published',
    episodes,
  }
}

function writeVideos(videos: Video[]) {
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos))
}

function createVideoId() {
  return `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getDefaultContentType(category: VideoCategory): ContentType {
  if (category === 'tv') return 'series'
  if (category === 'anime') return 'anime'
  return 'movie'
}

function normalizeEpisodes(video: InitialVideo | Video) {
  const savedEpisodes = Array.isArray(video.episodes) ? video.episodes : []
  const validEpisodes = savedEpisodes
    .filter((episode) => episode.playUrl || episode.title)
    .map((episode, index) => ({
      id: episode.id || createEpisodeId(video.id, index + 1),
      title: episode.title || getDefaultEpisodeTitle(video.contentType, index + 1),
      episodeNumber: Number(episode.episodeNumber) || index + 1,
      playUrl: episode.playUrl || video.playUrl,
      duration: episode.duration,
    }))

  if (validEpisodes.length > 0) {
    return validEpisodes.sort(
      (leftEpisode, rightEpisode) =>
        leftEpisode.episodeNumber - rightEpisode.episodeNumber,
    )
  }

  return [
    {
      id: createEpisodeId(video.id, 1),
      title: getDefaultEpisodeTitle(video.contentType, 1),
      episodeNumber: 1,
      playUrl: video.playUrl,
      duration: video.duration,
    },
  ]
}

function getDefaultEpisodeTitle(contentType: ContentType | undefined, episodeNumber: number) {
  return contentType === 'movie' ? '正片' : `第 ${episodeNumber} 集`
}

function getMainPlayUrl(playUrl: string, episodes: Episode[]) {
  return playUrl || episodes[0]?.playUrl || ''
}

function createEpisodeId(videoId: string, episodeNumber: number) {
  return `${videoId}-episode-${episodeNumber}`
}
