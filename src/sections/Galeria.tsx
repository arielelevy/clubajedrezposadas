import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { Button } from '@/components/ui/button'
import { hayFotos } from '@/data/fotos'

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
 * El acta y la placa ya se ven en grande, con su propio relato, en la sección
 * "acta" de /historia: repetirlas en la misma página no suma.
 */
const yaEnLaPagina = new Set(['acta-1926', 'placa-centenario'])

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
    const nombre = ruta
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, '')
    return { url, nombre, epigrafe: epigrafes[nombre] ?? nombre.replace(/[-_]/g, ' ') }
  })
  .filter((f) => !yaEnLaPagina.has(f.nombre))
  .sort((a, b) => a.nombre.localeCompare(b.nombre))

export function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null)

  if (fotos.length === 0) return null

  return (
    <section id="imagenes" className="bg-ivory scroll-mt-24 py-12 lg:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="Archivo"
          titulo="La historia, en imágenes"
          bajada="Documentos y fotos del archivo del club, de los torneos itinerantes al festejo del centenario."
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
                  className="group border-ink/8 bg-ink/5 relative block w-full overflow-hidden rounded-lg border"
                >
                  <span className="block aspect-4/3">
                    <img
                      src={foto.url}
                      alt={foto.epigrafe}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  {/* Sin backdrop-blur: aun invisible obligaba al navegador a
                      mantener una capa aparte por cada foto de la galería. */}
                  <span className="border-ivory/30 bg-ink/60 text-ivory absolute top-3 right-3 grid size-9 place-items-center rounded-full border opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Camera className="size-4" />
                  </span>
                </button>
                <figcaption className="text-ink/65 mt-3 text-[0.88rem] leading-relaxed">
                  {foto.epigrafe}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* La galería de hoy (las fotos que el club sube a Drive) vive en
            /fotos; el link recién aparece cuando la sincronización trajo algo. */}
        {hayFotos ? (
          <div className="mt-10 text-center">
            <Button asChild variant="outlineDark">
              <Link to="/fotos">
                Ver la galería de fotos
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <Lightbox fotos={fotos} indice={abierta} onCambio={setAbierta} />
    </section>
  )
}
