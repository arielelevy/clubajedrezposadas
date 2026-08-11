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
    <section id="contacto" className="bg-bone scroll-mt-24 py-12 lg:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              kicker="Contacto"
              titulo="La casa del ajedrez en Posadas"
              bajada="Vení a conocer la sede de Jujuy 1514 en cualquiera de los horarios de taller, o escribinos antes si preferís coordinar."
            />

            <Reveal delay={0.1} className="mt-8 space-y-4">
              <a
                href={club.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="border-ink/8 hover:border-gold/45 flex items-start gap-4 rounded-lg border bg-white/70 p-5 transition-all"
              >
                <MapPin className="text-gold mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="text-ink block font-medium">
                    {club.direccion} — {club.codigoPostal} {club.ciudad}, {club.provincia}
                  </span>
                  <span className="text-ink/60 mt-1 block text-sm">
                    Sede propia del club desde 1980
                  </span>
                </span>
              </a>

              <a
                href={club.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="border-ink/8 hover:border-gold/45 flex items-start gap-4 rounded-lg border bg-white/70 p-5 transition-all"
              >
                <MessageCircle className="text-gold mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="text-ink block font-medium">WhatsApp {club.whatsapp}</span>
                  <span className="text-ink/60 mt-1 block text-sm">
                    Consultas por talleres, torneos y cómo asociarse
                  </span>
                </span>
              </a>

              <a
                href={club.instagramLink}
                target="_blank"
                rel="noreferrer"
                className="border-ink/8 hover:border-gold/45 flex items-start gap-4 rounded-lg border bg-white/70 p-5 transition-all"
              >
                <InstagramIcon className="text-gold mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="text-ink block font-medium">@{club.instagram}</span>
                  <span className="text-ink/60 mt-1 block text-sm">
                    Novedades, torneos y resultados del club
                  </span>
                </span>
              </a>

              <div className="border-ink/8 flex items-start gap-4 rounded-lg border bg-white/70 p-5">
                <Clock className="text-gold mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="text-ink block font-medium">
                    Lunes a viernes de 17:00 a 21:30 hs
                  </span>
                  <span className="text-ink/60 mt-1 block text-sm">
                    Sábados de 09:00 a 11:30 hs
                  </span>
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
              <div className="border-ink/8 bg-ink/5 overflow-hidden rounded-lg border">
                <iframe
                  src={club.mapsEmbed}
                  title={`Mapa de la sede del ${club.nombre} en ${club.direccion}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-16/10 w-full border-0 grayscale-[35%]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-9">
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
