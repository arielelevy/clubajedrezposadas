import { MessageCircle, Clock } from 'lucide-react'
import { club, horarioSemanal, programas } from '@/data/site'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { GoldDivider } from '@/components/Ornaments'

export function Talleres() {
  return (
    <section id="talleres" className="bg-ivory relative scroll-mt-24 py-12 lg:py-18">
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
              <article className="group border-ink/8 bg-bone hover:border-gold/50 flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-500 hover:shadow-[var(--shadow-lift)]">
                <div className="bg-ink/5 relative aspect-16/9 overflow-hidden">
                  <img
                    src={p.imagen}
                    alt={p.imagenAlt}
                    loading="lazy"
                    className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="from-ink/25 absolute inset-0 bg-gradient-to-t to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-ink text-2xl">{p.titulo}</h3>
                  <p className="text-ink/65 mt-2.5 text-[0.95rem] leading-relaxed">{p.resumen}</p>
                  <ul className="border-ink/8 text-ink/75 mt-4 space-y-2 border-t pt-4 text-sm">
                    {p.detalle.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="bg-gold mt-2 size-1.5 shrink-0 rotate-45" />
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
        <div className="border-ink/8 bg-bone mt-8 rounded-lg border p-6 lg:p-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="kicker text-gold-deep">Horario semanal</p>
                <h3 className="text-ink mt-3 text-3xl lg:text-4xl">Cuándo venir</h3>
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

          <div className="divide-ink/8 mt-8 divide-y">
            {horarioSemanal.map((dia, i) => (
              <Reveal key={dia.dia} delay={0.04 * i}>
                <div className="grid items-center gap-4 py-3.5 sm:grid-cols-[7rem_1fr]">
                  <p className="font-condensed text-ink text-3xl leading-none">{dia.abrev}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dia.turnos.map((t) => (
                      <div
                        key={dia.abrev + t.horario}
                        className="border-ink/8 bg-ivory/60 rounded-md border px-4 py-3"
                      >
                        <p className="text-ink flex items-center gap-2 text-[0.95rem] font-medium">
                          <Clock className="text-gold size-4" />
                          {t.horario} hs
                        </p>
                        <p className="text-ink/60 mt-1 text-xs">
                          {t.instructor ? `${t.grupo} · ${t.instructor}` : t.grupo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-ink/50 mt-6 text-xs">
            Los talleres funcionan en la sede de {club.direccion}, {club.ciudad}. Los viernes de
            20:00 a 22:00 y los sábados de 16:00 a 20:00 la sede queda abierta para jugar, sin
            clase: vení con ganas de partida. Los miércoles de noche se suman próximamente al
            esquema de clases para adultos.
          </p>
        </div>
      </div>
    </section>
  )
}
