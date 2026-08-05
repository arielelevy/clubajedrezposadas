import { Link } from 'react-router-dom'
import { MessageCircle, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon, XIcon, WhatsAppIcon } from './Icons'
import { club, navegacion } from '@/data/site'
import { BoardTexture, GoldDivider } from './Ornaments'

const redes = [
  { nombre: `Instagram @${club.instagram}`, href: club.instagramLink, Icono: InstagramIcon },
  { nombre: `Facebook /${club.facebook}`, href: club.facebookLink, Icono: FacebookIcon },
  { nombre: `X @${club.x}`, href: club.xLink, Icono: XIcon },
  { nombre: `WhatsApp ${club.whatsapp}`, href: club.whatsappLink, Icono: WhatsAppIcon },
] as const

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-ivory">
      <BoardTexture className="text-ivory" size={38} opacity={0.04} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ivory">
                <img src="/logo-cap-96.webp" alt="" width={48} height={48} className="size-12" />
              </span>
              <div>
                <p className="font-display text-xl">{club.nombre}</p>
                <p className="kicker mt-1 text-[0.6rem] text-gold-bright">1926 — 2026 · {club.lema}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[0.85rem] leading-relaxed text-ivory/60">
              Institución deportiva y cultural centenaria de {club.ciudad}, {club.provincia}. Personería
              jurídica {club.personeriaJuridica}.
            </p>

            {/* Redes del club */}
            <ul className="mt-5 flex items-center gap-2.5">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={r.nombre}
                    title={r.nombre}
                    className="grid size-11 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold-bright"
                  >
                    <r.Icono className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav>
            <p className="kicker text-ivory/40">Secciones</p>
            <ul className="mt-4 space-y-2 text-sm">
              {navegacion.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-ivory/70 transition-colors hover:text-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="kicker text-ivory/40">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={club.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold-bright"
                >
                  <MessageCircle className="size-4 text-gold" />
                  WhatsApp {club.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={club.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold-bright"
                >
                  <InstagramIcon className="size-4 text-gold" />
                  @{club.instagram}
                </a>
              </li>
              <li>
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-3 text-ivory/70 transition-colors hover:text-gold-bright"
                >
                  <MapPin className="mt-0.5 size-4 text-gold" />
                  <span>
                    {club.direccion}
                    <br />
                    {club.codigoPostal} {club.ciudad}, {club.provincia}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <GoldDivider className="mt-9" />

        <div className="mt-5 flex flex-col items-center justify-between gap-2 text-xs text-ivory/40 sm:flex-row">
          <p>
            © {club.anioFundacion}–{new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.
          </p>
          <p className="kicker text-[0.6rem]">Cien años de ajedrez, comunidad y futuro</p>
        </div>
      </div>
    </footer>
  )
}
