/**
 * Trae de Chess-Results la clasificación final de los torneos del club y deja
 * el resultado en src/data/torneos.json.
 *
 * Por qué existe: el blog del club dejó de publicarse en 2019 y desde entonces
 * lo único que queda asentado de cada torneo es la planilla de Chess-Results.
 * Copiarla a mano cada vez es trabajo repetido y se desactualiza solo.
 *
 * Cómo encuentra los torneos:
 *
 *   1. La lista SEMILLA, acá abajo: los torneos ya identificados. Nunca se
 *      pierden aunque Chess-Results deje de listarlos.
 *   2. Descubrimiento: la página de torneos de Argentina (fed.aspx) muestra los
 *      que están en curso o recién terminados. De ahí se toman los que dicen
 *      "Club de Ajedrez Posadas" en el nombre.
 *
 * Lo que menciona a Posadas pero no nombra al club no se publica: se lista como
 * candidato en la salida del script para que alguien lo mire y, si corresponde,
 * lo agregue a SEMILLA. Es preferible perderse un torneo a publicar uno ajeno.
 *
 * Uso:
 *   node scripts/sync-torneos.mjs
 *   node scripts/sync-torneos.mjs --dry   (no escribe, solo informa)
 */

import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const destino = path.join(root, 'src', 'data', 'torneos.json')
const seco = process.argv.includes('--dry')

/** Chess-Results corta las conexiones sin user agent de navegador. */
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

/**
 * Torneos ya identificados como del club. El año va explícito porque la
 * planilla no publica la fecha de juego, solo la de última actualización.
 */
const SEMILLA = [
  { id: '683766', anio: 2022 },
  { id: '960817', anio: 2024 },
  { id: '983624', anio: 2024 },
  { id: '991550', anio: 2024 },
  { id: '1222679', anio: 2025 },
]

/** Solo se publica lo que nombra al club. Ver el comentario de arriba. */
const ES_DEL_CLUB = /club\s+de\s+ajedrez\s+posadas/i
const MENCIONA_POSADAS = /posadas/i

async function bajar(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${url} respondió ${res.status}`)
  return res.text()
}

const limpiar = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()

/** Lista de torneos argentinos en curso o recientes: [{ id, nombre }]. */
async function descubrir() {
  const html = await bajar('https://chess-results.com/fed.aspx?lan=1&fed=ARG')
  const vistos = new Map()
  for (const m of html.matchAll(/tnr(\d+)\.aspx[^>]*>([^<]{3,120})</g)) {
    vistos.set(m[1], limpiar(m[2]))
  }
  return [...vistos].map(([id, nombre]) => ({ id, nombre }))
}

/**
 * Clasificación final de un torneo. Devuelve null si la planilla todavía no
 * publicó resultados (torneo anunciado pero no jugado).
 */
async function leerTorneo(id) {
  // art=1 es la clasificación final en los torneos individuales. En los de
  // equipos esa vista trae la composición de cada equipo y la tabla de
  // posiciones queda en la vista por defecto, así que se prueban las dos.
  let html = await bajar(`https://s2.chess-results.com/tnr${id}.aspx?lan=1&art=1`)
  if (!/<h2[^>]*>\s*Final Ranking/i.test(html)) {
    html = await bajar(`https://s2.chess-results.com/tnr${id}.aspx?lan=1&art=0`)
  }

  // El nombre del torneo es el primer h2 de la página; el segundo es el título
  // de la tabla ("Final Ranking after N Rounds").
  const titulos = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => limpiar(m[1]))
  const nombre = (titulos.find((t) => t && !/^Final Ranking/i.test(t)) ?? '')
    // Varias planillas del club arrancan con un emoji decorativo.
    .replace(/^[^\p{L}\p{N}]+/u, '')
  if (!nombre) throw new Error(`tnr${id}: no se encontró el nombre del torneo`)

  const encabezado = html.match(/<h2[^>]*>\s*(Final Ranking[^<]*)<\/h2>/i)
  if (!encabezado) return null // sin clasificación final publicada
  const rondas = Number((encabezado[1].match(/after\s+(\d+)\s+Round/i) ?? [])[1] ?? 0)

  // La tabla de posiciones es la primera CRs1 después de ese título.
  const desde = html.indexOf(encabezado[0])
  const tabla = html.slice(desde).match(/<table class="CRs1"[\s\S]*?<\/table>/i)
  if (!tabla) throw new Error(`tnr${id}: hay título de clasificación pero no la tabla`)

  const filas = [...tabla[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((f) =>
    [...f[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => limpiar(c[1])),
  )
  if (filas.length < 2) throw new Error(`tnr${id}: la tabla de clasificación vino vacía`)

  // Las columnas cambian según el torneo (equipos, sexo, desempates), así que
  // se ubican por el encabezado en vez de asumir posiciones fijas.
  const cabecera = filas[0]
  const col = (...nombres) =>
    cabecera.findIndex((c) => nombres.some((n) => c.toLowerCase() === n.toLowerCase()))
  const iNombre = col('Name', 'Team')
  const porEquipos = col('Team') >= 0
  // En los torneos por equipos la tabla no trae columna "Pts.": lo que ordena
  // son los puntos de match, que Chess-Results publica como TB1.
  const iPuntos = porEquipos ? col('TB1') : col('Pts.', 'Pts', 'MP')
  const iRating = col('Rtg')
  const iClub = col('Club/City', 'Club')
  if (iNombre < 0 || iPuntos < 0) {
    throw new Error(`tnr${id}: no se reconocieron las columnas (${cabecera.join(' | ')})`)
  }

  const puestos = filas
    .slice(1)
    .filter((f) => f.length === cabecera.length && f[iNombre])
    .map((f) => ({
      nombre: f[iNombre],
      puntos: f[iPuntos],
      rating: iRating >= 0 ? f[iRating] || null : null,
      club: iClub >= 0 ? f[iClub] || null : null,
    }))

  if (!puestos.length) throw new Error(`tnr${id}: no se pudo leer ninguna posición`)

  const actualizado = (html.match(/Last update\s+(\d{2})\.(\d{2})\.(\d{4})/i) ?? []).slice(1)
  return {
    id,
    nombre,
    rondas,
    porEquipos,
    participantes: puestos.length,
    podio: puestos.slice(0, 3),
    actualizado: actualizado.length
      ? `${actualizado[2]}-${actualizado[1]}-${actualizado[0]}`
      : null,
    url: `https://chess-results.com/tnr${id}.aspx?lan=2`,
  }
}

// --- Descubrimiento -------------------------------------------------------
const listados = await descubrir()
const nuevos = listados.filter(
  (t) => ES_DEL_CLUB.test(t.nombre) && !SEMILLA.some((s) => s.id === t.id),
)
const candidatos = listados.filter(
  (t) => !ES_DEL_CLUB.test(t.nombre) && MENCIONA_POSADAS.test(t.nombre),
)

console.log(`Torneos argentinos listados hoy: ${listados.length}`)
if (nuevos.length) nuevos.forEach((t) => console.log(`  + nuevo del club: ${t.id} · ${t.nombre}`))
if (candidatos.length) {
  console.log('  Mencionan Posadas pero no nombran al club (revisar a mano):')
  candidatos.forEach((t) => console.log(`    ? ${t.id} · ${t.nombre}`))
}

// --- Lectura de cada torneo ----------------------------------------------
const aLeer = [...SEMILLA, ...nuevos.map((t) => ({ id: t.id, anio: null }))]
const torneos = []
for (const { id, anio } of aLeer) {
  try {
    const t = await leerTorneo(id)
    if (!t) {
      console.log(`  · tnr${id}: todavía sin clasificación final`)
      continue
    }
    // Sin fecha de juego en la planilla, el año sale de la última actualización.
    torneos.push({ ...t, anio: anio ?? Number(t.actualizado?.slice(0, 4)) ?? null })
    console.log(`  ✓ tnr${id}: ${t.nombre} — ganó ${t.podio[0].nombre}`)
  } catch (e) {
    // Un torneo que cambió de formato no puede tirar abajo la sincronización
    // entera, pero tiene que verse en el log del workflow.
    console.error(`  ✗ tnr${id}: ${e.message}`)
  }
}

if (!torneos.length) throw new Error('No se pudo leer ningún torneo: se aborta sin tocar el JSON')

torneos.sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0) || a.nombre.localeCompare(b.nombre))

const salida = {
  actualizado: new Date().toISOString().slice(0, 10),
  fuente: 'https://chess-results.com',
  torneos,
}

const previo = await readFile(destino, 'utf8').catch(() => null)
const nuevo = JSON.stringify(salida, null, 2) + '\n'

// La fecha de sincronización cambia siempre; si es lo único distinto, no se
// commitea nada.
const sinFecha = (t) => (t ? t.replace(/"actualizado": "\d{4}-\d{2}-\d{2}",/, '') : t)
if (previo && sinFecha(previo) === sinFecha(nuevo)) {
  console.log('Sin cambios en los torneos.')
} else if (seco) {
  console.log('--dry: no se escribe. Torneos leídos:', torneos.length)
} else {
  await writeFile(destino, nuevo)
  console.log(`Escrito ${path.relative(root, destino)} con ${torneos.length} torneos.`)
}
