/**
 * Optimiza el material grafico original (carpeta "GRAFICAS CAP - PNG-SVG")
 * y lo publica en public/. Ejecutar con: npm run assets
 */
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const src = path.join(root, 'GRAFICAS CAP - PNG-SVG')
const outImg = path.join(root, 'public', 'img')
const outDocs = path.join(root, 'public', 'docs')

const need = (file) => {
  const full = path.join(src, file)
  if (!existsSync(full)) throw new Error(`Falta el archivo fuente: ${full}`)
  return full
}

await mkdir(outImg, { recursive: true })
await mkdir(outDocs, { recursive: true })

// --- Logo: SVG vectorial (se sirve tal cual) + PNG para OG/favicon ---
const logoSvg = need('LOGO CAP.svg')
await copyFile(logoSvg, path.join(root, 'public', 'logo-cap.svg'))

const logoBuf = await readFile(logoSvg)
for (const size of [512, 1024]) {
  await sharp(logoBuf, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public', `logo-cap-${size}.png`))
}

/* El SVG del logo pesa 525 kB porque adentro trae un PNG embebido, y la barra y
   el pie lo mostraban a 36 y 48 px: media portada de descarga para un sello del
   tamaño de una uña. Estos webp son lo que usa la pagina; el SVG queda para
   imprenta y para quien lo pida directo. */
for (const size of [96, 640]) {
  await sharp(logoBuf, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88 })
    .toFile(path.join(root, 'public', `logo-cap-${size}.webp`))
}

/* --- Favicon: el sello completo no se lee a 16 px (el aro con texto, el laurel
   y el "100 AÑOS" quedan en dos pixeles). Se recorta el mate con las manos tal
   cual esta en el logo -sin retocar colores ni agregar fondo- y ese pedazo
   ocupa todo el icono. El recorte esta medido para caer dentro del aro, asi no
   entran restos del circulo ni de las letras. ---------------------------- */
const LIENZO = 2000

const marca = await sharp(logoBuf, { density: 400 })
  .resize(LIENZO, LIENZO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()

// Fracciones del lienzo: el mate completo con las manos, la tapa, el arranque
// de la bombilla y el tramo de hoja que los abraza.
const RECORTE = { left: 0.3205, top: 0.24, width: 0.36, height: 0.36 }
const recorte = {
  left: Math.round(RECORTE.left * LIENZO),
  top: Math.round(RECORTE.top * LIENZO),
  width: Math.round(RECORTE.width * LIENZO),
  height: Math.round(RECORTE.height * LIENZO),
}
const arteBase = await sharp(marca).extract(recorte).png().toBuffer()

/** Icono cuadrado con el recorte centrado. `fondo` solo para iOS, que no admite alfa. */
async function icono(size, { fondo = null, ocupa = 0.98 } = {}) {
  const escala = (size * ocupa) / Math.max(recorte.width, recorte.height)
  const w = Math.max(1, Math.round(recorte.width * escala))
  const h = Math.max(1, Math.round(recorte.height * escala))
  const arte = await sharp(arteBase).resize(w, h, { fit: 'fill' }).png().toBuffer()
  const lienzo = fondo
    ? sharp({ create: { width: size, height: size, channels: 3, background: fondo } })
    : sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
  return lienzo
    .composite([{ input: arte, top: Math.round((size - h) / 2), left: Math.round((size - w) / 2) }])
    .png({ compressionLevel: 9 })
}

// El master se genera grande y se baja por resize: a 16 y 32 px el downscale
// desde 512 conserva mucho mejor el borde del mate que rasterizar directo.
const master = await (await icono(512)).toBuffer()
for (const size of [16, 32, 48]) {
  await sharp(master)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public', `favicon-${size}.png`))
}
await sharp(master)
  .resize(256, 256)
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public', 'favicon.png'))
await (
  await icono(180, { fondo: { r: 0xfc, g: 0xfa, b: 0xf5 }, ocupa: 0.9 })
).toFile(path.join(root, 'public', 'apple-touch-icon.png'))

/* --- Piezas graficas -> webp.
   Los tres primeros se ven en las tarjetas de talleres, en un recuadro 16/9 de
   unos 450 px: a 1400 px de ancho se bajaban 430 kB para mostrar bastante menos
   de la mitad. 900 px alcanza para pantallas retina. -------------------------- */
const posters = {
  'TALLERES.png': ['talleres-horarios.webp', 900],
  'Niños.png': ['talleres-infantil.webp', 900],
  'Adultos.png': ['clases-adultos.webp', 900],
  'Banner IMPRECO.png': ['banner-menos-pantalla.webp', 1400],
  'CAP MEMBRETE.png': ['membrete.webp', 1400],
}
for (const [from, [to, ancho]] of Object.entries(posters)) {
  await sharp(need(from))
    .resize({ width: ancho, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(outImg, to))
}

// --- Open Graph: medallon del centenario sobre fondo grafito ---
const medallon = await sharp(logoBuf, { density: 300 })
  .resize(520, 520, { fit: 'contain', background: { r: 246, g: 241, b: 228, alpha: 1 } })
  .png()
  .toBuffer()

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: { r: 11, g: 11, b: 12 } },
})
  .composite([{ input: medallon, top: 55, left: 340 }])
  .jpeg({ quality: 88 })
  .toFile(path.join(root, 'public', 'og-image.jpg'))

// --- Documentos descargables ---
await copyFile(
  need('SOLICITUD DE ALTA DE SOCIO- FINAL.pdf'),
  path.join(outDocs, 'solicitud-alta-socio.pdf'),
)
await copyFile(
  need('CARPETA DE AUSPICIOS - 2026.pdf'),
  path.join(outDocs, 'carpeta-auspicios-2026.pdf'),
)

// --- Reporte: alpha del logo (para saber si el SVG trae fondo blanco) ---
const stats = await sharp(await readFile(path.join(root, 'public', 'logo-cap-512.png'))).stats()
await writeFile(
  path.join(outImg, '.assets-report.json'),
  JSON.stringify(
    { logoHasAlpha: stats.isOpaque === false, channels: stats.channels.length },
    null,
    2,
  ),
)

console.log('Assets listos en public/. logo con transparencia:', stats.isOpaque === false)
