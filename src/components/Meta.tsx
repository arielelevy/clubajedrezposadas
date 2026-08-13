import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Título, descripción y canonical por ruta.
 *
 * El sitio es una SPA: el `index.html` es el mismo para todas las rutas, así
 * que sin esto Google indexa /historia, /socios y /auspicios con el título del
 * inicio y las páginas compiten entre ellas por la misma consulta. Se hace a
 * mano sobre el `<head>` en lugar de traer una librería de meta tags: son
 * cinco rutas y media docena de etiquetas.
 *
 * El 404 se marca `noindex`: no tiene por qué entrar al índice.
 */

const SITIO = 'https://clubdeajedrezposadas.com'

/** La del `index.html`: el medallón del centenario sobre grafito. */
const OG_POR_DEFECTO = '/og-image.jpg'

type Meta = { titulo: string; descripcion: string; imagen?: string }

const POR_RUTA: Record<string, Meta> = {
  '/': {
    titulo: 'Club de Ajedrez Posadas · 100 años (1926-2026)',
    descripcion:
      'Club de Ajedrez Posadas: cien años de ajedrez en Misiones. Talleres para niños, jóvenes y adultos, torneos con validez FIDE y una sede propia en Jujuy 1514, Posadas.',
  },
  '/historia': {
    titulo: 'Cien años de historia · Club de Ajedrez Posadas',
    descripcion:
      'La reseña del centenario: la fundación en el Palace Hotel el 12 de julio de 1926, las décadas sin sede propia, la casa de Jujuy 1514 desde 1980 y las comisiones directivas de los cien años.',
  },
  '/festival': {
    titulo: 'Festival de Ajedrez del Centenario · IRT "100 Años" · 5 al 8 de diciembre de 2026',
    descripcion:
      'IRT "100 Años" del Club de Ajedrez Posadas: cuatro torneos del 5 al 8 de diciembre de 2026 en la Sociedad Italiana. $1.300.000 en premios, suizo a 7 rondas válido para el ranking FIDE, Blitz IRT, Prix infanto-juvenil, simultáneas, aranceles e inscripción.',
    // El afiche es lo que circula por WhatsApp: al compartir el link conviene
    // que aparezca esa pieza y no el medallón del sitio.
    imagen: '/og-festival.jpg',
  },
  '/socios': {
    titulo: 'Hacete socio · Club de Ajedrez Posadas',
    descripcion:
      'Cómo asociarse al Club de Ajedrez Posadas: formulario de alta online, solicitud en PDF, horarios de los talleres en Jujuy 1514 y el padrón de socios del centenario.',
  },
  '/fotos': {
    titulo: 'Fotos del club · Club de Ajedrez Posadas',
    descripcion:
      'La galería completa del Club de Ajedrez Posadas: talleres, torneos y los festejos del centenario en Jujuy 1514, con las fotos que el club va subiendo.',
  },
  '/auspicios': {
    titulo: 'Auspicios del centenario · Club de Ajedrez Posadas',
    descripcion:
      'Niveles de auspicio del IRT "100 Años" de diciembre de 2026: aportes, beneficios y propuesta de valor para acompañar los cien años del Club de Ajedrez Posadas.',
  },
}

const NO_ENCONTRADA: Meta = {
  titulo: 'Página no encontrada · Club de Ajedrez Posadas',
  descripcion: 'La página que buscabas no existe o cambió de dirección.',
}

/** Escribe una `<meta>`, creándola si el `index.html` no la trae. */
function meta(clave: string, valor: string, comoPropiedad = false) {
  const atributo = comoPropiedad ? 'property' : 'name'
  let etiqueta = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${clave}"]`)

  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    etiqueta.setAttribute(atributo, clave)
    document.head.appendChild(etiqueta)
  }

  etiqueta.setAttribute('content', valor)
}

function canonical(url: string) {
  let etiqueta = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!etiqueta) {
    etiqueta = document.createElement('link')
    etiqueta.rel = 'canonical'
    document.head.appendChild(etiqueta)
  }

  etiqueta.href = url
}

export function Meta() {
  const { pathname } = useLocation()

  useEffect(() => {
    // La barra final sobra: /historia/ y /historia serían dos URLs para Google.
    const ruta = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const conocida = POR_RUTA[ruta]
    const { titulo, descripcion, imagen } = conocida ?? NO_ENCONTRADA
    const url = SITIO + (ruta === '/' ? '/' : ruta)

    document.title = titulo
    meta('description', descripcion)
    meta('og:title', titulo, true)
    meta('og:description', descripcion, true)
    meta('og:url', url, true)
    // Absoluta: las redes no resuelven rutas relativas del og:image.
    meta('og:image', SITIO + (imagen ?? OG_POR_DEFECTO), true)

    if (conocida) {
      canonical(url)
      document.head.querySelector('meta[name="robots"]')?.remove()
    } else {
      // Sin canonical propio: la 404 no compite con nada.
      meta('robots', 'noindex, follow')
    }
  }, [pathname])

  return null
}
