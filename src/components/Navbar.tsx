import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, MessageCircle, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import { club, navegacion, eventoCentenario } from '@/data/site'
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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // Todas las rutas arrancan con un bloque oscuro (Hero o PageHeader),
  // así que mientras la barra es transparente el contenido va en marfil.
  const sobreOscuro = !scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'border-b border-ink/8 bg-bone/95 py-2 backdrop-blur-sm' : 'py-4',
      )}
    >
      {/* Aviso del evento del centenario: solo con la barra transparente, se
          retrae al scrollear para no robarle altura a la navegación. */}
      {eventoCentenario.publicado ? (
        <Link
          to="/#evento"
          className={cn(
            'group block overflow-hidden border-b border-gold/20 bg-ink/95 transition-all duration-500',
            scrolled ? 'pointer-events-none max-h-0 border-b-0 opacity-0' : 'max-h-24 opacity-100',
          )}
        >
          <span className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-5 py-2.5 lg:px-8">
            <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold-bright" />
            <span className="font-condensed text-[0.68rem] leading-tight tracking-[0.2em] text-gold-bright uppercase sm:text-[0.8rem] sm:tracking-[0.28em]">
              {eventoCentenario.avisoSuperior}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-gold-bright/60 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </Link>
      ) : null}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span
            className={cn(
              'grid place-items-center rounded-full transition-all duration-500',
              scrolled ? 'size-11 bg-ivory' : 'size-13 bg-ivory shadow-[var(--shadow-gold)]',
            )}
          >
            <img
              src="/logo-cap.svg"
              alt=""
              className={cn('transition-all duration-500', scrolled ? 'size-9' : 'size-11')}
            />
          </span>
          <span className="leading-tight">
            <span
              className={cn(
                'block font-display text-[1.2rem] font-semibold tracking-tight transition-colors sm:text-[1.35rem]',
                sobreOscuro ? 'text-ivory' : 'text-ink',
              )}
            >
              Club de Ajedrez Posadas
            </span>
            <span
              className={cn(
                'kicker block text-[0.68rem] transition-colors',
                sobreOscuro ? 'text-gold-bright/90' : 'text-gold-deep',
              )}
            >
              1926 — 2026 · Centenario
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative py-1 text-[0.95rem] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100',
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
                'grid size-11 place-items-center rounded-full border transition-colors lg:hidden',
                sobreOscuro ? 'border-ivory/30 text-ivory' : 'border-ink/15 text-ink',
              )}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[21rem] flex-col bg-ink text-ivory shadow-2xl">
              {/* Identidad, en lugar de un "Menú" a secas */}
              <div className="flex items-start justify-between gap-4 border-b border-ivory/10 px-6 py-5">
                <Dialog.Title asChild>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ivory">
                      <img src="/logo-cap.svg" alt="" className="size-8" />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-[1.05rem] font-semibold">
                        {club.nombre}
                      </span>
                      <span className="kicker block text-[0.58rem] text-gold-bright/90">
                        1926 — 2026
                      </span>
                    </span>
                  </div>
                </Dialog.Title>
                <Dialog.Close className="grid size-10 shrink-0 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-gold/60 hover:text-gold-bright">
                  <X className="size-5" />
                  <span className="sr-only">Cerrar</span>
                </Dialog.Close>
              </div>

              {/* Navegación: scrollea sola, así el contacto nunca se va de pantalla */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
                {grupos.map((grupo, i) => (
                  <div key={grupo.titulo} className={i > 0 ? 'mt-8' : undefined}>
                    <p className="kicker text-[0.58rem] text-ivory/35">{grupo.titulo}</p>
                    <ul className="mt-3">
                      {grupo.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="flex items-center justify-between gap-3 border-b border-ivory/8 py-3.5 text-[1.05rem] font-medium text-ivory/85 transition-colors hover:text-gold-bright"
                          >
                            {item.label}
                            <ChevronRight className="size-4 shrink-0 text-ivory/25" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <div className="shrink-0 space-y-4 border-t border-ivory/10 px-6 py-5">
                <a
                  href={club.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 text-sm text-ivory/60 transition-colors hover:text-gold-bright"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
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
