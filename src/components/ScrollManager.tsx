import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al cambiar de ruta va al tope; si la URL trae hash, desplaza a la sección.
 *
 * El desplazamiento se calcula a mano en lugar de usar `scrollIntoView` porque
 * la barra de navegación es fija y además cambia de alto: arriba muestra el
 * aviso del centenario y al scrollear se compacta. `scroll-margin-top` toma un
 * valor fijo y la sección quedaba corrida. Acá se descuenta el alto real que va
 * a tener la barra una vez compactada.
 */

/** Alto de la barra compacta (py-2 + logo de 44px) más un respiro. */
const ESPACIO_CABECERA = 76

export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
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
        const destino = el.getBoundingClientRect().top + window.scrollY - ESPACIO_CABECERA

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
