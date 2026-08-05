import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Sin backdrop-blur: la tarjeta se apoya sobre fondos planos, así que el
        // desenfoque no se veía y en cambio obligaba al navegador a recomponer
        // cada tarjeta en cada frame del scroll.
        'relative rounded-lg border border-ink/8 bg-white/70 p-7 transition-all duration-500 hover:border-gold/45 hover:shadow-[var(--shadow-lift)]',
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-2xl leading-snug text-ink', className)} {...props} />
}

export function CardText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-3 text-[0.95rem] leading-relaxed text-ink/70', className)} {...props} />
}
