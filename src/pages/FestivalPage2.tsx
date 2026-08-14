import { Link } from 'react-router-dom'
import { MessageCircle, FileText, ArrowRight, ArrowUpRight } from 'lucide-react'
import { club } from '@/data/site'
import { festival } from '@/data/festival'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { cn } from '@/lib/utils'

/**
 * ALTERNATIVA 2 — "La planilla".
 *
 * La otra página resuelve el torneo como un afiche: bandas oscuras, luces,
 * tarjetas. Esta parte del artefacto real del ajedrez de tablero, que no es el
 * afiche sino la planilla: el papel reglado donde se anotan las jugadas y el
 * boletín que el árbitro cuelga con los pareos. Todo el ajedrez federado se lee
 * en documentos así, y el jugador con Elo los reconoce de entrada.
 *
 * Qué significa eso acá:
 *
 * - Un solo fondo, papel (`bone`), de arriba abajo. Sin bandas alternadas: un
 *   boletín no cambia de color a la mitad. El único bloque en grafito es el
 *   cierre, que hace de sello.
 * - Filetes finos en lugar de tarjetas. La información se separa con reglas de
 *   1 px, como una planilla, y no con cajas con sombra.
 * - Los datos van en condensada (Bebas), que es la tipografía de los relojes y
 *   las planillas; el texto corrido en Inter; los títulos en Cormorant.
 * - La firma de la página es el cronograma resuelto como la tabla de rondas de
 *   un boletín: una fila por turno, la hora en el margen izquierdo, numeradas
 *   donde numerarlas dice algo (las siete rondas del IRT son una secuencia real;
 *   las secciones de la página no lo son, así que no se numeran).
 * - El color, casi nada: tinta sobre papel. El oro queda para el sello del
 *   centenario, el azul para lo homologado por FIDE y el rojo para lo que vence.
 */

/** Regla fina de la planilla. */
function Regla({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('bg-ink/12 h-px w-full', className)} />
}

/**
 * Rótulo de margen: el nombre del bloque a la izquierda, en versalitas, como el
 * encabezado de una columna de planilla.
 */
function Bloque({
  rotulo,
  titulo,
  children,
}: {
  rotulo: string
  titulo?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-ink/12 border-t py-8 lg:py-11">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[11rem_1fr]">
        <Reveal>
          <p className="kicker text-ink/40 text-[0.6rem] lg:sticky lg:top-24">{rotulo}</p>
        </Reveal>
        {/* min-w-0: sin esto la tabla de packs (min-w fijo) no deja que la
            columna se achique y toda la página desborda en mobile. */}
        <div className="min-w-0">
          {titulo ? (
            <Reveal>
              <h2 className="text-ink mb-7 text-2xl leading-tight lg:text-3xl">{titulo}</h2>
            </Reveal>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  )
}

function enlacesVigentes() {
  return Date.now() >= new Date(`${festival.chessResults.desdeISO}T00:00:00`).getTime()
}

/** Días que faltan para la primera ronda, para el sello de la cabecera. */
function diasQueFaltan() {
  const ms = new Date(`${festival.fechaISO}T00:00:00`).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function FestivalPage2() {
  const vigentes = enlacesVigentes()
  const faltan = diasQueFaltan()

  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ----------------------------------------------------------------
            Cabecera del boletín: los datos del torneo antes que nada, como
            el encabezado de una planilla oficial.
            ---------------------------------------------------------------- */}
        <header className="pt-24 pb-8 lg:pt-28 lg:pb-11">
          <Reveal className="motion-safe:animate-entrar">
            <div className="text-ink/45 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[0.7rem] tracking-[0.24em] uppercase">
              <span>{festival.nombre}</span>
              <span aria-hidden="true" className="bg-gold size-1 rotate-45" />
              <span>Posadas, Misiones</span>
              <span aria-hidden="true" className="bg-gold size-1 rotate-45" />
              <span>Boletín oficial</span>
            </div>

            <h1 className="text-ink mt-6 text-5xl leading-[0.95] font-medium sm:text-6xl lg:text-7xl">
              IRT “100 Años”
            </h1>

            {/* La fecha en condensada, como el marcador de un reloj, y al lado
                el sello con la cuenta regresiva: el dato que un boletín de
                torneo pone arriba de todo. */}
            <p className="font-condensed text-ink mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-3 text-[2.4rem] leading-none tracking-wide lg:text-[3rem]">
              <span>
                {festival.diaDesde}–{festival.diaHasta}
              </span>
              <span className="text-gold-deep text-[1.3rem] tracking-[0.3em] uppercase lg:text-[1.5rem]">
                Diciembre {festival.anio}
              </span>
              {faltan > 0 ? (
                <span className="border-ink/25 text-ink/60 -translate-y-1 rotate-[-2deg] border-2 px-3 py-1.5 text-[1rem] tracking-[0.2em] uppercase">
                  Faltan {faltan} días
                </span>
              ) : null}
            </p>
            <p className="sr-only">{festival.fechaTexto}</p>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Regla doble arriba y simple abajo, como un libro contable: la
                fila de cifras es el renglón de totales de la planilla. */}
            <div className="border-ink/30 mt-9 border-t-[3px] border-double" />
            <dl className="grid gap-x-10 gap-y-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
              {festival.cifras.map((c, i) => (
                <div key={c.rotulo}>
                  <dt
                    className={cn(
                      'font-condensed text-4xl leading-none',
                      // El único momento de oro del boletín: la bolsa.
                      i === 0 ? 'text-gold-deep' : 'text-ink',
                    )}
                  >
                    {c.valor}
                  </dt>
                  <dd className="text-ink/50 mt-2 text-[0.84rem] leading-snug">{c.rotulo}</dd>
                </div>
              ))}
            </dl>
            <Regla />
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_18rem]">
            <Reveal delay={0.12}>
              <p className="text-ink/70 max-w-2xl text-lg leading-relaxed">{festival.bajada}</p>

              <p className="text-ink/60 mt-6 text-[0.95rem]">
                <span className="text-ink/40 block text-[0.7rem] tracking-[0.2em] uppercase">
                  Sede
                </span>
                {festival.sede.nombre} · {festival.sede.direccion}
              </p>

              {festival.vencimiento ? (
                <p className="border-fada-red text-ink/75 mt-6 border-l-2 pl-4 text-[0.92rem] leading-snug">
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
                <Button asChild variant="outlineDark" size="lg">
                  <a href={festival.inscripcion.reglamento} target="_blank" rel="noreferrer">
                    <FileText />
                    Reglamento
                  </a>
                </Button>
              </div>
            </Reveal>

            {/* El afiche entra como anexo del boletín, no como portada */}
            <Reveal delay={0.16}>
              <figure className="border-ink/12 border p-2">
                <a href={festival.afiche.src} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={festival.afiche.src}
                    alt={festival.afiche.alt}
                    width={festival.afiche.ancho}
                    height={festival.afiche.alto}
                    className="block w-full"
                  />
                </a>
                <figcaption className="text-ink/40 mt-2 text-[0.68rem] tracking-[0.16em] uppercase">
                  Afiche oficial · abrir en grande
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </header>

        {/* ----------------------------------------------------------------
            Premios: una tabla de reparto, no tarjetas.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="Premios" titulo={`${festival.premios.total} en premios garantizados`}>
          <Reveal>
            <p className="text-ink/65 max-w-2xl leading-relaxed">{festival.premios.detalle}</p>

            <dl className="mt-7">
              {festival.premios.desglose.map((d) => (
                <div
                  key={d.torneo}
                  className="border-ink/12 flex items-baseline justify-between gap-6 border-b py-3.5"
                >
                  <dt className="text-ink/75 text-[0.98rem]">{d.torneo}</dt>
                  <dd className="font-condensed text-ink text-2xl leading-none tracking-wide">
                    {d.monto}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-ink/40 mt-7 text-[0.7rem] tracking-[0.2em] uppercase">
              Franjas con premio propio
            </p>
            <ul className="text-ink/70 mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9rem]">
              {festival.premios.franjas.map((f, i) => (
                <li key={f} className="flex items-center gap-5">
                  {i > 0 ? (
                    <span aria-hidden="true" className="bg-ink/20 size-1 rotate-45" />
                  ) : null}
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </Bloque>

        {/* ----------------------------------------------------------------
            Formato y arbitraje: lo homologado, en azul.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="Formato y validez" titulo="Suizo a 7 rondas, válido al Elo FIDE">
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            <Reveal>
              <dl>
                {festival.formato.items.map((f) => (
                  <div key={f.rotulo} className="border-ink/12 border-b py-3.5">
                    <dt className="text-fada-blue-deep text-[0.68rem] tracking-[0.2em] uppercase">
                      {f.rotulo}
                    </dt>
                    <dd className="text-ink/80 mt-1.5 text-[0.96rem] leading-snug">{f.valor}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-fada-blue-deep text-[0.68rem] tracking-[0.2em] uppercase">
                {festival.arbitraje.titulo}
              </p>
              <ul className="mt-3">
                {festival.arbitraje.integrantes.map((a) => (
                  <li key={a.nombre} className="border-ink/12 border-b py-3.5">
                    <p className="text-ink/45 text-[0.72rem] tracking-wide uppercase">{a.rol}</p>
                    <p className="font-display text-ink mt-0.5 text-xl leading-snug">{a.nombre}</p>
                    <p className="font-condensed text-fada-blue mt-0.5 text-[0.85rem] tracking-[0.14em]">
                      {a.fide}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="text-ink/50 mt-3.5 text-[0.88rem]">{festival.arbitraje.sistema}</p>
            </Reveal>
          </div>
        </Bloque>

        {/* ----------------------------------------------------------------
            Los cuatro torneos: filas de boletín, no tarjetas.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="El programa" titulo="Hay un tablero para cada uno">
          <ul>
            {festival.torneos.map((t, i) => (
              <Reveal key={t.nombre} delay={0.05 * i}>
                <li className="border-ink/12 grid gap-x-10 gap-y-3 border-b py-6 sm:grid-cols-[1fr_1.3fr]">
                  <div>
                    <p
                      className={cn(
                        'text-[0.62rem] tracking-[0.24em] uppercase',
                        t.tipo === 'Torneo' ? 'text-gold-deep' : 'text-ink/40',
                      )}
                    >
                      {t.tipo}
                    </p>
                    <h3 className="font-display text-ink mt-1 flex items-baseline gap-3 text-xl lg:text-2xl">
                      <ChessGlyph pieza={t.pieza as Pieza} className="text-gold/70 text-2xl" />
                      {t.nombre}
                    </h3>
                    <p className="font-condensed text-fada-blue-deep mt-1.5 text-[0.95rem] tracking-[0.1em]">
                      {t.cuando}
                    </p>
                  </div>
                  <ul className="text-ink/65 space-y-1 text-[0.9rem] leading-snug">
                    {t.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ul>
        </Bloque>

        {/* ----------------------------------------------------------------
            LA FIRMA: el cronograma como la tabla de rondas de un boletín.
            Una fila por turno, la hora en el margen, el día agrupando.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="Cronograma" titulo="Los cuatro días, turno por turno">
          {/* Cuatro columnas de planilla, una por día: apiladas medían media
              pantalla más y el boletín se hacía interminable. */}
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {festival.cronograma.dias.map((d, i) => (
              <Reveal key={d.dia} delay={0.05 * i}>
                <p className="border-ink/25 border-b pb-2">
                  <span className="font-display text-ink text-xl">{d.dia}</span>
                  <span className="text-ink/35 ml-2.5 text-[0.66rem] tracking-[0.2em] uppercase">
                    {d.mes}
                  </span>
                </p>
                <ol>
                  {d.turnos.map((t) => (
                    <li
                      key={t.hora}
                      className="border-ink/12 flex gap-3 border-b py-2.5 last:border-0"
                    >
                      <span className="font-condensed text-ink/80 w-12 shrink-0 text-lg leading-snug tracking-wide">
                        {t.hora}
                      </span>
                      <span className="text-ink/70 text-[0.9rem] leading-snug">{t.que}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </Bloque>

        {/* ----------------------------------------------------------------
            Aranceles: la escalera, en rojo, como una tabla de plazos.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="Inscripción" titulo="Aranceles, beneficios y packs">
          <Reveal>
            <p className="text-ink/65 max-w-2xl leading-relaxed">{festival.escala.bajada}</p>
          </Reveal>

          {/* Escala */}
          <Reveal delay={0.06}>
            <table className="mt-7 w-full border-collapse text-left">
              <thead>
                <tr className="border-ink/25 border-b">
                  <th className="text-fada-red py-2 text-[0.62rem] tracking-[0.2em] uppercase">
                    Plazo
                  </th>
                  <th className="text-fada-red py-2 text-[0.62rem] tracking-[0.2em] uppercase">
                    Cupos
                  </th>
                  <th className="text-fada-red py-2 text-right text-[0.62rem] tracking-[0.2em] uppercase">
                    Arancel
                  </th>
                </tr>
              </thead>
              <tbody>
                {festival.escala.tramos.map((t, i) => {
                  const ultimo = i === festival.escala.tramos.length - 1
                  return (
                    <tr key={t.cupos} className="border-ink/12 border-b">
                      <td className="py-3.5 align-top">
                        <span
                          className={cn('text-[0.92rem]', ultimo ? 'text-fada-red' : 'text-ink/75')}
                        >
                          {t.hasta}
                        </span>
                        {t.nota ? (
                          <span className="text-ink/40 mt-0.5 block text-[0.78rem] leading-snug">
                            {t.nota}
                          </span>
                        ) : null}
                      </td>
                      <td className="text-ink/60 py-3.5 align-top text-[0.9rem]">{t.cupos}</td>
                      <td
                        className={cn(
                          'font-condensed py-3.5 text-right align-top text-xl leading-none tracking-wide',
                          ultimo ? 'text-fada-red' : 'text-ink',
                        )}
                      >
                        {t.precio}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-ink/50 mt-4 text-[0.88rem] leading-relaxed">
              {festival.escala.aforo}
            </p>
          </Reveal>

          {/* Beneficios */}
          <Reveal delay={0.08}>
            <p className="text-ink/40 mt-10 text-[0.7rem] tracking-[0.2em] uppercase">
              Beneficios especiales
            </p>
            <ul className="mt-3">
              {festival.beneficios.map((b) => (
                <li
                  key={b.titulo}
                  className="border-ink/12 grid gap-x-8 gap-y-1 border-b py-3.5 sm:grid-cols-[14rem_1fr]"
                >
                  <div>
                    <span className="font-display text-ink text-lg">{b.titulo}</span>
                    <span className="text-gold-deep mt-0.5 block text-[0.7rem] tracking-[0.16em] uppercase">
                      {b.etiqueta}
                    </span>
                  </div>
                  <p className="text-ink/65 text-[0.9rem] leading-snug">{b.texto}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Packs */}
          <Reveal delay={0.1}>
            <p className="text-ink/40 mt-10 text-[0.7rem] tracking-[0.2em] uppercase">
              {festival.packs.titulo}
            </p>
            <p className="text-ink/60 mt-2 max-w-2xl text-[0.92rem] leading-relaxed">
              {festival.packs.bajada}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-ink/25 border-b">
                    <th className="text-ink/40 py-2 text-[0.62rem] tracking-[0.2em] uppercase">
                      Pack
                    </th>
                    {festival.packs.monedas.map((m) => (
                      <th
                        key={m}
                        className="text-ink/40 py-2 text-[0.62rem] tracking-[0.2em] uppercase"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {festival.packs.filas.map((f) => (
                    <tr key={f.pack} className="border-ink/12 border-b">
                      <td className="text-ink/80 py-3 text-[0.92rem]">{f.pack}</td>
                      <td className="font-condensed text-ink py-3 text-lg tracking-wide">
                        {f.ars}
                      </td>
                      <td className="text-ink/60 py-3 text-[0.88rem]">{f.usd}</td>
                      <td className="text-ink/60 py-3 text-[0.88rem]">{f.pyg}</td>
                      <td className="text-ink/60 py-3 text-[0.88rem]">{f.brl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Bloque>

        {/* ----------------------------------------------------------------
            Logística y seguimiento.
            ---------------------------------------------------------------- */}
        <Bloque rotulo="Logística" titulo="Sede, alojamiento y pagos">
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
            <Reveal>
              <p className="text-ink/40 text-[0.68rem] tracking-[0.2em] uppercase">Sede oficial</p>
              <p className="text-ink/80 mt-2 text-[0.94rem] leading-relaxed">
                {festival.sede.nombre}
                <br />
                {festival.sede.direccion}
              </p>
              <p className="text-ink/50 mt-1.5 text-[0.86rem]">{festival.sede.detalle}</p>
              <a
                href={festival.sede.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="text-gold-deep hover:text-gold mt-3 inline-flex items-center gap-1.5 text-[0.86rem] transition-colors"
              >
                Ver en el mapa
                <ArrowUpRight className="size-3.5" />
              </a>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="text-ink/40 text-[0.68rem] tracking-[0.2em] uppercase">Alojamiento</p>
              <p className="text-ink/80 mt-2 text-[0.94rem] leading-relaxed">
                {festival.alojamiento.lugar}
              </p>
              <p className="font-condensed text-ink mt-1.5 text-xl leading-none">
                {festival.alojamiento.precio}
              </p>
              <p className="text-ink/50 mt-1.5 text-[0.86rem]">{festival.alojamiento.detalle}</p>
              <a
                href={festival.alojamiento.reservasLink}
                target="_blank"
                rel="noreferrer"
                className="text-gold-deep hover:text-gold mt-3 inline-flex items-center gap-1.5 text-[0.86rem] transition-colors"
              >
                Reservas: {festival.alojamiento.reservas}
                <ArrowUpRight className="size-3.5" />
              </a>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-ink/40 text-[0.68rem] tracking-[0.2em] uppercase">
                Medios de pago
              </p>
              <dl className="mt-2">
                {festival.pagos.map((p) => (
                  <div key={p.pais} className="border-ink/12 border-b py-2.5">
                    <dt className="text-ink/45 text-[0.72rem] tracking-wide uppercase">
                      {p.pais} · {p.medio}
                    </dt>
                    <dd className="text-ink/80 mt-0.5 text-[0.9rem] break-words">{p.dato}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Cómo llegar: el mapa como anexo del boletín, con su leyenda */}
          <Reveal delay={0.08}>
            <figure className="border-ink/12 mt-9 border p-2">
              <iframe
                src={festival.sede.mapsEmbed}
                title={`Cómo llegar a la sede: ${festival.sede.nombre}, ${festival.sede.direccion}`}
                className="block h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <figcaption className="text-ink/40 mt-2 text-[0.68rem] tracking-[0.16em] uppercase">
                Cómo llegar
              </figcaption>
            </figure>
          </Reveal>

          {/* Seguimiento */}
          <Reveal delay={0.08}>
            <p
              className={cn(
                'mt-10 text-[0.7rem] tracking-[0.2em] uppercase',
                vigentes ? 'text-fada-blue-deep' : 'text-fada-red',
              )}
            >
              Seguimiento en vivo
            </p>
            {vigentes ? (
              <ul className="mt-3">
                {festival.chessResults.enlaces.map((e) => (
                  <li key={e.url} className="border-ink/12 border-b">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink/80 hover:text-fada-blue-deep group flex items-center justify-between gap-4 py-3.5 text-[0.94rem] transition-colors"
                    >
                      {e.torneo}
                      <span className="text-fada-blue flex items-center gap-2 text-[0.78rem] tracking-[0.16em] uppercase">
                        Chess-Results
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-fada-red text-ink/65 mt-3 max-w-2xl border-l-2 pl-4 text-[0.92rem] leading-relaxed">
                {festival.chessResults.aviso}
              </p>
            )}
          </Reveal>
        </Bloque>
      </div>

      {/* ------------------------------------------------------------------
          Cierre: el único bloque en grafito, como el sello del boletín.
          ------------------------------------------------------------------ */}
      <section className="bg-ink text-ivory mt-4">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
          <Reveal>
            <blockquote className="font-display text-ivory/90 max-w-4xl text-xl leading-snug italic lg:text-2xl">
              “{festival.espiritu.cita}”
            </blockquote>
            <p className="text-gold-bright mt-4 text-[0.66rem] tracking-[0.24em] uppercase">
              {festival.espiritu.citaFuente}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-ivory/15 mt-10 flex flex-wrap items-end justify-between gap-8 border-t pt-9">
              <div className="max-w-xl">
                <p className="text-fada-red-bright text-[0.66rem] tracking-[0.24em] uppercase">
                  Cupos limitados
                </p>
                <h2 className="text-ivory mt-3 text-2xl leading-snug lg:text-3xl">
                  Asegurá tu lugar en el festival
                </h2>
                <p className="text-ivory/60 mt-3 text-[0.94rem] leading-relaxed">
                  {festival.espiritu.reconocimientos.texto} Consultas por WhatsApp al{' '}
                  {festival.inscripcion.whatsappTexto}.
                </p>
                <Link
                  to="/historia"
                  className="text-gold-bright hover:text-gold mt-4 inline-flex items-center gap-2 text-[0.9rem] transition-colors"
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
    </div>
  )
}
