import { Link } from 'react-router-dom'
import { MessageCircle, FileText, ArrowRight, ArrowUpRight } from 'lucide-react'
import { club } from '@/data/site'
import { festival } from '@/data/festival'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { cn } from '@/lib/utils'

/**
 * La página del festival: "El tablero" (la alternativa 3, elegida por la
 * comisión en agosto de 2026; los otros dos bocetos quedaron en
 * `pages/deprecated/` solo como backup).
 *
 * La idea parte del tablero, y no como textura de fondo sino como estructura:
 * el tablero deja de ser un fondo tenue y pasa a ser la grilla con la que está
 * construida la página.
 *
 * Qué significa eso acá:
 *
 * - No hay tarjetas con sombra. Hay casilleros. Los bloques son cuadrados que
 *   alternan claro y oscuro como un tablero real, y el contenido vive adentro.
 * - La firma es la banda de los cuatro torneos: cuatro casilleros grandes en
 *   fila, alternados, cada uno con su pieza gigante detrás. Es la imagen que uno
 *   se lleva de la página.
 * - El cronograma se lee como cuatro columnas del tablero: una por día, un
 *   casillero por turno, alternando el tono igual que una columna real.
 * - Los aranceles son una fila de casilleros que se van oscureciendo hacia el
 *   cierre: la escalera se ve antes de leerse.
 *
 * El color es el del sitio —grafito, mármol, oro— con el azul de la Federación
 * en lo homologado y el rojo en lo que vence. Nunca lavados de fondo: sobre un
 * tablero, un lavado de color ensucia los casilleros claros.
 */

/** Un casillero. `oscuro` lo pone del color de las casillas negras. */
function Casillero({
  oscuro = false,
  className,
  children,
}: {
  oscuro?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden p-6 lg:p-7',
        oscuro ? 'bg-ink text-ivory' : 'bg-marble text-ink',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Banda separadora transparente, marcada solo por un filete dorado inferior.
 * Entra en dos mitades que se deslizan desde los bordes y se juntan al centro;
 * el disparo lo pone Reveal (.a-la-vista) y la transición vive en las mitades.
 */
function Rango({ className }: { className?: string }) {
  return (
    <Reveal y={0} className={className}>
      <div aria-hidden="true" className="flex overflow-hidden">
        <span className="border-gold/50 h-2.5 flex-1 -translate-x-full border-b bg-transparent transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] in-[.a-la-vista]:translate-x-0" />
        <span className="border-gold/50 h-2.5 flex-1 translate-x-full border-b bg-transparent transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] in-[.a-la-vista]:translate-x-0" />
      </div>
    </Reveal>
  )
}

function enlacesVigentes() {
  return Date.now() >= new Date(`${festival.chessResults.desdeISO}T00:00:00`).getTime()
}

/** Días que faltan para la primera ronda. */
function diasQueFaltan() {
  const ms = new Date(`${festival.fechaISO}T00:00:00`).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function FestivalPage() {
  const vigentes = enlacesVigentes()
  const faltan = diasQueFaltan()

  return (
    <>
      {/* ------------------------------------------------------------------
          Portada: lockup centrado, como el afiche, cerrado por un rango.
          ------------------------------------------------------------------ */}
      {/* 10px menos de aire arriba: la barra ya es transparente sobre este bloque. */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden pt-[86px] pb-0 lg:pt-[102px]">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* La columna del afiche mide lo que mide el afiche (22rem): con
              fracciones quedaba un vacío entre el texto y la imagen, y el
              afiche flotaba centrado en una columna más ancha que él. */}
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
            <div className="motion-safe:animate-entrar">
              <p className="text-gold-bright font-condensed text-sm tracking-[0.42em] uppercase">
                {festival.nombre}
              </p>

              <h1 className="mt-5 text-5xl leading-[0.94] font-medium sm:text-6xl lg:text-7xl">
                <span className="text-gold-gradient block">IRT “100 Años”</span>
              </h1>

              <p className="font-condensed text-ivory mt-7 flex flex-wrap items-baseline gap-x-4 text-[3rem] leading-none tracking-wide lg:text-[3.8rem]">
                <span>
                  {festival.diaDesde}–{festival.diaHasta}
                </span>
                <span className="text-gold text-[1.5rem] tracking-[0.3em] uppercase lg:text-[1.8rem]">
                  Dic {festival.anio}
                </span>
              </p>
              <span className="sr-only">{festival.fechaTexto}</span>
              {faltan > 0 ? (
                <p className="font-condensed text-gold-bright/80 mt-3 text-[0.95rem] tracking-[0.3em] uppercase">
                  Faltan {faltan} días
                </p>
              ) : null}

              {/* Un 10% más ancha que max-w-xl: hay lugar hasta el afiche. */}
              <p className="text-ivory/70 mt-7 max-w-[40rem] text-lg leading-relaxed">
                {festival.bajada}
              </p>

              <a
                href={festival.sede.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="text-ivory/55 hover:text-gold-bright mt-5 inline-flex items-start gap-1.5 text-[0.95rem] transition-colors"
              >
                {festival.sede.nombre} · {festival.sede.direccion}
                <ArrowUpRight className="mt-1 size-3.5 shrink-0" />
              </a>

              {festival.vencimiento ? (
                <p className="border-fada-red-bright text-ivory/75 mt-6 border-l-2 pl-4 text-[0.92rem] leading-snug">
                  {festival.vencimiento}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="gold" size="lg">
                  <a href={festival.inscripcion.formulario} target="_blank" rel="noreferrer">
                    Inscribirme
                    <ArrowRight />
                  </a>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <a href={festival.inscripcion.reglamento} target="_blank" rel="noreferrer">
                    <FileText />
                    Reglamento
                  </a>
                </Button>
              </div>
            </div>

            {/* En mobile va después del texto: antes que el título repetía lo
                que el visitante ya vio en el chat y empujaba el botón de
                inscripción una pantalla para abajo. */}
            <Reveal delay={0.1}>
              <img
                src={festival.afiche.src}
                alt={festival.afiche.alt}
                width={festival.afiche.ancho}
                height={festival.afiche.alto}
                // Corrido a la izquierda y un 5% más grande que max-w-xs: acompaña
                // la bajada más ancha sin tocar la columna de 22rem.
                className="border-gold/25 mx-auto block w-full max-w-[16.8rem] border shadow-[var(--shadow-gold)] sm:max-w-[21rem] lg:-translate-x-6"
              />
            </Reveal>
          </div>
        </div>

        {/* Las cifras, cada una en su casillero */}
        <Reveal delay={0.16}>
          <dl className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4">
            {festival.cifras.map((c, i) => (
              <div
                key={c.rotulo}
                className={cn('px-6 py-7 lg:px-8', i % 2 === 0 ? 'bg-graphite' : 'bg-ink')}
              >
                <dt className="font-condensed text-gold-bright text-4xl leading-none">{c.valor}</dt>
                <dd className="text-ivory/55 mt-2 text-[0.86rem] leading-snug">{c.rotulo}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Rango />
      </section>

      {/* ------------------------------------------------------------------
          LA FIRMA: los cuatro torneos como cuatro casilleros en fila.
          ------------------------------------------------------------------ */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {festival.torneos.map((t, i) => (
            <Reveal key={t.nombre} delay={0.06 * i}>
              <Casillero oscuro={i % 2 === 1} className="flex h-full min-h-[22rem] flex-col">
                {/* La pieza, gigante, como la marca de agua del casillero */}
                <ChessGlyph
                  pieza={t.pieza as Pieza}
                  className={cn(
                    'pointer-events-none absolute -right-4 -bottom-10 text-[11rem] leading-none select-none',
                    i % 2 === 1 ? 'text-ivory/[0.06]' : 'text-ink/[0.07]',
                  )}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className={cn(
                        'font-condensed text-[0.8rem] tracking-[0.2em]',
                        i % 2 === 1 ? 'text-fada-blue-bright' : 'text-fada-blue-deep',
                      )}
                    >
                      {t.cuando}
                    </p>
                    <p
                      className={cn(
                        'text-[0.6rem] tracking-[0.22em] uppercase',
                        t.tipo === 'Torneo'
                          ? i % 2 === 1
                            ? 'text-gold-bright/80'
                            : 'text-gold-deep'
                          : i % 2 === 1
                            ? 'text-ivory/40'
                            : 'text-ink/40',
                      )}
                    >
                      {t.tipo}
                    </p>
                  </div>

                  <h2
                    className={cn(
                      'font-display mt-3 text-2xl leading-tight',
                      i % 2 === 1 ? 'text-ivory' : 'text-ink',
                    )}
                  >
                    {t.nombre}
                  </h2>

                  <ul
                    className={cn(
                      'mt-5 space-y-2 border-t pt-5 text-[0.88rem] leading-snug',
                      i % 2 === 1 ? 'border-ivory/15 text-ivory/70' : 'border-ink/15 text-ink/70',
                    )}
                  >
                    {t.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {t.destacado ? (
                    <p
                      className={cn(
                        'font-condensed mt-auto pt-6 text-[0.72rem] tracking-[0.24em] uppercase',
                        i % 2 === 1 ? 'text-gold-bright' : 'text-gold-deep',
                      )}
                    >
                      Torneo principal
                    </p>
                  ) : null}
                </div>
              </Casillero>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Premios y formato: dos casilleros grandes, uno claro y uno oscuro.
          ------------------------------------------------------------------ */}
      <section className="grid lg:grid-cols-2">
        <Reveal>
          <Casillero className="h-full lg:p-12">
            <p className="kicker text-gold-deep">Bolsa de premios</p>
            <p className="font-condensed text-gold-deep mt-4 text-5xl leading-none lg:text-6xl">
              {festival.premios.total}
            </p>
            <p className="text-ink/65 mt-4 max-w-lg leading-relaxed">{festival.premios.detalle}</p>

            <dl className="mt-7">
              {festival.premios.desglose.map((d) => (
                <div
                  key={d.torneo}
                  className="border-ink/15 flex items-baseline justify-between gap-6 border-b py-3"
                >
                  <dt className="text-ink/75 text-[0.95rem]">{d.torneo}</dt>
                  <dd className="font-condensed text-ink text-xl leading-none">{d.monto}</dd>
                </div>
              ))}
            </dl>

            <p className="text-ink/45 mt-6 text-[0.68rem] tracking-[0.2em] uppercase">
              Franjas con premio propio
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {festival.premios.franjas.map((f) => (
                <li
                  key={f}
                  className="border-ink/20 text-ink/70 rounded-full border px-3 py-1 text-[0.78rem]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Casillero>
        </Reveal>

        <Reveal delay={0.08}>
          <Casillero oscuro className="h-full lg:p-12">
            <p className="kicker text-fada-blue-bright">{festival.formato.titulo}</p>

            <dl className="mt-6">
              {festival.formato.items.map((f) => (
                <div key={f.rotulo} className="border-ivory/12 border-b py-3.5">
                  <dt className="text-ivory/45 text-[0.7rem] tracking-[0.2em] uppercase">
                    {f.rotulo}
                  </dt>
                  <dd className="text-ivory/85 mt-1.5 text-[0.98rem] leading-snug">{f.valor}</dd>
                </div>
              ))}
            </dl>

            <p className="text-fada-blue-bright mt-7 text-[0.68rem] tracking-[0.2em] uppercase">
              {festival.arbitraje.titulo}
            </p>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2">
              {festival.arbitraje.integrantes.map((a) => (
                <li key={a.nombre}>
                  <p className="text-ivory/40 text-[0.7rem] tracking-wide uppercase">{a.rol}</p>
                  <p className="font-display text-ivory mt-0.5 text-lg leading-snug">{a.nombre}</p>
                  <p className="font-condensed text-fada-blue-bright mt-0.5 text-[0.82rem] tracking-[0.14em]">
                    {a.fide}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-ivory/50 mt-4 text-[0.86rem]">{festival.arbitraje.sistema}</p>
          </Casillero>
        </Reveal>
      </section>

      <Rango />

      {/* ------------------------------------------------------------------
          Cronograma: cuatro columnas del tablero, un casillero por turno.
          ------------------------------------------------------------------ */}
      <section className="bg-ink text-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="kicker text-fada-blue-bright">{festival.cronograma.titulo}</p>
            <h2 className="text-ivory mt-4 text-3xl leading-tight lg:text-4xl">
              Cuatro días, columna por columna
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {festival.cronograma.dias.map((d, col) => (
              <Reveal key={d.dia} delay={0.05 * col}>
                <div className="flex h-full flex-col">
                  <p className="bg-graphite border-gold/40 font-display text-ivory border-b-2 px-5 py-3 text-lg">
                    {d.dia}
                    <span className="text-ivory/35 ml-2 text-[0.68rem] tracking-[0.2em] uppercase">
                      {d.mes}
                    </span>
                  </p>

                  <ol className="flex-1">
                    {d.turnos.map((t, fila) => (
                      <li
                        key={t.hora}
                        // Alterna como una columna real del tablero: el tono
                        // depende de la suma de columna y fila.
                        className={cn(
                          'flex gap-3 px-5 py-3.5',
                          (col + fila) % 2 === 0 ? 'bg-ivory/[0.05]' : 'bg-transparent',
                        )}
                      >
                        <span className="font-condensed text-gold-bright w-12 shrink-0 text-[0.98rem] leading-snug tracking-wide">
                          {t.hora}
                        </span>
                        <span className="text-ivory/70 text-[0.86rem] leading-snug">{t.que}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          Aranceles: una fila de casilleros que se oscurece hacia el cierre.
          ------------------------------------------------------------------ */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="kicker text-gold-deep">{festival.escala.titulo}</p>
            <h2 className="text-ink mt-4 max-w-2xl text-3xl leading-tight lg:text-4xl">
              El arancel sube con los cupos
            </h2>
            <p className="text-ink/65 mt-4 max-w-2xl leading-relaxed">{festival.escala.bajada}</p>
          </Reveal>

          <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4">
            {festival.escala.tramos.map((t, i) => {
              const ultimo = i === festival.escala.tramos.length - 1
              return (
                <Reveal key={t.cupos} delay={0.05 * i}>
                  <li
                    className={cn(
                      'flex h-full flex-col border-t-2 p-6',
                      ultimo && 'border-t-fada-red bg-fada-red/[0.06]',
                    )}
                    // El filete se carga de oro tramo a tramo: la escalera se ve
                    // antes de leerse. El rojo queda solo para el cierre.
                    style={
                      ultimo
                        ? undefined
                        : {
                            borderTopColor: `color-mix(in srgb, var(--color-gold-deep) ${35 + i * 20}%, transparent)`,
                          }
                    }
                  >
                    <p
                      className={cn(
                        'font-condensed text-[0.78rem] tracking-[0.2em] uppercase',
                        ultimo ? 'text-fada-red' : 'text-gold-deep',
                      )}
                    >
                      {t.hasta}
                    </p>
                    <p className="text-ink/60 mt-3 text-[0.86rem]">{t.cupos}</p>
                    <p
                      className={cn(
                        'font-condensed mt-1.5 text-3xl leading-none',
                        ultimo ? 'text-fada-red' : 'text-ink',
                      )}
                    >
                      {t.precio}
                    </p>
                    {t.nota ? (
                      <p className="text-ink/45 mt-auto pt-4 text-[0.78rem] leading-snug">
                        {t.nota}
                      </p>
                    ) : null}
                  </li>
                </Reveal>
              )
            })}
          </ol>

          <Reveal delay={0.08}>
            <p className="border-fada-red text-ink/60 mt-6 border-l-2 pl-5 text-[0.92rem] leading-relaxed">
              {festival.escala.aforo}
            </p>
          </Reveal>

          {/* Beneficios y packs */}
          <div className="mt-11 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal delay={0.06}>
              <p className="kicker text-gold-deep text-[0.6rem]">Beneficios especiales</p>
              <ul className="mt-4">
                {festival.beneficios.map((b) => (
                  <li key={b.titulo} className="border-ink/12 border-b py-3.5">
                    <div className="flex items-baseline gap-3">
                      <ChessGlyph pieza={b.pieza as Pieza} className="text-gold/70 text-xl" />
                      <span className="font-display text-ink text-lg">{b.titulo}</span>
                    </div>
                    <p className="text-gold-deep mt-1 text-[0.68rem] tracking-[0.16em] uppercase">
                      {b.etiqueta}
                    </p>
                    <p className="text-ink/65 mt-1.5 text-[0.88rem] leading-snug">{b.texto}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* min-w-0: la tabla de packs tiene ancho mínimo fijo y sin esto la
                columna del grid no se achica y la página desborda en mobile. */}
            <Reveal delay={0.12} className="min-w-0">
              <p className="kicker text-gold-deep text-[0.6rem]">{festival.packs.titulo}</p>
              <p className="text-ink/60 mt-3 text-[0.92rem] leading-relaxed">
                {festival.packs.bajada}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left">
                  <thead>
                    <tr className="border-ink/25 border-b">
                      <th className="text-ink/40 py-2 text-[0.6rem] tracking-[0.2em] uppercase">
                        Pack
                      </th>
                      {festival.packs.monedas.map((m) => (
                        <th
                          key={m}
                          className="text-ink/40 py-2 text-[0.6rem] tracking-[0.2em] uppercase"
                        >
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {festival.packs.filas.map((f, i) => (
                      <tr
                        key={f.pack}
                        className={cn('border-ink/10 border-b', i % 2 === 0 && 'bg-marble/40')}
                      >
                        <td className="text-ink/80 px-2 py-3 text-[0.9rem]">{f.pack}</td>
                        <td className="font-condensed text-ink px-2 py-3 text-lg tracking-wide">
                          {f.ars}
                        </td>
                        <td className="text-ink/60 px-2 py-3 text-[0.86rem]">{f.usd}</td>
                        <td className="text-ink/60 px-2 py-3 text-[0.86rem]">{f.pyg}</td>
                        <td className="text-ink/60 px-2 py-3 text-[0.86rem]">{f.brl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Rango />

      {/* ------------------------------------------------------------------
          Logística y seguimiento: tres casilleros alternados.
          ------------------------------------------------------------------ */}
      <section className="grid md:grid-cols-3">
        <Reveal>
          <Casillero oscuro className="h-full lg:p-9">
            <p className="kicker text-gold-bright text-[0.58rem]">Sede oficial</p>
            <p className="text-ivory/85 mt-4 leading-relaxed">
              {festival.sede.nombre}
              <br />
              {festival.sede.direccion}
            </p>
            <p className="text-ivory/45 mt-2 text-[0.86rem]">{festival.sede.detalle}</p>
            <a
              href={festival.sede.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="text-gold-bright hover:text-gold mt-4 inline-flex items-center gap-1.5 text-[0.86rem] transition-colors"
            >
              Ver en el mapa
              <ArrowUpRight className="size-3.5" />
            </a>
          </Casillero>
        </Reveal>

        <Reveal delay={0.06}>
          <Casillero className="h-full lg:p-9">
            <p className="kicker text-gold-deep text-[0.58rem]">Alojamiento</p>
            <p className="text-ink/85 mt-4 leading-relaxed">{festival.alojamiento.lugar}</p>
            <p className="font-condensed text-ink mt-2 text-2xl leading-none">
              {festival.alojamiento.precio}
            </p>
            <p className="text-ink/50 mt-2 text-[0.86rem]">{festival.alojamiento.detalle}</p>
            <a
              href={festival.alojamiento.reservasLink}
              target="_blank"
              rel="noreferrer"
              className="text-gold-deep hover:text-gold mt-4 inline-flex items-center gap-1.5 text-[0.86rem] transition-colors"
            >
              Reservas: {festival.alojamiento.reservas}
              <ArrowUpRight className="size-3.5" />
            </a>
          </Casillero>
        </Reveal>

        <Reveal delay={0.12}>
          <Casillero oscuro className="h-full lg:p-9">
            <p className="kicker text-gold-bright text-[0.58rem]">Medios de pago</p>
            <dl className="mt-4">
              {festival.pagos.map((p) => (
                <div key={p.pais} className="border-ivory/12 border-b py-2.5">
                  <dt className="text-ivory/40 text-[0.72rem] tracking-wide uppercase">
                    {p.pais} · {p.medio}
                  </dt>
                  <dd className="text-ivory/85 mt-0.5 text-[0.9rem] break-words">{p.dato}</dd>
                </div>
              ))}
            </dl>
          </Casillero>
        </Reveal>
      </section>

      {/* Cómo llegar: el mapa a todo el ancho, como un casillero más. */}
      <section aria-label={`Cómo llegar a la sede: ${festival.sede.nombre}`}>
        <iframe
          src={festival.sede.mapsEmbed}
          title={`Cómo llegar a la sede: ${festival.sede.nombre}, ${festival.sede.direccion}`}
          className="block h-56 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>

      {/* ------------------------------------------------------------------
          Seguimiento y cierre.
          ------------------------------------------------------------------ */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className={cn('kicker', vigentes ? 'text-fada-blue-deep' : 'text-fada-red')}>
              Seguimiento en vivo
            </p>
          </Reveal>

          {vigentes ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {festival.chessResults.enlaces.map((e, i) => (
                <Reveal key={e.url} delay={0.05 * i}>
                  <li className="h-full">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border-fada-blue/35 hover:border-fada-blue hover:bg-fada-blue/[0.06] group flex h-full items-start justify-between gap-3 border p-4 transition-colors"
                    >
                      <span>
                        <span className="text-fada-blue-deep block text-[0.62rem] tracking-[0.2em] uppercase">
                          Chess-Results
                        </span>
                        <span className="text-ink/85 mt-1.5 block text-[0.92rem] leading-snug">
                          {e.torneo}
                        </span>
                      </span>
                      <ArrowUpRight className="text-fada-blue/60 mt-0.5 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.06}>
              <p className="border-fada-red text-ink/65 mt-5 max-w-3xl border-l-2 pl-5 text-[0.94rem] leading-relaxed">
                {festival.chessResults.aviso}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <figure className="border-gold/40 mt-12 border-l-2 pl-7 lg:pl-9">
              <blockquote className="font-display text-ink text-xl leading-snug italic lg:text-2xl">
                “{festival.espiritu.cita}”
              </blockquote>
              <figcaption className="text-gold-deep mt-4 text-[0.62rem] tracking-[0.24em] uppercase">
                {festival.espiritu.citaFuente}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <Rango />

      <section className="bg-ink text-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-fada-red-bright font-condensed text-[0.72rem] tracking-[0.24em] uppercase">
                  Cupos limitados
                </p>
                <h2 className="text-ivory mt-3 text-3xl leading-snug lg:text-4xl">
                  Asegurá tu lugar en el festival
                </h2>
                <p className="text-ivory/65 mt-4 text-[0.95rem] leading-relaxed">
                  {festival.espiritu.reconocimientos.texto} Consultas por WhatsApp al{' '}
                  <a
                    href={festival.inscripcion.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ivory decoration-gold/60 hover:text-gold-bright underline underline-offset-4 transition-colors"
                  >
                    {festival.inscripcion.whatsappTexto}
                  </a>
                  .
                </p>
                <Link
                  to="/historia"
                  className="text-gold-bright hover:text-gold mt-5 inline-flex items-center gap-2 text-[0.9rem] transition-colors"
                >
                  Leer los cien años del club
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild variant="gold" size="lg">
                  <a href={festival.inscripcion.formulario} target="_blank" rel="noreferrer">
                    Inscribirme
                    <ArrowRight />
                  </a>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <a href={club.whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    Consultar
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
