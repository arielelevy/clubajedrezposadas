import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { hitos, contextoAntiguedad } from '@/data/site'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture } from '@/components/Ornaments'
import { cn } from '@/lib/utils'

/**
 * El tablero de los cien años.
 *
 * Cien casilleros, cien años: cada fila es una década (1926–1935, 1936–1945…)
 * y cada casillero un año del club. Los únicos casilleros de oro son los cinco
 * momentos que cambiaron su historia, y son los que se pueden tocar. El año
 * 2026 queda deliberadamente fuera del tablero, como la jugada en curso.
 *
 * La línea de tiempo desarrollada, con el texto de cada hito, vive en /historia.
 */

const PRIMER_ANIO = 1926
const CASILLEROS = 100 // 1926 → 2025: el siglo cumplido
const anios = Array.from({ length: CASILLEROS }, (_, i) => PRIMER_ANIO + i)
const ultimoAnio = PRIMER_ANIO + CASILLEROS - 1

/** Hitos que caen dentro del tablero, y el que lo cierra desde afuera. */
const enTablero = hitos.filter((h) => h.desde <= ultimoAnio)
const cierre = hitos[hitos.length - 1]

export function Centenario() {
  const [seleccionado, setSeleccionado] = useState<string>(cierre.anio)
  const [anioMirado, setAnioMirado] = useState<number | null>(null)

  const hito = hitos.find((h) => h.anio === seleccionado) ?? cierre

  return (
    <section
      id="centenario"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-12 text-ivory lg:py-18"
    >
      <BoardTexture className="text-ivory" size={64} opacity={0.04} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(192,145,44,0.14),transparent_58%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-20 lg:px-8">
        {/* El tablero */}
        <Reveal className="order-2 lg:order-1">
          <div className="flex gap-3">
            {/* Rótulos de década */}
            <div
              aria-hidden="true"
              className="grid grid-rows-[repeat(10,minmax(0,1fr))] gap-[3px] text-right"
            >
              {anios
                .filter((_, i) => i % 10 === 0)
                .map((a) => (
                  <span
                    key={a}
                    className="self-center font-condensed text-[0.65rem] leading-none text-ivory/30"
                  >
                    ’{String(a).slice(2)}
                  </span>
                ))}
            </div>

            <ol
              className="grid flex-1 grid-cols-[repeat(10,minmax(0,1fr))] gap-[3px]"
              onMouseLeave={() => setAnioMirado(null)}
              onMouseOver={(e) => {
                const casillero = (e.target as HTMLElement).closest('[data-anio]')
                setAnioMirado(casillero ? Number(casillero.getAttribute('data-anio')) : null)
              }}
            >
              {anios.map((anio, i) => {
                const fila = Math.floor(i / 10)
                const columna = i % 10
                const claro = (fila + columna) % 2 === 0
                const ancla = enTablero.find((h) => h.desde === anio)
                const enEra = anio >= hito.desde && anio <= hito.hasta

                return (
                  <li key={anio} className="aspect-square">
                    {ancla ? (
                      <button
                        type="button"
                        data-anio={anio}
                        onClick={() => setSeleccionado(ancla.anio)}
                        aria-pressed={hito.anio === ancla.anio}
                        title={`${ancla.anio} · ${ancla.titulo}`}
                        className={cn(
                          'grid size-full place-items-center rounded-[3px] bg-gradient-to-br from-gold-bright to-gold-deep text-ink transition-all duration-300 hover:brightness-115',
                          hito.anio === ancla.anio
                            ? 'ring-2 ring-gold-bright ring-offset-2 ring-offset-ink'
                            : 'opacity-80 hover:opacity-100',
                        )}
                      >
                        <ChessGlyph
                          pieza={ancla.pieza as Pieza}
                          className="text-[0.85rem] sm:text-base"
                        />
                        <span className="sr-only">
                          {ancla.anio}: {ancla.titulo}
                        </span>
                      </button>
                    ) : (
                      <div
                        data-anio={anio}
                        title={String(anio)}
                        aria-hidden="true"
                        className={cn(
                          'size-full rounded-[3px] transition-colors duration-300',
                          enEra
                            ? 'bg-gold/35'
                            : claro
                              ? 'bg-ivory/[0.09] hover:bg-ivory/20'
                              : 'bg-ivory/[0.03] hover:bg-ivory/15',
                        )}
                      />
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Lectura del casillero + la jugada en curso */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-6">
            <p aria-live="polite" className="font-condensed text-xl tracking-wide text-ivory/60">
              {anioMirado ? (
                <span className="text-gold-bright">{anioMirado}</span>
              ) : (
                <span className="text-[0.7rem] tracking-[0.2em] uppercase">
                  Tocá un casillero de oro
                </span>
              )}
            </p>

            <button
              type="button"
              onClick={() => setSeleccionado(cierre.anio)}
              aria-pressed={hito.anio === cierre.anio}
              className={cn(
                'group flex items-center gap-3 rounded-md border px-4 py-2.5 transition-all duration-300',
                hito.anio === cierre.anio
                  ? 'border-gold bg-gold/15 text-gold-bright'
                  : 'border-ivory/15 text-ivory/60 hover:border-gold/60 hover:text-gold-bright',
              )}
            >
              <ChessGlyph pieza={cierre.pieza as Pieza} className="text-xl" />
              <span className="text-left leading-tight">
                <span className="block font-condensed text-lg tracking-wide">{cierre.anio}</span>
                <span className="block text-[0.62rem] tracking-[0.14em] uppercase opacity-70">
                  La jugada en curso
                </span>
              </span>
            </button>
          </div>
        </Reveal>

        {/* El relato */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="kicker text-gold-bright">1926 — 2026</p>
            <h2 className="mt-5 text-4xl leading-[1.04] text-ivory sm:text-5xl lg:text-[3.4rem]">
              Cien casilleros,
              <span className="block text-gold-gradient">cien años</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/70">
              Cada fila del tablero es una década y cada casillero un año del club, desde aquella
              primera reunión en el Palace Hotel. Los cinco de oro son los que cambiaron su historia.
            </p>
          </Reveal>

          {/* Hito seleccionado */}
          <Reveal delay={0.1}>
            <div className="mt-8 rounded-lg border border-gold/25 bg-graphite/60 p-8 backdrop-blur-sm lg:p-9">
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-bright">
                  <ChessGlyph pieza={hito.pieza as Pieza} className="text-xl" />
                </span>
                <div>
                  <p className="font-condensed text-3xl leading-none text-gold-bright">
                    {hito.anio}
                  </p>
                  <p className="kicker mt-1.5 text-[0.6rem] text-ivory/40">{hito.fecha}</p>
                </div>
              </div>

              <h3 className="mt-7 text-2xl leading-snug text-ivory">{hito.titulo}</h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ivory/70">{hito.texto}</p>
            </div>
          </Reveal>

          {/* Antigüedad en perspectiva: tres fechas y se entiende sola */}
          <Reveal delay={0.14}>
            <div className="mt-8 border-t border-ivory/12 pt-7">
              <p className="kicker text-[0.58rem] text-ivory/40">{contextoAntiguedad.titulo}</p>
              <ol className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-5">
                {contextoAntiguedad.fechas.map((f) => (
                  <li key={f.anio}>
                    <p
                      className={
                        f.propio
                          ? 'font-condensed text-3xl leading-none text-gold-bright'
                          : 'font-condensed text-3xl leading-none text-ivory/45'
                      }
                    >
                      {f.anio}
                    </p>
                    <p
                      className={
                        f.propio
                          ? 'mt-1.5 text-[0.82rem] text-ivory/80'
                          : 'mt-1.5 text-[0.82rem] text-ivory/45'
                      }
                    >
                      {f.que}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-ivory/55">
                {contextoAntiguedad.texto}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <Button asChild variant="gold" size="lg" className="mt-9">
              <Link to="/historia">
                Leer los cien años
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
