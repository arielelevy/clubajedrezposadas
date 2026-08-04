import { cn } from '@/lib/utils'

/**
 * Piezas de ajedrez tipográficas (Unicode). Escalan sin pérdida, heredan color
 * y no suman peso al bundle. Se usan como sistema de iconografía del sitio.
 */
export const piezas = {
  rey: '♔',
  dama: '♕',
  torre: '♖',
  alfil: '♗',
  caballo: '♘',
  peon: '♙',
} as const

export type Pieza = keyof typeof piezas

const nombres: Record<Pieza, string> = {
  rey: 'Rey',
  dama: 'Dama',
  torre: 'Torre',
  alfil: 'Alfil',
  caballo: 'Caballo',
  peon: 'Peón',
}

export function ChessGlyph({
  pieza,
  className,
  decorativo = true,
}: {
  pieza: Pieza
  className?: string
  decorativo?: boolean
}) {
  return (
    <span
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : nombres[pieza]}
      role={decorativo ? undefined : 'img'}
      className={cn('font-display leading-none select-none', className)}
    >
      {piezas[pieza]}
    </span>
  )
}
