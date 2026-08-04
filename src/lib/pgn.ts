import { Chess } from 'chess.js'

export type Ply = {
  numero: number
  color: 'w' | 'b'
  san: string
  fen: string
  from: string
  to: string
}

export type Partida = {
  id: string
  evento: string
  sitio: string
  fecha: string
  ronda: string
  blancas: string
  negras: string
  eloBlancas: string
  eloNegras: string
  resultado: string
  apertura: string
  fenInicial: string
  plies: Ply[]
  pgn: string
}

const FEN_INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

/** Separa un PGN con varias partidas en bloques individuales. */
export function separarPartidas(texto: string): string[] {
  const normalizado = texto.replace(/\r\n/g, '\n').trim()
  if (!normalizado) return []

  const bloques: string[] = []
  let actual: string[] = []
  let enMovimientos = false

  for (const linea of normalizado.split('\n')) {
    const esCabecera = linea.startsWith('[')
    if (esCabecera && enMovimientos) {
      bloques.push(actual.join('\n').trim())
      actual = []
      enMovimientos = false
    }
    if (!esCabecera && linea.trim() !== '') enMovimientos = true
    actual.push(linea)
  }
  if (actual.length) bloques.push(actual.join('\n').trim())

  return bloques.filter((b) => b.includes('['))
}

/** Interpreta un PGN individual y devuelve la partida con la posición de cada jugada. */
export function parsearPartida(pgn: string, id: string): Partida {
  const juego = new Chess()
  juego.loadPgn(pgn)

  const h = juego.getHeaders()
  const historia = juego.history({ verbose: true })

  const plies: Ply[] = historia.map((m, i) => ({
    numero: Math.floor(i / 2) + 1,
    color: m.color,
    san: m.san,
    fen: m.after,
    from: m.from,
    to: m.to,
  }))

  return {
    id,
    evento: h.Event ?? 'Partida',
    sitio: h.Site ?? '',
    fecha: h.Date ?? '',
    ronda: h.Round ?? '',
    blancas: h.White ?? 'Blancas',
    negras: h.Black ?? 'Negras',
    eloBlancas: h.WhiteElo ?? '',
    eloNegras: h.BlackElo ?? '',
    resultado: h.Result ?? '*',
    apertura: h.Opening ?? h.ECO ?? '',
    fenInicial: h.FEN ?? FEN_INICIAL,
    plies,
    pgn,
  }
}

/** Interpreta un archivo PGN completo (una o varias partidas), descartando las que no sean legibles. */
export function parsearArchivoPgn(texto: string, prefijoId: string): Partida[] {
  const partidas: Partida[] = []
  separarPartidas(texto).forEach((bloque, i) => {
    try {
      partidas.push(parsearPartida(bloque, `${prefijoId}-${i}`))
    } catch (error) {
      console.warn(`PGN ilegible (${prefijoId}-${i}):`, error)
    }
  })
  return partidas
}

/** Convierte un FEN en una matriz de 8x8 lista para renderizar. */
export type Casilla = { pieza: string | null; color: 'w' | 'b' | null; nombre: string }

export function fenATablero(fen: string): Casilla[][] {
  const filas = fen.split(' ')[0].split('/')
  const letras = 'abcdefgh'

  return filas.map((fila, indiceFila) => {
    const casillas: Casilla[] = []
    for (const caracter of fila) {
      if (/\d/.test(caracter)) {
        for (let i = 0; i < Number(caracter); i++) {
          casillas.push({
            pieza: null,
            color: null,
            nombre: `${letras[casillas.length]}${8 - indiceFila}`,
          })
        }
      } else {
        casillas.push({
          pieza: caracter.toLowerCase(),
          color: caracter === caracter.toUpperCase() ? 'w' : 'b',
          nombre: `${letras[casillas.length]}${8 - indiceFila}`,
        })
      }
    }
    return casillas
  })
}

/** Agrupa las jugadas en pares (blancas / negras) para la planilla. */
export function agruparJugadas(plies: Ply[]) {
  const pares: { numero: number; blancas?: Ply; negras?: Ply; indiceB: number; indiceN: number }[] = []
  plies.forEach((ply, i) => {
    const par = pares.find((p) => p.numero === ply.numero)
    if (ply.color === 'w') {
      pares.push({ numero: ply.numero, blancas: ply, indiceB: i, indiceN: -1 })
    } else if (par) {
      par.negras = ply
      par.indiceN = i
    } else {
      pares.push({ numero: ply.numero, negras: ply, indiceB: -1, indiceN: i })
    }
  })
  return pares
}
