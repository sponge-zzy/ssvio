import { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import type { ContentType, VideoStatus } from '../../types/video'
import { getCategoryName } from '../../utils/category'
import {
  deleteVideo,
  getVideos,
  toggleVideoStatus,
} from '../../utils/videoStorage'

export function AdminVideosPage() {
  const [videos, setVideos] = useState(() => getVideos())

  function refreshVideos() {
    setVideos(getVideos())
  }

  function handleToggleStatus(videoId: string) {
    toggleVideoStatus(videoId)
    refreshVideos()
  }

  function handleDelete(videoId: string, title: string) {
    const confirmed = window.confirm(`确认删除《${title}》吗？`)

    if (!confirmed) {
      return
    }

    deleteVideo(videoId)
    refreshVideos()
  }

  return (
    <AdminLayout title="影片管理">
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>影片列表</h2>
            <p>当前列表读取 localStorage 影片数据，不连接真实后端。</p>
          </div>
          <a href="#/admin/videos/new" className="admin-primary-link">
            新增影片
          </a>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-video-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>分类</th>
                <th>内容类型</th>
                <th>地区</th>
                <th>年份</th>
                <th>状态</th>
                <th>播放量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td>{video.title}</td>
                  <td>{getCategoryName(video.category)}</td>
                  <td>{getContentTypeLabel(video.contentType)}</td>
                  <td>{video.region}</td>
                  <td>{video.year}</td>
                  <td>{getStatusLabel(video.status)}</td>
                  <td>{video.playCount.toLocaleString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      <a href={`#/admin/videos/${video.id}/edit`}>编辑</a>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(video.id)}
                      >
                        {video.status === 'published' ? '下架' : '上架'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(video.id, video.title)}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {videos.length === 0 && <p>暂无影片。</p>}
        </div>
      </section>
    </AdminLayout>
  )
}

function getStatusLabel(status: VideoStatus) {
  return status === 'published' ? '已上架' : '草稿'
}

function getContentTypeLabel(contentType: ContentType) {
  if (contentType === 'series') return '电视剧'
  if (contentType === 'anime') return '动漫'
  return '电影'
}
