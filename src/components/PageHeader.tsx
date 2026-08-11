import type { ReactNode } from 'react'
import { BoardTexture, GraphiteCurves, GoldDivider } from './Ornaments'

export function PageHeader({
  kicker,
  titulo,
  bajada,
  compacta = false,
  children,
}: {
  kicker: string
  titulo: ReactNode
  bajada?: string
  /** Versión más baja, para páginas donde el contenido es el protagonista (ej. /fotos). */
  compacta?: boolean
  children?: ReactNode
}) {
  return (
    <section
      className={`bg-ink text-ivory relative isolate overflow-hidden ${
        compacta ? 'pt-24 pb-8 lg:pt-28 lg:pb-10' : 'pt-28 pb-14 lg:pt-32 lg:pb-16'
      }`}
    >
      <BoardTexture className="text-ivory" size={50} opacity={0.05} />
      <GraphiteCurves className="opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(192,145,44,0.15),transparent_55%)]" />

      <div className="motion-safe:animate-entrar relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <p className="kicker text-gold-bright">{kicker}</p>
        <h1
          className={
            compacta
              ? 'mt-3 text-3xl leading-[1.05] font-medium sm:text-4xl lg:text-5xl'
              : 'mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl'
          }
        >
          {titulo}
        </h1>
        <GoldDivider className={`mx-auto max-w-xs ${compacta ? 'mt-4' : 'mt-6'}`} />
        {bajada ? (
          <p
            className={`text-ivory/70 mx-auto max-w-2xl leading-relaxed ${
              compacta ? 'mt-3 text-base' : 'mt-4 text-lg'
            }`}
          >
            {bajada}
          </p>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
        ) : null}
      </div>
    </section>
  )
}
