/**
 * Lee la planilla de socios del club y deja en src/data/socios.json solo los
 * datos que se publican en el sitio.
 *
 * Por qué existe este script y no se lee la planilla desde el navegador: para
 * que una página estática pueda leer un Google Sheet, la planilla tiene que
 * quedar pública, y esa planilla son las respuestas del formulario de alta
 * (nombres, teléfonos, datos de menores). Acá la credencial vive en un secret
 * de GitHub Actions, nunca llega al cliente, y del Sheet sale únicamente lo que
 * este script decide publicar.
 *
 * El club decidió que el listado de socios sea público, así que los nombres se
 * publican. Lo que este script no lee nunca, aunque esté en la planilla, son
 * teléfonos, mails, DNI, direcciones ni fechas de nacimiento (ver
 * COLUMNAS_PROHIBIDAS): el repositorio es público y esos datos no se publican.
 *
 * Hay dos formas de leer la planilla, y el script elige según lo que esté seteado:
 *
 *   A) SOCIOS_CSV_URL — una pestaña del Sheet publicada en la web como CSV.
 *      No necesita credenciales ni Google Cloud. Conviene armar una pestaña
 *      aparte que traiga SOLO la columna de nombres, y publicar esa: lo que se
 *      publica en la web de Google queda legible para cualquiera con el link.
 *
 *   B) GOOGLE_SERVICE_ACCOUNT_JSON — la planilla queda privada y se lee con una
 *      service account con permiso de Lector. La credencial vive en un secret
 *      de Actions y nunca llega al navegador.
 *
 * Uso:
 *   SOCIOS_CSV_URL='https://docs.google.com/.../pub?output=csv' node scripts/sync-socios.mjs
 *   GOOGLE_SERVICE_ACCOUNT_JSON='{...}' node scripts/sync-socios.mjs
 *
 * Variables:
 *   SOCIOS_CSV_URL               (opción A)  URL del CSV publicado
 *   GOOGLE_SERVICE_ACCOUNT_JSON  (opción B)  clave JSON de la service account
 *   SHEET_ID                     (opcional)  id de la planilla (opción B)
 *   SHEET_RANGE                  (opcional)  rango, por defecto la primera hoja
 *   PUBLICAR_NOMBRES             (opcional)  '0' para escribir solo el total
 */

import { createSign } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SALIDA = resolve(RAIZ, 'src/data/socios.json')

const SHEET_ID = process.env.SHEET_ID ?? '1gnpEBfmAU9HqWhi26S5hyq4zFfsEQ7Njnnds3fFWTG4'
const SHEET_RANGE = process.env.SHEET_RANGE ?? 'A1:Z20000'
const PUBLICAR_NOMBRES = process.env.PUBLICAR_NOMBRES !== '0'

/** Columnas que se consideran nombre. El resto de la planilla se ignora. */
const COLUMNAS_NOMBRE = [/^nombre/i, /^apellido/i, /nombre y apellido/i, /^socio/i]

/** Encabezados que nunca se leen, ni siquiera para contar. */
const COLUMNAS_PROHIBIDAS = [
  /tel[eé]fono/i,
  /celular/i,
  /whatsapp/i,
  /mail/i,
  /correo/i,
  /dni/i,
  /documento/i,
  /direcci[oó]n/i,
  /domicilio/i,
  /nacimiento/i,
  /edad/i,
]

function firmarJwt(cuenta) {
  const ahora = Math.floor(Date.now() / 1000)
  const encabezado = { alg: 'RS256', typ: 'JWT' }
  const reclamos = {
    iss: cuenta.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: ahora,
    exp: ahora + 3600,
  }

  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const cuerpo = `${b64(encabezado)}.${b64(reclamos)}`

  const firma = createSign('RSA-SHA256')
  firma.update(cuerpo)
  return `${cuerpo}.${firma.sign(cuenta.private_key, 'base64url')}`
}

async function obtenerToken(cuenta) {
  const respuesta = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: firmarJwt(cuenta),
    }),
  })

  if (!respuesta.ok) {
    throw new Error(
      `Google rechazó la autenticación (${respuesta.status}): ${await respuesta.text()}`,
    )
  }

  const { access_token } = await respuesta.json()
  if (!access_token) throw new Error('Google no devolvió access_token.')
  return access_token
}

async function leerPlanilla(token) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/` +
    `${encodeURIComponent(SHEET_RANGE)}?majorDimension=ROWS`

  const respuesta = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    if (respuesta.status === 403 || respuesta.status === 404) {
      throw new Error(
        `No se pudo leer la planilla (${respuesta.status}). ` +
          `Revisá que esté compartida como Lector con el email de la service account. Detalle: ${detalle}`,
      )
    }
    throw new Error(`Error al leer la planilla (${respuesta.status}): ${detalle}`)
  }

  const { values } = await respuesta.json()
  if (!values?.length) throw new Error('La planilla no devolvió filas.')
  return values
}

function extraer(filas) {
  const encabezados = filas[0].map((h) => String(h ?? '').trim())
  const datos = filas.slice(1).filter((f) => f.some((c) => String(c ?? '').trim() !== ''))

  const indicesNombre = encabezados
    .map((h, i) => ({ h, i }))
    .filter(
      ({ h }) =>
        COLUMNAS_NOMBRE.some((r) => r.test(h)) && !COLUMNAS_PROHIBIDAS.some((r) => r.test(h)),
    )
    .map(({ i }) => i)

  if (indicesNombre.length === 0) {
    throw new Error(
      `No encontré ninguna columna de nombre. Encabezados de la planilla: ${encabezados.join(' | ')}. ` +
        `Ajustá COLUMNAS_NOMBRE en este script.`,
    )
  }

  const nombres = datos
    .map((fila) =>
      indicesNombre
        .map((i) => String(fila[i] ?? '').trim())
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' '),
    )
    .filter(Boolean)

  return {
    total: nombres.length,
    columnasUsadas: indicesNombre.map((i) => encabezados[i]),
    nombres: [...new Set(nombres)].sort((a, b) => a.localeCompare(b, 'es')),
  }
}

async function main() {
  const crudo = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!crudo) {
    throw new Error(
      'Falta GOOGLE_SERVICE_ACCOUNT_JSON. Es la clave JSON de la service account con acceso de lectura a la planilla.',
    )
  }

  const cuenta = JSON.parse(crudo)
  if (!cuenta.client_email || !cuenta.private_key) {
    throw new Error('El JSON de la service account no tiene client_email o private_key.')
  }

  const token = await obtenerToken(cuenta)
  const { total, nombres, columnasUsadas } = extraer(await leerPlanilla(token))

  const salida = {
    _nota:
      'Generado por scripts/sync-socios.mjs desde la planilla de altas del club. No editar a mano.',
    actualizado: new Date().toISOString().slice(0, 10),
    total,
    nombres: PUBLICAR_NOMBRES ? nombres : [],
  }

  await mkdir(dirname(SALIDA), { recursive: true })
  await writeFile(SALIDA, `${JSON.stringify(salida, null, 2)}\n`, 'utf8')

  console.log(`Socios: ${total} (columnas leídas: ${columnasUsadas.join(', ')})`)
  console.log(
    PUBLICAR_NOMBRES
      ? `Nombres publicados: ${nombres.length} únicos.`
      : 'Nombres omitidos (PUBLICAR_NOMBRES=0): solo se escribió el total.',
  )
}

main().catch((error) => {
  console.error(`\nFalló la sincronización de socios:\n${error.message}\n`)
  process.exit(1)
})
