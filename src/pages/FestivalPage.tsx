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
  Trophy,
} from 'lucide-react'
import { club } from '@/data/site'
import { festival } from '@/data/festival'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { ChessGlyph, type Pieza } from '@/components/ChessGlyph'
import { BoardTexture, GraphiteCurves, GoldDivider } from '@/components/Ornaments'
import { cn } from '@/lib/utils'

/**
 * La página del festival: el evento más grande que organizó el club, con la
 * información completa de los cuatro torneos.
 *
 * El sitio entero está en grafito, marfil y oro. Acá se le suman los colores
 * del sello de la Federación Argentina de Ajedrez que va en el afiche, con un
 * reparto fijo (definido en index.css): el oro es el centenario y los premios,
 * el azul es lo deportivo-oficial —validez FIDE, arbitraje, planillas— y el
 * rojo es lo que vence: los plazos, los cupos, el aforo. Sin ese reparto la
 * página sería un semáforo; con él, el color dice de qué habla cada bloque.
 */

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
 * Rótulo de bloque en los fondos claros. Solo oro y azul: el rojo, que marca los
 * plazos, aparece únicamente en la banda oscura de aranceles, y ahí necesita la
 * variante clara para leerse.
 */
function Rotulo({ children, tono }: { children: string; tono: 'oro' | 'azul' }) {
  return (
    <p className={cn('kicker', tono === 'oro' ? 'text-gold-deep' : 'text-fada-blue-deep')}>
      {children}
    </p>
  )
}

export function FestivalPage() {
  const vigentes = enlacesVigentes()

  return (
    <>
      {/* ---------------------------------------------------------------
          Encabezado: el afiche a un lado y la ficha del festival al otro.
          --------------------------------------------------------------- */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden pt-24 pb-12 lg:pt-28 lg:pb-16">
        <BoardTexture className="text-ivory" size={50} opacity={0.05} />
        <GraphiteCurves className="opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(192,145,44,0.18),transparent_55%)]" />
        {/* El azul del sello entra por el otro vértice: firma el bloque sin
            pelearle el protagonismo al oro del centenario. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_78%,rgba(20,118,189,0.22),transparent_52%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
            <div className="motion-safe:animate-entrar">
              <p className="kicker text-gold-bright">{festival.nombre}</p>
              <h1 className="mt-4 text-4xl leading-[1.02] font-medium sm:text-5xl lg:text-6xl">
                <span className="text-gold-gradient block">IRT “100 Años”</span>
              </h1>

              {/* La fecha, en el bloque tipográfico del afiche */}
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
                    Inscribirme al festival
                    <ArrowRight />
                  </a>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <a href={festival.inscripcion.reglamento} target="_blank" rel="noreferrer">
                    <FileText />
                    Leer el reglamento
                  </a>
                </Button>
              </div>
            </div>

            {/* El afiche oficial. No es decoración: es la pieza que circula por
                WhatsApp, así que se puede abrir en grande. */}
            <Reveal delay={0.1} className="order-first lg:order-none">
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

          {/* Banda de cifras */}
          <Reveal delay={0.16}>
            <dl className="border-ivory/12 mt-12 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {festival.cifras.map((c) => (
                <div key={c.rotulo}>
                  <dt className="font-condensed text-gold-bright text-3xl leading-none lg:text-4xl">
                    {c.valor}
                  </dt>
                  <dd className="text-ivory/55 mt-2 text-[0.88rem] leading-snug">{c.rotulo}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Bolsa de premios — familia oro.
          --------------------------------------------------------------- */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="grid items-end gap-x-12 gap-y-4 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <Rotulo tono="oro">Bolsa de premios</Rotulo>
              <h2 className="text-ink mt-4 text-4xl leading-[1.06] lg:text-5xl">
                {festival.premios.total} en premios
              </h2>
            </div>
            <p className="text-ink/65 text-[1.02rem] leading-relaxed lg:pb-1">
              {festival.premios.detalle}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Desglose por torneo */}
            <Reveal delay={0.08}>
              <div className="border-gold/45 bg-ink text-ivory h-full rounded-lg border p-6 shadow-[var(--shadow-gold)] lg:p-7">
                <div className="flex items-center gap-3">
                  <Trophy className="text-gold-bright size-5" />
                  <p className="kicker text-gold-bright text-[0.6rem]">Cómo se reparte</p>
                </div>
                <dl className="mt-6 space-y-5">
                  {festival.premios.desglose.map((d) => (
                    <div
                      key={d.torneo}
                      className="border-ivory/10 border-t pt-4 first:border-0 first:pt-0"
                    >
                      <dt className="text-ivory/60 text-[0.85rem]">{d.torneo}</dt>
                      <dd className="font-condensed text-ivory mt-1 text-3xl leading-none">
                        {d.monto}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Franjas premiadas */}
            <Reveal delay={0.14}>
              <div className="border-ink/8 h-full rounded-lg border bg-white/70 p-6 lg:p-7">
                <p className="kicker text-gold-deep text-[0.6rem]">Franjas con premio propio</p>
                <p className="text-ink/60 mt-3 text-[0.92rem] leading-relaxed">
                  Además de la general, cada franja compite por su propio premio: se puede llegar
                  sin ranking y volver con algo.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {festival.premios.franjas.map((f) => (
                    <li
                      key={f}
                      className="border-gold/35 text-ink/75 rounded-full border bg-white px-3.5 py-1.5 text-[0.82rem]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Validez FIDE, formato y arbitraje — familia azul.
          --------------------------------------------------------------- */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <BoardTexture className="text-ivory" size={58} opacity={0.05} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(20,118,189,0.22),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="kicker text-fada-blue-bright">Torneo IRT Standard</p>
            <h2 className="text-ivory mt-5 text-4xl leading-[1.06] lg:text-5xl">
              {festival.formato.titulo}
            </h2>
            <p className="text-ivory/70 mt-6 text-lg leading-relaxed">
              Lo que mira un jugador con Elo antes de anotarse: el ritmo, el sistema de pareo y
              quién firma las planillas.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal delay={0.08}>
              <dl className="border-fada-blue/40 bg-graphite/60 h-full rounded-lg border p-6 lg:p-7">
                {festival.formato.items.map((f, i) => (
                  <div
                    key={f.rotulo}
                    className={cn('border-ivory/10', i > 0 && 'mt-5 border-t pt-5')}
                  >
                    <dt className="kicker text-fada-blue-bright text-[0.58rem]">{f.rotulo}</dt>
                    <dd className="text-ivory/85 mt-2 text-[1.02rem] leading-snug">{f.valor}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="border-ivory/12 h-full rounded-lg border p-6 lg:p-7">
                <p className="kicker text-fada-blue-bright text-[0.6rem]">
                  {festival.arbitraje.titulo}
                </p>
                <ul className="mt-6 space-y-5">
                  {festival.arbitraje.integrantes.map((a) => (
                    <li key={a.nombre}>
                      <p className="text-ivory/45 text-[0.78rem] tracking-wide uppercase">
                        {a.rol}
                      </p>
                      <p className="font-display text-ivory mt-1 text-xl">{a.nombre}</p>
                      <p className="text-fada-blue-bright/80 font-condensed mt-0.5 text-[0.85rem] tracking-[0.12em]">
                        {a.fide}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="border-ivory/10 text-ivory/55 mt-6 border-t pt-5 text-[0.88rem] leading-relaxed">
                  {festival.arbitraje.sistema}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Los cuatro torneos.
          --------------------------------------------------------------- */}
      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <Rotulo tono="oro">Cuatro torneos, cuatro días</Rotulo>
            <h2 className="text-ink mt-4 max-w-2xl text-4xl leading-[1.06] lg:text-5xl">
              Hay un tablero para cada uno
            </h2>
            <p className="text-ink/65 mt-4 max-w-2xl text-lg leading-relaxed">
              El IRT es el torneo principal, pero el festival se juega en cuatro frentes: desde los
              titulados hasta quien recién aprende a mover las piezas.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {festival.torneos.map((t, i) => (
              <Reveal key={t.nombre} delay={0.06 * i}>
                <article
                  className={cn(
                    'flex h-full flex-col rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 lg:p-7',
                    t.destacado
                      ? 'border-gold/45 bg-ink text-ivory hover:border-gold/80 shadow-[var(--shadow-gold)]'
                      : 'border-ink/8 hover:border-gold/45 bg-white/70 hover:shadow-[var(--shadow-lift)]',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <ChessGlyph
                      pieza={t.pieza as Pieza}
                      className={cn('text-4xl', t.destacado ? 'text-gold-bright' : 'text-gold/70')}
                    />
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-[0.68rem] leading-tight',
                        t.destacado
                          ? 'border-gold/40 text-gold-bright'
                          : 'border-fada-blue/30 text-fada-blue-deep',
                      )}
                    >
                      {t.cuando}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'font-display mt-5 text-2xl',
                      t.destacado ? 'text-ivory' : 'text-ink',
                    )}
                  >
                    {t.nombre}
                  </h3>

                  <ul
                    className={cn(
                      'mt-5 space-y-2.5 border-t pt-5 text-[0.88rem] leading-snug',
                      t.destacado ? 'border-ivory/15 text-ivory/75' : 'border-ink/8 text-ink/70',
                    )}
                  >
                    {t.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="bg-gold mt-[0.3rem] size-1.5 shrink-0 rotate-45"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Beneficios de inscripción.
          --------------------------------------------------------------- */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <Rotulo tono="oro">Beneficios especiales</Rotulo>
            <h2 className="text-ink mt-4 max-w-2xl text-4xl leading-[1.06] lg:text-5xl">
              Tres formas de entrar sin pagar la tarifa plena
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {festival.beneficios.map((b, i) => (
              <Reveal key={b.titulo} delay={0.07 * i}>
                <article className="border-ink/8 hover:border-gold/45 flex h-full flex-col rounded-lg border bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <ChessGlyph pieza={b.pieza as Pieza} className="text-gold/70 text-4xl" />
                  <h3 className="font-display text-ink mt-5 text-2xl">{b.titulo}</h3>
                  <p className="kicker text-gold-deep mt-2 text-[0.55rem]">{b.etiqueta}</p>
                  <p className="text-ink/70 border-ink/8 mt-5 border-t pt-5 text-[0.9rem] leading-relaxed">
                    {b.texto}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Packs y escala de aranceles — la escala es familia rojo: son plazos.
          --------------------------------------------------------------- */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <BoardTexture className="text-ivory" size={64} opacity={0.04} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_5%,rgba(165,15,20,0.28),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="kicker text-gold-bright">{festival.packs.titulo}</p>
            <h2 className="text-ivory mt-5 text-4xl leading-[1.06] lg:text-5xl">
              Elegí cómo venís a jugar
            </h2>
            <p className="text-ivory/70 mt-6 text-lg leading-relaxed">{festival.packs.bajada}</p>
          </Reveal>

          {/* La tabla tiene cinco columnas: en mobile scrollea sola en lugar de
              apretujar cuatro monedas en 320 px. */}
          <Reveal delay={0.1}>
            <div className="border-ivory/12 mt-9 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <thead>
                  <tr className="border-ivory/12 border-b">
                    <th scope="col" className="kicker text-ivory/45 px-5 py-4 text-[0.58rem]">
                      Opción / pack
                    </th>
                    {festival.packs.monedas.map((m) => (
                      <th
                        key={m}
                        scope="col"
                        className="kicker text-gold-bright px-5 py-4 text-[0.58rem]"
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
                      className="border-ivory/8 hover:bg-ivory/[0.04] border-b transition-colors last:border-0"
                    >
                      <th
                        scope="row"
                        className="text-ivory/90 px-5 py-4 text-[0.95rem] font-normal"
                      >
                        {f.pack}
                      </th>
                      <td className="font-condensed text-gold-bright px-5 py-4 text-lg tracking-wide">
                        {f.ars}
                      </td>
                      <td className="text-ivory/70 px-5 py-4 text-[0.92rem]">{f.usd}</td>
                      <td className="text-ivory/70 px-5 py-4 text-[0.92rem]">{f.pyg}</td>
                      <td className="text-ivory/70 px-5 py-4 text-[0.92rem]">{f.brl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Escala de inscripción */}
          <Reveal delay={0.14}>
            <div className="border-ivory/12 mt-12 border-t pt-10">
              <p className="kicker text-fada-red-bright">{festival.escala.titulo}</p>
              <h3 className="font-display text-ivory mt-4 max-w-2xl text-3xl leading-snug">
                {festival.escala.bajada}
              </h3>
            </div>
          </Reveal>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {festival.escala.tramos.map((t, i) => (
              <Reveal key={t.cupos} delay={0.06 * i}>
                <li className="border-fada-red/35 bg-graphite/50 flex h-full flex-col rounded-lg border p-5">
                  <p className="kicker text-fada-red-bright text-[0.55rem]">{t.hasta}</p>
                  <p className="text-ivory/80 mt-3 text-[0.92rem]">{t.cupos}</p>
                  <p className="font-condensed text-ivory mt-2 text-2xl leading-none">{t.precio}</p>
                  {t.nota ? (
                    <p className="border-ivory/10 text-ivory/50 mt-4 border-t pt-3 text-[0.8rem] leading-snug">
                      {t.nota}
                    </p>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <p className="border-fada-red-bright/60 text-ivory/65 mt-8 max-w-3xl border-l-2 pl-6 text-[0.95rem] leading-relaxed">
              {festival.escala.aforo}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Cronograma oficial.
          --------------------------------------------------------------- */}
      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <Rotulo tono="azul">{festival.cronograma.titulo}</Rotulo>
            <h2 className="text-ink mt-4 max-w-2xl text-4xl leading-[1.06] lg:text-5xl">
              Los cuatro días, hora por hora
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {festival.cronograma.dias.map((d, i) => (
              <Reveal key={d.dia} delay={0.06 * i}>
                <article className="border-ink/8 flex h-full flex-col rounded-lg border bg-white/70 p-6">
                  <p className="font-display text-ink text-2xl">{d.dia}</p>
                  <p className="kicker text-fada-blue-deep mt-1.5 text-[0.55rem]">{d.mes}</p>

                  <ol className="border-ink/8 mt-5 space-y-4 border-t pt-5">
                    {d.turnos.map((t) => (
                      <li key={t.hora} className="flex gap-3">
                        <span className="font-condensed text-fada-blue-deep w-14 shrink-0 text-lg leading-tight tracking-wide">
                          {t.hora}
                        </span>
                        <span className="text-ink/75 text-[0.9rem] leading-snug">{t.que}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Sede, alojamiento y medios de pago.
          --------------------------------------------------------------- */}
      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <Rotulo tono="oro">Cómo llegar y cómo pagar</Rotulo>
            <h2 className="text-ink mt-4 max-w-2xl text-4xl leading-[1.06] lg:text-5xl">
              Todo lo de la logística
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {/* Sede */}
            <Reveal delay={0.06}>
              <article className="border-ink/8 flex h-full flex-col rounded-lg border bg-white/70 p-6 lg:p-7">
                <MapPin className="text-gold size-5" />
                <h3 className="font-display text-ink mt-4 text-xl">Sede oficial</h3>
                <p className="text-ink/75 mt-3 text-[0.95rem] leading-relaxed">
                  {festival.sede.nombre}
                  <br />
                  {festival.sede.direccion}
                </p>
                <p className="text-ink/55 mt-2 text-[0.88rem]">{festival.sede.detalle}</p>
                <a
                  href={festival.sede.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-deep hover:text-gold mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.88rem] transition-colors"
                >
                  Ver en el mapa
                  <ArrowUpRight className="size-3.5" />
                </a>
              </article>
            </Reveal>

            {/* Alojamiento */}
            <Reveal delay={0.12}>
              <article className="border-ink/8 flex h-full flex-col rounded-lg border bg-white/70 p-6 lg:p-7">
                <BedDouble className="text-gold size-5" />
                <h3 className="font-display text-ink mt-4 text-xl">Alojamiento</h3>
                <p className="text-ink/75 mt-3 text-[0.95rem] leading-relaxed">
                  {festival.alojamiento.lugar}
                </p>
                <p className="font-condensed text-ink mt-2 text-xl leading-none">
                  {festival.alojamiento.precio}
                </p>
                <p className="text-ink/55 mt-2 text-[0.88rem]">{festival.alojamiento.detalle}</p>
                <a
                  href={festival.alojamiento.reservasLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-deep hover:text-gold mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.88rem] transition-colors"
                >
                  Reservas: {festival.alojamiento.reservas}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </article>
            </Reveal>

            {/* Medios de pago */}
            <Reveal delay={0.18}>
              <article className="border-ink/8 flex h-full flex-col rounded-lg border bg-white/70 p-6 lg:p-7">
                <Wallet className="text-gold size-5" />
                <h3 className="font-display text-ink mt-4 text-xl">Medios de pago</h3>
                <dl className="mt-4 space-y-4">
                  {festival.pagos.map((p) => (
                    <div
                      key={p.pais}
                      className="border-ink/8 border-t pt-3 first:border-0 first:pt-0"
                    >
                      <dt className="text-ink/50 text-[0.78rem] tracking-wide uppercase">
                        {p.pais} · {p.medio}
                      </dt>
                      <dd className="text-ink/85 mt-1 text-[0.92rem] break-words">{p.dato}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Seguimiento en vivo — familia azul. Los enlaces aparecen el
          1.º de septiembre; antes se muestra el aviso.
          --------------------------------------------------------------- */}
      <section className="bg-ink text-ivory relative isolate overflow-hidden py-12 lg:py-16">
        <BoardTexture className="text-ivory" size={54} opacity={0.045} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,118,189,0.2),transparent_58%)]" />

        <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal className="text-center">
            <p className="kicker text-fada-blue-bright">Seguimiento en vivo</p>
            <h2 className="text-ivory mt-5 text-3xl leading-[1.08] lg:text-4xl">
              Pareos y posiciones en Chess-Results
            </h2>
            <GoldDivider className="mx-auto mt-6 max-w-xs" />
          </Reveal>

          {vigentes ? (
            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {festival.chessResults.enlaces.map((e, i) => (
                <Reveal key={e.url} delay={0.06 * i}>
                  <li className="h-full">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border-fada-blue/40 hover:border-fada-blue-bright hover:bg-fada-blue/10 group flex h-full items-start justify-between gap-3 rounded-lg border p-5 transition-colors"
                    >
                      <span>
                        <span className="kicker text-fada-blue-bright block text-[0.55rem]">
                          Chess-Results
                        </span>
                        <span className="text-ivory/90 mt-2 block text-[0.98rem] leading-snug">
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
            <Reveal delay={0.08}>
              <p className="border-fada-blue/40 bg-graphite/50 text-ivory/70 mx-auto mt-9 flex max-w-2xl items-start gap-4 rounded-lg border p-6 text-[0.98rem] leading-relaxed">
                <Clock className="text-fada-blue-bright mt-0.5 size-5 shrink-0" />
                {festival.chessResults.aviso}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Espíritu centenario e inscripción.
          --------------------------------------------------------------- */}
      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <figure className="border-gold/40 relative border-l-2 pl-7 lg:pl-10">
              <ChessGlyph
                pieza="rey"
                className="text-gold/10 pointer-events-none absolute -top-6 right-0 text-[9rem] leading-none select-none"
              />
              <blockquote className="font-display text-ink relative text-2xl leading-snug italic lg:text-[2rem]">
                “{festival.espiritu.cita}”
              </blockquote>
              <figcaption className="kicker text-gold-deep relative mt-5 text-[0.58rem]">
                {festival.espiritu.citaFuente}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-ink/8 mt-10 border-t pt-9">
              <h3 className="font-display text-ink text-2xl">
                {festival.espiritu.reconocimientos.titulo}
              </h3>
              <p className="text-ink/65 mt-3 max-w-3xl text-[1.02rem] leading-relaxed">
                {festival.espiritu.reconocimientos.texto}
              </p>
              <Link
                to="/historia"
                className="text-gold-deep hover:text-gold mt-5 inline-flex items-center gap-2 text-[0.92rem] transition-colors"
              >
                Leer los cien años del club
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          {/* Cierre: inscripción */}
          <Reveal delay={0.14}>
            <div className="border-gold/40 bg-ink text-ivory relative isolate mt-10 overflow-hidden rounded-xl border p-8 shadow-[var(--shadow-gold)] lg:p-10">
              <GraphiteCurves className="opacity-60" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(20,118,189,0.22),transparent_55%)]" />

              <div className="relative flex flex-wrap items-center justify-between gap-8">
                <div className="max-w-xl">
                  <p className="kicker text-gold-bright text-[0.6rem]">Cupos limitados</p>
                  <h3 className="text-ivory mt-3 text-3xl leading-snug">
                    Asegurá tu lugar en el festival
                  </h3>
                  <p className="text-ivory/65 mt-4 text-[0.98rem] leading-relaxed">
                    La inscripción se completa por el formulario oficial. Cualquier duda —packs,
                    alojamiento, pagos desde Paraguay o Brasil— se responde por WhatsApp al{' '}
                    {festival.inscripcion.whatsappTexto}.
                  </p>
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
