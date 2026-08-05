import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  club,
  historia,
  hitos,
  comisionFundadora,
  comisionCentenario,
  decadaTorneos,
  torneosRecientes,
} from '@/data/site'
import actaUrl from '@/assets/galeria/acta-1926.webp'
import placaUrl from '@/assets/galeria/placa-centenario.webp'
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

      <section className="bg-bone py-12 lg:py-16">
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
            <GoldDivider className="my-10" />
          </Reveal>

          {historia.cierre.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="mt-6 font-display text-xl leading-relaxed text-ink/85 italic">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* El acta de fundación y la primera comisión directiva */}
      <section id="acta" className="scroll-mt-24 bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <Reveal>
              <figure>
                <img
                  src={actaUrl}
                  alt="Acta N° 1 del Club de Ajedrez Posadas, manuscrita el 12 de julio de 1926 en el Palace Hotel, con la distribución de cargos de la primera comisión directiva"
                  loading="lazy"
                  className="w-full rounded-lg border border-ink/10 shadow-[var(--shadow-lift)]"
                />
                <figcaption className="mt-3 text-xs text-ink/45">
                  Acta N.º 1, libro de actas del club.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="kicker text-gold-deep">12 de julio de 1926</p>
              <h2 className="mt-3 text-3xl text-ink lg:text-4xl">{comisionFundadora.titulo}</h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/70">
                {comisionFundadora.bajada}
              </p>

              <dl className="mt-8 divide-y divide-ink/8 border-t border-ink/8">
                {comisionFundadora.cargos.map((c) => (
                  <div key={c.cargo} className="grid grid-cols-[8rem_1fr] gap-4 py-2.5">
                    <dt className="kicker text-[0.58rem] text-ink/40">{c.cargo}</dt>
                    <dd className="text-[0.95rem] text-ink/85">
                      {c.nombre}
                      {c.aConfirmar ? (
                        <span className="ml-1 text-gold-deep" title="Pendiente de confirmación">
                          *
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-xs text-ink/45">{comisionFundadora.nota}</p>
            </Reveal>
          </div>

          {/* Cien años después, la otra comisión: el mismo gesto de dejar los
              nombres asentados, del libro de actas a una placa de bronce. */}
          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <Reveal>
              <p className="kicker text-gold-deep">12 de julio de 2026</p>
              <h2 className="mt-3 text-3xl text-ink lg:text-4xl">{comisionCentenario.titulo}</h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/70">
                {comisionCentenario.bajada}
              </p>

              <dl className="mt-8 divide-y divide-ink/8 border-t border-ink/8">
                {comisionCentenario.cargos.map((c) => (
                  <div
                    key={`${c.cargo}-${c.nombre}`}
                    className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4"
                  >
                    <dt className="kicker text-[0.58rem] text-ink/40">{c.cargo}</dt>
                    <dd className="text-[0.95rem] text-ink/85">{c.nombre}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <figure>
                <img
                  src={placaUrl}
                  alt="Placa conmemorativa del centenario del Club de Ajedrez Posadas, titulada Hogar de Ajedrecistas, con los nombres de la comisión directiva"
                  loading="lazy"
                  className="w-full rounded-lg border border-ink/10 shadow-[var(--shadow-lift)]"
                />
                <figcaption className="mt-3 text-xs text-ink/45">
                  “Hogar de Ajedrecistas”, en la sede de {club.direccion}.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* La década 2010-2019 según las crónicas que el club publicó en su momento */}
      <section id="decada" className="scroll-mt-24 bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeading
              kicker="2010 — 2019"
              titulo={decadaTorneos.titulo}
              bajada={decadaTorneos.bajada}
            />
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {decadaTorneos.destacados.map((t, i) => (
              <Reveal key={`${t.anio}-${t.nombre}`} delay={0.05 * (i % 2)}>
                <article className="flex h-full flex-col rounded-lg border border-ink/8 bg-white/70 p-6 transition-colors duration-500 hover:border-gold/45 lg:p-7">
                  <div className="flex items-baseline gap-3">
                    <p className="font-condensed text-3xl leading-none text-gold-deep">{t.anio}</p>
                    <p className="kicker text-[0.58rem] text-ink/40">{t.fecha}</p>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-ink">{t.nombre}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{t.texto}</p>

                  {/* El campeón cierra la ficha: es el dato que la crónica destacaba */}
                  <div className="mt-auto flex items-start gap-3 border-t border-ink/8 pt-5">
                    <ChessGlyph pieza={t.pieza as Pieza} className="mt-0.5 text-xl text-gold" />
                    <div>
                      <p className="text-[0.95rem] font-medium text-ink">Campeón: {t.campeon}</p>
                      <p className="mt-1 text-[0.88rem] leading-relaxed text-ink/60">{t.cierre}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* El resto de la serie, año por año */}
          <Reveal className="mt-11">
            <GoldDivider className="max-w-xs" />
            <p className="kicker mt-6 text-gold-deep">Y además</p>
            <dl className="mt-4 divide-y divide-ink/8 border-t border-ink/8">
              {decadaTorneos.serie.map((a) => (
                <div key={a.anio} className="grid gap-1 py-3 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <dt className="font-condensed text-xl leading-none text-gold-deep">{a.anio}</dt>
                  <dd className="text-[0.95rem] text-ink/70">{a.torneos.join(' · ')}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-ink/45">{decadaTorneos.nota}</p>
          </Reveal>

          {/* De 2020 en adelante el blog ya no publicaba: la fuente pasa a ser la
              planilla oficial de cada torneo. */}
          <Reveal className="mt-12">
            <p className="kicker text-gold-deep">{torneosRecientes.titulo}</p>
            <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-ink/70">
              {torneosRecientes.bajada}
            </p>

            <ul className="mt-7 divide-y divide-ink/8 border-t border-ink/8">
              {torneosRecientes.torneos.map((t) => (
                <li
                  key={`${t.anio}-${t.nombre}`}
                  className="grid gap-2 py-4 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-6"
                >
                  <p className="font-condensed text-2xl leading-none text-gold-deep">{t.anio}</p>
                  <div>
                    <p className="font-display text-lg leading-snug text-ink">{t.nombre}</p>
                    <p className="kicker mt-1 text-[0.55rem] text-ink/35">{t.detalle}</p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/60">{t.cierre}</p>
                  </div>
                  <p className="text-[0.95rem] text-ink sm:text-right">
                    <span className="font-medium">{t.campeon}</span>
                    {t.puntos ? (
                      <span className="mt-0.5 block text-xs text-gold-deep">
                        {t.puntos} puntos
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-ink/45">{torneosRecientes.nota}</p>
          </Reveal>
        </div>
      </section>

      {/* Línea del tiempo: los hitos del siglo */}
      <section
        id="hitos"
        className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-12 text-ivory lg:py-18"
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

          <ol className="relative mt-9 space-y-2">
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

          <Reveal className="mt-9 flex flex-wrap gap-4">
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
