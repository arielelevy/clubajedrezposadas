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
 * Cómo lee la carpeta, según lo que haya configurado:
 *
 *   A) GOOGLE_SERVICE_ACCOUNT_JSON — la carpeta se comparte como Lector con el
 *      mail de la service account (Drive API habilitada en su proyecto).
 *   B) DRIVE_API_KEY — la carpeta es pública y se lee con una API key.
 *   C) Sin credencial — la carpeta es pública ("cualquiera con el enlace") y
 *      se lee por la vista embebida de Drive, sin ninguna key. Es el modo por
 *      defecto del club; si Google cambia ese HTML, pasar al modo A o B.
 *
 * Variables:
 *   FOTOS_DRIVE_FOLDER           link (o id) de la carpeta compartida. Sin esto
 *                                el script avisa y termina bien, para que el
 *                                cron no falle mientras el club no pase el link.
 *   GOOGLE_SERVICE_ACCOUNT_JSON  modo A (opcional)
 *   DRIVE_API_KEY                modo B (opcional)
 *
 * Uso:
 *   FOTOS_DRIVE_FOLDER='https://drive.google.com/drive/folders/...' node scripts/sync-fotos.mjs
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
const EXTENSIONES_IMAGEN = /\.(jpe?g|png|webp|avif|gif|bmp|tiff?|heic|heif)$/i

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

/* ------------------------------------------------------------------ */
/* Modos A y B: la Drive API, con service account o con API key        */
/* ------------------------------------------------------------------ */

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

/** Credencial elegida, o null para el modo público sin credencial. */
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

  // Para una corrida manual con la sesión de una persona:
  //   DRIVE_ACCESS_TOKEN=$(gcloud auth print-access-token) node scripts/sync-fotos.mjs
  // (el login previo necesita el scope de Drive: gcloud auth login --enable-gdrive-access)
  const tokenManual = process.env.DRIVE_ACCESS_TOKEN
  if (tokenManual) {
    console.log('Leyendo Drive con un access token manual.')
    return { headers: { Authorization: `Bearer ${tokenManual}` }, params: {} }
  }

  console.log('Sin credencial: leyendo la carpeta pública por la vista embebida de Drive.')
  return null
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

async function pedirDrive(credencial, ruta, params) {
  const url = new URL(`${API}/${ruta}`)
  for (const [k, v] of Object.entries({ ...params, ...credencial.params })) {
    url.searchParams.set(k, v)
  }

  // La cuota de Drive es por minuto: cuando la carpeta es grande, la corrida
  // la pisa y Google devuelve 403 rateLimitExceeded. Se espera y se insiste.
  for (let intento = 0; ; intento++) {
    const respuesta = await fetch(url, { headers: credencial.headers })
    if (respuesta.ok) return respuesta

    const detalle = await respuesta.text()
    const esLimite =
      respuesta.status === 429 ||
      (respuesta.status === 403 && /rate.?limit|quota/i.test(detalle))

    if (esLimite && intento < 6) {
      const pausa = Math.min(90, 10 * 2 ** intento)
      console.log(`  … límite de la Drive API, esperando ${pausa}s`)
      await esperar(pausa * 1000)
      continue
    }

    if (respuesta.status === 403 || respuesta.status === 404) {
      throw new Error(
        `Drive no dejó leer (${respuesta.status}). Con service account: la carpeta tiene que ` +
          `estar compartida como Lector con su mail y la Drive API habilitada en el proyecto. ` +
          `Con API key: la carpeta tiene que ser pública. Detalle: ${detalle}`,
      )
    }
    throw new Error(`Error de la Drive API (${respuesta.status}): ${detalle}`)
  }
}

async function listarCarpetaApi(credencial, idCarpeta) {
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

  return archivos.map((a) => ({
    id: a.id,
    nombre: a.name,
    esCarpeta: a.mimeType === 'application/vnd.google-apps.folder',
    esImagen: Boolean(a.mimeType?.startsWith('image/')),
    md5: a.md5Checksum ?? null,
    fechaApi: fechaDeMetadatos(a),
  }))
}

/** 'AAAA:MM:DD HH:MM:SS' del EXIF que reporta Drive → 'AAAA-MM-DD'. */
function fechaDeMetadatos(archivo) {
  const exif = archivo.imageMediaMetadata?.time
  const match = exif?.match(/^(\d{4}):(\d{2}):(\d{2})/)
  if (match) return `${match[1]}-${match[2]}-${match[3]}`
  return (archivo.createdTime ?? '').slice(0, 10) || null
}

/* ------------------------------------------------------------------ */
/* Modo C: carpeta pública, sin credencial                             */
/* ------------------------------------------------------------------ */

/**
 * La vista embebida (embeddedfolderview) es HTML público y estable que Google
 * sirve para carpetas compartidas con "cualquiera con el enlace". No es una
 * API formal: si algún día cambia, conviene pasar al modo con credencial.
 */
async function listarCarpetaPublica(idCarpeta) {
  const url = `https://drive.google.com/embeddedfolderview?id=${idCarpeta}`
  const respuesta = await fetch(url, { redirect: 'follow' })

  if (respuesta.status === 401 || respuesta.status === 403) {
    throw new Error(
      'La carpeta no es pública: en Drive, botón "Compartir" → "Cualquiera con el enlace" ' +
        'como Lector. La otra opción es configurar GOOGLE_SERVICE_ACCOUNT_JSON o DRIVE_API_KEY.',
    )
  }
  if (!respuesta.ok) {
    throw new Error(`Drive devolvió ${respuesta.status} al listar la carpeta pública.`)
  }

  const html = await respuesta.text()
  const entradas = []

  // Cada entrada de la vista: id="entry-<ID>" … href="<link>" … flip-entry-title">nombre<
  for (const bloque of html.split(/id="entry-/).slice(1)) {
    const id = bloque.match(/^([-\w]+)"/)?.[1]
    const nombre = bloque.match(/flip-entry-title">([^<]*)</)?.[1]
    if (!id || nombre === undefined) continue

    const esCarpeta = bloque.includes('/drive/folders/')
    entradas.push({
      id,
      nombre,
      esCarpeta,
      esImagen: !esCarpeta && EXTENSIONES_IMAGEN.test(nombre),
      md5: null,
      fechaApi: null,
    })
  }

  return entradas
}

/**
 * El EXIF guarda las fechas como texto plano 'AAAA:MM:DD HH:MM:SS', así que en
 * lugar de un parser TIFF entero alcanza con buscar ese patrón en el arranque
 * del archivo (el EXIF vive en los primeros bloques del JPEG).
 */
function fechaDeExif(buffer) {
  const cabecera = buffer.subarray(0, 131072).toString('latin1')
  const match = cabecera.match(/((?:19|20)\d{2}):(\d{2}):(\d{2}) \d{2}:\d{2}:\d{2}/)
  if (!match) return null

  const [, anio, mes, dia] = match
  if (Number(mes) < 1 || Number(mes) > 12 || Number(dia) < 1 || Number(dia) > 31) return null
  return `${anio}-${mes}-${dia}`
}

/* ------------------------------------------------------------------ */
/* Recorrido, descarga y espejo                                        */
/* ------------------------------------------------------------------ */

/**
 * Recorre la carpeta y sus subcarpetas. El título de cada foto es la
 * subcarpeta de PRIMER nivel: si el club anida más adentro, todo lo de
 * "Torneo X/día 1/..." sigue titulado "Torneo X".
 */
async function descubrirFotos(credencial, idRaiz) {
  const listar = credencial
    ? (id) => listarCarpetaApi(credencial, id)
    : (id) => listarCarpetaPublica(id)

  const pendientes = [{ id: idRaiz, carpeta: null }]
  const fotos = []

  while (pendientes.length) {
    const { id, carpeta } = pendientes.shift()

    for (const entrada of await listar(id)) {
      if (entrada.esCarpeta) {
        pendientes.push({ id: entrada.id, carpeta: carpeta ?? entrada.nombre.trim() })
      } else if (entrada.esImagen) {
        fotos.push({ ...entrada, carpeta })
      }
    }
  }

  return fotos
}

async function descargar(credencial, archivo) {
  if (credencial) {
    const respuesta = await pedirDrive(credencial, `files/${archivo.id}`, {
      alt: 'media',
      supportsAllDrives: 'true',
    })
    return Buffer.from(await respuesta.arrayBuffer())
  }

  // Descarga pública directa. Para archivos grandes Drive intercala una página
  // de confirmación; el endpoint moderno con confirm=t la saltea.
  for (const url of [
    `https://drive.google.com/uc?export=download&id=${archivo.id}`,
    `https://drive.usercontent.google.com/download?id=${archivo.id}&export=download&confirm=t`,
  ]) {
    const respuesta = await fetch(url, { redirect: 'follow' })
    if (!respuesta.ok) continue
    const tipo = respuesta.headers.get('content-type') ?? ''
    if (tipo.includes('text/html')) continue
    return Buffer.from(await respuesta.arrayBuffer())
  }

  throw new Error('Drive no entregó el archivo por los endpoints públicos.')
}

async function convertir(original, destino) {
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
  const previas = new Map((previo.fotos ?? []).map((f) => [f.id, f]))
  const existentes = new Set(await readdir(CARPETA_FOTOS))

  const fotos = []
  let bajadas = 0
  let falladas = 0

  for (const archivo of descubiertas) {
    const nombreLocal = `${archivo.id}.webp`
    const anterior = previas.get(archivo.id)

    // Con la API comparamos md5; en el modo público no hay hash, así que una
    // foto ya bajada no se vuelve a bajar (editar una foto subida es rarísimo).
    const sinCambios =
      existentes.has(nombreLocal) && (archivo.md5 ? anterior?.md5 === archivo.md5 : Boolean(anterior))

    let fecha = archivo.fechaApi ?? anterior?.fecha ?? null

    if (!sinCambios) {
      try {
        const original = await descargar(credencial, archivo)
        fecha = archivo.fechaApi ?? fechaDeExif(original)
        await convertir(original, resolve(CARPETA_FOTOS, nombreLocal))
        bajadas++
      } catch (error) {
        // Un formato que sharp no decodifica (HEIC de iPhone, por ejemplo) no
        // tiene que frenar el resto de la galería.
        falladas++
        console.warn(`  ⚠ No pude bajar o convertir "${archivo.nombre}" (${archivo.id}): ${error.message}`)
        continue
      }
    }

    fotos.push({
      id: archivo.id,
      archivo: nombreLocal,
      carpeta: archivo.carpeta,
      fecha,
      md5: archivo.md5,
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
