import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight, MapPin } from 'lucide-react'
import { club, cifras } from '@/data/site'
import { Button } from './ui/button'
import { BoardTexture, GraphiteCurves, GoldDivider } from './Ornaments'

export function Hero() {
  /** Entrada escalonada por CSS: la clase trae la curva y el delay va por estilo. */
  const aparece = (delay: number) => ({
    style: { animationDelay: `${delay}s` },
  })

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink text-ivory">
      <BoardTexture className="text-ivory" size={52} opacity={0.05} animate />
      <GraphiteCurves />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(192,145,44,0.16),transparent_58%)]" />

      {/* Numeral del centenario como marca de agua */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-[-6%] font-display text-[34rem] leading-none font-semibold text-ivory/[0.035] select-none lg:text-[46rem]"
      >
        100
      </span>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-28 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:pt-32 lg:pb-20">
        <div>
          <p {...aparece(0.05)} className="kicker text-gold-bright motion-safe:animate-entrar">
            {club.ciudad}, {club.provincia} · desde 1926
          </p>

          <h1
            {...aparece(0.15)}
            className="mt-4 text-[2.9rem] leading-[0.95] font-medium motion-safe:animate-entrar sm:text-6xl lg:text-[5rem]"
          >
            Cien años
            <span className="block text-gold-gradient">de ajedrez</span>
            <span className="mt-2 block font-sans text-base font-light tracking-[0.2em] text-ivory/60 uppercase sm:text-lg">
              en el corazón de Misiones
            </span>
          </h1>

          <div {...aparece(0.28)} className="motion-safe:animate-entrar">
            <GoldDivider className="mt-6 max-w-md" />
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ivory/75">
              El primer club dedicado exclusivamente al ajedrez en la provincia. Fundado el{' '}
              {club.fundacion} en el Palace Hotel, con sede propia desde 1980 y las puertas abiertas
              seis días por semana para chicos, jóvenes y adultos.
            </p>
          </div>

          <div {...aparece(0.4)} className="mt-6 flex flex-wrap items-center gap-4 motion-safe:animate-entrar">
            <Button asChild size="lg" variant="gold">
              <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle />
                Sumate a los talleres
              </a>
            </Button>
            <Button asChild size="lg" variant="outlineLight">
              <Link to="/historia">
                Conocé los 100 años
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <a
            {...aparece(0.5)}
            href={club.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ivory/55 transition-colors hover:text-gold-bright motion-safe:animate-entrar"
          >
            <MapPin className="size-4" />
            {club.direccion} · {club.ciudad}, {club.provincia}
          </a>
        </div>

        {/* Medallón del centenario */}
        <div
          style={{ animationDelay: '0.25s' }}
          className="relative mx-auto w-full max-w-[13rem] motion-safe:animate-acercar sm:max-w-xs lg:max-w-none"
        >
          <div className="relative aspect-square">
            {/* El arco dorado gira por CSS, no por Framer Motion: animarlo en JS
                mantenía un requestAnimationFrame vivo en el main thread para
                siempre, incluso con el Hero fuera de pantalla. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold/25 [will-change:transform] motion-safe:animate-girar"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0 78%, rgba(226,189,94,0.5) 86%, transparent 94%)',
              }}
            />
            <div className="absolute inset-5 rounded-full bg-ivory shadow-[0_40px_120px_-40px_rgba(226,189,94,0.55)]" />
            {/* El logo va dentro de su propio marco para quedar centrado en el
                disco marfil: con size-auto el SVG se salía del recuadro. */}
            <div className="absolute inset-7">
              <img
                src="/logo-cap-640.webp"
                alt="Escudo del Club de Ajedrez Posadas con el sello de los 100 años (1926-2026)"
                className="size-full object-contain"
                width={640}
                height={640}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cifras institucionales. En el flujo y empujadas al fondo con mt-auto:
          como capa absoluta se le montaba encima al medallón en mobile. */}
      <div className="relative mt-auto w-full border-t border-ivory/10 bg-ink/70">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-ivory/10 px-5 lg:grid-cols-4 lg:divide-x lg:px-8">
          {cifras.map((c, i) => (
            <div
              key={c.detalle}
              {...aparece(0.55 + i * 0.08)}
              className="px-2 py-3 motion-safe:animate-entrar lg:px-8 lg:py-4"
            >
              <dt className="font-condensed text-3xl text-gold-bright lg:text-4xl">
                {c.valor}
                {c.unidad ? <span className="ml-1 text-base text-ivory/50">{c.unidad}</span> : null}
              </dt>
              <dd className="mt-0.5 text-xs leading-snug text-ivory/55 lg:text-[0.8rem]">
                <span className="sm:hidden">{c.corto}</span>
                <span className="hidden sm:inline">{c.detalle}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
