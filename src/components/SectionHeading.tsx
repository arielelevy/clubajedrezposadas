import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

export function SectionHeading({
  kicker,
  titulo,
  bajada,
  align = 'left',
  tono = 'claro',
  className,
}: {
  kicker?: string
  titulo: string
  bajada?: string
  align?: 'left' | 'center'
  tono?: 'claro' | 'oscuro'
  className?: string
}) {
  const oscuro = tono === 'oscuro'

  return (
    <Reveal className={cn(align === 'center' && 'text-center', className)}>
      {kicker ? (
        <p className={cn('kicker mb-3', oscuro ? 'text-gold-bright' : 'text-gold-deep')}>
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          'text-[2.1rem] leading-[1.08] sm:text-4xl lg:text-5xl',
          oscuro ? 'text-ivory' : 'text-ink',
        )}
      >
        {titulo}
      </h2>
      {bajada ? (
        <p
          className={cn(
            'mt-3 max-w-2xl text-[1.02rem] leading-relaxed',
            align === 'center' && 'mx-auto',
            oscuro ? 'text-ivory/70' : 'text-ink/65',
          )}
        >
          {bajada}
        </p>
      ) : null}
    </Reveal>
  )
}
