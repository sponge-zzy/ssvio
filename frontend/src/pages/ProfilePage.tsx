import { useEffect, useState } from 'react'
import type { FavoriteItem, WatchHistoryItem } from '../types/interactions'
import { getCategoryName } from '../utils/category'
import { getFavorites } from '../utils/favorites'
import { getPublishedVideos } from '../utils/videoStorage'
import { getWatchHistory } from '../utils/watchHistory'

export function ProfilePage() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    const publishedVideoIds = new Set(getPublishedVideos().map((video) => video.id))

    setWatchHistory(
      getWatchHistory().filter((item) => publishedVideoIds.has(item.id)),
    )
    setFavorites(getFavorites().filter((item) => publishedVideoIds.has(item.id)))
  }, [])

  return (
    <section>
      <h1>用户中心</h1>
      <section className="profile-section">
        <h2>观看历史</h2>
        {watchHistory.length > 0 ? (
          <div className="profile-media-list">
            {watchHistory.map((item) => (
              <article key={item.id} className="profile-media-item">
                <a href={`#/videos/${item.id}`} className="profile-media-link">
                  <img src={item.coverUrl} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {getCategoryName(item.category)} / {item.region} / {item.year}
                    </p>
                    <p>观看时间：{formatDateTime(item.watchedAt)}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p>暂无观看历史。</p>
        )}
      </section>

      <section className="profile-section">
        <h2>我的收藏</h2>
        {favorites.length > 0 ? (
          <div className="profile-media-list">
            {favorites.map((item) => (
              <article key={item.id} className="profile-media-item">
                <a href={`#/videos/${item.id}`} className="profile-media-link">
                  <img src={item.coverUrl} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {getCategoryName(item.category)} / {item.region} / {item.year}
                    </p>
                    <p>收藏时间：{formatDateTime(item.favoritedAt)}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p>暂无收藏影片。</p>
        )}
      </section>
    </section>
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}
