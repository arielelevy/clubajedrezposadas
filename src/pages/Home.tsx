import { Hero } from '@/components/Hero'
import { EventoCentenario } from '@/sections/EventoCentenario'
import { ElClub } from '@/sections/ElClub'
import { Centenario } from '@/sections/Centenario'
import { Talleres } from '@/sections/Talleres'
import { Partidas } from '@/sections/Partidas'
import { Galeria } from '@/sections/Galeria'
import { Contacto } from '@/sections/Contacto'

export function Home() {
  return (
    <>
      <Hero />
      <EventoCentenario />
      <ElClub />
      <Centenario />
      <Talleres />
      <Partidas />
      <Galeria />
      <Contacto />
    </>
  )
}
