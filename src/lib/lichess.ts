/**
 * Cliente de la API pública de Lichess (sin backend y sin API key: los
 * endpoints usados responden con Access-Control-Allow-Origin: *).
 *
 * Docs: https://lichess.org/api
 */

const BASE = 'https://lichess.org/api'

export type Transmision = {
  id: string
  torneo: string
  ronda: string
  info: string
  url: string
  enVivo: boolean
}

type BroadcastTop = {
  active?: BroadcastItem[]
  upcoming?: BroadcastItem[]
  past?: { currentPageResults?: BroadcastItem[] } | BroadcastItem[]
}

type BroadcastItem = {
  tour: { id: string; name: string; info?: { players?: string; location?: string; tc?: string } }
  round: { id: string; name: string; ongoing?: boolean; url: string }
}

function aTransmision(item: BroadcastItem): Transmision {
  const info = [item.tour.info?.players, item.tour.info?.location, item.tour.info?.tc]
    .filter(Boolean)
    .join(' · ')

  return {
    id: item.round.id,
    torneo: item.tour.name,
    ronda: item.round.name,
    info,
    url: item.round.url,
    enVivo: Boolean(item.round.ongoing),
  }
}

/**
 * Transmisiones oficiales destacadas (Candidatos, GCT, Tata Steel, opens...).
 *
 * Devuelve las en curso y también las terminadas, y no una sola lista recortada:
 * entre rondas, las transmisiones activas responden con las partidas cargadas
 * pero sin una sola jugada, y con un `slice` sobre la lista unida las terminadas
 * —que sí tienen partidas completas— nunca entraban.
 */
export async function obtenerTransmisionesElite(cantidad = 6): Promise<Transmision[]> {
  const res = await fetch(`${BASE}/broadcast/top?nb=${cantidad}`)
  if (!res.ok) throw new Error(`Lichess respondió ${res.status} al pedir las transmisiones`)

  const data = (await res.json()) as BroadcastTop
  const conRonda = (items: BroadcastItem[]) => items.filter((i) => i?.round?.id)

  const activas = conRonda(data.active ?? [])
  const pasadas = conRonda(
    Array.isArray(data.past) ? data.past : (data.past?.currentPageResults ?? []),
  )

  return [...activas.slice(0, cantidad), ...pasadas.slice(0, cantidad)].map(aTransmision)
}

/** PGN completo de una ronda de transmisión (todas las partidas de esa ronda). */
export async function obtenerPgnDeRonda(idRonda: string): Promise<string> {
  const res = await fetch(`${BASE}/broadcast/round/${idRonda}.pgn`)
  if (!res.ok) throw new Error(`Lichess respondió ${res.status} al pedir el PGN de la ronda`)
  return res.text()
}

export type JugadorTop = { usuario: string; titulo: string; rating: number }

/** Ranking de los mejores jugadores de Lichess en una modalidad. */
export async function obtenerJugadoresTop(
  modalidad: 'blitz' | 'rapid' | 'classical' | 'bullet',
  cantidad = 8,
): Promise<JugadorTop[]> {
  const res = await fetch(`${BASE}/player/top/${cantidad}/${modalidad}`)
  if (!res.ok) throw new Error(`Lichess respondió ${res.status} al pedir el ranking`)

  const data = (await res.json()) as {
    users: { username: string; title?: string; perfs: Record<string, { rating: number }> }[]
  }

  return data.users.map((u) => ({
    usuario: u.username,
    titulo: u.title ?? '',
    rating: u.perfs[modalidad]?.rating ?? 0,
  }))
}

/** Últimas partidas de un jugador, en PGN. */
export async function obtenerPgnDeJugador(usuario: string, cantidad = 3): Promise<string> {
  const params = new URLSearchParams({
    max: String(cantidad),
    rated: 'true',
    perfType: 'blitz,rapid,classical',
    opening: 'true',
    clocks: 'false',
    evals: 'false',
  })

  const res = await fetch(`${BASE}/games/user/${usuario}?${params}`, {
    headers: { Accept: 'application/x-chess-pgn' },
  })
  if (!res.ok) throw new Error(`Lichess respondió ${res.status} al pedir las partidas de ${usuario}`)
  return res.text()
}
