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

export function Partidas() {
  const [fuente, setFuente] = useState<Fuente>('club')
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [seleccionada, setSeleccionada] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transmisiones, setTransmisiones] = useState<Transmision[]>([])
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

  /** Elite: transmisiones oficiales de Lichess (Candidatos, GCT, Tata Steel...). */
  const cargarElite = useCallback(async (idRonda?: string) => {
    setCargando(true)
    setError(null)
    try {
      let rondas = transmisiones
      if (rondas.length === 0) {
        rondas = await obtenerTransmisionesElite(6)
        setTransmisiones(rondas)
      }
      const objetivo = idRonda ?? rondas[0]?.id
      if (!objetivo) throw new Error('Lichess no devolvió transmisiones disponibles en este momento')

      const pgn = await obtenerPgnDeRonda(objetivo)
      const todas = parsearArchivoPgn(pgn, objetivo)
      if (todas.length === 0) throw new Error('La ronda todavía no tiene partidas publicadas')

      setTransmisionActiva(objetivo)
      setPartidas(todas)
      setSeleccionada(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido al consultar Lichess')
      setPartidas([])
    } finally {
      setCargando(false)
    }
  }, [transmisiones])

  useEffect(() => {
    if (fuente === 'club') cargarDelClub()
    else cargarElite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuente])

  const partida = partidas[seleccionada]

  return (
    <section id="partidas" className="scroll-mt-24 bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker="Tablero en vivo"
          titulo="Partidas para mirar jugada por jugada"
          bajada="Las clásicas que se estudian en los talleres del club y, en la otra pestaña, las partidas de los torneos de elite que se están transmitiendo ahora mismo."
          align="center"
        />

        {/* Selector de fuente */}
        <Reveal className="mt-12 flex flex-wrap justify-center gap-2">
          <BotonFuente activo={fuente === 'club'} onClick={() => setFuente('club')}>
            Clásicas del club
          </BotonFuente>
          <BotonFuente activo={fuente === 'elite'} onClick={() => setFuente('elite')}>
            <Radio className="size-4" />
            Elite en vivo
          </BotonFuente>
        </Reveal>

        {/* Transmisiones disponibles */}
        {fuente === 'elite' && transmisiones.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {transmisiones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => cargarElite(t.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs transition-colors',
                  transmisionActiva === t.id
                    ? 'border-gold bg-gold/15 text-ink'
                    : 'border-ink/12 text-ink/60 hover:border-gold/50 hover:text-ink',
                )}
                title={t.info}
              >
                {t.enVivo ? <span className="mr-2 inline-block size-1.5 rounded-full bg-mate" /> : null}
                {t.torneo} · {t.ronda}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-12">
          {cargando ? (
            <div className="grid place-items-center rounded-lg border border-ink/8 bg-bone py-24 text-ink/50">
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
            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              {/* Listado de partidas */}
              <ol className="max-h-[34rem] space-y-1.5 overflow-y-auto pr-1">
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

        <p className="mt-10 text-center text-xs text-ink/45">
          Las partidas de elite se leen en vivo desde la API pública de Lichess. Las del club se publican como
          archivos PGN, sin necesidad de servidor.
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
