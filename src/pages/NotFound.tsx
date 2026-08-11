import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BoardTexture, GoldDivider } from '@/components/Ornaments'
import { ChessGlyph } from '@/components/ChessGlyph'

export function NotFound() {
  return (
    <section className="bg-ink text-ivory relative isolate grid min-h-[80svh] place-items-center overflow-hidden px-5 text-center">
      <BoardTexture className="text-ivory" size={48} opacity={0.05} />
      <div className="relative">
        <ChessGlyph pieza="caballo" className="text-gold/70 text-7xl" />
        <p className="kicker text-gold-bright mt-8">Jaque a la URL</p>
        <h1 className="mt-5 text-4xl lg:text-5xl">Esta página no está en el tablero</h1>
        <GoldDivider className="mx-auto mt-8 max-w-xs" />
        <p className="text-ivory/65 mx-auto mt-8 max-w-md">
          La dirección que buscás no existe o cambió de casilla. Volvé al inicio para seguir
          recorriendo los cien años del club.
        </p>
        <Button asChild variant="gold" size="lg" className="mt-9">
          <Link to="/">
            <ArrowLeft />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </section>
  )
}
