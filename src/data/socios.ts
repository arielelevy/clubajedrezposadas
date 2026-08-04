import datos from './socios.json'

/**
 * Padrón de socios, generado por `scripts/sync-socios.mjs` desde la planilla de
 * altas del club (workflow `sync-socios.yml`, todos los lunes).
 *
 * El JSON se importa con un tipo explícito porque TypeScript infiere `never[]`
 * para los arrays vacíos de un módulo JSON, y el listado arranca vacío.
 */
export type Padron = {
  actualizado: string | null
  total: number
  nombres: string[]
}

export const padron = datos as Padron

/** Hay listado para mostrar. Si la sincronización nunca corrió, no se renderiza. */
export const hayPadron = padron.nombres.length > 0
