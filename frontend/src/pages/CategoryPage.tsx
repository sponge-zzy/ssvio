import { useEffect, useState } from 'react'
import { VideoCard } from '../components/VideoCard'
import { mockCategories, mockVideos } from '../mocks/videos'
import type { VideoCategory } from '../types/video'

type CategoryPageProps = {
  initialCategory?: VideoCategory
}

type FilterValue = 'all'

export function CategoryPage({ initialCategory }: CategoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    VideoCategory | FilterValue
  >(initialCategory ?? 'all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')

  useEffect(() => {
    setSelectedCategory(initialCategory ?? 'all')
  }, [initialCategory])

  const regions = Array.from(new Set(mockVideos.map((video) => video.region)))
  const years = Array.from(new Set(mockVideos.map((video) => video.year)))

  const filteredVideos = mockVideos.filter((video) => {
    const isCategoryMatched =
      selectedCategory === 'all' || video.category === selectedCategory
    const isRegionMatched =
      selectedRegion === 'all' || video.region === selectedRegion
    const isYearMatched =
      selectedYear === 'all' || String(video.year) === selectedYear

    return isCategoryMatched && isRegionMatched && isYearMatched
  })

  return (
    <section>
      <h1>分类页</h1>
      <p>根据分类、地区、年份筛选 mock 视频数据。</p>

      <div className="filter-panel">
        <label>
          分类
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value as VideoCategory | FilterValue)
            }
          >
            <option value="all">全部分类</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          地区
          <select
            value={selectedRegion}
            onChange={(event) => setSelectedRegion(event.target.value)}
          >
            <option value="all">全部地区</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label>
          年份
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            <option value="all">全部年份</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredVideos.length > 0 ? (
        <div className="placeholder-grid">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p>暂无符合条件的影片。</p>
      )}
    </section>
  )
}
