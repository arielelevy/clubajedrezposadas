import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BoardTexture, GraphiteCurves, GoldDivider } from './Ornaments'

export function PageHeader({
  kicker,
  titulo,
  bajada,
  children,
}: {
  kicker: string
  titulo: ReactNode
  bajada?: string
  children?: ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-ink pt-28 pb-14 text-ivory lg:pt-32 lg:pb-16">
      <BoardTexture className="text-ivory" size={50} opacity={0.05} />
      <GraphiteCurves className="opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(192,145,44,0.15),transparent_55%)]" />

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 22 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-4xl px-5 text-center lg:px-8"
      >
        <p className="kicker text-gold-bright">{kicker}</p>
        <h1 className="mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl">{titulo}</h1>
        <GoldDivider className="mx-auto mt-6 max-w-xs" />
        {bajada ? (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">{bajada}</p>
        ) : null}
        {children ? <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div> : null}
      </motion.div>
    </section>
  )
}
