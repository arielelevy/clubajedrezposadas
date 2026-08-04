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
const SHEET_GID = process.env.SHEET_GID ?? '0'
const SHEET_RANGE = process.env.SHEET_RANGE ?? 'A1:BZ20000'
const PUBLICAR_NOMBRES = process.env.PUBLICAR_NOMBRES !== '0'

/**
 * La planilla del club es legible con el link, así que por defecto se lee por
 * el endpoint CSV y no hace falta credencial. Si algún día se cierra, basta con
 * cargar GOOGLE_SERVICE_ACCOUNT_JSON y este default deja de usarse.
 */
const CSV_POR_DEFECTO = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`

/** Columna con el nombre del socio. */
const COLUMNAS_NOMBRE = [/nombre y apellido/i, /^nombre/i, /^apellido/i]

/** Columna con la categoría (ACTIVO, CADETE, PROTECTOR…). */
const COLUMNA_TIPO = /tipo de socio/i

/** Columna que marca si el socio integra el padrón ("SI" / "NO"). */
const COLUMNA_PADRON = /^grupo$/i

/**
 * Encabezados que nunca se leen. La planilla trae además el historial de pagos
 * mes por mes: no es una columna prohibida, pero tampoco se publica, porque solo
 * se leen las columnas elegidas más arriba.
 */
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
  /cuota/i,
  /pag[oa]/i,
  /deuda/i,
  /importe/i,
]

/** Parser de CSV mínimo: campos entre comillas, comillas escapadas y CRLF. */
function parsearCsv(texto) {
  const filas = []
  let fila = []
  let campo = ''
  let entreComillas = false

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]

    if (entreComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else {
          entreComillas = false
        }
      } else {
        campo += c
      }
      continue
    }

    if (c === '"') entreComillas = true
    else if (c === ',') {
      fila.push(campo)
      campo = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++
      fila.push(campo)
      filas.push(fila)
      fila = []
      campo = ''
    } else campo += c
  }

  if (campo !== '' || fila.length) {
    fila.push(campo)
    filas.push(fila)
  }

  return filas
}

async function leerCsvPublicado(url) {
  const respuesta = await fetch(url, { redirect: 'follow' })

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo bajar el CSV publicado (${respuesta.status}). ` +
        `Revisá que la pestaña esté publicada en la web y que el link termine en output=csv.`,
    )
  }

  const texto = await respuesta.text()

  if (texto.trimStart().startsWith('<')) {
    throw new Error(
      'La URL devolvió HTML en lugar de CSV. Tiene que ser el link de "Archivo → Compartir → ' +
        'Publicar en la web", eligiendo la pestaña y el formato CSV.',
    )
  }

  const filas = parsearCsv(texto).filter((f) => f.some((c) => String(c ?? '').trim() !== ''))
  if (!filas.length) throw new Error('El CSV publicado vino vacío.')
  return filas
}

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

/**
 * Normaliza "acuña jonas AGUSTIN" a "Acuña Jonas Agustin", respetando los
 * títulos entre paréntesis como (MN) o (AR-ACM). La planilla usa la coma de
 * forma despareja ("Barney,juan", "Kuchera Marcos A,"), así que se ordena.
 */
function capitalizar(texto) {
  return texto
    .replace(/\s*,\s*/g, ', ')
    .replace(/[,\s]+$/, '')
    .trim()
    .toLocaleLowerCase('es')
    .split(' ')
    .map((palabra) =>
      palabra.startsWith('(') || palabra.length <= 1
        ? palabra.toLocaleUpperCase('es')
        : palabra[0].toLocaleUpperCase('es') + palabra.slice(1),
    )
    .join(' ')
}

function extraer(filas) {
  const encabezados = filas[0].map((h) => String(h ?? '').trim())

  const buscar = (patron) =>
    encabezados.findIndex((h) => patron.test(h) && !COLUMNAS_PROHIBIDAS.some((p) => p.test(h)))

  const iNombre = COLUMNAS_NOMBRE.map(buscar).find((i) => i >= 0) ?? -1
  if (iNombre < 0) {
    throw new Error(
      `No encontré la columna de nombre. Encabezados de la planilla: ${encabezados.join(' | ')}. ` +
        `Ajustá COLUMNAS_NOMBRE en este script.`,
    )
  }

  const iTipo = buscar(COLUMNA_TIPO)
  const iPadron = buscar(COLUMNA_PADRON)

  const vistos = new Set()
  const socios = []

  for (const fila of filas.slice(1)) {
    const nombre = String(fila[iNombre] ?? '')
      .trim()
      .replace(/\s+/g, ' ')
    if (!nombre) continue

    // La planilla marca con "SI"/"NO" quién integra el padrón.
    if (iPadron >= 0 && String(fila[iPadron] ?? '').trim().toUpperCase() !== 'SI') continue

    const clave = nombre.toLocaleLowerCase('es')
    if (vistos.has(clave)) continue
    vistos.add(clave)

    socios.push({
      nombre: capitalizar(nombre),
      tipo: iTipo >= 0 ? capitalizar(String(fila[iTipo] ?? '').trim()) : '',
    })
  }

  socios.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const columnasUsadas = [encabezados[iNombre], iTipo >= 0 ? encabezados[iTipo] : null].filter(
    Boolean,
  )

  return { total: socios.length, socios, columnasUsadas }
}

async function obtenerFilas() {
  const crudo = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (crudo) {
    const cuenta = JSON.parse(crudo)
    if (!cuenta.client_email || !cuenta.private_key) {
      throw new Error('El JSON de la service account no tiene client_email o private_key.')
    }
    console.log(`Leyendo la planilla con la service account ${cuenta.client_email}.`)
    return leerPlanilla(await obtenerToken(cuenta))
  }

  const csv = process.env.SOCIOS_CSV_URL ?? CSV_POR_DEFECTO
  console.log('Leyendo la planilla por el endpoint CSV (sin credencial).')
  return leerCsvPublicado(csv)
}

async function main() {
  const { total, socios, columnasUsadas } = extraer(await obtenerFilas())

  const salida = {
    _nota:
      'Generado por scripts/sync-socios.mjs desde la planilla de socios del club. No editar a mano.',
    actualizado: new Date().toISOString().slice(0, 10),
    total,
    socios: PUBLICAR_NOMBRES ? socios : [],
  }

  await mkdir(dirname(SALIDA), { recursive: true })
  await writeFile(SALIDA, `${JSON.stringify(salida, null, 2)}\n`, 'utf8')

  console.log(`Socios en el padrón: ${total}`)
  console.log(`Columnas leídas: ${columnasUsadas.join(', ')} (y ninguna más)`)
  console.log(
    PUBLICAR_NOMBRES
      ? `Publicados ${socios.length} nombres con su categoría.`
      : 'Nombres omitidos (PUBLICAR_NOMBRES=0): solo se escribió el total.',
  )
}

main().catch((error) => {
  console.error(`\nFalló la sincronización de socios:\n${error.message}\n`)
  process.exit(1)
})
