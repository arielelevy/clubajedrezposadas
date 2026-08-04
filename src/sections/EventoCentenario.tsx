import { MessageCircle, ArrowRight } from 'lucide-react'
import { club, eventoCentenario as evento } from '@/data/site'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph } from '@/components/ChessGlyph'
import { BoardTexture, GraphiteCurves, GoldDivider } from '@/components/Ornaments'

/**
 * Evento central del festejo: el IRT "100 Años".
 * Va inmediatamente después del Hero y está resuelto como un afiche de torneo:
 * banda clara (para cortar con el Hero oscuro) con la ficha del evento en una
 * pieza de grafito y oro. Se oculta completo con `eventoCentenario.publicado: false`.
 */
export function EventoCentenario() {
  if (!evento.publicado) return null

  return (
    <section
      id="evento"
      className="relative isolate scroll-mt-24 overflow-hidden bg-ivory py-24 lg:py-32"
    >
      <BoardTexture className="text-ink" size={72} opacity={0.035} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="kicker text-gold-deep">El evento del centenario</p>
          <h2 className="mt-5 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]">
            {evento.nombre}
          </h2>
          <p className="mt-4 font-sans text-sm font-light tracking-[0.22em] text-ink/50 uppercase">
            {evento.subtitulo}
          </p>
          <p className="mt-7 text-lg leading-relaxed text-ink/65">{evento.bajada}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <article className="mt-14 grid overflow-hidden rounded-xl border border-gold/30 bg-ink text-ivory shadow-[var(--shadow-lift)] lg:grid-cols-[0.82fr_1.18fr]">
            {/* Ficha: fecha en tipografía condensada y datos del torneo */}
            <div className="relative isolate overflow-hidden border-b border-ivory/10 p-9 lg:border-r lg:border-b-0 lg:p-12">
              <GraphiteCurves className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(192,145,44,0.2),transparent_60%)]" />

              <div className="relative">
                <p className="kicker text-gold-bright">{evento.sigla} · Diciembre 2026</p>

                <time dateTime={evento.fechaISO} className="mt-7 block">
                  <span className="flex items-baseline font-condensed leading-[0.8] text-ivory">
                    <span className="text-[5.5rem] lg:text-[6.5rem]">{evento.diaDesde}</span>
                    <span className="mx-2 text-[3rem] text-gold lg:text-[3.5rem]">—</span>
                    <span className="text-[5.5rem] lg:text-[6.5rem]">{evento.diaHasta}</span>
                  </span>
                  <span className="mt-3 block font-condensed text-2xl tracking-[0.3em] text-gold-bright uppercase lg:text-3xl">
                    {evento.mesCorto} {evento.anio}
                  </span>
                  <span className="sr-only">{evento.fechaTexto}</span>
                </time>

                <GoldDivider className="mt-9" />

                <dl className="mt-8 space-y-4">
                  {evento.ficha.map((f) => (
                    <div key={f.rotulo}>
                      <dt className="kicker text-[0.6rem] text-ivory/40">{f.rotulo}</dt>
                      <dd className="mt-1 text-[0.95rem] leading-snug text-ivory/85">{f.valor}</dd>
                    </div>
                  ))}
                </dl>

                <Button asChild variant="gold" size="lg" className="mt-10 w-full sm:w-auto">
                  <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    {evento.ctaTexto}
                  </a>
                </Button>
              </div>
            </div>

            {/* Descripción y características */}
            <div className="relative isolate overflow-hidden p-9 lg:p-12">
              <ChessGlyph
                pieza="rey"
                className="pointer-events-none absolute -right-6 -bottom-14 text-[18rem] leading-none text-ivory/[0.04] select-none"
              />

              <div className="relative">
                <p className="text-[1.02rem] leading-relaxed text-ivory/75">{evento.descripcion}</p>
                <p className="mt-5 text-[1.02rem] leading-relaxed text-ivory/75">
                  {evento.descripcion2}
                </p>

                <p className="kicker mt-10 text-[0.62rem] text-gold-bright">Qué incluye la edición</p>
                <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {evento.caracteristicas.map((c) => (
                    <li key={c} className="flex gap-3 text-[0.95rem] leading-snug text-ivory/80">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gold-bright"
                      />
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ivory/10 pt-8">
                  <Button asChild variant="outlineLight">
                    <a href={club.instagramLink} target="_blank" rel="noreferrer">
                      Seguir la cuenta oficial
                      <ArrowRight />
                    </a>
                  </Button>
                  <p className="text-sm text-ivory/50">
                    Las bases, el reglamento y la inscripción se publican en {' '}
                    <span className="text-ivory/70">@{club.instagram}</span>.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
