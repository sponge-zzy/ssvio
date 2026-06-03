import type { Video } from '../types/video'

type VideoCardProps = {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="video-card">
      <a href={`#/videos/${video.id}`} className="video-card-link">
        <img src={video.coverUrl} alt={video.title} className="video-card-cover" />
        <strong>{video.title}</strong>
      </a>
      <p>
        {video.year} / {video.region} / 播放 {video.playCount.toLocaleString()}
      </p>
    </article>
  )
}
