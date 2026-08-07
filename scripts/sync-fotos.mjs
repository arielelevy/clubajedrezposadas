/**
 * Baja las fotos de la carpeta de Google Drive del club a src/assets/fotos/
 * y escribe src/data/fotos.json con lo que la página necesita para el
 * epígrafe: la subcarpeta de Drive (el título) y la fecha de la foto.
 *
 * Por qué se bajan y no se sirven desde Drive: así el sitio no depende de una
 * API key visible en el navegador ni de que Google siga sirviendo thumbnails,
 * las imágenes quedan optimizadas (webp, ancho acotado) y versionadas con el
 * resto del repo, y la página las autodescubre igual que la galería del home.
 *
 * El club sube las fotos desde el celular a la carpeta compartida, y este
 * script (workflow sync-fotos.yml) las trae: es un espejo, lo que se borra en
 * Drive se borra acá. La subcarpeta de primer nivel es el título del epígrafe
 * ("Torneo Aniversario/foto.jpg" → "Torneo Aniversario"); las fotos sueltas en
 * la raíz quedan solo con la fecha. La fecha sale del EXIF de la foto y, si no
 * trae, de la fecha de subida a Drive.
 *
 * Variables:
 *   FOTOS_DRIVE_FOLDER           link (o id) de la carpeta compartida. Sin esto
 *                                el script avisa y termina bien, para que el
 *                                cron no falle mientras el club no pase el link.
 *   GOOGLE_SERVICE_ACCOUNT_JSON  opción A: la carpeta se comparte como Lector
 *                                con el mail de la service account (la misma
 *                                del padrón sirve, con la Drive API habilitada).
 *   DRIVE_API_KEY                opción B: la carpeta queda pública ("cualquiera
 *                                con el enlace") y se lee con una API key.
 *
 * Uso:
 *   FOTOS_DRIVE_FOLDER='https://drive.google.com/drive/folders/...' \
 *   DRIVE_API_KEY='...' node scripts/sync-fotos.mjs
 */

import { createSign } from 'node:crypto'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CARPETA_FOTOS = resolve(RAIZ, 'src/assets/fotos')
const SALIDA_JSON = resolve(RAIZ, 'src/data/fotos.json')

/** Ancho máximo del webp publicado: alcanza para el lightbox en retina. */
const ANCHO_MAX = 1600
const CALIDAD = 78

const API = 'https://www.googleapis.com/drive/v3'

function extraerIdCarpeta(crudo) {
  const texto = crudo.trim()
  // Acepta el link completo (…/drive/folders/<id>?usp=sharing) o el id pelado.
  const match = texto.match(/folders\/([-\w]+)/) ?? texto.match(/^([-\w]{20,})$/)
  if (!match) {
    throw new Error(
      `No pude sacar el id de carpeta de "${texto}". ` +
        `Pasá el link tal cual lo da Drive (https://drive.google.com/drive/folders/…) o el id solo.`,
    )
  }
  return match[1]
}

function firmarJwt(cuenta) {
  const ahora = Math.floor(Date.now() / 1000)
  const reclamos = {
    iss: cuenta.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: ahora,
    exp: ahora + 3600,
  }

  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const cuerpo = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(reclamos)}`

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

/** Credencial elegida: header Bearer (service account) o key en la URL (API key). */
async function prepararCredencial() {
  const crudo = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (crudo) {
    const cuenta = JSON.parse(crudo)
    if (!cuenta.client_email || !cuenta.private_key) {
      throw new Error('El JSON de la service account no tiene client_email o private_key.')
    }
    console.log(`Leyendo Drive con la service account ${cuenta.client_email}.`)
    const token = await obtenerToken(cuenta)
    return { headers: { Authorization: `Bearer ${token}` }, params: {} }
  }

  const key = process.env.DRIVE_API_KEY
  if (key) {
    console.log('Leyendo Drive con API key (la carpeta tiene que ser pública).')
    return { headers: {}, params: { key } }
  }

  throw new Error(
    'Falta la credencial: GOOGLE_SERVICE_ACCOUNT_JSON (carpeta compartida con la service ' +
      'account) o DRIVE_API_KEY (carpeta pública). Ver el encabezado de este script.',
  )
}

async function pedirDrive(credencial, ruta, params) {
  const url = new URL(`${API}/${ruta}`)
  for (const [k, v] of Object.entries({ ...params, ...credencial.params })) {
    url.searchParams.set(k, v)
  }

  const respuesta = await fetch(url, { headers: credencial.headers })
  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    if (respuesta.status === 403 || respuesta.status === 404) {
      throw new Error(
        `Drive no dejó leer (${respuesta.status}). Con service account: la carpeta tiene que ` +
          `estar compartida como Lector con su mail y la Drive API habilitada en el proyecto. ` +
          `Con API key: la carpeta tiene que ser pública. Detalle: ${detalle}`,
      )
    }
    throw new Error(`Error de la Drive API (${respuesta.status}): ${detalle}`)
  }
  return respuesta
}

async function listarCarpeta(credencial, idCarpeta) {
  const archivos = []
  let pageToken

  do {
    const respuesta = await pedirDrive(credencial, 'files', {
      q: `'${idCarpeta}' in parents and trashed = false`,
      fields:
        'nextPageToken,files(id,name,mimeType,md5Checksum,createdTime,imageMediaMetadata(time))',
      pageSize: '1000',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
      ...(pageToken ? { pageToken } : {}),
    })
    const datos = await respuesta.json()
    archivos.push(...(datos.files ?? []))
    pageToken = datos.nextPageToken
  } while (pageToken)

  return archivos
}

/**
 * Recorre la carpeta y sus subcarpetas. El título de cada foto es la
 * subcarpeta de PRIMER nivel: si el club anida más adentro, todo lo de
 * "Torneo X/día 1/..." sigue titulado "Torneo X".
 */
async function descubrirFotos(credencial, idRaiz) {
  const pendientes = [{ id: idRaiz, carpeta: null }]
  const fotos = []

  while (pendientes.length) {
    const { id, carpeta } = pendientes.shift()

    for (const archivo of await listarCarpeta(credencial, id)) {
      if (archivo.mimeType === 'application/vnd.google-apps.folder') {
        pendientes.push({ id: archivo.id, carpeta: carpeta ?? archivo.name.trim() })
      } else if (archivo.mimeType?.startsWith('image/')) {
        fotos.push({ ...archivo, carpeta })
      }
    }
  }

  return fotos
}

/** 'AAAA:MM:DD HH:MM:SS' del EXIF → 'AAAA-MM-DD'; sin EXIF, la fecha de subida. */
function fechaDeFoto(archivo) {
  const exif = archivo.imageMediaMetadata?.time
  const match = exif?.match(/^(\d{4}):(\d{2}):(\d{2})/)
  if (match) return `${match[1]}-${match[2]}-${match[3]}`
  return (archivo.createdTime ?? '').slice(0, 10) || null
}

async function bajarYConvertir(credencial, archivo, destino) {
  const respuesta = await pedirDrive(credencial, `files/${archivo.id}`, {
    alt: 'media',
    supportsAllDrives: 'true',
  })
  const original = Buffer.from(await respuesta.arrayBuffer())

  // rotate() sin argumentos hornea la orientación EXIF: las fotos de celular
  // suelen venir "acostadas" y con la rotación solo en metadatos.
  await sharp(original)
    .rotate()
    .resize({ width: ANCHO_MAX, withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toFile(destino)
}

async function leerJsonPrevio() {
  try {
    return JSON.parse(await readFile(SALIDA_JSON, 'utf8'))
  } catch {
    return { fotos: [] }
  }
}

async function main() {
  const carpetaCruda = process.env.FOTOS_DRIVE_FOLDER
  if (!carpetaCruda) {
    console.log(
      'FOTOS_DRIVE_FOLDER no está configurada todavía: no hay carpeta de Drive que leer.\n' +
        'Cuando el club pase el link, cargarlo como variable del repo:\n' +
        '  gh variable set FOTOS_DRIVE_FOLDER --repo arielelevy/clubajedrezposadas --body "<link>"',
    )
    return
  }

  const idRaiz = extraerIdCarpeta(carpetaCruda)
  const credencial = await prepararCredencial()

  const descubiertas = await descubrirFotos(credencial, idRaiz)
  console.log(`Fotos en la carpeta de Drive: ${descubiertas.length}`)

  await mkdir(CARPETA_FOTOS, { recursive: true })

  const previo = await leerJsonPrevio()
  const md5Previo = new Map((previo.fotos ?? []).map((f) => [f.id, f.md5]))
  const existentes = new Set(await readdir(CARPETA_FOTOS))

  const fotos = []
  let bajadas = 0
  let falladas = 0

  for (const archivo of descubiertas) {
    const nombreLocal = `${archivo.id}.webp`
    const sinCambios = existentes.has(nombreLocal) && md5Previo.get(archivo.id) === archivo.md5Checksum

    if (!sinCambios) {
      try {
        await bajarYConvertir(credencial, archivo, resolve(CARPETA_FOTOS, nombreLocal))
        bajadas++
      } catch (error) {
        // Un formato que sharp no decodifica (HEIC de iPhone, por ejemplo) no
        // tiene que frenar el resto de la galería.
        falladas++
        console.warn(`  ⚠ No pude convertir "${archivo.name}" (${archivo.id}): ${error.message}`)
        continue
      }
    }

    fotos.push({
      id: archivo.id,
      archivo: nombreLocal,
      carpeta: archivo.carpeta,
      fecha: fechaDeFoto(archivo),
      md5: archivo.md5Checksum ?? null,
    })
  }

  // Espejo: lo que ya no está en Drive (o falló siempre) se va del repo.
  const vigentes = new Set(fotos.map((f) => f.archivo))
  let borradas = 0
  for (const nombre of existentes) {
    if (nombre.endsWith('.webp') && !vigentes.has(nombre)) {
      await rm(resolve(CARPETA_FOTOS, nombre))
      borradas++
    }
  }

  fotos.sort(
    (a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? '') || a.archivo.localeCompare(b.archivo),
  )

  const salida = {
    _nota:
      'Generado por scripts/sync-fotos.mjs desde la carpeta de Drive del club. No editar a mano.',
    actualizado: new Date().toISOString().slice(0, 10),
    fotos,
  }
  await writeFile(SALIDA_JSON, `${JSON.stringify(salida, null, 2)}\n`, 'utf8')

  console.log(
    `Galería: ${fotos.length} fotos publicadas (${bajadas} bajadas, ${borradas} borradas` +
      (falladas ? `, ${falladas} sin convertir` : '') +
      ').',
  )
}

main().catch((error) => {
  console.error(`\nFalló la sincronización de fotos:\n${error.message}\n`)
  process.exit(1)
})
