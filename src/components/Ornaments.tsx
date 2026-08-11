import { cn } from '@/lib/utils'

/**
 * Curvas de grafito inspiradas en el banner institucional del club.
 * Se usan como firma visual en los bloques oscuros.
 */
export function GraphiteCurves({ className }: { className?: string }) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="curveA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a41" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0b0b0c" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="curveB" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26262b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0b0b0c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-40 0 C 260 120, 190 330, -40 470 Z" fill="url(#curveA)" />
      <path d="M-40 0 C 200 90, 150 300, -40 400 Z" fill="url(#curveB)" />
      <path d="M1240 800 C 940 690, 1010 470, 1240 330 Z" fill="url(#curveA)" />
      <path d="M1240 800 C 1000 720, 1050 520, 1240 420 Z" fill="url(#curveB)" />
    </svg>
  )
}

/**
 * Textura de tablero, muy tenue.
 *
 * La deriva es opcional y viene apagada por defecto a propósito: animar el
 * `transform` de una capa a pantalla completa con un gradiente repetido obliga
 * al navegador a repintar áreas grandes en cada frame, y con la textura en seis
 * secciones a la vez el scroll se sentía pesado. Queda animada solo en el Hero,
 * donde es la firma visual y está sola en pantalla.
 */
export function BoardTexture({
  className,
  size = 46,
  opacity = 0.06,
  animate = false,
}: {
  className?: string
  size?: number
  opacity?: number
  animate?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'board-texture pointer-events-none absolute inset-0 text-current',
        animate && 'animate-drift [will-change:transform] [contain:paint]',
        className,
      )}
      style={{ ['--board-size' as string]: `${size}px`, opacity }}
    />
  )
}

/** Filete dorado con rombo central: separador editorial. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)} aria-hidden="true">
      <span className="rule-gold h-px flex-1" />
      <span className="bg-gold-bright size-1.5 rotate-45" />
      <span className="rule-gold h-px flex-1" />
    </div>
  )
}
