import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Download,
} from 'lucide-react'
import { agruparJugadas, type Partida } from '@/lib/pgn'
import { cn } from '@/lib/utils'
import { Board } from './Board'

const FEN_INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function GameViewer({ partida }: { partida: Partida }) {
  const [indice, setIndice] = useState(-1) // -1 = posición inicial
  const [reproduciendo, setReproduciendo] = useState(false)
  const [invertido, setInvertido] = useState(false)

  useEffect(() => {
    setIndice(-1)
    setReproduciendo(false)
  }, [partida.id])

  const total = partida.plies.length

  const avanzar = useCallback(() => setIndice((i) => Math.min(i + 1, total - 1)), [total])
  const retroceder = useCallback(() => setIndice((i) => Math.max(i - 1, -1)), [])

  useEffect(() => {
    if (!reproduciendo) return
    if (indice >= total - 1) {
      setReproduciendo(false)
      return
    }
    const t = setTimeout(avanzar, 900)
    return () => clearTimeout(t)
  }, [reproduciendo, indice, total, avanzar])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') avanzar()
      if (e.key === 'ArrowLeft') retroceder()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [avanzar, retroceder])

  const plyActual = indice >= 0 ? partida.plies[indice] : undefined
  const fen = plyActual?.fen ?? partida.fenInicial ?? FEN_INICIAL
  const pares = useMemo(() => agruparJugadas(partida.plies), [partida.plies])

  const pgnUrl = useMemo(
    () => URL.createObjectURL(new Blob([partida.pgn], { type: 'application/x-chess-pgn' })),
    [partida.pgn],
  )
  useEffect(() => () => URL.revokeObjectURL(pgnUrl), [pgnUrl])

  const resultado =
    partida.resultado === '1-0'
      ? 'Ganan blancas'
      : partida.resultado === '0-1'
        ? 'Ganan negras'
        : partida.resultado === '1/2-1/2'
          ? 'Tablas'
          : 'En juego'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <Board fen={fen} ultimaJugada={plyActual} invertido={invertido} />

        {/* Controles */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <BotonControl etiqueta="Inicio" onClick={() => setIndice(-1)} disabled={indice === -1}>
              <ChevronFirst className="size-5" />
            </BotonControl>
            <BotonControl etiqueta="Anterior" onClick={retroceder} disabled={indice === -1}>
              <ChevronLeft className="size-5" />
            </BotonControl>
            <BotonControl
              etiqueta={reproduciendo ? 'Pausar' : 'Reproducir'}
              onClick={() => setReproduciendo((r) => !r)}
              disabled={total === 0 || indice >= total - 1}
              destacado
            >
              {reproduciendo ? <Pause className="size-5" /> : <Play className="size-5" />}
            </BotonControl>
            <BotonControl etiqueta="Siguiente" onClick={avanzar} disabled={indice >= total - 1}>
              <ChevronRight className="size-5" />
            </BotonControl>
            <BotonControl
              etiqueta="Final"
              onClick={() => setIndice(total - 1)}
              disabled={indice >= total - 1}
            >
              <ChevronLast className="size-5" />
            </BotonControl>
            <BotonControl etiqueta="Girar tablero" onClick={() => setInvertido((v) => !v)}>
              <RefreshCw className="size-4" />
            </BotonControl>
          </div>

          <div className="flex items-center gap-4 text-xs text-ink/55">
            <span>
              Jugada {Math.max(indice + 1, 0)} de {total}
            </span>
            <a
              href={pgnUrl}
              download={`${partida.blancas}-${partida.negras}.pgn`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-deep"
            >
              <Download className="size-3.5" />
              PGN
            </a>
          </div>
        </div>
      </div>

      {/* Ficha + planilla */}
      <div className="flex flex-col rounded-lg border border-ink/8 bg-white/70">
        <div className="border-b border-ink/8 p-5">
          <p className="kicker text-[0.58rem] text-gold-deep">{partida.evento}</p>
          <div className="mt-3 space-y-2 text-sm">
            <Jugador nombre={partida.blancas} elo={partida.eloBlancas} color="w" />
            <Jugador nombre={partida.negras} elo={partida.eloNegras} color="b" />
          </div>
          <p className="mt-3 text-xs text-ink/50">
            {[partida.ronda && `Ronda ${partida.ronda}`, partida.fecha, resultado]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {partida.apertura ? (
            <p className="mt-2 text-xs text-ink/45 italic">{partida.apertura}</p>
          ) : null}
        </div>

        <ol className="max-h-96 flex-1 overflow-y-auto p-4 text-sm">
          {pares.map((par) => (
            <li key={par.numero} className="grid grid-cols-[2.2rem_1fr_1fr] items-center gap-1 py-0.5">
              <span className="text-xs text-ink/40">{par.numero}.</span>
              <JugadaBoton ply={par.blancas?.san} activo={indice === par.indiceB} onClick={() => setIndice(par.indiceB)} />
              <JugadaBoton ply={par.negras?.san} activo={indice === par.indiceN} onClick={() => setIndice(par.indiceN)} />
            </li>
          ))}
          {total === 0 ? <li className="text-xs text-ink/50">La partida no tiene jugadas cargadas.</li> : null}
        </ol>
      </div>
    </div>
  )
}

function BotonControl({
  children,
  etiqueta,
  onClick,
  disabled,
  destacado,
}: {
  children: React.ReactNode
  etiqueta: string
  onClick: () => void
  disabled?: boolean
  destacado?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className={cn(
        'grid size-10 place-items-center rounded-full border transition-all duration-300 disabled:opacity-35',
        destacado
          ? 'border-gold/50 bg-gold/15 text-gold-deep hover:bg-gold/25'
          : 'border-ink/12 text-ink/70 hover:border-gold/50 hover:text-gold-deep',
      )}
    >
      {children}
    </button>
  )
}

function JugadaBoton({
  ply,
  activo,
  onClick,
}: {
  ply?: string
  activo: boolean
  onClick: () => void
}) {
  if (!ply) return <span />
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded px-2 py-1 text-left font-mono text-[0.8rem] transition-colors',
        activo ? 'bg-gold/20 font-semibold text-ink' : 'text-ink/75 hover:bg-ink/5',
      )}
    >
      {ply}
    </button>
  )
}

function Jugador({ nombre, elo, color }: { nombre: string; elo: string; color: 'w' | 'b' }) {
  return (
    <p className="flex items-center gap-2.5">
      <span
        className={cn(
          'size-3 shrink-0 rounded-full border',
          color === 'w' ? 'border-ink/25 bg-bone' : 'border-ink/60 bg-ink',
        )}
      />
      <span className="font-medium text-ink">{nombre}</span>
      {elo ? <span className="text-xs text-ink/45">{elo}</span> : null}
    </p>
  )
}
