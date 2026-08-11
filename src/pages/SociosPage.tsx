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
            <span className="text-gold-gradient block">centenario</span>
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

      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          {/* Título y bajada en una línea: "Tres pasos" solo no justificaba
              ocupar el alto de un titular de sección. */}
          <Reveal className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h2 className="text-ink text-3xl lg:text-4xl">Cómo asociarse</h2>
            <p className="kicker text-gold-deep">en tres pasos</p>
          </Reveal>

          <ol className="mt-9 grid gap-5 md:grid-cols-3">
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
                    className="group border-ink/8 hover:border-gold/45 flex h-full flex-col rounded-lg border bg-white/70 p-6 transition-all duration-500 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-condensed text-gold text-4xl leading-none">
                        {p.paso}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="text-gold/45 group-hover:text-gold size-5 shrink-0 transition-all duration-300 group-hover:translate-x-1"
                      />
                    </span>
                    <h3 className="font-display text-ink mt-4 text-2xl">{p.titulo}</h3>
                    <p className="text-ink/65 mt-2 text-[0.95rem] leading-relaxed">{p.texto}</p>
                  </a>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="border-ink/8 bg-ivory mt-9 grid gap-6 rounded-lg border p-8 lg:grid-cols-2 lg:p-10">
              <div>
                <h3 className="font-display text-ink text-2xl">Formulario de alta de socio</h3>
                <p className="text-ink/65 mt-3 text-[0.95rem] leading-relaxed">
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
                <p className="text-ink/50 mt-4 text-sm">
                  Si elegís el PDF, completalo y acercalo a la sede o envialo por WhatsApp.
                </p>
              </div>
              <div className="border-ink/8 bg-bone rounded-md border p-6">
                <p className="kicker text-gold-deep">Dónde entregarlo</p>
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:text-gold-deep mt-4 flex items-start gap-3 transition-colors"
                >
                  <MapPin className="text-gold mt-0.5 size-5 shrink-0" />
                  <span>
                    <span className="block font-medium">{club.direccion}</span>
                    <span className="text-ink/60 text-sm">
                      {club.ciudad}, {club.provincia}
                    </span>
                  </span>
                </a>
                <p className="text-ink/60 mt-5 text-sm">
                  Lunes a viernes de 17:00 a 21:30 hs · Sábados de 09:00 a 11:30 hs
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 max-w-3xl">
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
        className="bg-ink text-ivory relative isolate scroll-mt-24 overflow-hidden py-12 lg:py-16"
      >
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(192,145,44,0.16),transparent_58%)]" />

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
            <Reveal>
              <p className="kicker text-gold-bright">{proyectos.kicker}</p>
              <h2 className="text-ivory mt-5 text-4xl leading-[1.06] lg:text-5xl">
                {proyectos.titulo}
              </h2>
              <GoldDivider className="mt-8 max-w-sm" />
              <p className="text-ivory/70 mt-8 text-lg leading-relaxed">{proyectos.bajada}</p>
              <p className="text-ivory/50 mt-5 text-sm leading-relaxed">{proyectos.nota}</p>
              <Button asChild variant="gold" size="lg" className="mt-9">
                <a href={club.formularioProyectos} target="_blank" rel="noreferrer">
                  {proyectos.cta}
                  <ArrowRight />
                </a>
              </Button>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="border-ivory/12 bg-graphite/60 rounded-lg border p-8 backdrop-blur-sm lg:p-10">
                <div className="flex items-center gap-3">
                  <Lightbulb className="text-gold-bright size-5" />
                  <p className="kicker text-ivory/50 text-[0.62rem]">Qué tipo de propuestas</p>
                </div>
                <ul className="mt-7 space-y-4">
                  {proyectos.ejemplos.map((e) => (
                    <li
                      key={e}
                      className="border-ivory/8 text-ivory/80 flex gap-4 border-b pb-4 text-[0.95rem] leading-snug last:border-b-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-gold-bright mt-1.5 size-1.5 shrink-0 rotate-45"
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
