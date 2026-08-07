import datos from './fotos.json'

/**
 * Galería completa del club, generada por `scripts/sync-fotos.mjs` desde la
 * carpeta compartida de Google Drive (workflow `sync-fotos.yml`, todos los
 * días). Acá viene solo lo que el epígrafe necesita: la subcarpeta de Drive
 * como título y la fecha de la foto.
 *
 * El JSON se normaliza en lugar de castearse, por el mismo motivo que el
 * padrón: TypeScript infiere `never[]` para los arrays vacíos de un módulo
 * JSON, y hasta que el club pase la carpeta este archivo está vacío.
 */
export type FotoDrive = {
  /** Nombre del webp en src/assets/fotos/ (el id de Drive con extensión). */
  archivo: string
  /** Subcarpeta de primer nivel en Drive; null para las fotos sueltas. */
  carpeta: string | null
  /** 'AAAA-MM-DD' del EXIF de la foto o de la subida a Drive. */
  fecha: string | null
}

type Crudo = Partial<{
  actualizado: string | null
  fotos: Partial<FotoDrive>[]
}>

const bruto = datos as Crudo

export const fotosDrive: FotoDrive[] = (Array.isArray(bruto.fotos) ? bruto.fotos : [])
  .filter((f): f is FotoDrive & { archivo: string } => typeof f.archivo === 'string')
  .map((f) => ({ archivo: f.archivo, carpeta: f.carpeta ?? null, fecha: f.fecha ?? null }))

/** Hay fotos sincronizadas: mientras no las haya, el link a /fotos no se muestra. */
export const hayFotos = fotosDrive.length > 0

const formatoLargo = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * Epígrafe pedido por el club: «título — fecha», donde el título es la
 * subcarpeta de Drive si la hay. El mediodía evita que la zona horaria
 * corra la fecha un día.
 */
export function epigrafeDe(foto: FotoDrive): string {
  const fecha = foto.fecha ? formatoLargo.format(new Date(`${foto.fecha}T12:00:00`)) : ''
  if (foto.carpeta && fecha) return `${foto.carpeta} — ${fecha}`
  return foto.carpeta ?? fecha
}
