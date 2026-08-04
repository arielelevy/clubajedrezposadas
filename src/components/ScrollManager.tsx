import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al cambiar de ruta va al tope; si la URL trae hash, desplaza a la sección.
 *
 * El desplazamiento se calcula a mano en lugar de usar `scrollIntoView` porque
 * la barra de navegación es fija y además cambia de alto: arriba muestra el
 * aviso del centenario y al scrollear se compacta.
 *
 * Además se salta el `padding-top` de la sección. Las secciones tienen un
 * `py-12 lg:py-18` pensado para el scroll continuo; al aterrizar en el borde
 * superior ese padding se sumaba al alto de la barra y quedaban unos 170px de
 * aire antes del título. Se descuenta casi todo y se deja solo un respiro.
 */

/** Alto de la barra compacta (py-2 + logo de 44px). */
const ALTO_CABECERA = 68

/** Aire que se deja entre la barra y el primer texto de la sección. */
const RESPIRO = 20

export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const primerRender = useRef(true)

  useEffect(() => {
    const esPrimero = primerRender.current
    primerRender.current = false

    if (!hash) {
      // Al refrescar, el navegador restaura la posición: forzar el tope acá
      // provocaba el salto de "se ve la página y después se mueve".
      if (!esPrimero) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    let cancelado = false

    // Dos frames: el primero deja montar la ruta, el segundo la deja medir.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (cancelado) return

        const el = document.querySelector(hash)
        if (!el) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
          return
        }

        const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const paddingArriba = parseFloat(getComputedStyle(el).paddingTop) || 0

        const destino =
          el.getBoundingClientRect().top +
          window.scrollY -
          ALTO_CABECERA +
          Math.max(0, paddingArriba - RESPIRO)

        window.scrollTo({
          top: Math.max(0, destino),
          left: 0,
          behavior: suave ? 'smooth' : 'instant',
        })
      }),
    )

    return () => {
      cancelado = true
      cancelAnimationFrame(frame)
    }
  }, [pathname, hash])

  return null
}
