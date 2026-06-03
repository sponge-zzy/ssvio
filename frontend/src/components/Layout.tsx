import type { ReactNode } from 'react'

type LayoutProps = {
  header: ReactNode
  children: ReactNode
}

export function Layout({ header, children }: LayoutProps) {
  return (
    <div className="app-shell">
      {header}
      <main className="page-content">{children}</main>
    </div>
  )
}
