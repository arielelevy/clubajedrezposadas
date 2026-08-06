import { MessageCircle, Clock } from 'lucide-react'
import { club, horarioSemanal, programas } from '@/data/site'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { GoldDivider } from '@/components/Ornaments'

export function Talleres() {
  return (
    <section id="talleres" className="relative scroll-mt-24 bg-ivory py-12 lg:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="Talleres y clases"
          titulo="Se aprende jugando, seis días por semana"
          bajada="No hace falta saber mover las piezas para empezar. El club tiene tableros, relojes e instructores titulados para cada nivel y cada edad."
          align="center"
        />

        <div className="mt-9 grid gap-6 lg:grid-cols-3">
          {programas.map((p, i) => (
            <Reveal key={p.id} delay={0.08 * i}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink/8 bg-bone transition-all duration-500 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-16/9 overflow-hidden bg-ink/5">
                  <img
                    src={p.imagen}
                    alt={p.imagenAlt}
                    loading="lazy"
                    className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl text-ink">{p.titulo}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/65">{p.resumen}</p>
                  <ul className="mt-4 space-y-2 border-t border-ink/8 pt-4 text-sm text-ink/75">
                    {p.detalle.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Horario semanal */}
        <div className="mt-8 rounded-lg border border-ink/8 bg-bone p-6 lg:p-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="kicker text-gold-deep">Horario semanal</p>
                <h3 className="mt-3 text-3xl text-ink lg:text-4xl">Cuándo venir</h3>
              </div>
              <Button asChild variant="gold">
                <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle />
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>
            <GoldDivider className="mt-8" />
          </Reveal>

          <div className="mt-8 divide-y divide-ink/8">
            {horarioSemanal.map((dia, i) => (
              <Reveal key={dia.dia} delay={0.04 * i}>
                <div className="grid items-center gap-4 py-3.5 sm:grid-cols-[7rem_1fr]">
                  <p className="font-condensed text-3xl leading-none text-ink">{dia.abrev}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dia.turnos.map((t) => (
                      <div
                        key={dia.abrev + t.horario}
                        className="rounded-md border border-ink/8 bg-ivory/60 px-4 py-3"
                      >
                        <p className="flex items-center gap-2 text-[0.95rem] font-medium text-ink">
                          <Clock className="size-4 text-gold" />
                          {t.horario} hs
                        </p>
                        <p className="mt-1 text-xs text-ink/60">
                          {t.instructor ? `${t.grupo} · ${t.instructor}` : t.grupo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-xs text-ink/50">
            Los talleres funcionan en la sede de {club.direccion}, {club.ciudad}. Los viernes de 20:00 a
            22:00 y los sábados de 16:00 a 20:00 la sede queda abierta para jugar, sin clase: vení con
            ganas de partida. Los miércoles de noche se suman próximamente al esquema de clases para
            adultos.
          </p>
        </div>
      </div>
    </section>
  )
}
