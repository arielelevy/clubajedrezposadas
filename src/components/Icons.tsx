import type { SVGProps } from 'react'

/**
 * Logos de marca: lucide-react v1 ya no incluye iconos de marcas,
 * así que el glifo de Instagram va como SVG propio.
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15.4 2.5h-2.2A4.4 4.4 0 0 0 8.8 6.9v2.6H6.6v3.4h2.2v8.6h3.5v-8.6h2.7l.4-3.4h-3.1V7.2c0-.7.3-1.1 1.1-1.1h2V2.5Z" />
    </svg>
  )
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.6l-4.38-5.73L6.74 21H3.72l6.86-7.84L2.5 3h5.74l4.1 5.42L17.53 3Zm-1.06 16.16h1.67L7.6 4.75H5.81l10.66 14.41Z" />
    </svg>
  )
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="4.5" />
      <path d="M10.4 9.1 15.3 12l-4.9 2.9V9.1Z" />
    </svg>
  )
}

/**
 * Lichess y chess.com no tienen glifo de marca reproducible con honestidad, así
 * que se los representa con las piezas que el sitio ya usa como iconografía: el
 * caballo para Lichess y el peón para chess.com. El nombre va en el aria-label.
 */
export function CaballoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M13.6 3.4c2.2 1.1 3.6 3.2 3.8 5.7.2 2.4-.5 4-.5 5.8 0 1.1.3 2.1.9 3H7.4c.2-2.4 1.4-4.4 3.4-6 1-.8 1.6-1.5 1.9-2.3-1 .5-2 .7-3 .6l-2.6-.2 1.7-2.4c.5-.7.8-1.6.9-2.5l.2-2 1.7 1.5 2-1.2Z" />
      <path d="M6.2 20.6h11.9" />
    </svg>
  )
}

export function PeonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="7.2" r="3.1" />
      <path d="M9.3 10.6c-.4 1 .1 2 1 2.5-1 1.5-1.7 3.3-1.9 5.4h7.2c-.2-2.1-.9-3.9-1.9-5.4.9-.5 1.4-1.5 1-2.5" />
      <path d="M6.4 20.6h11.2" />
    </svg>
  )
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.2 20.8l1.3-4.4A8.4 8.4 0 1 1 7.8 19.6l-4.6 1.2Z" />
      <path d="M8.9 8c.3-.1.6 0 .8.4l.7 1.4c.1.3.1.5-.1.8l-.5.6c-.2.2-.2.4 0 .7a7 7 0 0 0 2.6 2.4c.3.2.5.1.7-.1l.5-.6c.2-.2.5-.3.8-.2l1.4.7c.4.2.5.5.4.9-.2.9-1 1.6-2 1.6-2.7 0-6.5-3.8-6.5-6.5 0-1 .7-1.8 1.6-2.1Z" />
    </svg>
  )
}
