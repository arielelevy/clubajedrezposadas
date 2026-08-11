import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, X, Users } from 'lucide-react'
import { club } from '@/data/site'
import { padron, porCategoria } from '@/data/socios'
import { Button } from './ui/button'

/** Quita acentos para que buscar "nunez" encuentre "Núñez". */
const normalizar = (t: string) =>
  t
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

/**
 * Padrón de socios en un panel que se abre desde la cabecera de la página.
 *
 * Listado en línea, los más de cien nombres se comían media página y empujaban todo lo
 * demás hacia abajo. Acá queda a un click del título, sin costo de espacio, y
 * con un buscador que a esa cantidad es lo que de verdad sirve.
 */
export function PadronDialog() {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim())
    if (!q) return padron.socios
    return padron.socios.filter(
      (s) => normalizar(s.nombre).includes(q) || normalizar(s.tipo).includes(q),
    )
  }, [busqueda])

  return (
    <Dialog.Root onOpenChange={(abierto) => !abierto && setBusqueda('')}>
      <Dialog.Trigger asChild>
        <Button variant="outlineLight" size="lg">
          <Users />
          Padrón · {padron.total} socios
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/80 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="border-gold/25 bg-bone fixed top-1/2 left-1/2 z-50 flex max-h-[88svh] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border shadow-2xl focus:outline-none">
          {/* Cabecera con el desglose por categoría */}
          <div className="border-ink/8 bg-ivory shrink-0 border-b px-6 py-5 lg:px-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="kicker text-gold-deep">Padrón</p>
                <Dialog.Title className="font-display text-ink mt-2 text-2xl lg:text-3xl">
                  Quiénes sostienen el club
                </Dialog.Title>
              </div>
              <Dialog.Close className="border-ink/12 text-ink/50 hover:border-gold hover:text-gold-deep grid size-10 shrink-0 place-items-center rounded-full border transition-colors">
                <X className="size-5" />
                <span className="sr-only">Cerrar</span>
              </Dialog.Close>
            </div>

            <dl className="mt-5 flex flex-wrap items-baseline gap-x-7 gap-y-2">
              <div className="flex items-baseline gap-2">
                <dd className="font-condensed text-gold-deep text-3xl leading-none">
                  {padron.total}
                </dd>
                <dt className="kicker text-ink/45 text-[0.58rem]">socios</dt>
              </div>
              {porCategoria.map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-baseline gap-2">
                  <dd className="font-condensed text-ink/70 text-2xl leading-none">{cantidad}</dd>
                  <dt className="kicker text-ink/40 text-[0.58rem]">{tipo}</dt>
                </div>
              ))}
            </dl>

            <div className="relative mt-5">
              <Search
                aria-hidden="true"
                className="text-ink/35 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
              />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar un socio o una categoría"
                aria-label="Buscar en el padrón de socios"
                className="border-ink/12 bg-bone text-ink placeholder:text-ink/40 focus:border-gold w-full rounded-full border py-3 pr-11 pl-11 text-[0.95rem] focus:outline-none"
              />
              {busqueda ? (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar la búsqueda"
                  className="text-ink/45 hover:bg-ink/5 hover:text-ink absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full transition-colors"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Listado */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2 lg:px-8">
            {filtrados.length > 0 ? (
              <ul className="columns-1 gap-x-10 sm:columns-2">
                {filtrados.map((socio) => (
                  <li
                    key={socio.nombre}
                    className="border-ink/8 flex break-inside-avoid items-baseline justify-between gap-3 border-b py-2.5"
                  >
                    <span className="text-ink/80 text-[0.93rem]">{socio.nombre}</span>
                    {socio.tipo ? (
                      <span className="text-ink/35 shrink-0 text-[0.62rem] tracking-wide uppercase">
                        {socio.tipo}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/55 px-2 py-12 text-center text-[0.95rem]">
                Ningún socio coincide con “{busqueda}”. Probá con el apellido, o escribinos al{' '}
                {club.whatsapp} si deberías figurar.
              </p>
            )}
          </div>

          <div
            aria-live="polite"
            className="border-ink/8 bg-ivory text-ink/45 shrink-0 border-t px-6 py-4 text-xs lg:px-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span>
                {busqueda
                  ? `${filtrados.length} de ${padron.total} socios`
                  : padron.actualizado
                    ? `Actualizado el ${padron.actualizado}`
                    : null}
              </span>
              <span>Si figurás mal o no querés aparecer, escribinos al {club.whatsapp}.</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
