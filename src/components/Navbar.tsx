import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, MessageCircle, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import { club, navegacion } from '@/data/site'
import { festival } from '@/data/festival'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

/**
 * El menú mezclaba secciones del home (`/#algo`) con páginas propias. En el
 * panel de mobile se separan, que es una distinción real: unas te mueven dentro
 * de la página y las otras te llevan a otra.
 */
const grupos = [
  {
    titulo: 'En el inicio',
    items: navegacion.filter((i) => i.href.startsWith('/#')),
  },
  {
    titulo: 'Páginas',
    items: navegacion.filter((i) => !i.href.startsWith('/#')),
  },
].filter((g) => g.items.length > 0)

/**
 * Resistencia para desplegar el aviso, ya en el tope. No se puede medir con el
 * scroll: en `y = 0` la página no se mueve más y dejan de llegar eventos, así
 * que los píxeles se cuentan sobre la rueda y el arrastre del dedo, que siguen
 * llegando cuando uno insiste hacia arriba contra el tope.
 */
const RESISTENCIA_RUEDA = 380 // cuatro golpes de rueda, más o menos
const RESISTENCIA_TACTIL = 150 // un tirón sostenido del dedo

/** Hasta acá se considera que la página está en el tope. */
const TOPE = 24

export function Navbar() {
  /**
   * El aviso del centenario aparece cuando volvés al tope subiendo, y se
   * retrae al bajar. No se muestra en la carga: la barra tiene que verse igual
   * desde el primer momento, sin depender de dónde quedó el scroll.
   */
  const [avisoVisible, setAvisoVisible] = useState(false)
  const [open, setOpen] = useState(false)
  // En el tope de la página (hasta TOPE px). Se usa solo en el festival, cuya
  // portada es oscura: ahí la barra clara ensuciaba el hero.
  const [enTope, setEnTope] = useState(() => window.scrollY <= TOPE)
  const { pathname, hash } = useLocation()

  const enFestival = pathname === '/festival'

  /**
   * En el festival el aviso no corre: es la invitación a esta misma página, y
   * al desplegarse la barra crecía y se montaba sobre el texto del hero.
   */
  const avisoDesplegado = avisoVisible && !enFestival

  /**
   * El festival abre con un bloque oscuro a pantalla completa: la barra arranca
   * transparente sobre él y recién al scrollear pasa al look claro. Solo esa
   * ruta: el resto de las páginas abre sobre fondo claro y la barra clara queda
   * bien desde el primer píxel.
   */
  const sobreOscuro = avisoDesplegado || (enFestival && enTope)

  useEffect(() => {
    let anterior = window.scrollY
    let acumulado = 0
    let dedo: number | null = null

    const enTope = () => window.scrollY <= TOPE

    // Bajar retrae el aviso y borra lo acumulado: la insistencia arranca de cero.
    // Se pide `y > TOPE` porque el rebote de iOS vuelve de un scroll negativo a 0
    // sin que nadie haya bajado nada, y eso cerraba el aviso recién abierto.
    const onScroll = () => {
      const y = window.scrollY
      setEnTope(y <= TOPE)
      if (y > anterior && y > TOPE) {
        acumulado = 0
        setAvisoVisible(false)
      }
      anterior = y
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY >= 0) {
        acumulado = 0
        return
      }
      if (!enTope()) return
      // deltaMode 1 son líneas, no píxeles (Firefox).
      acumulado += e.deltaMode === 1 ? -e.deltaY * 16 : -e.deltaY
      if (acumulado >= RESISTENCIA_RUEDA) setAvisoVisible(true)
    }

    const onTouchStart = (e: TouchEvent) => {
      dedo = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      const actual = e.touches[0]?.clientY
      if (actual == null || dedo == null) return

      // El dedo bajando arrastra la página hacia arriba.
      const arrastre = actual - dedo
      dedo = actual

      if (arrastre < 0) {
        acumulado = 0
        return
      }
      if (!enTope() || arrastre === 0) return

      acumulado += arrastre
      if (acumulado >= RESISTENCIA_TACTIL) setAvisoVisible(true)
    }

    const onTouchEnd = () => {
      dedo = null
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Se incluye el hash: elegir una sección del inicio no cambia el pathname,
  // así que el panel de mobile quedaba abierto tapando la sección elegida.
  useEffect(() => {
    setOpen(false)
    setAvisoVisible(false)
  }, [pathname, hash])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        // Transparente cuando se apoya sobre un bloque oscuro: con el aviso
        // desplegado, o en el tope del festival. En el festival vuelve al look
        // claro al scrollear, así nunca queda el menú negro sobre negro.
        sobreOscuro ? 'bg-transparent' : 'border-ink/8 bg-bone/95 border-b backdrop-blur-sm',
      )}
    >
      {/* Aviso del evento del centenario. Lleva a la página del festival, no a
          la sección del inicio: quien insiste hacia arriba para abrirlo ya está
          buscando el torneo, y la página tiene la información completa. */}
      {festival.publicado && !enFestival ? (
        <Link
          to="/festival"
          className={cn(
            'group border-gold/20 bg-ink block overflow-hidden transition-all duration-500',
            avisoDesplegado
              ? 'max-h-24 border-b opacity-100'
              : 'pointer-events-none max-h-0 opacity-0',
          )}
        >
          <span className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-5 py-2.5 lg:px-8">
            <span aria-hidden="true" className="bg-gold-bright size-1.5 shrink-0 rotate-45" />
            <span className="font-condensed text-gold-bright text-[0.68rem] leading-tight tracking-[0.2em] uppercase sm:text-[0.8rem] sm:tracking-[0.28em]">
              {festival.avisoSuperior}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="text-gold-bright/60 size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </Link>
      ) : null}

      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-500 lg:px-8',
          avisoDesplegado ? 'py-3' : 'py-2',
        )}
      >
        <Link to="/" className="group flex items-center gap-3">
          <span className="bg-ivory grid size-11 place-items-center rounded-full">
            <img src="/logo-cap-96.webp" alt="" width={36} height={36} className="size-9" />
          </span>
          <span className="leading-tight">
            <span
              className={cn(
                'font-display block text-[1.05rem] font-semibold tracking-tight whitespace-nowrap transition-colors duration-500 sm:text-[1.3rem]',
                sobreOscuro ? 'text-ivory' : 'text-ink',
              )}
            >
              Club de Ajedrez Posadas
            </span>
            {/* El tracking ancho del kicker partía la línea en dos en mobile */}
            <span
              className={cn(
                'kicker block text-[0.6rem] tracking-[0.2em] whitespace-nowrap transition-colors duration-500 sm:text-[0.68rem] sm:tracking-[0.34em]',
                sobreOscuro ? 'text-gold-bright/90' : 'text-gold-deep',
              )}
            >
              1926 — 2026<span className="hidden sm:inline"> · Centenario</span>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'after:bg-gold relative py-1 text-[0.95rem] transition-colors duration-500 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100',
                sobreOscuro ? 'text-ivory/85 hover:text-ivory' : 'text-ink/75 hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" variant={sobreOscuro ? 'outlineLight' : 'gold'}>
            <a href={club.whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle />
              Escribinos
            </a>
          </Button>
        </nav>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className={cn(
                'grid size-11 place-items-center rounded-full border transition-colors duration-500 lg:hidden',
                sobreOscuro
                  ? 'border-ivory/30 text-ivory'
                  : 'border-ink/15 text-ink hover:border-gold hover:text-gold-deep',
              )}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-ink/70 fixed inset-0 z-50 backdrop-blur-sm" />
            <Dialog.Content className="bg-ink text-ivory fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[21rem] flex-col shadow-2xl">
              {/* Identidad, en lugar de un "Menú" a secas */}
              <div className="border-ivory/10 flex items-start justify-between gap-4 border-b px-6 py-5">
                <Dialog.Title asChild>
                  <div className="flex items-center gap-3">
                    <span className="bg-ivory grid size-10 shrink-0 place-items-center rounded-full">
                      <img
                        src="/logo-cap-96.webp"
                        alt=""
                        width={32}
                        height={32}
                        className="size-8"
                      />
                    </span>
                    <span className="leading-tight">
                      <span className="font-display block text-[1.05rem] font-semibold">
                        {club.nombre}
                      </span>
                      <span className="kicker text-gold-bright/90 block text-[0.58rem]">
                        1926 — 2026
                      </span>
                    </span>
                  </div>
                </Dialog.Title>
                <Dialog.Close className="border-ivory/20 hover:border-gold/60 hover:text-gold-bright grid size-10 shrink-0 place-items-center rounded-full border transition-colors">
                  <X className="size-5" />
                  <span className="sr-only">Cerrar</span>
                </Dialog.Close>
              </div>

              {/* Navegación: scrollea sola, así el contacto nunca se va de pantalla */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                {grupos.map((grupo, i) => (
                  <div key={grupo.titulo} className={i > 0 ? 'mt-8' : undefined}>
                    <p className="kicker text-ivory/35 text-[0.58rem]">{grupo.titulo}</p>
                    <ul className="mt-3">
                      {grupo.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            // Cierra también cuando se elige la sección en la
                            // que ya estás, donde la ubicación no cambia.
                            onClick={() => setOpen(false)}
                            className="border-ivory/8 text-ivory/85 hover:text-gold-bright flex items-center justify-between gap-3 border-b py-3.5 text-[1.05rem] font-medium transition-colors"
                          >
                            {item.label}
                            <ChevronRight className="text-ivory/25 size-4 shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <div className="border-ivory/10 shrink-0 space-y-4 border-t px-6 py-5">
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ivory/60 hover:text-gold-bright flex items-start gap-2.5 text-sm transition-colors"
                >
                  <MapPin className="text-gold mt-0.5 size-4 shrink-0" />
                  <span>
                    {club.direccion} · {club.ciudad}
                  </span>
                </a>
                <Button asChild variant="gold" className="w-full">
                  <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    WhatsApp {club.whatsapp}
                  </a>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}
