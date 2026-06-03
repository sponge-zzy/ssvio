import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { DanmakuItem } from '../types/interactions'
import type { Video } from '../types/video'
import { addDanmaku, getDanmakuByVideo } from '../utils/danmaku'
import { saveWatchHistory } from '../utils/watchHistory'

type WatchPageProps = {
  video?: Video
  videoId?: string
}

export function WatchPage({ video, videoId }: WatchPageProps) {
  const videoElementRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [danmakuContent, setDanmakuContent] = useState('')
  const [danmakuError, setDanmakuError] = useState('')
  const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([])

  useEffect(() => {
    if (video) {
      saveWatchHistory(video)
      setDanmakuItems(getDanmakuByVideo(video.id))
      setCurrentTime(0)
      setDanmakuContent('')
      setDanmakuError('')
    }
  }, [video])

  if (!video) {
    return (
      <section>
        <h1>影片不存在</h1>
        <p>没有找到 id 为 {videoId ?? '未知'} 的影片。</p>
      </section>
    )
  }

  const currentVideo = video
  const activeDanmakuItems = danmakuItems.filter(
    (item) => Math.abs(currentTime - item.time) <= 1,
  )

  function handleDanmakuSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextDanmakuContent = danmakuContent.trim()

    if (!nextDanmakuContent) {
      setDanmakuError('弹幕内容不能为空。')
      return
    }

    const videoTime = videoElementRef.current?.currentTime ?? currentTime

    addDanmaku(currentVideo.id, nextDanmakuContent, videoTime)
    setDanmakuItems(getDanmakuByVideo(currentVideo.id))
    setDanmakuContent('')
    setDanmakuError('')
  }

  return (
    <section>
      <h1>{currentVideo.title}</h1>
      <div className="player-wrapper">
        <video
          ref={videoElementRef}
          src={currentVideo.playUrl}
          poster={currentVideo.bannerUrl ?? currentVideo.coverUrl}
          controls
          className="video-player"
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        >
          当前浏览器不支持 video 标签。
        </video>
        <div className="danmaku-overlay" aria-live="polite">
          {activeDanmakuItems.map((item) => (
            <p key={item.id}>{item.content}</p>
          ))}
        </div>
      </div>
      <div className="danmaku-panel">
        <h2>弹幕</h2>
        <form className="danmaku-form" onSubmit={handleDanmakuSubmit}>
          <input
            type="text"
            value={danmakuContent}
            onChange={(event) => {
              setDanmakuContent(event.target.value)
              setDanmakuError('')
            }}
            placeholder="输入弹幕内容"
          />
          <button type="submit">发送弹幕</button>
        </form>
        {danmakuError && <p className="form-error">{danmakuError}</p>}
      </div>
      <p>{currentVideo.description}</p>
      <a href={`#/videos/${currentVideo.id}`}>返回详情页</a>
    </section>
  )
}
