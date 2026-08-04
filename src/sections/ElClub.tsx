import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { club, historia, pilaresCentenario } from '@/data/site'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph } from '@/components/ChessGlyph'
import { BoardTexture } from '@/components/Ornaments'

const piezas = ['torre', 'caballo', 'alfil'] as const

export function ElClub() {
  return (
    <section id="el-club" className="relative scroll-mt-24 overflow-hidden bg-bone py-12 lg:py-18">
      <BoardTexture className="text-ink" size={64} opacity={0.03} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              kicker="El club"
              titulo="Una institución que atravesó un siglo sin apagar las luces"
              bajada={historia.bajada}
            />

            <Reveal delay={0.1}>
              <p className="mt-7 text-[1.02rem] leading-relaxed text-ink/70">
                Fundado el {club.fundacion} en el histórico Palace Hotel, el Club de Ajedrez Posadas fue el
                primer club dedicado exclusivamente al ajedrez en Misiones. Desde 1980 funciona en su propia
                casa de {club.direccion}: una de las pocas instituciones ajedrecísticas del país con
                inmueble propio.
              </p>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/70">
                Hoy es uno de los principales referentes del ajedrez del nordeste argentino, con talleres de
                iniciación, clases para adultos, capacitación docente y torneos válidos para el ranking
                nacional e internacional.
              </p>

              <Button asChild variant="outlineDark" className="mt-9">
                <Link to="/historia">
                  Leer la reseña histórica completa
                  <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-1">
            {pilaresCentenario.map((pilar, i) => (
              <Reveal key={pilar.titulo} delay={0.08 * i}>
                <article className="group relative flex gap-6 overflow-hidden rounded-lg border border-ink/8 bg-white/70 p-7 transition-all duration-500 hover:border-gold/45 hover:shadow-[var(--shadow-lift)]">
                  <ChessGlyph
                    pieza={piezas[i]}
                    className="text-5xl text-gold/70 transition-colors duration-500 group-hover:text-gold"
                  />
                  <div>
                    <h3 className="font-display text-2xl text-ink">{pilar.titulo}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65">{pilar.texto}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
