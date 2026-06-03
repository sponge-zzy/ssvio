import { useState } from 'react'
import { VideoCard } from '../components/VideoCard'
import type { Video } from '../types/video'
import { getCategoryName } from '../utils/category'

type SearchPageProps = {
  videos: Video[]
}

export function SearchPage({ videos }: SearchPageProps) {
  const [keyword, setKeyword] = useState('')
  const searchText = keyword.trim().toLowerCase()
  const searchResults = searchText
    ? videos.filter((video) => isVideoMatched(video, searchText))
    : videos

  return (
    <section>
      <h1>搜索页</h1>
      <p>输入关键词后，会在 mock 视频数据中搜索影片。</p>
      <form className="search-placeholder" onSubmit={(event) => event.preventDefault()}>
        <input
          type="search"
          placeholder="搜索标题、简介、分类、地区、年份或标签"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button type="submit">
          搜索
        </button>
      </form>
      {searchResults.length > 0 ? (
        <div className="placeholder-grid">
          {searchResults.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p>没有找到匹配的影片。</p>
      )}
    </section>
  )
}

function isVideoMatched(video: Video, searchText: string) {
  const searchableText = [
    video.title,
    video.description,
    getCategoryName(video.category),
    video.category,
    video.region,
    String(video.year),
    ...video.genres,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(searchText)
}
