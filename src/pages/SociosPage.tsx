import { Download, MessageCircle, MapPin, ArrowRight, Lightbulb } from 'lucide-react'
import { club, pasosSocio, faq, proyectos } from '@/data/site'
import { hayPadron } from '@/data/socios'
import { PadronDialog } from '@/components/Padron'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { BoardTexture, GoldDivider } from '@/components/Ornaments'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function SociosPage() {
  return (
    <>
      <PageHeader
        kicker="Socios"
        titulo={
          <>
            Ser socio de un club
            <span className="block text-gold-gradient">centenario</span>
          </>
        }
        bajada="Asociarte es sostener una institución que lleva cien años abriendo sus puertas. Y es, además, la forma de entrar a todos los talleres, torneos internos y actividades del club."
      >
        <Button asChild variant="gold" size="lg">
          <a href={club.formularioSocios} target="_blank" rel="noreferrer">
            Asociarme online
            <ArrowRight />
          </a>
        </Button>
        {hayPadron ? <PadronDialog /> : null}
        <Button asChild variant="outlineLight" size="lg">
          <a href={club.whatsappLink} target="_blank" rel="noreferrer">
            <MessageCircle />
            WhatsApp {club.whatsapp}
          </a>
        </Button>
      </PageHeader>

      <section className="bg-bone py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="kicker text-gold-deep">Cómo asociarse</p>
            <h2 className="mt-4 text-4xl text-ink lg:text-5xl">Tres pasos</h2>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {pasosSocio.map((p, i) => (
              <Reveal key={p.paso} delay={0.08 * i}>
                <li className="h-full">
                  {/* La tarjeta entera es el enlace: el paso ya dice qué hace,
                      no hace falta repetirlo como texto de link aparte. */}
                  <a
                    href={p.enlace.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.titulo} — ${p.enlace.texto}`}
                    className="group flex h-full flex-col rounded-lg border border-ink/8 bg-white/70 p-7 transition-all duration-500 hover:border-gold/45 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="font-condensed text-5xl leading-none text-gold">
                        {p.paso}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="mt-2 size-5 shrink-0 text-gold/45 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                      />
                    </span>
                    <h3 className="mt-5 font-display text-2xl text-ink">{p.titulo}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">{p.texto}</p>
                  </a>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-16 grid gap-6 rounded-lg border border-ink/8 bg-ivory p-8 lg:grid-cols-2 lg:p-10">
              <div>
                <h3 className="font-display text-2xl text-ink">Formulario de alta de socio</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">
                  La forma más rápida es el formulario online: lo completás desde el celular en dos
                  minutos y el club te contacta para terminar el alta.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild variant="gold">
                    <a href={club.formularioSocios} target="_blank" rel="noreferrer">
                      Completar el formulario
                      <ArrowRight />
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <a href="/docs/solicitud-alta-socio.pdf" target="_blank" rel="noreferrer">
                      <Download />
                      Prefiero el PDF
                    </a>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-ink/50">
                  Si elegís el PDF, completalo y acercalo a la sede o envialo por WhatsApp.
                </p>
              </div>
              <div className="rounded-md border border-ink/8 bg-bone p-6">
                <p className="kicker text-gold-deep">Dónde entregarlo</p>
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-start gap-3 text-ink transition-colors hover:text-gold-deep"
                >
                  <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    <span className="block font-medium">{club.direccion}</span>
                    <span className="text-sm text-ink/60">
                      {club.ciudad}, {club.provincia}
                    </span>
                  </span>
                </a>
                <p className="mt-5 text-sm text-ink/60">
                  Lunes a viernes de 17:00 a 21:30 hs · Sábados de 09:00 a 11:30 hs
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-16 max-w-3xl">
            <p className="kicker text-gold-deep">Antes de venir</p>
            <Accordion type="single" collapsible className="mt-6">
              {faq.map((f) => (
                <AccordionItem key={f.pregunta} value={f.pregunta}>
                  <AccordionTrigger>{f.pregunta}</AccordionTrigger>
                  <AccordionContent>{f.respuesta}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>


      {/* Convocatoria abierta a presentar proyectos */}
      <section
        id="proyectos"
        className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-20 text-ivory lg:py-28"
      >
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(192,145,44,0.16),transparent_58%)]" />

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
            <Reveal>
              <p className="kicker text-gold-bright">{proyectos.kicker}</p>
              <h2 className="mt-5 text-4xl leading-[1.06] text-ivory lg:text-5xl">
                {proyectos.titulo}
              </h2>
              <GoldDivider className="mt-8 max-w-sm" />
              <p className="mt-8 text-lg leading-relaxed text-ivory/70">{proyectos.bajada}</p>
              <p className="mt-5 text-sm leading-relaxed text-ivory/50">{proyectos.nota}</p>
              <Button asChild variant="gold" size="lg" className="mt-9">
                <a href={club.formularioProyectos} target="_blank" rel="noreferrer">
                  {proyectos.cta}
                  <ArrowRight />
                </a>
              </Button>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-lg border border-ivory/12 bg-graphite/60 p-8 backdrop-blur-sm lg:p-10">
                <div className="flex items-center gap-3">
                  <Lightbulb className="size-5 text-gold-bright" />
                  <p className="kicker text-[0.62rem] text-ivory/50">Qué tipo de propuestas</p>
                </div>
                <ul className="mt-7 space-y-4">
                  {proyectos.ejemplos.map((e) => (
                    <li
                      key={e}
                      className="flex gap-4 border-b border-ivory/8 pb-4 text-[0.95rem] leading-snug text-ivory/80 last:border-b-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gold-bright"
                      />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
