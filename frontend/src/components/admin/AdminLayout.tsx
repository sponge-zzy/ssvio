import type { ReactNode } from 'react'

type AdminLayoutProps = {
  title: string
  children: ReactNode
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="#/admin" className="admin-brand">
          VideoNet Admin
        </a>
        <nav className="admin-nav" aria-label="后台导航">
          <a href="#/admin/videos">影片管理</a>
          <a href="#/">返回前台</a>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>后台管理</span>
            <h1>{title}</h1>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
