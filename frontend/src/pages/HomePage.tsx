import { VideoCard } from '../components/VideoCard'
import type { Video } from '../types/video'

type HomePageProps = {
  videos: Video[]
}

export function HomePage({ videos }: HomePageProps) {
  return (
    <section>
      <h1>首页</h1>
      <p>这里展示已上架的本地影片列表。</p>
      <div className="placeholder-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  )
}
