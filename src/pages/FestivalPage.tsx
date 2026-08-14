import { Link } from 'react-router-dom'
import {
  MessageCircle,
  FileText,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  BedDouble,
  Wallet,
  Clock,
} from 'lucide-react'
import { club } from '@/data/site'
import { festival } from '@/data/festival'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GraphiteCurves, GoldDivider } from '@/components/Ornaments'
import { cn } from '@/lib/utils'

/**
 * La página del IRT "100 Años": los cuatro torneos del festival del centenario.
 *
 * Sobre el color, después de verla armada y mirarla en pantalla: la primera
 * versión pintaba cada banda oscura con un lavado distinto —oro, azul, rojo—
 * encima de la textura de tablero, y el tablero era marfil. Un lavado cálido
 * sobre casilleros cálidos da marrón: el encabezado salía marrón, la banda de
 * FIDE verdosa y la de packs borravino. Tres tableros de tres colores en una
 * misma página, y ninguno parecía del mismo sitio que el resto.
 *
 * Ahora el tablero va en `marble`, el gris frío que el sitio ya tenía definido
 * para las piezas y los tableros del club, y las bandas oscuras no llevan ningún
 * lavado de color encima: la profundidad la dan las curvas de grafito, que son
 * grises y no tiñen nada. De la paleta de la Federación queda el azul en los
 * datos oficiales (FIDE ID, Chess-Results, el cronograma) y el rojo en lo que
 * vence (los tramos de arancel). Como acentos de tinta, nunca de fondo.
 *
 * Sobre el largo: al principio eran diez bandas, una por tema, cada una con su
 * rótulo y su título grande. Leído de corrido era andamiaje repetido y la página
 * medía más de siete mil píxeles. Quedaron seis, agrupadas por el momento en que
 * uno necesita el dato: qué se juega, cuándo, cuánto sale, cómo llegar.
 */

/** Tablero de las bandas oscuras: mármol frío, sin nada de color encima. */
function Tablero({ size = 56 }: { size?: number }) {
  return <BoardTexture className="text-marble" size={size} opacity={0.05} />
}

/**
 * Los tres torneos ya tienen ficha en Chess-Results, pero el club pidió
 * publicarlos recién el 1.º de septiembre.
 *
 * La fecha se arma sin `Z`, así que se lee como medianoche local: el corte cae
 * cuando empieza ese día para quien está mirando la página, que es lo que
 * significa "a partir del 1.º" y no obliga a nadie a esperar el huso de otro.
 */
function enlacesVigentes() {
  return Date.now() >= new Date(`${festival.chessResults.desdeISO}T00:00:00`).getTime()
}

/**
 * Encabezado de banda. Un solo tamaño para las seis: el título grande es el de
 * la portada y no compite con nada más en la página.
 */
function Encabezado({
  kicker,
  titulo,
  claro = false,
  children,
}: {
  kicker: string
  titulo: string
  /** Sobre grafito. */
  claro?: boolean
  children?: React.ReactNode
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className={cn('kicker', claro ? 'text-gold-bright' : 'text-gold-deep')}>{kicker}</p>
      <h2
        className={cn('mt-4 text-3xl leading-[1.1] lg:text-4xl', claro ? 'text-ivory' : 'text-ink')}
      >
        {titulo}
      </h2>
      {children ? (
        <p className={cn('mt-4 leading-relaxed', claro ? 'text-ivory/70' : 'text-ink/65')}>
          {children}
        </p>
      ) : null}
    </Reveal>
  )
}

export function FestivalPage() {
  const vigentes = enlacesVigentes()

  return (
    <>
      {/* ------------------------------------------------------------------
          1. Portada: el afiche, la fecha y las cuatro cifras.
          ------------------------------------------------------------------ */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden pt-24 pb-10 lg:pt-28 lg:pb-14">
        <Tablero size={50} />
        <GraphiteCurves className="opacity-80" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
            <div className="motion-safe:animate-entrar">
              <p className="kicker text-gold-bright">{festival.nombre}</p>
              <h1 className="mt-4 text-4xl leading-[1.02] font-medium sm:text-5xl lg:text-6xl">
                <span className="text-gold-gradient block">IRT “100 Años”</span>
              </h1>

              <time
                dateTime={festival.fechaISO}
                className="mt-6 flex flex-wrap items-baseline gap-x-3"
              >
                <span className="font-condensed text-ivory flex items-baseline leading-[0.8]">
                  <span className="text-[3.4rem] lg:text-[4.2rem]">{festival.diaDesde}</span>
                  <span className="text-gold mx-2 text-[2rem] lg:text-[2.4rem]">—</span>
                  <span className="text-[3.4rem] lg:text-[4.2rem]">{festival.diaHasta}</span>
                </span>
                <span className="font-condensed text-gold-bright text-xl tracking-[0.28em] uppercase lg:text-2xl">
                  {festival.mesCorto} {festival.anio}
                </span>
                <span className="sr-only">{festival.fechaTexto}</span>
              </time>

              <GoldDivider className="mt-6 max-w-md" />

              <p className="text-ivory/70 mt-6 max-w-2xl text-lg leading-relaxed">
                {festival.bajada}
              </p>

              <a
                href={festival.sede.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="text-ivory/60 hover:text-gold-bright mt-6 inline-flex items-start gap-2.5 text-[0.95rem] transition-colors"
              >
                <MapPin className="text-gold mt-0.5 size-4 shrink-0" />
                <span>
                  {festival.sede.nombre} · {festival.sede.direccion}
                </span>
              </a>

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

            {/* El afiche es la pieza que circula por WhatsApp: se puede abrir en
                grande. En mobile va después del texto: primero iba antes, y quien
                llegaba desde el chat veía de nuevo el afiche que ya tenía, con el
                título y el botón de inscripción a una pantalla entera de scroll. */}
            <Reveal delay={0.1} className="mx-auto w-full max-w-sm lg:max-w-none">
              <a
                href={festival.afiche.src}
                target="_blank"
                rel="noreferrer"
                className="border-gold/30 hover:border-gold/70 group block overflow-hidden rounded-xl border shadow-[var(--shadow-gold)] transition-colors"
              >
                <img
                  src={festival.afiche.src}
                  alt={festival.afiche.alt}
                  width={festival.afiche.ancho}
                  height={festival.afiche.alto}
                  className="block w-full transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <dl className="border-ivory/12 mt-10 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {festival.cifras.map((c) => (
                <div key={c.rotulo}>
                  <dt className="font-condensed text-gold-bright text-3xl leading-none lg:text-4xl">
                    {c.valor}
                  </dt>
                  <dd className="text-ivory/55 mt-2 text-[0.88rem] leading-snug">{c.rotulo}</dd>
                </div>
              ))}
            </dl>

            {/* La tarifa vigente cierra la banda de cifras. Va en rojo porque es
                lo único de la portada que se vence, que es lo que el rojo de la
                Federación marca en el resto de la página. */}
            {festival.vencimiento ? (
              <p className="border-fada-red-bright/70 text-ivory/75 mt-7 flex items-start gap-3 border-l-2 pl-4 text-[0.92rem] leading-snug">
                <span
                  aria-hidden="true"
                  className="bg-fada-red-bright mt-[0.42rem] size-1.5 shrink-0 rotate-45"
                />
                {festival.vencimiento}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. Qué se juega: premios a un lado, formato y arbitraje al otro.
          Antes eran dos bandas enteras que decían lo mismo desde dos ángulos.
          ------------------------------------------------------------------ */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Encabezado kicker="Qué se juega" titulo={`${festival.premios.total} en premios`}>
            {festival.premios.detalle}
          </Encabezado>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
            {/* Premios */}
            <Reveal delay={0.06}>
              <div className="border-gold/45 bg-ink text-ivory flex h-full flex-col rounded-lg border p-6 shadow-[var(--shadow-gold)] lg:p-7">
                <dl className="grid gap-5 sm:grid-cols-2">
                  {festival.premios.desglose.map((d) => (
                    <div key={d.torneo}>
                      <dt className="text-ivory/55 text-[0.82rem]">{d.torneo}</dt>
                      <dd className="font-condensed text-gold-bright mt-1 text-3xl leading-none">
                        {d.monto}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="kicker text-ivory/40 mt-7 text-[0.55rem]">
                  Franjas con premio propio
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {festival.premios.franjas.map((f) => (
                    <li
                      key={f}
                      className="border-ivory/20 text-ivory/75 rounded-full border px-3 py-1 text-[0.78rem]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Formato y arbitraje: lo oficial, en azul de la Federación */}
            <Reveal delay={0.12}>
              <div className="border-ink/8 flex h-full flex-col rounded-lg border bg-white/70 p-6 lg:p-7">
                <p className="kicker text-fada-blue-deep text-[0.6rem]">
                  {festival.formato.titulo}
                </p>

                <dl className="mt-5">
                  {festival.formato.items.map((f, i) => (
                    <div
                      key={f.rotulo}
                      className={cn('border-ink/8', i > 0 && 'mt-4 border-t pt-4')}
                    >
                      <dt className="text-ink/45 text-[0.72rem] tracking-wide uppercase">
                        {f.rotulo}
                      </dt>
                      <dd className="text-ink/80 mt-1 text-[0.95rem] leading-snug">{f.valor}</dd>
                    </div>
                  ))}
                </dl>

                <p className="kicker text-fada-blue-deep mt-7 text-[0.55rem]">
                  {festival.arbitraje.titulo}
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {festival.arbitraje.integrantes.map((a) => (
                    <li key={a.nombre}>
                      <p className="text-ink/45 text-[0.72rem] tracking-wide uppercase">{a.rol}</p>
                      <p className="font-display text-ink mt-0.5 text-lg leading-snug">
                        {a.nombre}
                      </p>
                      <p className="text-fada-blue font-condensed mt-0.5 text-[0.8rem] tracking-[0.12em]">
                        {a.fide}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="text-ink/50 mt-4 text-[0.85rem]">{festival.arbitraje.sistema}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Los cuatro torneos y el cronograma, juntos: los dos contestaban
          "cuándo se juega qué" y por separado se repetían.
          ------------------------------------------------------------------ */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <Tablero size={58} />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Encabezado
            kicker="Tres torneos y una jornada"
            titulo="Hay un tablero para cada uno"
            claro
          >
            El IRT es el torneo principal, pero el festival se juega en cuatro frentes: desde los
            titulados hasta quien recién aprende a mover las piezas.
          </Encabezado>

          <ul className="mt-8 grid gap-3 lg:grid-cols-2">
            {festival.torneos.map((t, i) => (
              <Reveal key={t.nombre} delay={0.05 * i}>
                <li
                  className={cn(
                    'flex h-full flex-col rounded-lg border p-5 transition-colors duration-300 lg:p-6',
                    t.destacado
                      ? 'border-gold/45 bg-graphite/70 shadow-[var(--shadow-gold)]'
                      : 'border-ivory/12 hover:border-ivory/25',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-ivory flex items-baseline gap-3 text-xl lg:text-2xl">
                      <ChessGlyph
                        pieza={t.pieza as Pieza}
                        className={cn(
                          'text-2xl',
                          t.destacado ? 'text-gold-bright' : 'text-gold/60',
                        )}
                      />
                      {t.nombre}
                    </h3>
                    <span className="shrink-0 text-right leading-tight">
                      {/* Torneo o actividades: los tres torneos tienen planilla
                          en Chess-Results; los talleres son la jornada paralela. */}
                      <span
                        className={cn(
                          'kicker block text-[0.5rem]',
                          t.tipo === 'Torneo' ? 'text-gold-bright/80' : 'text-ivory/45',
                        )}
                      >
                        {t.tipo}
                      </span>
                      <span className="text-fada-blue-bright mt-1 block text-[0.78rem]">
                        {t.cuando}
                      </span>
                    </span>
                  </div>

                  <ul className="border-ivory/10 text-ivory/70 mt-4 space-y-1.5 border-t pt-4 text-[0.86rem] leading-snug">
                    {t.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="bg-gold/70 mt-[0.35rem] size-1 shrink-0 rotate-45"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ul>

          {/* Cronograma: cuatro columnas, una por día */}
          <Reveal delay={0.1}>
            <p className="kicker text-fada-blue-bright border-ivory/12 mt-12 border-t pt-9">
              {festival.cronograma.titulo}
            </p>
          </Reveal>

          <div className="mt-5 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {festival.cronograma.dias.map((d, i) => (
              <Reveal key={d.dia} delay={0.05 * i}>
                <div className="border-ivory/12 border-t pt-4">
                  <p className="font-display text-ivory text-lg">{d.dia}</p>
                  <ol className="mt-3 space-y-2">
                    {d.turnos.map((t) => (
                      <li key={t.hora} className="flex gap-3">
                        <span className="font-condensed text-fada-blue-bright w-12 shrink-0 text-[0.95rem] leading-snug tracking-wide">
                          {t.hora}
                        </span>
                        <span className="text-ivory/65 text-[0.84rem] leading-snug">{t.que}</span>
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
          4. Cuánto sale: beneficios, escala y packs en una sola banda.
          ------------------------------------------------------------------ */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Encabezado kicker="Cuánto sale" titulo="Inscripción y packs">
            {festival.escala.bajada}
          </Encabezado>

          {/* Beneficios: tres líneas, no tres tarjetas grandes */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {festival.beneficios.map((b, i) => (
              <Reveal key={b.titulo} delay={0.05 * i}>
                <article className="border-gold/30 flex h-full gap-4 rounded-lg border bg-white/70 p-5">
                  <ChessGlyph pieza={b.pieza as Pieza} className="text-gold/70 text-3xl" />
                  <div>
                    <h3 className="font-display text-ink text-lg leading-tight">{b.titulo}</h3>
                    <p className="kicker text-gold-deep mt-1 text-[0.5rem]">{b.etiqueta}</p>
                    <p className="text-ink/65 mt-2.5 text-[0.85rem] leading-snug">{b.texto}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* La escala es lo único que vence, así que es lo único en rojo. El
              filete superior se va cargando tramo a tramo: leídas en fila, las
              cuatro tarjetas muestran que el arancel sube con los cupos. */}
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {festival.escala.tramos.map((t, i) => {
              const ultimo = i === festival.escala.tramos.length - 1
              return (
                <Reveal key={t.cupos} delay={0.05 * i}>
                  <li
                    className={cn(
                      'border-ink/8 border-t-fada-red flex h-full flex-col rounded-lg border border-t-4 p-5',
                      ultimo ? 'bg-fada-red/[0.06]' : 'bg-white/70',
                    )}
                    style={{
                      borderTopColor: `color-mix(in srgb, var(--color-fada-red) ${45 + i * 18}%, transparent)`,
                    }}
                  >
                    <p className="kicker text-fada-red text-[0.55rem]">{t.hasta}</p>
                    <p className="text-ink/60 mt-2.5 text-[0.85rem]">{t.cupos}</p>
                    <p
                      className={cn(
                        'font-condensed mt-1.5 text-2xl leading-none',
                        ultimo ? 'text-fada-red' : 'text-ink',
                      )}
                    >
                      {t.precio}
                    </p>
                    {t.nota ? (
                      <p className="text-ink/45 mt-auto pt-3 text-[0.76rem] leading-snug">
                        {t.nota}
                      </p>
                    ) : null}
                  </li>
                </Reveal>
              )
            })}
          </ol>

          <Reveal delay={0.08}>
            <p className="border-fada-red/50 text-ink/60 mt-5 border-l-2 pl-5 text-[0.9rem] leading-relaxed">
              {festival.escala.aforo}
            </p>
          </Reveal>

          {/* Packs */}
          <Reveal delay={0.1}>
            <p className="kicker text-gold-deep mt-11 text-[0.6rem]">{festival.packs.titulo}</p>
            <p className="text-ink/60 mt-3 max-w-3xl text-[0.95rem] leading-relaxed">
              {festival.packs.bajada}
            </p>
          </Reveal>

          {/* Cinco columnas: en mobile scrollea sola antes que apretujar cuatro monedas. */}
          <Reveal delay={0.12}>
            <div className="border-ink/10 mt-5 overflow-x-auto rounded-lg border bg-white/70">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <thead>
                  <tr className="border-ink/10 border-b">
                    <th scope="col" className="kicker text-ink/45 px-5 py-3.5 text-[0.55rem]">
                      Opción / pack
                    </th>
                    {festival.packs.monedas.map((m) => (
                      <th
                        key={m}
                        scope="col"
                        className="kicker text-gold-deep px-5 py-3.5 text-[0.55rem]"
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {festival.packs.filas.map((f) => (
                    <tr
                      key={f.pack}
                      className="border-ink/8 hover:bg-gold/[0.04] border-b transition-colors last:border-0"
                    >
                      <th
                        scope="row"
                        className="text-ink/85 px-5 py-3.5 text-[0.92rem] font-normal"
                      >
                        {f.pack}
                      </th>
                      <td className="font-condensed text-ink px-5 py-3.5 text-lg tracking-wide">
                        {f.ars}
                      </td>
                      <td className="text-ink/60 px-5 py-3.5 text-[0.88rem]">{f.usd}</td>
                      <td className="text-ink/60 px-5 py-3.5 text-[0.88rem]">{f.pyg}</td>
                      <td className="text-ink/60 px-5 py-3.5 text-[0.88rem]">{f.brl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. Logística y seguimiento en vivo, juntos: las dos son "cómo hago".
          ------------------------------------------------------------------ */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <Tablero size={64} />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Encabezado kicker="Cómo llegar y cómo pagar" titulo="Sede, alojamiento y pagos" claro />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Reveal delay={0.05}>
              <article className="border-ivory/12 flex h-full flex-col rounded-lg border p-6">
                <MapPin className="text-gold size-5" />
                <h3 className="font-display text-ivory mt-4 text-xl">Sede oficial</h3>
                <p className="text-ivory/70 mt-3 text-[0.92rem] leading-relaxed">
                  {festival.sede.nombre}
                  <br />
                  {festival.sede.direccion}
                </p>
                <p className="text-ivory/45 mt-2 text-[0.85rem]">{festival.sede.detalle}</p>
                <a
                  href={festival.sede.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-bright hover:text-gold mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.86rem] transition-colors"
                >
                  Ver en el mapa
                  <ArrowUpRight className="size-3.5" />
                </a>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="border-ivory/12 flex h-full flex-col rounded-lg border p-6">
                <BedDouble className="text-gold size-5" />
                <h3 className="font-display text-ivory mt-4 text-xl">Alojamiento</h3>
                <p className="text-ivory/70 mt-3 text-[0.92rem] leading-relaxed">
                  {festival.alojamiento.lugar}
                </p>
                <p className="font-condensed text-ivory mt-2 text-xl leading-none">
                  {festival.alojamiento.precio}
                </p>
                <p className="text-ivory/45 mt-2 text-[0.85rem]">{festival.alojamiento.detalle}</p>
                <a
                  href={festival.alojamiento.reservasLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-bright hover:text-gold mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.86rem] transition-colors"
                >
                  Reservas: {festival.alojamiento.reservas}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </article>
            </Reveal>

            <Reveal delay={0.15}>
              <article className="border-ivory/12 flex h-full flex-col rounded-lg border p-6">
                <Wallet className="text-gold size-5" />
                <h3 className="font-display text-ivory mt-4 text-xl">Medios de pago</h3>
                <dl className="mt-4 space-y-3">
                  {festival.pagos.map((p) => (
                    <div
                      key={p.pais}
                      className="border-ivory/10 border-t pt-3 first:border-0 first:pt-0"
                    >
                      <dt className="text-ivory/40 text-[0.74rem] tracking-wide uppercase">
                        {p.pais} · {p.medio}
                      </dt>
                      <dd className="text-ivory/85 mt-1 text-[0.9rem] break-words">{p.dato}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          </div>

          {/* Cómo llegar: el mapa de la sede, embebido igual que el de la sede
              del club en el inicio. */}
          <Reveal delay={0.08}>
            <div className="border-ivory/12 mt-4 overflow-hidden rounded-lg border">
              <iframe
                src={festival.sede.mapsEmbed}
                title={`Cómo llegar a la sede: ${festival.sede.nombre}, ${festival.sede.direccion}`}
                className="block h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          {/* Seguimiento en vivo. El rótulo sigue el estado del bloque: mientras
              falta para el 1.º de septiembre es una fecha pendiente y va en rojo;
              cuando los enlaces entran, pasa al azul de los datos oficiales. */}
          <Reveal delay={0.1}>
            <p
              className={cn(
                'kicker border-ivory/12 mt-11 border-t pt-9',
                vigentes ? 'text-fada-blue-bright' : 'text-fada-red-bright',
              )}
            >
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
                      className="border-fada-blue/40 hover:border-fada-blue-bright hover:bg-fada-blue/10 group flex h-full items-start justify-between gap-3 rounded-lg border p-4 transition-colors"
                    >
                      <span>
                        <span className="kicker text-fada-blue-bright block text-[0.5rem]">
                          Chess-Results
                        </span>
                        <span className="text-ivory/90 mt-1.5 block text-[0.92rem] leading-snug">
                          {e.torneo}
                        </span>
                      </span>
                      <ArrowUpRight className="text-fada-blue-bright/60 mt-0.5 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.06}>
              <p className="border-fada-red/45 text-ivory/65 mt-5 flex max-w-3xl items-start gap-3.5 rounded-lg border p-5 text-[0.94rem] leading-relaxed">
                <Clock className="text-fada-red-bright mt-0.5 size-5 shrink-0" />
                {festival.chessResults.aviso}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. Cierre: la cita del estatuto y la inscripción.
          ------------------------------------------------------------------ */}
      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <figure className="border-gold/40 relative border-l-2 pl-7 lg:pl-10">
              <ChessGlyph
                pieza="rey"
                className="text-gold/10 pointer-events-none absolute -top-6 right-0 text-[9rem] leading-none select-none"
              />
              <blockquote className="font-display text-ink relative text-xl leading-snug italic lg:text-2xl">
                “{festival.espiritu.cita}”
              </blockquote>
              <figcaption className="kicker text-gold-deep relative mt-4 text-[0.55rem]">
                {festival.espiritu.citaFuente}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-gold/40 bg-ink text-ivory relative isolate mt-9 overflow-hidden rounded-xl border p-8 shadow-[var(--shadow-gold)] lg:p-10">
              <GraphiteCurves className="opacity-60" />

              <div className="relative flex flex-wrap items-center justify-between gap-8">
                <div className="max-w-xl">
                  {/* Lo único en rojo de la banda de cierre: el cupo es lo que se agota. */}
                  <p className="kicker text-fada-red-bright text-[0.6rem]">Cupos limitados</p>
                  <h2 className="text-ivory mt-3 text-2xl leading-snug lg:text-3xl">
                    Asegurá tu lugar en el festival
                  </h2>
                  <p className="text-ivory/65 mt-4 text-[0.95rem] leading-relaxed">
                    {festival.espiritu.reconocimientos.texto} La inscripción se completa por el
                    formulario oficial y cualquier duda —packs, alojamiento, pagos desde Paraguay o
                    Brasil— se responde por WhatsApp al {festival.inscripcion.whatsappTexto}.
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
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
