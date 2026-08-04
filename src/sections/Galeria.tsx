import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'

/**
 * Las fotos se descubren automáticamente en tiempo de build: basta con copiar
 * los archivos a src/assets/galeria/ (Vite los optimiza y versiona).
 * Los epígrafes se definen en `epigrafes`, indexados por nombre de archivo.
 */
const modulos = import.meta.glob<string>('../assets/galeria/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/**
 * Epígrafes por nombre de archivo (sin extensión). Los que no estén acá caen
 * al nombre del archivo con los guiones convertidos en espacios.
 *
 * Para agregar fotos: copiarlas a src/assets/galeria/ y sumar su epígrafe acá.
 * La sección se autodescubre y no se renderiza si la carpeta está vacía.
 */
const epigrafes: Record<string, string> = {
  'acta-1926':
    'El Acta N.º 1: a las cinco de la tarde del 12 de julio de 1926, en el Palace Hotel, quedó constituido el club y se repartieron los diez cargos de la primera comisión directiva.',
  'reta-saissac-1980':
    'Miguel Reta (negras) fue el primer campeón del club en la sede de calle Jujuy. Mayo de 1980, en juego ante Saissac; quien observa la partida es el señor Gil.',
  'torneo-itinerante':
    'Del archivo del club: un torneo en marcha con relojes de madera y los jugadores de traje, en los años en que el club no tenía casa propia y los tableros iban del Palace Hotel a la Biblioteca Popular, el Hotel Savoy, la Casa Paraguaya y el Club Tokio.',
  'placa-centenario':
    'La placa conmemorativa de los 100 años, descubierta el 12 de julio de 2026 en la sede: “Hogar de Ajedrecistas”, con el agradecimiento de la comisión directiva a los socios que hacen posible la existencia y la continuidad del club.',
  'centenario-2026':
    'El festejo de los cien años en la sede de Jujuy 1514, julio de 2026: medio centenar de socios, amigos y dirigentes, homenaje a los jugadores históricos, las declaraciones de interés municipal y provincial, el descubrimiento de la placa conmemorativa y el brindis.',
}

type Foto = { url: string; nombre: string; epigrafe: string }

const fotos: Foto[] = Object.entries(modulos)
  .map(([ruta, url]) => {
    const nombre = ruta.split('/').pop()!.replace(/\.[^.]+$/, '')
    return { url, nombre, epigrafe: epigrafes[nombre] ?? nombre.replace(/[-_]/g, ' ') }
  })
  .sort((a, b) => a.nombre.localeCompare(b.nombre))

export function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null)

  const mover = (delta: number) =>
    setAbierta((i) => (i === null ? null : (i + delta + fotos.length) % fotos.length))

  if (fotos.length === 0) return null

  return (
    <section id="galeria" className="scroll-mt-24 bg-bone py-12 lg:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="Galería"
          titulo="El club, en imágenes"
          bajada="Talleres, torneos y la vida cotidiana de la sede de Jujuy 1514."
          align="center"
        />

        {/* Las leyendas van siempre visibles debajo de cada foto: estaban solo
            en el hover, y en celular el hover no existe. Estas fotos son
            documentos históricos, la leyenda es la mitad del valor. */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto, i) => (
            <Reveal key={foto.nombre} delay={0.05 * (i % 6)}>
              <figure className="flex h-full flex-col">
                <button
                  type="button"
                  onClick={() => setAbierta(i)}
                  aria-label={`Ampliar: ${foto.epigrafe}`}
                  className="group relative block w-full overflow-hidden rounded-lg border border-ink/8 bg-ink/5"
                >
                  <span className="block aspect-4/3">
                    <img
                      src={foto.url}
                      alt={foto.epigrafe}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-ivory/30 bg-ink/50 text-ivory opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                    <Camera className="size-4" />
                  </span>
                </button>
                <figcaption className="mt-3 text-[0.88rem] leading-relaxed text-ink/65">
                  {foto.epigrafe}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog.Root open={abierta !== null} onOpenChange={(o) => !o && setAbierta(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/92 backdrop-blur-md" />
          <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-4 focus:outline-none">
            {abierta !== null ? (
              <figure className="relative max-h-full w-full max-w-4xl">
                <img
                  src={fotos[abierta].url}
                  alt={fotos[abierta].epigrafe}
                  className="mx-auto max-h-[80svh] w-auto rounded-lg object-contain shadow-2xl"
                />
                <figcaption className="mt-5 text-center text-sm text-ivory/70">
                  {fotos[abierta].epigrafe}
                </figcaption>
                <Dialog.Title className="sr-only">{fotos[abierta].epigrafe}</Dialog.Title>

                <button
                  type="button"
                  onClick={() => mover(-1)}
                  aria-label="Foto anterior"
                  className="absolute top-1/2 -left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold-bright lg:-left-16"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => mover(1)}
                  aria-label="Foto siguiente"
                  className="absolute top-1/2 -right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold-bright lg:-right-16"
                >
                  <ChevronRight className="size-6" />
                </button>
              </figure>
            ) : null}

            <Dialog.Close
              aria-label="Cerrar"
              className="fixed top-6 right-6 grid size-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold-bright"
            >
              <X className="size-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
