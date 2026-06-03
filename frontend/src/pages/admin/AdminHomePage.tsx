import { AdminLayout } from '../../components/admin/AdminLayout'

export function AdminHomePage() {
  return (
    <AdminLayout title="后台首页">
      <section className="admin-panel">
        <h2>后台管理入口</h2>
        <p>当前阶段只提供静态后台页面，用于整理影片管理页面结构。</p>
        <a href="#/admin/videos" className="admin-primary-link">
          进入影片管理
        </a>
      </section>
    </AdminLayout>
  )
}
