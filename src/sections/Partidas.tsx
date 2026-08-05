import { useCallback, useEffect, useState } from 'react'
import { Radio, LoaderCircle, TriangleAlert, RefreshCw } from 'lucide-react'
import { archivosDelClub } from '@/data/partidas'
import { parsearArchivoPgn, type Partida } from '@/lib/pgn'
import { obtenerPgnDeRonda, obtenerTransmisionesElite, type Transmision } from '@/lib/lichess'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { GameViewer } from '@/components/GameViewer'
import { cn } from '@/lib/utils'

type Fuente = 'club' | 'elite'

/** Una ronda de Lichess con sus partidas ya descargadas y parseadas. */
type TransmisionCargada = { ronda: Transmision; partidas: Partida[] }

export function Partidas() {
  const [fuente, setFuente] = useState<Fuente>('club')
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [seleccionada, setSeleccionada] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transmisiones, setTransmisiones] = useState<TransmisionCargada[]>([])
  const [transmisionActiva, setTransmisionActiva] = useState<string | null>(null)

  /** Partidas del club: archivos PGN estáticos. */
  const cargarDelClub = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const textos = await Promise.all(
        archivosDelClub.map(async (a) => {
          const res = await fetch(a.archivo)
          if (!res.ok) throw new Error(`No se pudo leer ${a.archivo} (${res.status})`)
          return { texto: await res.text(), archivo: a.archivo }
        }),
      )
      const todas = textos.flatMap((t) => parsearArchivoPgn(t.texto, t.archivo))
      setPartidas(todas)
      setSeleccionada(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido al leer los PGN del club')
      setPartidas([])
    } finally {
      setCargando(false)
    }
  }, [])

  /**
   * Elite: transmisiones oficiales de Lichess (Candidatos, GCT, opens, ligas).
   *
   * Se sondean varias rondas en paralelo y se ofrecen solo las que tienen
   * jugadas. Es la única forma: muchas rondas listadas como activas todavía no
   * arrancaron y devuelven las partidas sin un solo movimiento, y la API no
   * permite saberlo de antemano (el campo `ongoing` viene nulo y el HEAD del PGN
   * responde 204 sin `Content-Length`).
   *
   * Las partidas parseadas se guardan junto a cada ronda, así cambiar de torneo
   * es instantáneo y no se vuelve a pedir nada.
   */
  const cargarElite = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const rondas = await obtenerTransmisionesElite(5)

      // Se sondean tres en curso y cinco terminadas. Las en curso valen la pena
      // porque son lo interesante cuando hay ronda jugándose, pero buena parte
      // del día están por empezar y vienen vacías, así que el peso del sondeo va
      // a las terminadas, que sí tienen partidas completas.
      const candidatas = [
        ...rondas.filter((r) => !r.terminada).slice(0, 3),
        ...rondas.filter((r) => r.terminada).slice(0, 5),
      ]

      const sondeos = await Promise.all(
        candidatas.map(async (ronda) => {
          try {
            const pgn = await obtenerPgnDeRonda(ronda.id)
            const partidas = parsearArchivoPgn(pgn, ronda.id).filter((p) => p.plies.length > 0)
            return partidas.length > 0 ? { ronda, partidas } : null
          } catch {
            return null
          }
        }),
      )

      const disponibles = sondeos.filter((s): s is TransmisionCargada => s !== null).slice(0, 4)

      if (disponibles.length === 0) {
        throw new Error(
          'Ninguna de las transmisiones de Lichess tiene jugadas publicadas en este momento',
        )
      }

      setTransmisiones(disponibles)
      setTransmisionActiva(disponibles[0].ronda.id)
      setPartidas(disponibles[0].partidas)
      setSeleccionada(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido al consultar Lichess')
      setPartidas([])
      setTransmisiones([])
    } finally {
      setCargando(false)
    }
  }, [])

  /** Cambio de torneo: ya está descargado y parseado. */
  const elegirTransmision = useCallback((cargada: TransmisionCargada) => {
    setTransmisionActiva(cargada.ronda.id)
    setPartidas(cargada.partidas)
    setSeleccionada(0)
  }, [])

  useEffect(() => {
    if (fuente === 'club') cargarDelClub()
    else cargarElite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuente])

  const partida = partidas[seleccionada]

  return (
    <section id="partidas" className="scroll-mt-24 bg-ivory py-12 lg:py-18">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="Tablero en vivo"
          titulo="Partidas, jugada por jugada"
          bajada="Las clásicas que se estudian en los talleres, y los torneos de elite que transmite Lichess."
          align="center"
        />

        {/* Selector de fuente */}
        <Reveal className="mt-6 flex flex-wrap justify-center gap-2">
          <BotonFuente activo={fuente === 'club'} onClick={() => setFuente('club')}>
            Clásicas
          </BotonFuente>
          <BotonFuente activo={fuente === 'elite'} onClick={() => setFuente('elite')}>
            <Radio className="size-4" />
            Torneos de elite
          </BotonFuente>
        </Reveal>

        {/* Torneos disponibles: solo los que tienen partidas con jugadas */}
        {fuente === 'elite' && transmisiones.length > 0 ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {transmisiones.map((t) => (
              <button
                key={t.ronda.id}
                type="button"
                onClick={() => elegirTransmision(t)}
                className={cn(
                  'max-w-full truncate rounded-full border px-4 py-2 text-xs transition-colors',
                  transmisionActiva === t.ronda.id
                    ? 'border-gold bg-gold/15 text-ink'
                    : 'border-ink/12 text-ink/60 hover:border-gold/50 hover:text-ink',
                )}
                title={[t.ronda.torneo, t.ronda.ronda, t.ronda.info].filter(Boolean).join(' · ')}
              >
                {t.ronda.enVivo ? (
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-mate" />
                ) : null}
                {t.ronda.torneo} · {t.ronda.ronda}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          {cargando ? (
            <div className="grid place-items-center rounded-lg border border-ink/8 bg-bone py-16 text-ink/50">
              <LoaderCircle className="size-7 animate-spin text-gold" />
              <p className="mt-4 text-sm">
                {fuente === 'elite' ? 'Consultando Lichess…' : 'Leyendo las partidas…'}
              </p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-xl rounded-lg border border-mate/30 bg-bone p-8 text-center">
              <TriangleAlert className="mx-auto size-7 text-mate" />
              <p className="mt-4 font-display text-xl text-ink">No se pudieron cargar las partidas</p>
              <p className="mt-2 text-sm text-ink/60">{error}</p>
              <button
                type="button"
                onClick={() => (fuente === 'club' ? cargarDelClub() : cargarElite())}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm transition-colors hover:border-gold hover:text-gold-deep"
              >
                <RefreshCw className="size-4" />
                Reintentar
              </button>
            </div>
          ) : partida ? (
            <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
              {/* Listado de partidas */}
              <ol className="max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
                {partidas.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSeleccionada(i)}
                      className={cn(
                        'w-full rounded-md border px-4 py-3 text-left transition-all duration-300',
                        i === seleccionada
                          ? 'border-gold/50 bg-bone shadow-[var(--shadow-lift)]'
                          : 'border-ink/8 bg-bone/60 hover:border-gold/40',
                      )}
                    >
                      <p className="text-[0.82rem] leading-snug font-medium text-ink">
                        {p.blancas} — {p.negras}
                      </p>
                      <p className="mt-1 text-[0.7rem] text-ink/50">
                        {[p.evento, p.resultado].filter(Boolean).join(' · ')}
                      </p>
                    </button>
                  </li>
                ))}
              </ol>

              <GameViewer partida={partida} />
            </div>
          ) : (
            <p className="text-center text-sm text-ink/50">No hay partidas para mostrar.</p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-ink/45">
          Las partidas de elite se leen en vivo desde la API pública de Lichess. Las clásicas se
          publican como archivos PGN, sin necesidad de servidor.
        </p>
      </div>
    </section>
  )
}

function BotonFuente({
  children,
  activo,
  onClick,
}: {
  children: React.ReactNode
  activo: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm transition-all duration-300',
        activo
          ? 'border-gold bg-ink text-ivory shadow-[var(--shadow-gold)]'
          : 'border-ink/12 text-ink/65 hover:border-gold/50 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
