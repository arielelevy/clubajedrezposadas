import { useState } from 'react'
import { Camera } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { fotosDrive, epigrafeDe } from '@/data/fotos'

/**
 * La galería completa: todas las fotos que el club sube a su carpeta de
 * Google Drive, espejadas al repo por scripts/sync-fotos.mjs. El epígrafe es
 * «subcarpeta — fecha» y las fotos vienen ordenadas de la más nueva a la más
 * vieja desde fotos.json.
 */
const modulos = import.meta.glob<string>('../assets/fotos/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const urlPorArchivo = new Map(
  Object.entries(modulos).map(([ruta, url]) => [ruta.split('/').pop()!, url]),
)

const fotos = fotosDrive
  .map((foto) => ({ url: urlPorArchivo.get(foto.archivo), epigrafe: epigrafeDe(foto) }))
  .filter((foto): foto is { url: string; epigrafe: string } => Boolean(foto.url))

export function FotosPage() {
  const [abierta, setAbierta] = useState<number | null>(null)

  return (
    <>
      <PageHeader
        compacta
        kicker="Galería"
        titulo="Las fotos del club"
        bajada="Talleres, torneos y festejos, tal como los va registrando el club."
      />

      <section className="bg-bone py-12 lg:py-18">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {fotos.length === 0 ? (
            <p className="mx-auto max-w-xl text-center text-lg leading-relaxed text-ink/60">
              Todavía no hay fotos cargadas: las primeras están en camino.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fotos.map((foto, i) => (
                <Reveal key={foto.url} delay={0.05 * (i % 6)}>
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
                      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-ivory/30 bg-ink/60 text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
          )}
        </div>

        <Lightbox fotos={fotos} indice={abierta} onCambio={setAbierta} />
      </section>
    </>
  )
}
