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
      <div className="@container overflow-hidden rounded-md border border-ink/12 shadow-[var(--shadow-lift)]">
        <div className="grid grid-cols-8">
          {filas.map((fila, i) =>
            (invertido ? [...fila].reverse() : fila).map((casilla, j) => {
              const clara = (i + j) % 2 === 0
              const destacada =
                ultimaJugada && (ultimaJugada.from === casilla.nombre || ultimaJugada.to === casilla.nombre)

              return (
                <div
                  key={casilla.nombre}
                  className={cn(
                    'relative grid aspect-square place-items-center',
                    clara ? 'bg-ivory' : 'bg-[#7d6541]',
                  )}
                >
                  {destacada ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gold-bright/35 ring-2 ring-gold/70 ring-inset"
                    />
                  ) : null}

                  {casilla.pieza ? (
                    <span
                      className={cn(
                        // La caja del glifo es más alta que su font-size (el tipo
                        // trae ascendente y descendente propios), así que con
                        // 14cqw la pieza medía 170% del alto de la casilla y se
                        // metía en la de al lado. A 9.5cqw entra justa.
                        'relative flex select-none items-center justify-center leading-[0.75]',
                        'text-[9.5cqw]',
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
