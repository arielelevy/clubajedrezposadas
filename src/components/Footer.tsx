import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, MapPin } from 'lucide-react'
import { club, navegacion } from '@/data/site'
import { BoardTexture, GoldDivider } from './Ornaments'

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-ivory">
      <BoardTexture className="text-ivory" size={38} opacity={0.04} animate={false} />

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-full bg-ivory">
                <img src="/logo-cap.svg" alt="" className="size-14" />
              </span>
              <div>
                <p className="font-display text-2xl">{club.nombre}</p>
                <p className="kicker mt-1 text-[0.65rem] text-gold-bright">1926 — 2026 · {club.lema}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
              Institución deportiva y cultural centenaria de {club.ciudad}, {club.provincia}. Personería
              jurídica {club.personeriaJuridica}.
            </p>
          </div>

          <nav>
            <p className="kicker text-ivory/40">Secciones</p>
            <ul className="mt-5 space-y-3 text-sm">
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
            <ul className="mt-5 space-y-4 text-sm">
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
                  <Instagram className="size-4 text-gold" />
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
                    {club.ciudad}, {club.provincia}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <GoldDivider className="mt-14" />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-ivory/40 sm:flex-row">
          <p>
            © {club.anioFundacion}–{new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.
          </p>
          <p className="kicker text-[0.6rem]">Cien años de ajedrez, comunidad y futuro</p>
        </div>
      </div>
    </footer>
  )
}
