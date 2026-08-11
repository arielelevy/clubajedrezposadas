import { Download, MessageCircle } from 'lucide-react'
import {
  club,
  nivelesAuspicio,
  notaAuspicios,
  auspiciantesActuales,
  propuestaValor,
} from '@/data/site'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GoldDivider } from '@/components/Ornaments'
import { cn } from '@/lib/utils'

/**
 * Tres escalones de énfasis para las tarjetas, del aporte más alto al más
 * accesible: los dos Rey en grafito, Dama y Torre en el mármol frío de las
 * piezas del club, y los niveles de entrada en blanco.
 *
 * El `hover` de cada escalón intensifica su propio borde; el levantamiento lo
 * pone la tarjeta, así las seis reaccionan igual al mouse (antes solo lo hacían
 * las dos blancas y los Rey quedaban muertos).
 */
const estiloNivel = {
  alto: {
    tarjeta: 'border-gold/45 bg-ink text-ivory shadow-[var(--shadow-gold)] hover:border-gold/80',
    pieza: 'text-gold-bright',
    chip: 'border-gold/40 text-gold-bright',
    titulo: 'text-ivory',
    kicker: 'text-gold-bright',
    aporte: 'text-gold-bright',
    exclusivo: 'text-gold-bright/85',
    lista: 'border-ivory/15 text-ivory/75',
  },
  medio: {
    tarjeta: 'border-silver/45 bg-marble shadow-[var(--shadow-lift)] hover:border-slate-soft/60',
    pieza: 'text-slate-soft',
    chip: 'border-ink/15 text-ink/60',
    titulo: 'text-ink',
    kicker: 'text-ink/60',
    aporte: 'text-ink',
    exclusivo: 'text-ink/70',
    lista: 'border-ink/12 text-ink/75',
  },
  base: {
    tarjeta:
      'border-ink/8 bg-white/70 shadow-none hover:border-gold/45 hover:shadow-[var(--shadow-lift)]',
    pieza: 'text-gold/70',
    chip: 'border-ink/12 text-ink/50',
    titulo: 'text-ink',
    kicker: 'text-gold-deep',
    aporte: 'text-ink',
    exclusivo: 'text-gold-deep',
    lista: 'border-ink/8 text-ink/70',
  },
} as const

export function AuspiciosPage() {
  return (
    <>
      <PageHeader
        kicker="Carpeta de auspicios 2026"
        titulo={
          <>
            Sumá tu marca a<span className="text-gold-gradient block">cien años de historia</span>
          </>
        }
        bajada="El centenario del Club de Ajedrez Posadas es una plataforma con arraigo real en la comunidad: talleres para cientos de chicos y adultos, torneos con validez nacional e internacional y una sede propia en el centro de la ciudad."
      >
        <Button asChild variant="gold" size="lg">
          <a href="/docs/carpeta-auspicios-2026.pdf" target="_blank" rel="noreferrer">
            <Download />
            Descargar la carpeta (PDF)
          </a>
        </Button>
        <Button asChild variant="outlineLight" size="lg">
          <a href={club.whatsappLink} target="_blank" rel="noreferrer">
            <MessageCircle />
            Hablar con el club
          </a>
        </Button>
      </PageHeader>

      {/* Niveles de auspicio, con el aporte de la carpeta 2026 */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="kicker text-gold-deep">Niveles de auspicio</p>
            <h2 className="text-ink mt-4 max-w-2xl text-4xl lg:text-5xl">
              Seis formas de acompañar el proyecto
            </h2>
            <p className="text-ink/65 mt-4 max-w-2xl text-lg leading-relaxed">
              Cada nivel toma el nombre de una pieza y define el aporte y las contraprestaciones. El
              detalle completo, junto con los plazos, está en la carpeta institucional 2026.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nivelesAuspicio.map((n, i) => {
              const e = estiloNivel[n.enfasis]

              return (
                <Reveal key={n.nivel} delay={0.06 * i}>
                  <article
                    className={cn(
                      'flex h-full flex-col rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1',
                      e.tarjeta,
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <ChessGlyph pieza={n.pieza as Pieza} className={cn('text-4xl', e.pieza)} />
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-[0.6rem] tracking-wide uppercase',
                          e.chip,
                        )}
                      >
                        {n.disponibilidad}
                      </span>
                    </div>

                    <h3 className={cn('font-display mt-5 text-2xl', e.titulo)}>{n.nivel}</h3>
                    <p className={cn('kicker mt-1.5 text-[0.55rem]', e.kicker)}>{n.rol}</p>

                    {/* Aporte */}
                    <p
                      className={cn(
                        'font-condensed mt-4 text-xl leading-none tracking-wide',
                        e.aporte,
                      )}
                    >
                      {n.aporte}
                    </p>

                    {n.exclusivo ? (
                      <p className={cn('mt-2.5 text-xs leading-snug', e.exclusivo)}>
                        {n.exclusivo}
                      </p>
                    ) : null}

                    <ul
                      className={cn(
                        'mt-5 space-y-2.5 border-t pt-5 text-[0.82rem] leading-snug',
                        e.lista,
                      )}
                    >
                      {n.beneficios.map((b) => (
                        <li key={b} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className="bg-gold mt-[0.3rem] size-1.5 shrink-0 rotate-45"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={0.08}>
            <p className="border-gold/50 text-ink/60 mx-auto mt-9 max-w-3xl border-l-2 pl-6 text-[0.95rem] leading-relaxed">
              {notaAuspicios}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Dónde aparece la marca */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(192,145,44,0.15),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="kicker text-gold-bright">Propuesta de valor</p>
            <h2 className="text-ivory mt-5 text-4xl leading-[1.06] lg:text-5xl">
              Dónde va a estar tu marca
            </h2>
            <GoldDivider className="mt-8 max-w-sm" />
            <p className="text-ivory/70 mt-8 text-lg leading-relaxed">
              Los festejos del centenario se extienden hasta julio de 2027: hasta doce meses de
              exposición sostenida, dentro y fuera de la sede.
            </p>
          </Reveal>

          <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {propuestaValor.map((p, i) => (
              <Reveal key={p.titulo} delay={0.05 * i}>
                <div className="border-ivory/12 border-t pt-5">
                  <dt className="font-display text-ivory text-xl">{p.titulo}</dt>
                  <dd className="text-ivory/60 mt-2 text-[0.9rem] leading-relaxed">{p.texto}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Quiénes ya acompañan + cierre */}
      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="text-center">
            <p className="kicker text-gold-deep">Ya acompañan el centenario</p>
            <h2 className="text-ink mt-4 text-3xl lg:text-4xl">Gracias por estar</h2>
          </Reveal>

          <ul className="mt-9 grid gap-4 sm:grid-cols-3">
            {auspiciantesActuales.map((a, i) => (
              <Reveal key={a} delay={0.07 * i}>
                <li className="border-ink/8 flex h-full items-center justify-center gap-4 rounded-lg border bg-white/70 px-6 py-8 text-center">
                  <ChessGlyph pieza="peon" className="text-gold/60 text-2xl" />
                  <span className="font-display text-ink text-lg leading-snug">{a}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="border-ink/8 bg-bone mt-9 rounded-lg border p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="font-display text-ink text-2xl">
                    ¿Querés que tu empresa acompañe el centenario?
                  </h3>
                  <p className="text-ink/65 mt-3 text-[0.95rem] leading-relaxed">
                    Escribinos al {club.whatsapp} y coordinamos una reunión en la sede de{' '}
                    {club.direccion} para armar el plan que mejor se ajuste a tu marca. El aporte
                    puede ser económico o en productos.
                  </p>
                </div>
                <Button asChild variant="gold" size="lg">
                  <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    Quiero auspiciar
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
