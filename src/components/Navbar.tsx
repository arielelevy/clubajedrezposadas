import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react'
import { club, navegacion, eventoCentenario } from '@/data/site'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

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
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-ink px-7 py-6 text-ivory shadow-2xl">
              <div className="flex items-center justify-between">
                <Dialog.Title className="kicker text-gold-bright">Menú</Dialog.Title>
                <Dialog.Close className="grid size-10 place-items-center rounded-full border border-ivory/20">
                  <X className="size-5" />
                  <span className="sr-only">Cerrar</span>
                </Dialog.Close>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {navegacion.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="border-b border-ivory/10 py-4 font-display text-2xl text-ivory/90 transition-colors hover:text-gold-bright"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 text-sm text-ivory/70">
                <p>
                  {club.direccion} · {club.ciudad}
                </p>
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
