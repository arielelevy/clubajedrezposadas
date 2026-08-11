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

type Hito = (typeof hitos)[number]

/**
 * Ficha del hito elegido. Se usa con `key={hito.anio}` para que React la vuelva
 * a montar y la animación `jugada` corra en cada cambio: si nada se mueve, el
 * toque en el casillero parece no haber hecho nada.
 */
function FichaHito({ hito }: { hito: Hito }) {
  return (
    <div className="animate-jugada border-gold/25 bg-graphite/60 rounded-lg border p-8 backdrop-blur-sm lg:p-9">
      <div className="flex items-center gap-4">
        <span className="border-gold/40 text-gold-bright grid size-11 shrink-0 place-items-center rounded-full border">
          <ChessGlyph pieza={hito.pieza as Pieza} className="text-xl" />
        </span>
        <div>
          <p className="font-condensed text-gold-bright text-3xl leading-none">{hito.anio}</p>
          <p className="kicker text-ivory/40 mt-1.5 text-[0.6rem]">{hito.fecha}</p>
        </div>
      </div>

      <h3 className="text-ivory mt-7 text-2xl leading-snug">{hito.titulo}</h3>
      <p className="text-ivory/70 mt-4 text-[0.98rem] leading-relaxed">{hito.texto}</p>
    </div>
  )
}

export function Centenario() {
  const [seleccionado, setSeleccionado] = useState<string>(cierre.anio)
  const [anioMirado, setAnioMirado] = useState<number | null>(null)
  const [tocado, setTocado] = useState(false)

  const hito = hitos.find((h) => h.anio === seleccionado) ?? cierre

  /** Un toque en un casillero de oro: la lectura pasa a mostrar el hito elegido. */
  const elegir = (anio: string) => {
    setSeleccionado(anio)
    setTocado(true)
    setAnioMirado(null)
  }

  return (
    <section
      id="centenario"
      className="bg-ink text-ivory relative isolate scroll-mt-24 overflow-hidden py-12 lg:py-18"
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
                    className="font-condensed text-ivory/30 self-center text-[0.65rem] leading-none"
                  >
                    ’{String(a).slice(2)}
                  </span>
                ))}
            </div>

            <ol
              className="grid flex-1 grid-cols-[repeat(10,minmax(0,1fr))] gap-[3px]"
              onPointerLeave={() => setAnioMirado(null)}
              onPointerOver={(e) => {
                // Solo mouse: en touch el "hover" queda pegado después del toque
                // y tapaba la lectura del hito recién elegido.
                if (e.pointerType !== 'mouse') return
                const casillero = (e.target as HTMLElement).closest('[data-anio]')
                // En los 3 px entre casilleros el target es la grilla: si eso
                // borrara la lectura, el texto de abajo parpadearía al pasar el
                // mouse. Se mantiene el último año hasta salir del tablero.
                if (!casillero) return
                setAnioMirado(Number(casillero.getAttribute('data-anio')))
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
                        onClick={() => elegir(ancla.anio)}
                        aria-pressed={hito.anio === ancla.anio}
                        title={`${ancla.anio} · ${ancla.titulo}`}
                        className={cn(
                          // El `after` agranda el área táctil sin agrandar el
                          // casillero: en mobile cada casilla mide ~28px. Solo
                          // en punteros gruesos, porque con mouse ese halo le
                          // robaba el hover a los casilleros vecinos.
                          'from-gold-bright to-gold-deep text-ink relative grid size-full place-items-center rounded-[3px] bg-gradient-to-br transition-all duration-300 hover:brightness-115 pointer-coarse:after:absolute pointer-coarse:after:-inset-1.5 pointer-coarse:after:content-[""]',
                          hito.anio === ancla.anio
                            ? 'ring-gold-bright ring-offset-ink ring-2 ring-offset-2'
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
          <div className="border-ivory/10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <p
              aria-live="polite"
              className="font-condensed text-ivory/60 min-w-0 text-xl tracking-wide"
            >
              {anioMirado || tocado ? (
                // El año va siempre en el mismo lugar: si alternara con el
                // rótulo del hito, la línea se movería sola con el mouse.
                <span className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="text-gold-bright">{anioMirado ?? hito.anio}</span>
                  <span className="text-ivory/45 font-sans text-[0.68rem] font-light tracking-[0.16em] uppercase">
                    {anioMirado ? '' : hito.fecha}
                  </span>
                </span>
              ) : (
                <span className="text-[0.7rem] tracking-[0.2em] uppercase">
                  Tocá un casillero de oro
                </span>
              )}
            </p>

            <button
              type="button"
              onClick={() => elegir(cierre.anio)}
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
                <span className="font-condensed block text-lg tracking-wide">{cierre.anio}</span>
                <span className="block text-[0.62rem] tracking-[0.14em] uppercase opacity-70">
                  La jugada en curso
                </span>
              </span>
            </button>
          </div>

          {/* En mobile la ficha del hito va acá, pegada al tablero: arriba
              quedaba fuera de pantalla y el toque no se veía. */}
          <div className="mt-6 lg:hidden">
            <FichaHito key={hito.anio} hito={hito} />
          </div>
        </Reveal>

        {/* El relato */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="kicker text-gold-bright">1926 — 2026</p>
            <h2 className="text-ivory mt-5 text-4xl leading-[1.04] sm:text-5xl lg:text-[3.4rem]">
              Cien casilleros,
              <span className="text-gold-gradient block">cien años</span>
            </h2>
            <p className="text-ivory/70 mt-7 max-w-xl text-lg leading-relaxed">
              Cada fila del tablero es una década y cada casillero un año del club, desde aquella
              primera reunión en el Palace Hotel. Los cinco de oro son los que cambiaron su
              historia.
            </p>
          </Reveal>

          {/* Hito seleccionado (en mobile se muestra debajo del tablero) */}
          <Reveal delay={0.1} className="mt-8 hidden lg:block">
            <FichaHito key={hito.anio} hito={hito} />
          </Reveal>

          {/* Antigüedad en perspectiva: tres fechas y se entiende sola */}
          <Reveal delay={0.14}>
            <div className="border-ivory/12 mt-8 border-t pt-7">
              <p className="kicker text-ivory/40 text-[0.58rem]">{contextoAntiguedad.titulo}</p>
              <ol className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-5">
                {contextoAntiguedad.fechas.map((f) => (
                  <li key={f.anio}>
                    <p
                      className={
                        f.propio
                          ? 'font-condensed text-gold-bright text-3xl leading-none'
                          : 'font-condensed text-ivory/45 text-3xl leading-none'
                      }
                    >
                      {f.anio}
                    </p>
                    <p
                      className={
                        f.propio
                          ? 'text-ivory/80 mt-1.5 text-[0.82rem]'
                          : 'text-ivory/45 mt-1.5 text-[0.82rem]'
                      }
                    >
                      {f.que}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="text-ivory/55 mt-5 max-w-xl text-[0.9rem] leading-relaxed">
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
