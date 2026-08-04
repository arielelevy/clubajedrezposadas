import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { InstagramIcon } from '@/components/Icons'
import { club, faq } from '@/data/site'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-bone py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              kicker="Contacto"
              titulo="La casa del ajedrez en Posadas"
              bajada="Vení a conocer la sede de Jujuy 1514 en cualquiera de los horarios de taller, o escribinos antes si preferís coordinar."
            />

            <Reveal delay={0.1} className="mt-10 space-y-4">
              <a
                href={club.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 rounded-lg border border-ink/8 bg-white/70 p-5 transition-all hover:border-gold/45"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>
                  <span className="block font-medium text-ink">
                    {club.direccion} — {club.codigoPostal} {club.ciudad}, {club.provincia}
                  </span>
                  <span className="mt-1 block text-sm text-ink/60">Sede propia del club desde 1980</span>
                </span>
              </a>

              <a
                href={club.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 rounded-lg border border-ink/8 bg-white/70 p-5 transition-all hover:border-gold/45"
              >
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>
                  <span className="block font-medium text-ink">WhatsApp {club.whatsapp}</span>
                  <span className="mt-1 block text-sm text-ink/60">
                    Consultas por talleres, torneos y cómo asociarse
                  </span>
                </span>
              </a>

              <a
                href={club.instagramLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 rounded-lg border border-ink/8 bg-white/70 p-5 transition-all hover:border-gold/45"
              >
                <InstagramIcon className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>
                  <span className="block font-medium text-ink">@{club.instagram}</span>
                  <span className="mt-1 block text-sm text-ink/60">
                    Novedades, torneos y resultados del club
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4 rounded-lg border border-ink/8 bg-white/70 p-5">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>
                  <span className="block font-medium text-ink">Lunes a viernes de 17:00 a 21:30 hs</span>
                  <span className="mt-1 block text-sm text-ink/60">Sábados de 09:00 a 11:30 hs</span>
                </span>
              </div>

              <Button asChild variant="gold" size="lg" className="w-full">
                <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle />
                  Escribinos por WhatsApp
                </a>
              </Button>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <div className="overflow-hidden rounded-lg border border-ink/8 bg-ink/5">
                <iframe
                  src={club.mapsEmbed}
                  title={`Mapa de la sede del ${club.nombre} en ${club.direccion}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-16/10 w-full border-0 grayscale-[35%]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
              <p className="kicker text-gold-deep">Preguntas frecuentes</p>
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
        </div>
      </div>
    </section>
  )
}
