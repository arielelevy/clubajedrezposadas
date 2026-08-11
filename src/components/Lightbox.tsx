import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export type FotoAmpliable = { url: string; epigrafe: string }

/**
 * Visor a pantalla completa compartido por la galería del home y por /fotos:
 * la foto ampliada, el epígrafe debajo y las flechas para recorrer la serie.
 */
export function Lightbox({
  fotos,
  indice,
  onCambio,
}: {
  fotos: FotoAmpliable[]
  /** Índice de la foto abierta, o null con el visor cerrado. */
  indice: number | null
  onCambio: (indice: number | null) => void
}) {
  const mover = (delta: number) => {
    if (indice !== null) onCambio((indice + delta + fotos.length) % fotos.length)
  }

  return (
    <Dialog.Root open={indice !== null} onOpenChange={(o) => !o && onCambio(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/92 fixed inset-0 z-50 backdrop-blur-md" />
        <Dialog.Content
          className="fixed inset-0 z-50 grid place-items-center p-4 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') mover(-1)
            if (e.key === 'ArrowRight') mover(1)
          }}
        >
          {indice !== null ? (
            <figure className="relative max-h-full w-full max-w-4xl">
              <img
                src={fotos[indice].url}
                alt={fotos[indice].epigrafe}
                className="mx-auto max-h-[80svh] w-auto rounded-lg object-contain shadow-2xl"
              />
              <figcaption className="text-ivory/70 mt-5 text-center text-sm">
                {fotos[indice].epigrafe}
              </figcaption>
              <Dialog.Title className="sr-only">{fotos[indice].epigrafe}</Dialog.Title>

              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Foto anterior"
                className="border-ivory/25 text-ivory hover:border-gold hover:text-gold-bright absolute top-1/2 -left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full border transition-colors lg:-left-16"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Foto siguiente"
                className="border-ivory/25 text-ivory hover:border-gold hover:text-gold-bright absolute top-1/2 -right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full border transition-colors lg:-right-16"
              >
                <ChevronRight className="size-6" />
              </button>
            </figure>
          ) : null}

          <Dialog.Close
            aria-label="Cerrar"
            className="border-ivory/25 text-ivory hover:border-gold hover:text-gold-bright fixed top-6 right-6 grid size-11 place-items-center rounded-full border transition-colors"
          >
            <X className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
