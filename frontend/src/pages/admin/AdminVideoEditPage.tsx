import { AdminLayout } from '../../components/admin/AdminLayout'
import { AdminVideoForm } from '../../components/admin/AdminVideoForm'
import {
  getVideoById,
  updateVideo,
  type VideoFormValues,
} from '../../utils/videoStorage'

type AdminVideoEditPageProps = {
  videoId?: string
}

export function AdminVideoEditPage({ videoId }: AdminVideoEditPageProps) {
  const video = videoId
    ? getVideoById(videoId, { includeDraft: true })
    : undefined

  function handleSave(values: VideoFormValues) {
    if (!videoId) {
      return
    }

    updateVideo(videoId, values)
    window.location.hash = '#/admin/videos'
  }

  if (!video) {
    return (
      <AdminLayout title="编辑影片">
        <section className="admin-panel">
          <h2>影片不存在</h2>
          <p>没有找到 id 为 {videoId ?? '未知'} 的影片。</p>
          <a href="#/admin/videos" className="admin-primary-link">
            返回影片列表
          </a>
        </section>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="编辑影片">
      <section className="admin-panel">
        <h2>编辑影片信息</h2>
        <AdminVideoForm mode="edit" video={video} onSave={handleSave} />
      </section>
    </AdminLayout>
  )
}
