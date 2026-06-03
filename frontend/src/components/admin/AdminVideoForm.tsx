import { useEffect, useState, type FormEvent } from 'react'
import { mockCategories } from '../../mocks/videos'
import type {
  ContentType,
  Episode,
  Video,
  VideoCategory,
  VideoStatus,
} from '../../types/video'
import { getCategoryName } from '../../utils/category'
import type { VideoFormValues } from '../../utils/videoStorage'

type AdminVideoFormProps = {
  mode: 'create' | 'edit'
  video?: Video
  onSave: (values: VideoFormValues) => void
}

export function AdminVideoForm({ mode, video, onSave }: AdminVideoFormProps) {
  const [message, setMessage] = useState('')
  const [episodes, setEpisodes] = useState<Episode[]>(() =>
    getInitialEpisodes(video),
  )

  useEffect(() => {
    setEpisodes(getInitialEpisodes(video))
  }, [video])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    const contentType = formData.get('contentType') as ContentType
    const playUrl = String(formData.get('playUrl') ?? '').trim()

    if (!title) {
      setMessage('请填写影片标题。')
      return
    }

    onSave({
      title,
      description: String(formData.get('description') ?? '').trim(),
      category: formData.get('category') as VideoCategory,
      contentType,
      region: String(formData.get('region') ?? '').trim(),
      year: Number(formData.get('year')) || new Date().getFullYear(),
      coverUrl: String(formData.get('coverUrl') ?? '').trim(),
      playUrl,
      genres: parseGenres(String(formData.get('genres') ?? '')),
      status: formData.get('status') as VideoStatus,
      episodes:
        mode === 'edit'
          ? getCleanEpisodes(episodes, playUrl, contentType)
          : [createDefaultEpisode(contentType, playUrl)],
    })
  }

  function handleEpisodeChange(
    episodeId: string,
    field: keyof Episode,
    value: string,
  ) {
    setEpisodes((currentEpisodes) =>
      currentEpisodes.map((episode) => {
        if (episode.id !== episodeId) {
          return episode
        }

        return {
          ...episode,
          [field]: field === 'episodeNumber' ? Number(value) || 1 : value,
        }
      }),
    )
  }

  function handleAddEpisode() {
    const nextEpisodeNumber =
      Math.max(0, ...episodes.map((episode) => episode.episodeNumber)) + 1

    setEpisodes([
      ...episodes,
      {
        id: createFormEpisodeId(),
        title: `第 ${nextEpisodeNumber} 集`,
        episodeNumber: nextEpisodeNumber,
        playUrl: '',
        duration: '',
      },
    ])
  }

  function handleDeleteEpisode(episodeId: string) {
    setEpisodes(episodes.filter((episode) => episode.id !== episodeId))
  }

  return (
    <form className="admin-video-form" onSubmit={handleSubmit}>
      <label>
        标题
        <input name="title" defaultValue={video?.title ?? ''} />
      </label>

      <label>
        简介
        <textarea
          name="description"
          defaultValue={video?.description ?? ''}
          rows={5}
        />
      </label>

      <div className="admin-form-grid">
        <label>
          分类
          <select name="category" defaultValue={video?.category ?? 'movie'}>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          内容类型
          <select name="contentType" defaultValue={video?.contentType ?? 'movie'}>
            <option value="movie">电影</option>
            <option value="series">电视剧</option>
            <option value="anime">动漫</option>
          </select>
        </label>

        <label>
          地区
          <input name="region" defaultValue={video?.region ?? ''} />
        </label>

        <label>
          年份
          <input
            name="year"
            type="number"
            min="1900"
            defaultValue={video?.year ?? ''}
          />
        </label>

        <label>
          状态
          <select name="status" defaultValue={video?.status ?? 'published'}>
            <option value="published">已上架</option>
            <option value="draft">草稿</option>
          </select>
        </label>
      </div>

      <label>
        封面地址
        <input name="coverUrl" defaultValue={video?.coverUrl ?? ''} />
      </label>

      <label>
        播放地址
        <input name="playUrl" defaultValue={video?.playUrl ?? ''} />
      </label>

      <label>
        标签
        <input name="genres" defaultValue={video?.genres.join('、') ?? ''} />
      </label>

      {video && (
        <p className="admin-form-note">
          当前编辑：{video.title} / {getCategoryName(video.category)} /{' '}
          {video.year}
        </p>
      )}

      {mode === 'edit' && (
        <section className="admin-episode-panel">
          <div className="admin-panel-header">
            <div>
              <h3>分集管理</h3>
              <p>分集只保存在 localStorage，播放地址仍然使用文本输入。</p>
            </div>
            <button type="button" onClick={handleAddEpisode}>
              添加分集
            </button>
          </div>

          {episodes.length > 0 ? (
            <div className="admin-episode-list">
              {episodes.map((episode) => (
                <div key={episode.id} className="admin-episode-row">
                  <label>
                    集数
                    <input
                      type="number"
                      min="1"
                      value={episode.episodeNumber}
                      onChange={(event) =>
                        handleEpisodeChange(
                          episode.id,
                          'episodeNumber',
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    标题
                    <input
                      value={episode.title}
                      onChange={(event) =>
                        handleEpisodeChange(
                          episode.id,
                          'title',
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    播放地址
                    <input
                      value={episode.playUrl}
                      onChange={(event) =>
                        handleEpisodeChange(
                          episode.id,
                          'playUrl',
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    时长
                    <input
                      value={episode.duration ?? ''}
                      onChange={(event) =>
                        handleEpisodeChange(
                          episode.id,
                          'duration',
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteEpisode(episode.id)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>暂无分集。保存时会根据播放地址自动生成默认分集。</p>
          )}
        </section>
      )}

      <div className="admin-form-actions">
        <button type="submit">
          {mode === 'create' ? '创建影片' : '保存修改'}
        </button>
        <a href="#/admin/videos">返回列表</a>
      </div>

      {message && <p className="admin-form-message">{message}</p>}
    </form>
  )
}

function parseGenres(value: string) {
  return value
    .split(/[,，、\s]+/)
    .map((genre) => genre.trim())
    .filter(Boolean)
}

function getInitialEpisodes(video?: Video) {
  if (!video) {
    return []
  }

  return video.episodes.map((episode) => ({ ...episode }))
}

function getCleanEpisodes(
  episodes: Episode[],
  fallbackPlayUrl: string,
  contentType: ContentType,
) {
  const cleanEpisodes = episodes
    .map((episode, index) => ({
      id: episode.id || createFormEpisodeId(),
      title:
        episode.title.trim() || getDefaultEpisodeTitle(contentType, index + 1),
      episodeNumber: Number(episode.episodeNumber) || index + 1,
      playUrl: episode.playUrl.trim(),
      duration: episode.duration?.trim(),
    }))
    .filter((episode) => episode.playUrl)
    .sort(
      (leftEpisode, rightEpisode) =>
        leftEpisode.episodeNumber - rightEpisode.episodeNumber,
    )

  if (cleanEpisodes.length > 0) {
    return cleanEpisodes
  }

  return [createDefaultEpisode(contentType, fallbackPlayUrl)]
}

function createDefaultEpisode(contentType: ContentType, playUrl: string): Episode {
  return {
    id: createFormEpisodeId(),
    title: getDefaultEpisodeTitle(contentType, 1),
    episodeNumber: 1,
    playUrl,
  }
}

function getDefaultEpisodeTitle(contentType: ContentType, episodeNumber: number) {
  return contentType === 'movie' ? '正片' : `第 ${episodeNumber} 集`
}

function createFormEpisodeId() {
  return `episode-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
