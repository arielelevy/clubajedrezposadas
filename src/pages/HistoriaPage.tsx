import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { club, historia, hitos } from '@/data/site'
import { PageHeader } from '@/components/PageHeader'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GoldDivider, GraphiteCurves } from '@/components/Ornaments'

export function HistoriaPage() {
  return (
    <>
      <PageHeader
        kicker="1926 — 2026"
        titulo={
          <>
            Reseña histórica de
            <span className="block text-gold-gradient">un siglo de ajedrez</span>
          </>
        }
        bajada={historia.bajada}
      />

      <section className="bg-bone py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-0">
          {historia.parrafos.map((p, i) => (
            <Reveal key={i} delay={0.03 * i}>
              <p
                className={
                  i === 0
                    ? 'font-display text-2xl leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold'
                    : 'mt-7 text-[1.05rem] leading-[1.85] text-ink/75'
                }
              >
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal>
            <GoldDivider className="my-14" />
          </Reveal>

          {historia.cierre.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="mt-6 font-display text-xl leading-relaxed text-ink/85 italic">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Línea del tiempo: los cinco hitos del siglo */}
      <section
        id="hitos"
        className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-24 text-ivory lg:py-32"
      >
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <GraphiteCurves className="opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(192,145,44,0.14),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeading
              kicker="Los hitos"
              titulo="La línea del tiempo de un siglo"
              bajada="Cinco momentos que explican cómo un club sin sede propia terminó siendo patrimonio deportivo y cultural de Posadas."
              tono="oscuro"
            />
          </div>

          <ol className="relative mt-16 space-y-2">
            {/* Riel vertical */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent lg:left-1/2"
            />

            {hitos.map((h, i) => (
              <li key={h.anio} className="relative">
                <Reveal delay={0.05 * i}>
                  <div
                    className={`grid gap-6 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>*:first-child]:col-start-2' : ''}`}
                  >
                    <div
                      className={`relative pl-14 lg:pl-0 ${i % 2 === 1 ? 'lg:pl-16' : 'lg:pr-16 lg:text-right'}`}
                    >
                      {/* Nodo */}
                      <span
                        className={`absolute top-1 left-0 grid size-10 place-items-center rounded-full border border-gold/40 bg-ink text-gold-bright ${
                          i % 2 === 1 ? 'lg:right-auto lg:-left-5' : 'lg:left-auto lg:-right-5'
                        }`}
                      >
                        <ChessGlyph pieza={h.pieza as Pieza} className="text-xl" />
                      </span>

                      <p className="font-condensed text-4xl leading-none text-gold-bright lg:text-5xl">
                        {h.anio}
                      </p>
                      <p className="kicker mt-2 text-[0.62rem] text-ivory/45">{h.fecha}</p>
                      <h3 className="mt-4 text-2xl text-ivory lg:text-[1.75rem]">{h.titulo}</h3>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/65">{h.texto}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="mt-16 flex flex-wrap gap-4">
            <Button asChild variant="gold" size="lg">
              <Link to="/socios">
                Sumate al club
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <a href={club.instagramLink} target="_blank" rel="noreferrer">
                Ver novedades en Instagram
              </a>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
