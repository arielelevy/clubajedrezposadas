/**
 * Fuentes de partidas del visor. Todo se resuelve en el navegador, sin backend:
 *
 * - "club": archivos .pgn servidos desde /public/partidas (los sube el club).
 * - "elite": transmisiones oficiales de la API pública de Lichess.
 */

export type ArchivoPartidas = {
  archivo: string
  titulo: string
  descripcion: string
}

/** Archivos PGN publicados en public/partidas/. Agregar acá cada archivo nuevo. */
export const archivosDelClub: ArchivoPartidas[] = [
  {
    archivo: '/partidas/clasicas.pgn',
    titulo: 'Clásicas comentadas',
    descripcion:
      'Partidas históricas que se usan en los talleres para enseñar ataque y sacrificio.',
  },
]

/** Modalidad usada para el ranking de elite de Lichess. */
export const modalidadElite = 'classical' as const
