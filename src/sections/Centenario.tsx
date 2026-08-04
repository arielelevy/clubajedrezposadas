import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { hitos, club } from '@/data/site'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GraphiteCurves } from '@/components/Ornaments'

/**
 * Banda compacta del centenario en el home: el recorrido de los cien años
 * como riel horizontal de años. La línea de tiempo desarrollada, con el texto
 * de cada hito, vive en /historia — acá solo se marca el camino y se enlaza.
 */
export function Centenario() {
  return (
    <section
      id="centenario"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-20 text-ivory lg:py-28"
    >
      <BoardTexture className="text-ivory" size={58} opacity={0.05} />
      <GraphiteCurves className="opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(192,145,44,0.14),transparent_55%)]" />

      {/* Numeral del centenario como marca de agua */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-10 font-display text-[22rem] leading-none font-semibold text-ivory/[0.03] select-none"
      >
        100
      </span>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-2xl">
            <p className="kicker text-gold-bright">1926 — 2026</p>
            <h2 className="mt-5 text-4xl leading-[1.06] text-ivory lg:text-5xl">
              Cien años sin apagar las luces
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory/70">
              Del Palace Hotel a la casa propia de {club.direccion}: un siglo de ajedrez sostenido por
              socios, profesores y familias de Posadas.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/historia">
                La historia completa
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Riel horizontal de hitos */}
        <ol className="relative mt-16 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          <span
            aria-hidden="true"
            className="absolute top-5 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block"
          />

          {hitos.map((h, i) => (
            <li key={h.anio} className="relative">
              <Reveal delay={0.06 * i}>
                <span className="relative grid size-10 place-items-center rounded-full border border-gold/40 bg-ink text-gold-bright">
                  <ChessGlyph pieza={h.pieza as Pieza} className="text-xl" />
                </span>
                <p className="mt-5 font-condensed text-3xl leading-none text-gold-bright">{h.anio}</p>
                <h3 className="mt-3 max-w-[15rem] font-display text-lg leading-snug text-ivory">
                  {h.titulo}
                </h3>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
