import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BoardTexture, GoldDivider } from '@/components/Ornaments'
import { ChessGlyph } from '@/components/ChessGlyph'

export function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden bg-ink px-5 text-center text-ivory">
      <BoardTexture className="text-ivory" size={48} opacity={0.05} />
      <div className="relative">
        <ChessGlyph pieza="caballo" className="text-7xl text-gold/70" />
        <p className="kicker mt-8 text-gold-bright">Jaque a la URL</p>
        <h1 className="mt-5 text-4xl lg:text-5xl">Esta página no está en el tablero</h1>
        <GoldDivider className="mx-auto mt-8 max-w-xs" />
        <p className="mx-auto mt-8 max-w-md text-ivory/65">
          La dirección que buscás no existe o cambió de casilla. Volvé al inicio para seguir recorriendo los
          cien años del club.
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
