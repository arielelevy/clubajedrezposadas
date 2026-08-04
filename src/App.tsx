import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollManager } from './components/ScrollManager'
import { Home } from './pages/Home'
import { HistoriaPage } from './pages/HistoriaPage'
import { AuspiciosPage } from './pages/AuspiciosPage'
import { SociosPage } from './pages/SociosPage'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<HistoriaPage />} />
          <Route path="/auspicios" element={<AuspiciosPage />} />
          <Route path="/socios" element={<SociosPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
