/**
 * Sonido de las jugadas del visor, sintetizado con Web Audio.
 *
 * Se genera en el navegador en lugar de servir archivos: no suma peso al sitio,
 * funciona sin conexión y permite darle el timbre corto y seco de una pieza de
 * madera apoyándose en el tablero, con un golpe más grave para las capturas.
 *
 * El contexto se crea recién en el primer sonido, que siempre llega después de
 * un clic o una tecla: los navegadores no permiten arrancar audio sin un gesto.
 */

let contexto: AudioContext | null = null

function obtenerContexto(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!contexto) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    contexto = new Ctor()
  }

  // Si el navegador lo dejó suspendido, se reanuda en el gesto del usuario.
  if (contexto.state === 'suspended') void contexto.resume()
  return contexto
}

/** Ruido corto y filtrado: es el "tac" de la madera. */
function golpe(ctx: AudioContext, cuando: number, duracion: number, frecuencia: number, volumen: number) {
  const muestras = Math.floor(ctx.sampleRate * duracion)
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate)
  const datos = buffer.getChannelData(0)

  for (let i = 0; i < muestras; i++) {
    // Ruido con caída exponencial: percusivo, sin cola.
    datos[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / muestras, 3)
  }

  const fuente = ctx.createBufferSource()
  fuente.buffer = buffer

  const filtro = ctx.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.frequency.value = frecuencia
  filtro.Q.value = 1.2

  const ganancia = ctx.createGain()
  ganancia.gain.value = volumen

  fuente.connect(filtro).connect(ganancia).connect(ctx.destination)
  fuente.start(cuando)
  fuente.stop(cuando + duracion)
}

/** Cuerpo tonal del golpe, que le da la madera. */
function cuerpo(ctx: AudioContext, cuando: number, frecuencia: number, volumen: number) {
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(frecuencia, cuando)
  osc.frequency.exponentialRampToValueAtTime(frecuencia * 0.6, cuando + 0.07)

  const ganancia = ctx.createGain()
  ganancia.gain.setValueAtTime(volumen, cuando)
  ganancia.gain.exponentialRampToValueAtTime(0.0001, cuando + 0.09)

  osc.connect(ganancia).connect(ctx.destination)
  osc.start(cuando)
  osc.stop(cuando + 0.1)
}

/**
 * Suena una jugada. El tipo se deduce de la notación: `x` es captura, `+` y `#`
 * jaque y mate, `O-O` enroque.
 */
export function sonarJugada(san: string) {
  const ctx = obtenerContexto()
  if (!ctx) return

  const t = ctx.currentTime + 0.001
  const captura = san.includes('x')
  const jaque = san.includes('+') || san.includes('#')
  const enroque = san.startsWith('O-O')

  if (captura) {
    // Más grave y con más ruido: madera contra madera.
    golpe(ctx, t, 0.1, 1500, 0.5)
    cuerpo(ctx, t, 150, 0.32)
  } else if (enroque) {
    // Dos toques, que son las dos piezas.
    golpe(ctx, t, 0.05, 2100, 0.28)
    cuerpo(ctx, t, 210, 0.2)
    golpe(ctx, t + 0.09, 0.05, 2100, 0.24)
    cuerpo(ctx, t + 0.09, 195, 0.17)
  } else {
    golpe(ctx, t, 0.055, 2300, 0.3)
    cuerpo(ctx, t, 220, 0.22)
  }

  // El jaque agrega un armónico agudo, apenas insinuado.
  if (jaque) cuerpo(ctx, t + 0.05, 880, 0.09)
}
