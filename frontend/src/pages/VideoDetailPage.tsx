import { useEffect, useState, type FormEvent } from 'react'
import type { CommentItem } from '../types/interactions'
import type { Video } from '../types/video'
import { addComment, deleteComment, getCommentsByVideo } from '../utils/comments'
import { getCategoryName } from '../utils/category'
import { addFavorite, isFavorite, removeFavorite } from '../utils/favorites'
import { getRating, saveRating } from '../utils/ratings'

type VideoDetailPageProps = {
  video?: Video
  videoId?: string
}

export function VideoDetailPage({ video, videoId }: VideoDetailPageProps) {
  const [isCurrentVideoFavorite, setIsCurrentVideoFavorite] = useState(false)
  const [currentScore, setCurrentScore] = useState<number | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [commentError, setCommentError] = useState('')
  const [comments, setComments] = useState<CommentItem[]>([])

  useEffect(() => {
    if (video) {
      setIsCurrentVideoFavorite(isFavorite(video.id))
      setCurrentScore(getRating(video.id)?.score ?? null)
      setComments(getCommentsByVideo(video.id))
      setCommentContent('')
      setCommentError('')
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
  const categoryName = getCategoryName(currentVideo.category)

  function handleFavoriteClick() {
    if (isCurrentVideoFavorite) {
      removeFavorite(currentVideo.id)
      setIsCurrentVideoFavorite(false)
      return
    }

    addFavorite(currentVideo)
    setIsCurrentVideoFavorite(true)
  }

  function handleScoreClick(score: number) {
    saveRating(currentVideo.id, score)
    setCurrentScore(score)
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextCommentContent = commentContent.trim()

    if (!nextCommentContent) {
      setCommentError('评论内容不能为空。')
      return
    }

    addComment(currentVideo.id, nextCommentContent)
    setComments(getCommentsByVideo(currentVideo.id))
    setCommentContent('')
    setCommentError('')
  }

  function handleDeleteComment(commentId: string) {
    deleteComment(commentId)
    setComments(getCommentsByVideo(currentVideo.id))
  }

  return (
    <section className="video-detail">
      <img
        src={currentVideo.coverUrl}
        alt={currentVideo.title}
        className="video-detail-cover"
      />
      <div>
        <h1>{currentVideo.title}</h1>
        <p>{currentVideo.description}</p>
        <dl className="video-meta">
          <div>
            <dt>分类</dt>
            <dd>{categoryName}</dd>
          </div>
          <div>
            <dt>年份</dt>
            <dd>{currentVideo.year}</dd>
          </div>
          <div>
            <dt>地区</dt>
            <dd>{currentVideo.region}</dd>
          </div>
          <div>
            <dt>播放量</dt>
            <dd>{currentVideo.playCount.toLocaleString()}</dd>
          </div>
        </dl>
        <div className="detail-actions">
          <a href={`#/play/${currentVideo.id}`} className="primary-link">
            立即播放
          </a>
          <button type="button" onClick={handleFavoriteClick}>
            {isCurrentVideoFavorite ? '取消收藏' : '收藏'}
          </button>
        </div>
        <div className="rating-panel">
          <h2>我的评分</h2>
          <p>{currentScore ? `已评分：${currentScore} 分` : '请选择评分'}</p>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                className={currentScore === score ? 'active' : ''}
                onClick={() => handleScoreClick(score)}
              >
                {score} 分
              </button>
            ))}
          </div>
        </div>
        <div className="comment-panel">
          <h2>评论</h2>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={commentContent}
              onChange={(event) => {
                setCommentContent(event.target.value)
                setCommentError('')
              }}
              placeholder="写下你的评论"
              rows={4}
            />
            <button type="submit">提交评论</button>
          </form>
          {commentError && <p className="form-error">{commentError}</p>}
          {comments.length > 0 ? (
            <div className="comment-list">
              {comments.map((comment) => (
                <article key={comment.id} className="comment-item">
                  <p>{comment.content}</p>
                  <div className="comment-meta">
                    <span>{formatDateTime(comment.createdAt)}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>暂无评论。</p>
          )}
        </div>
      </div>
    </section>
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}
