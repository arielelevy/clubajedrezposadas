import datos from './torneos.json'

/**
 * Torneos del club, generados por `scripts/sync-torneos.mjs` desde las planillas
 * de Chess-Results (workflow `sync-torneos.yml`, todos los lunes).
 *
 * El script trae los datos duros —nombre del torneo, rondas, participantes y el
 * podio con sus puntos— y acá se les agrega la prosa que ya revisamos a mano.
 * Un torneo nuevo aparece en la página sin tocar código: si no tiene entrada en
 * `curados`, se muestra con el nombre de la planilla y un podio armado solo.
 */
export type Puesto = {
  nombre: string
  puntos: string
  rating: string | null
  club: string | null
}

export type TorneoBruto = {
  id: string
  anio: number | null
  nombre: string
  rondas: number
  porEquipos: boolean
  participantes: number
  podio: Puesto[]
  actualizado: string | null
  url: string
}

const bruto = datos as Partial<{ actualizado: string; torneos: TorneoBruto[] }>
const leidos = Array.isArray(bruto.torneos) ? bruto.torneos : []

/**
 * Retoques a lo que publica la planilla: nombres sin abreviar, acentos que
 * Chess-Results no trae y una línea sobre cómo se definió cada torneo.
 */
const curados: Record<string, { nombre?: string; campeon?: string; cierre?: string }> = {
  683766: {
    nombre: 'IRT Sub 2400 “Torneo Mayor Abierto”',
    campeon: 'Patricio Zaldívar',
    cierre:
      'Segundo quedó el paraguayo Ettiene Ezequiel Amarilla y tercero Esteban Carlino, del CAP.',
  },
  991550: {
    nombre: 'IRT Clasificación al Mayor',
    campeon: 'Juan Ignacio Selva Andrade',
    cierre: 'Miguel Álvarez llegó a los mismos puntos y quedó segundo por desempate.',
  },
  983624: {
    nombre: 'Torneo Mayor del club',
    campeon: 'Horacio Oviedo',
    cierre: 'Segundo el MC Joaquín Jiménez y tercero Ángel Damián Yossen.',
  },
  960817: {
    nombre: 'Torneo por Equipos 98.º Aniversario',
    campeon: 'Tierra Roja',
    cierre:
      'Oberá “A” y el Club de Ajedrez Posadas “A” completaron el podio, los dos con siete puntos de match.',
  },
  1222679: {
    nombre: 'IRT Abierto 99.º Aniversario',
    campeon: 'Patricio Zaldívar',
    cierre:
      'Igualó en puntos con Stefan Botz y se quedó con el título por desempate; tercero fue Horacio Oviedo.',
  },
}

/** Las planillas escriben "Apellido, Nombre". Los equipos no llevan coma. */
const comoSeLee = (nombre: string) => {
  const partes = nombre.split(', ')
  return partes.length === 2 ? `${partes[1]} ${partes[0]}` : nombre
}

/** Podio armado solo, para los torneos que todavía nadie redactó. */
const podioAutomatico = (t: TorneoBruto) =>
  t.podio
    .slice(1, 3)
    .map((p, i) => `${i + 2}.º ${comoSeLee(p.nombre)}`)
    .join(' · ')

export const torneosDelClub = leidos
  .filter((t) => t.podio?.length)
  .map((t) => {
    const c = curados[t.id] ?? {}
    return {
      id: t.id,
      anio: t.anio,
      nombre: c.nombre ?? t.nombre,
      campeon: c.campeon ?? comoSeLee(t.podio[0].nombre),
      puntos: t.podio[0].puntos,
      /** En los torneos por equipos lo que ordena son los puntos de match. */
      unidad: t.porEquipos ? 'puntos de match' : 'puntos',
      detalle: `${t.participantes} ${t.porEquipos ? 'equipos' : 'jugadores'} · ${t.rondas} rondas`,
      cierre: c.cierre ?? podioAutomatico(t),
      url: t.url,
    }
  })

export const hayTorneos = torneosDelClub.length > 0

export const copyTorneos = {
  titulo: 'Del 2020 al centenario',
  bajada:
    'El Mayor sigue siendo el torneo que consagra al campeón del club, y sigue habiendo nombres que cruzan las décadas: Joaquín Jiménez, campeón en 2010 y en 2014, terminó segundo en 2024, ahora como maestro candidato.',
  nota: 'Clasificaciones finales publicadas en Chess-Results, que el sitio vuelve a leer todas las semanas.',
}
