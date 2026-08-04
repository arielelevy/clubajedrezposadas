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

export function AuspiciosPage() {
  return (
    <>
      <PageHeader
        kicker="Carpeta de auspicios 2026"
        titulo={
          <>
            Sumá tu marca a
            <span className="block text-gold-gradient">cien años de historia</span>
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
      <section className="bg-bone py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="kicker text-gold-deep">Niveles de auspicio</p>
            <h2 className="mt-4 max-w-2xl text-4xl text-ink lg:text-5xl">
              Seis formas de acompañar el proyecto
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/65">
              Cada nivel toma el nombre de una pieza y define el aporte y las contraprestaciones. El
              detalle completo, junto con los plazos, está en la carpeta institucional 2026.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {nivelesAuspicio.map((n, i) => (
              <Reveal key={n.nivel} delay={0.06 * i}>
                <article
                  className={cn(
                    'flex h-full flex-col rounded-lg border p-7 transition-all duration-500',
                    n.destacado
                      ? 'border-gold/45 bg-ink text-ivory shadow-[var(--shadow-gold)]'
                      : 'border-ink/8 bg-white/70 hover:border-gold/45 hover:shadow-[var(--shadow-lift)]',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <ChessGlyph
                      pieza={n.pieza as Pieza}
                      className={cn('text-5xl', n.destacado ? 'text-gold-bright' : 'text-gold/70')}
                    />
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-[0.65rem] tracking-wide uppercase',
                        n.destacado ? 'border-gold/40 text-gold-bright' : 'border-ink/12 text-ink/50',
                      )}
                    >
                      {n.disponibilidad}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'mt-6 font-display text-3xl',
                      n.destacado ? 'text-ivory' : 'text-ink',
                    )}
                  >
                    {n.nivel}
                  </h3>
                  <p
                    className={cn(
                      'kicker mt-2 text-[0.6rem]',
                      n.destacado ? 'text-gold-bright' : 'text-gold-deep',
                    )}
                  >
                    {n.rol}
                  </p>

                  {/* Aporte */}
                  <p
                    className={cn(
                      'mt-6 font-condensed text-2xl leading-none tracking-wide',
                      n.destacado ? 'text-gold-bright' : 'text-ink',
                    )}
                  >
                    {n.aporte}
                  </p>

                  {n.exclusivo ? (
                    <p
                      className={cn(
                        'mt-3 text-xs leading-snug',
                        n.destacado ? 'text-gold-bright/85' : 'text-gold-deep',
                      )}
                    >
                      {n.exclusivo}
                    </p>
                  ) : null}

                  <ul
                    className={cn(
                      'mt-6 space-y-3 border-t pt-6 text-sm',
                      n.destacado ? 'border-ivory/15 text-ivory/75' : 'border-ink/8 text-ink/70',
                    )}
                  >
                    {n.beneficios.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gold"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08}>
            <p className="mx-auto mt-12 max-w-3xl border-l-2 border-gold/50 pl-6 text-[0.95rem] leading-relaxed text-ink/60">
              {notaAuspicios}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Dónde aparece la marca */}
      <section className="relative isolate overflow-hidden bg-ink py-14 text-ivory lg:py-20">
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(192,145,44,0.15),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="kicker text-gold-bright">Propuesta de valor</p>
            <h2 className="mt-5 text-4xl leading-[1.06] text-ivory lg:text-5xl">
              Dónde va a estar tu marca
            </h2>
            <GoldDivider className="mt-8 max-w-sm" />
            <p className="mt-8 text-lg leading-relaxed text-ivory/70">
              Los festejos del centenario se extienden hasta julio de 2027: hasta doce meses de
              exposición sostenida, dentro y fuera de la sede.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {propuestaValor.map((p, i) => (
              <Reveal key={p.titulo} delay={0.05 * i}>
                <div className="border-t border-ivory/12 pt-5">
                  <dt className="font-display text-xl text-ivory">{p.titulo}</dt>
                  <dd className="mt-2 text-[0.9rem] leading-relaxed text-ivory/60">{p.texto}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Quiénes ya acompañan + cierre */}
      <section className="bg-ivory py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="text-center">
            <p className="kicker text-gold-deep">Ya acompañan el centenario</p>
            <h2 className="mt-4 text-3xl text-ink lg:text-4xl">Gracias por estar</h2>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {auspiciantesActuales.map((a, i) => (
              <Reveal key={a} delay={0.07 * i}>
                <li className="flex h-full items-center justify-center gap-4 rounded-lg border border-ink/8 bg-white/70 px-6 py-8 text-center">
                  <ChessGlyph pieza="peon" className="text-2xl text-gold/60" />
                  <span className="font-display text-lg leading-snug text-ink">{a}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-lg border border-ink/8 bg-bone p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl text-ink">
                    ¿Querés que tu empresa acompañe el centenario?
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">
                    Escribinos al {club.whatsapp} y coordinamos una reunión en la sede de{' '}
                    {club.direccion} para armar el plan que mejor se ajuste a tu marca. El aporte puede
                    ser económico o en productos.
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
