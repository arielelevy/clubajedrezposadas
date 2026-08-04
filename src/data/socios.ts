import datos from './socios.json'

/**
 * Padrón de socios, generado por `scripts/sync-socios.mjs` desde la planilla del
 * club (workflow `sync-socios.yml`, todos los lunes).
 *
 * Del Sheet salen solo dos columnas, nombre y categoría: el historial de cuotas
 * y pagos que la planilla también tiene nunca se lee.
 *
 * El JSON se importa con un tipo explícito porque TypeScript infiere `never[]`
 * para los arrays vacíos de un módulo JSON, y el listado puede estar vacío.
 */
export type Socio = {
  nombre: string
  /** ACTIVO, CADETE, PROTECTOR… puede venir vacío. */
  tipo: string
}

export type Padron = {
  actualizado: string | null
  total: number
  socios: Socio[]
}

export const padron = datos as Padron

/** Hay listado para mostrar. Si la sincronización nunca corrió, no se renderiza. */
export const hayPadron = padron.socios.length > 0

/** Cantidad de socios por categoría, de mayor a menor. */
export const porCategoria = Object.entries(
  padron.socios.reduce<Record<string, number>>((acc, s) => {
    if (!s.tipo) return acc
    acc[s.tipo] = (acc[s.tipo] ?? 0) + 1
    return acc
  }, {}),
).sort((a, b) => b[1] - a[1])
