import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'
import { festival } from '@/data/festival'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GraphiteCurves, GoldDivider } from '@/components/Ornaments'

/**
 * Adelanto del festival del centenario, inmediatamente después del Hero.
 *
 * Hasta que llegó el programa oficial, esta sección era todo lo que el sitio
 * decía del torneo, y por eso traía la ficha completa. Ahora la información vive
 * en /festival: acá quedan el afiche, la fecha, las cifras que deciden a un
 * jugador (premios, rondas, ritmo) y los cuatro torneos en una línea cada uno.
 * Todo lo demás —aranceles, packs, cronograma, sede— es un click.
 *
 * Se oculta completa con `festival.publicado: false`.
 */
export function EventoCentenario() {
  if (!festival.publicado) return null

  return (
    <section
      id="evento"
      className="bg-ivory relative isolate scroll-mt-24 overflow-hidden py-12 lg:py-18"
    >
      <BoardTexture className="text-ink" size={72} opacity={0.035} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Título a la izquierda y bajada a la derecha: apilados se comían un
            renglón entero de alto sin necesidad. */}
        <Reveal className="grid items-end gap-x-12 gap-y-4 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="kicker text-gold-deep">El evento del centenario</p>
            <h2 className="text-ink mt-4 text-3xl leading-[1.06] sm:text-4xl lg:text-5xl">
              {festival.nombre}
            </h2>
            <p className="text-ink/50 mt-3 font-sans text-sm font-light tracking-[0.22em] uppercase">
              {festival.torneoPrincipal} · {festival.fechaTexto}
            </p>
          </div>
          <p className="text-ink/65 text-[1.02rem] leading-relaxed lg:pb-1">{festival.bajada}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <article className="border-gold/30 bg-ink text-ivory mt-6 grid overflow-hidden rounded-xl border shadow-[var(--shadow-lift)] lg:grid-cols-[0.9fr_1.1fr]">
            {/* El afiche, del lado de la fecha */}
            <div className="border-ivory/10 relative isolate overflow-hidden border-b p-6 lg:border-r lg:border-b-0 lg:p-7">
              <GraphiteCurves className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(192,145,44,0.2),transparent_60%)]" />

              <div className="relative">
                <time
                  dateTime={festival.fechaISO}
                  className="flex flex-wrap items-baseline gap-x-3"
                >
                  <span className="font-condensed text-ivory flex items-baseline leading-[0.8]">
                    <span className="text-[3.2rem] lg:text-[3.8rem]">{festival.diaDesde}</span>
                    <span className="text-gold mx-1.5 text-[2rem] lg:text-[2.2rem]">—</span>
                    <span className="text-[3.2rem] lg:text-[3.8rem]">{festival.diaHasta}</span>
                  </span>
                  <span className="font-condensed text-gold-bright text-lg tracking-[0.28em] uppercase lg:text-xl">
                    {festival.mesCorto} {festival.anio}
                  </span>
                  <span className="sr-only">{festival.fechaTexto}</span>
                </time>

                <GoldDivider className="mt-4" />

                <Link
                  to="/festival"
                  className="border-gold/25 hover:border-gold/70 group mt-5 block overflow-hidden rounded-lg border transition-colors"
                >
                  <img
                    src={festival.afiche.src}
                    alt={festival.afiche.alt}
                    width={festival.afiche.ancho}
                    height={festival.afiche.alto}
                    loading="lazy"
                    className="block w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </Link>

                <p className="text-ivory/55 mt-4 text-[0.88rem] leading-snug">
                  {festival.sede.nombre} · {festival.sede.direccion}
                </p>
              </div>
            </div>

            {/* Cifras, los cuatro torneos y la salida a la página */}
            <div className="relative isolate overflow-hidden p-6 lg:p-7">
              <ChessGlyph
                pieza="rey"
                className="text-ivory/[0.04] pointer-events-none absolute -right-6 -bottom-14 text-[15rem] leading-none select-none"
              />

              <div className="relative flex h-full flex-col">
                <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {festival.cifras.map((c) => (
                    <div key={c.rotulo}>
                      <dt className="font-condensed text-gold-bright text-3xl leading-none">
                        {c.valor}
                      </dt>
                      <dd className="text-ivory/55 mt-1.5 text-[0.85rem] leading-snug">
                        {c.rotulo}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="kicker text-gold-bright mt-7 text-[0.6rem]">Los cuatro torneos</p>
                <ul className="border-ivory/10 mt-4 border-t">
                  {festival.torneos.map((t) => (
                    <li
                      key={t.nombre}
                      className="border-ivory/8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3 last:border-0"
                    >
                      <span className="text-ivory/85 flex items-baseline gap-2.5 text-[0.95rem]">
                        <ChessGlyph pieza={t.pieza as Pieza} className="text-gold/70 text-base" />
                        {t.nombre}
                      </span>
                      <span className="text-ivory/45 text-[0.8rem]">{t.cuando}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-4 pt-1">
                  <Button asChild variant="gold">
                    <Link to="/festival">
                      Ver el festival completo
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outlineLight">
                    <a href={festival.inscripcion.reglamento} target="_blank" rel="noreferrer">
                      <FileText />
                      Reglamento
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
