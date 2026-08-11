import { Link } from 'react-router-dom'
import { MessageCircle, MapPin } from 'lucide-react'
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  CaballoIcon,
  PeonIcon,
  WhatsAppIcon,
} from './Icons'
import { club, navegacion } from '@/data/site'
import { BoardTexture, GoldDivider } from './Ornaments'

const redes = [
  { nombre: `Instagram @${club.instagram}`, href: club.instagramLink, Icono: InstagramIcon },
  { nombre: `Facebook /${club.facebook}`, href: club.facebookLink, Icono: FacebookIcon },
  { nombre: `X @${club.x}`, href: club.xLink, Icono: XIcon },
  { nombre: `YouTube @${club.youtube}`, href: club.youtubeLink, Icono: YouTubeIcon },
  { nombre: 'Equipo del club en Lichess', href: club.lichessLink, Icono: CaballoIcon },
  { nombre: 'Club del CAP en chess.com', href: club.chesscomLink, Icono: PeonIcon },
  { nombre: `WhatsApp ${club.whatsapp}`, href: club.whatsappLink, Icono: WhatsAppIcon },
] as const

export function Footer() {
  return (
    <footer className="bg-ink text-ivory relative isolate overflow-hidden">
      <BoardTexture className="text-ivory" size={38} opacity={0.04} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-4">
              <span className="bg-ivory grid size-14 shrink-0 place-items-center rounded-full">
                <img src="/logo-cap-96.webp" alt="" width={48} height={48} className="size-12" />
              </span>
              <div>
                <p className="font-display text-xl">{club.nombre}</p>
                <p className="kicker text-gold-bright mt-1 text-[0.6rem]">
                  1926 — 2026 · {club.lema}
                </p>
              </div>
            </div>
            <p className="text-ivory/60 mt-4 max-w-sm text-[0.85rem] leading-relaxed">
              Institución deportiva y cultural centenaria de {club.ciudad}, {club.provincia}.
              Personería jurídica {club.personeriaJuridica}.
            </p>

            {/* Redes del club. Con siete ya no entran en una línea de celular. */}
            <ul className="mt-5 flex flex-wrap items-center gap-2.5">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={r.nombre}
                    title={r.nombre}
                    className="border-ivory/15 text-ivory/70 hover:border-gold/60 hover:bg-gold/10 hover:text-gold-bright grid size-11 place-items-center rounded-full border transition-all duration-300"
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
                  <Link
                    to={item.href}
                    className="text-ivory/70 hover:text-gold-bright transition-colors"
                  >
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
                  className="text-ivory/70 hover:text-gold-bright inline-flex items-center gap-3 transition-colors"
                >
                  <MessageCircle className="text-gold size-4" />
                  WhatsApp {club.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={club.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory/70 hover:text-gold-bright inline-flex items-center gap-3 transition-colors"
                >
                  <InstagramIcon className="text-gold size-4" />@{club.instagram}
                </a>
              </li>
              <li>
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory/70 hover:text-gold-bright inline-flex items-start gap-3 transition-colors"
                >
                  <MapPin className="text-gold mt-0.5 size-4" />
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

        <div className="text-ivory/40 mt-5 flex flex-col items-center justify-between gap-2 text-xs sm:flex-row">
          <p>
            © {club.anioFundacion}–{new Date().getFullYear()} {club.nombre}. Todos los derechos
            reservados.
          </p>
          <p className="kicker text-[0.6rem]">Cien años de ajedrez, comunidad y futuro</p>
        </div>
      </div>
    </footer>
  )
}
