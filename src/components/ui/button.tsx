import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gold: 'bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink shadow-[0_10px_30px_-12px_rgba(192,145,44,0.7)] hover:brightness-110 hover:shadow-[0_14px_40px_-12px_rgba(192,145,44,0.85)]',
        outlineLight:
          'border border-ivory/35 text-ivory hover:border-gold-bright hover:text-gold-bright backdrop-blur-sm',
        outlineDark: 'border border-ink/20 text-ink hover:border-gold hover:text-gold-deep',
        ink: 'bg-ink text-ivory hover:bg-graphite',
        ghost: 'text-ink hover:text-gold-deep',
      },
      size: {
        default: 'h-11 px-6',
        lg: 'h-13 px-8 text-[0.95rem]',
        sm: 'h-9 px-4 text-xs',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'gold', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { buttonVariants }
