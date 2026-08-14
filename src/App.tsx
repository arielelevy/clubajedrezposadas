import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Meta } from './components/Meta'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollManager } from './components/ScrollManager'
import { Home } from './pages/Home'

/**
 * Solo el inicio viaja en el paquete principal. Las páginas internas se piden
 * cuando alguien las abre: antes quien entraba a la portada se bajaba también el
 * padrón de socios, la historia y los auspicios sin haberlos pedido.
 */
const HistoriaPage = lazy(() =>
  import('./pages/HistoriaPage').then((m) => ({ default: m.HistoriaPage })),
)
const FestivalPage = lazy(() =>
  import('./pages/FestivalPage').then((m) => ({ default: m.FestivalPage })),
)
/* Bocetos alternativos del festival, para que la comisión elija. No están en el
   menú (solo por URL directa) y van con noindex; cuando se elija uno, borrar
   los otros y estas rutas. */
const FestivalPage2 = lazy(() =>
  import('./pages/FestivalPage2').then((m) => ({ default: m.FestivalPage2 })),
)
const FestivalPage3 = lazy(() =>
  import('./pages/FestivalPage3').then((m) => ({ default: m.FestivalPage3 })),
)
const AuspiciosPage = lazy(() =>
  import('./pages/AuspiciosPage').then((m) => ({ default: m.AuspiciosPage })),
)
const SociosPage = lazy(() => import('./pages/SociosPage').then((m) => ({ default: m.SociosPage })))
const FotosPage = lazy(() => import('./pages/FotosPage').then((m) => ({ default: m.FotosPage })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

export function App() {
  return (
    <>
      <ScrollManager />
      <Meta />
      <Navbar />
      <main>
        {/* El alto mínimo evita que el pie de página salte hacia arriba en el
            momento en que se está trayendo la página pedida. */}
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<HistoriaPage />} />
            <Route path="/festival" element={<FestivalPage />} />
            <Route path="/festival2" element={<FestivalPage2 />} />
            <Route path="/festival3" element={<FestivalPage3 />} />
            <Route path="/auspicios" element={<AuspiciosPage />} />
            <Route path="/socios" element={<SociosPage />} />
            <Route path="/fotos" element={<FotosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
