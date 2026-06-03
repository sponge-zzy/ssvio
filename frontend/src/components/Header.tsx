export function Header() {
  return (
    <header className="site-header">
      <a href="#/" className="site-logo">
        VideoNet
      </a>
      <nav className="site-nav" aria-label="主导航">
        <a href="#/">首页</a>
        <a href="#/categories">分类</a>
        <a href="#/search">搜索</a>
        <a href="#/profile">用户中心</a>
      </nav>
    </header>
  )
}
