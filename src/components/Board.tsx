import { fenATablero } from '@/lib/pgn'
import { cn } from '@/lib/utils'

const glifos: Record<string, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
}

/**
 * Tablero renderizado a partir de un FEN. Piezas tipográficas (Unicode) con
 * contorno, para mantener la paleta marfil/grafito/oro del club.
 */
export function Board({
  fen,
  ultimaJugada,
  invertido = false,
  className,
}: {
  fen: string
  ultimaJugada?: { from: string; to: string }
  invertido?: boolean
  className?: string
}) {
  const tablero = fenATablero(fen)
  const filas = invertido ? [...tablero].reverse() : tablero
  const letras = invertido ? 'hgfedcba' : 'abcdefgh'

  return (
    <div className={cn('w-full', className)}>
      {/* @container: el tamaño de las piezas se mide contra el ancho del
          tablero y no contra el viewport, así siguen al tablero cuando cambia
          de tamaño en lugar de quedarse chicas. */}
      <div className="border-ink/12 @container overflow-hidden rounded-md border shadow-[var(--shadow-lift)]">
        {/* El tablero es cuadrado y sus ocho filas miden exactamente un octavo:
            así ninguna casilla puede estirarse por lo que tenga adentro, que era
            lo que deformaba el tablero cuando la pieza entraba en la fila. */}
        <div className="grid aspect-square grid-cols-8 grid-rows-8">
          {filas.map((fila, i) =>
            (invertido ? [...fila].reverse() : fila).map((casilla, j) => {
              const clara = (i + j) % 2 === 0
              const destacada =
                ultimaJugada &&
                (ultimaJugada.from === casilla.nombre || ultimaJugada.to === casilla.nombre)

              return (
                <div
                  key={casilla.nombre}
                  className={cn(
                    'relative grid min-h-0 min-w-0 place-items-center overflow-hidden',
                    clara ? 'bg-ivory' : 'bg-[#7d6541]',
                  )}
                >
                  {destacada ? (
                    <span
                      aria-hidden="true"
                      className="bg-gold-bright/35 ring-gold/70 absolute inset-0 ring-2 ring-inset"
                    />
                  ) : null}

                  {casilla.pieza ? (
                    <span
                      className={cn(
                        // Medido sobre el render: a 12cqw la tinta ocupaba el 82%
                        // de la casilla y tocaba el borde de abajo, y con la base
                        // ancha de las piezas eso se lee como que están hundidas.
                        // A 10.5cqw queda margen arriba y abajo, y el empujón
                        // corrige el centrado óptico (la tinta de estos glifos
                        // vive toda arriba de la línea base).
                        'relative -translate-y-[0.07em] text-[10.5cqw] leading-none select-none',
                        casilla.color === 'w'
                          ? 'text-[#fdfbf6] [text-shadow:0_0_1px_#0b0b0c,0_1px_0_#0b0b0c,1px_0_0_#0b0b0c,-1px_0_0_#0b0b0c,0_-1px_0_#0b0b0c]'
                          : 'text-[#141416] [text-shadow:0_0_1px_rgba(252,250,245,0.55)]',
                      )}
                    >
                      {glifos[casilla.pieza]}
                    </span>
                  ) : null}

                  {/* Coordenadas discretas en el borde */}
                  {j === 0 ? (
                    <span
                      className={cn(
                        'absolute top-0.5 left-1 text-[0.55rem] font-medium',
                        clara ? 'text-ink/35' : 'text-ivory/55',
                      )}
                    >
                      {invertido ? i + 1 : 8 - i}
                    </span>
                  ) : null}
                  {i === 7 ? (
                    <span
                      className={cn(
                        'absolute right-1 bottom-0.5 text-[0.55rem] font-medium',
                        clara ? 'text-ink/35' : 'text-ivory/55',
                      )}
                    >
                      {letras[j]}
                    </span>
                  ) : null}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}
