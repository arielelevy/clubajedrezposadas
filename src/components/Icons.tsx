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
