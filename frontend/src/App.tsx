import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { VideoDetailPage } from './pages/VideoDetailPage'
import { WatchPage } from './pages/WatchPage'
import { mockVideos } from './mocks/videos'
import { parseHashRoute } from './utils/routes'

function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const route = parseHashRoute(hash)
  const selectedVideo = route.params.id
    ? mockVideos.find((video) => video.id === route.params.id)
    : undefined

  return (
    <Layout header={<Header />}>
      {route.name === 'home' && <HomePage videos={mockVideos} />}
      {route.name === 'category' && (
        <CategoryPage initialCategory={route.params.category} />
      )}
      {route.name === 'search' && <SearchPage videos={mockVideos} />}
      {route.name === 'videoDetail' && (
        <VideoDetailPage video={selectedVideo} videoId={route.params.id} />
      )}
      {route.name === 'watch' && (
        <WatchPage video={selectedVideo} videoId={route.params.id} />
      )}
      {route.name === 'profile' && <ProfilePage />}
      {route.name === 'notFound' && (
        <section>
          <h1>页面未找到</h1>
          <p>当前路由还没有对应的页面。</p>
        </section>
      )}
    </Layout>
  )
}

export default App
