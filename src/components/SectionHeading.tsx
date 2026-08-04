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
        <p className={cn('kicker mb-4', oscuro ? 'text-gold-bright' : 'text-gold-deep')}>{kicker}</p>
      ) : null}
      <h2
        className={cn(
          'text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]',
          oscuro ? 'text-ivory' : 'text-ink',
        )}
      >
        {titulo}
      </h2>
      {bajada ? (
        <p
          className={cn(
            'mt-4 max-w-2xl text-lg leading-relaxed',
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
