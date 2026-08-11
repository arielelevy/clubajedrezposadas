import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Sin backdrop-blur: la tarjeta se apoya sobre fondos planos, así que el
        // desenfoque no se veía y en cambio obligaba al navegador a recomponer
        // cada tarjeta en cada frame del scroll.
        'border-ink/8 hover:border-gold/45 relative rounded-lg border bg-white/70 p-7 transition-all duration-500 hover:shadow-[var(--shadow-lift)]',
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-ink text-2xl leading-snug', className)} {...props} />
}

export function CardText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-ink/70 mt-3 text-[0.95rem] leading-relaxed', className)} {...props} />
  )
}
