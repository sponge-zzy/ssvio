import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { AdminHomePage } from './pages/admin/AdminHomePage'
import { AdminVideoEditPage } from './pages/admin/AdminVideoEditPage'
import { AdminVideoNewPage } from './pages/admin/AdminVideoNewPage'
import { AdminVideosPage } from './pages/admin/AdminVideosPage'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { VideoDetailPage } from './pages/VideoDetailPage'
import { WatchPage } from './pages/WatchPage'
import { parseHashRoute } from './utils/routes'
import { getPublishedVideos } from './utils/videoStorage'

function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [publishedVideos, setPublishedVideos] = useState(() =>
    getPublishedVideos(),
  )

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
      setPublishedVideos(getPublishedVideos())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const route = parseHashRoute(hash)
  const selectedVideo = route.params.id
    ? publishedVideos.find((video) => video.id === route.params.id)
    : undefined
  const isAdminRoute =
    route.name === 'adminHome' ||
    route.name === 'adminVideos' ||
    route.name === 'adminVideoNew' ||
    route.name === 'adminVideoEdit'

  if (isAdminRoute) {
    return (
      <>
        {route.name === 'adminHome' && <AdminHomePage />}
        {route.name === 'adminVideos' && <AdminVideosPage />}
        {route.name === 'adminVideoNew' && <AdminVideoNewPage />}
        {route.name === 'adminVideoEdit' && (
          <AdminVideoEditPage videoId={route.params.id} />
        )}
      </>
    )
  }

  return (
    <Layout header={<Header />}>
      {route.name === 'home' && <HomePage videos={publishedVideos} />}
      {route.name === 'category' && (
        <CategoryPage
          videos={publishedVideos}
          initialCategory={route.params.category}
        />
      )}
      {route.name === 'search' && <SearchPage videos={publishedVideos} />}
      {route.name === 'videoDetail' && (
        <VideoDetailPage video={selectedVideo} videoId={route.params.id} />
      )}
      {route.name === 'watch' && (
        <WatchPage
          video={selectedVideo}
          videoId={route.params.id}
          episodeId={route.params.episodeId}
        />
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
