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

// Favicon: recorta el margen y deja la pieza centrada
await sharp(logoBuf, { density: 300 })
  .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public', 'favicon.png'))

// --- Piezas graficas -> webp para la galeria ---
const posters = {
  'TALLERES.png': 'talleres-horarios.webp',
  'Niños.png': 'talleres-infantil.webp',
  'Adultos.png': 'clases-adultos.webp',
  'Banner IMPRECO.png': 'banner-menos-pantalla.webp',
  'CAP MEMBRETE.png': 'membrete.webp',
}
for (const [from, to] of Object.entries(posters)) {
  await sharp(need(from))
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
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
await copyFile(need('SOLICITUD DE ALTA DE SOCIO- FINAL.pdf'), path.join(outDocs, 'solicitud-alta-socio.pdf'))
await copyFile(need('CARPETA DE AUSPICIOS - 2026.pdf'), path.join(outDocs, 'carpeta-auspicios-2026.pdf'))

// --- Reporte: alpha del logo (para saber si el SVG trae fondo blanco) ---
const stats = await sharp(await readFile(path.join(root, 'public', 'logo-cap-512.png'))).stats()
await writeFile(
  path.join(outImg, '.assets-report.json'),
  JSON.stringify({ logoHasAlpha: stats.isOpaque === false, channels: stats.channels.length }, null, 2),
)

console.log('Assets listos en public/. logo con transparencia:', stats.isOpaque === false)
