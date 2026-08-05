import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Aparición en scroll, respetando prefers-reduced-motion (lo resuelve el CSS).
 *
 * El estado inicial y la transición están en la clase `.reveal`; acá solo se
 * observa el bloque y se le agrega `.a-la-vista` una única vez. El observer se
 * desconecta ahí mismo: la animación no vuelve a correr y no queda nada
 * escuchando scroll.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [aLaVista, setALaVista] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setALaVista(true)
      return
    }

    // El margen negativo pide que el bloque entre 80px antes de animarse: si no,
    // el movimiento arranca justo en el borde y casi no se ve.
    const observer = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return
        setALaVista(true)
        observer.disconnect()
      },
      { rootMargin: '-80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', aLaVista && 'a-la-vista', className)}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  )
}
