import { AdminLayout } from '../../components/admin/AdminLayout'
import { AdminVideoForm } from '../../components/admin/AdminVideoForm'
import { createVideo, type VideoFormValues } from '../../utils/videoStorage'

export function AdminVideoNewPage() {
  function handleSave(values: VideoFormValues) {
    createVideo(values)
    window.location.hash = '#/admin/videos'
  }

  return (
    <AdminLayout title="新增影片">
      <section className="admin-panel">
        <h2>新增影片信息</h2>
        <AdminVideoForm mode="create" onSave={handleSave} />
      </section>
    </AdminLayout>
  )
}
