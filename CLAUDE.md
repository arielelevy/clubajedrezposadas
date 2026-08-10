# Instrucciones para Claude — sitio del Club de Ajedrez Posadas

Sitio estático (Vite + React + TS) en Azure Static Web Apps. Los datos que cambian
(fotos, socios, torneos) no se editan a mano: los generan los scripts de `scripts/`
y quedan versionados como JSON en `src/data/`.

## Refrescar fotos y socios a mano

**Socios** corre solo por GitHub Actions (`sync-socios.yml`, los lunes 9 UTC).
**Fotos ya no tiene cron**: se sacó el 2026-08-10 porque la carpeta de Drive
dejó de ser pública y fallaba todos los días; ahora la corre Ariel a mano desde
su máquina. `sync-fotos.yml` quedó solo con `workflow_dispatch`, para el día que
haya una credencial cargada en el repo.

### Socios — no necesita login

La planilla se lee por el endpoint CSV de Google Sheets, que es público:

```bash
node scripts/sync-socios.mjs
```

Escribe `src/data/socios.json`. La fecha `actualizado` se ve en el sitio
(`src/components/Padron.tsx`), así que una corrida sin cambios de padrón igual
mueve esa línea del diff.

Si falla diciendo que no encontró la columna de nombre, imprime los encabezados
reales de la planilla: ajustar `COLUMNAS_NOMBRE` en el script.

### Leer el padrón

Son dos lecturas distintas y conviene no confundirlas al reportar:

- **El JSON del repo** — lo que el sitio publica. Alcanza para contar socios,
  agrupar por categoría o listar nombres, y no toca la planilla:

  ```bash
  node -e "const j=require('./src/data/socios.json');console.log(j.actualizado,j.total,j.socios.length)"
  ```

- **La planilla cruda** — para chequear algo que el JSON no muestra (por ejemplo
  si el filtro por categoría está dejando socios afuera, o qué otras columnas
  trae). Se baja el mismo CSV que usa el script:

  ```bash
  curl -s "https://docs.google.com/spreadsheets/d/1gnpEBfmAU9HqWhi26S5hyq4zFfsEQ7Njnnds3fFWTG4/gviz/tq?tqx=out:csv&gid=0"
  ```

Regla de privacidad, que es el motivo de que exista `sync-socios.mjs` en vez de
leer el Sheet desde el navegador: la planilla son las respuestas del formulario
de alta y trae teléfonos, mails, DNI, direcciones, fechas de nacimiento (también
de menores) e historial de pagos. **Nada de eso sale de la planilla**: ni al
repo, ni a un commit, ni a una página, ni a un archivo temporal. Lo único
publicable es nombre y categoría, y el script ya lo fuerza con
`COLUMNAS_PROHIBIDAS`. Si hay que mirar la planilla cruda, mirar solo la columna
que hace falta para la pregunta y no volcar el CSV completo a un archivo.

Cosas conocidas del padrón, por si aparecen en una revisión: la planilla usa la
coma de forma despareja (`Barney, Juan` junto a `Voines Vigo`) y hay nombres que
parecen la misma persona con distinta grafía (`Voines Vigo` / `Voynes, Rippel
Viggo`). El dedup del script compara el nombre normalizado exacto, así que esos
casos quedan como dos socios. Al 2026-08-10 son 118: 63 Activo, 51 Cadete,
4 Protector.

### Fotos — necesita login de Google (la carpeta de Drive no es pública)

El script tiene un modo sin credencial que lee carpetas públicas por
`embeddedfolderview`, pero **la carpeta del club volvió a quedar privada y
devuelve 401 desde el 2026-08-08** (por eso se sacó el cron diario). La corrida
va con un access token de Drive, y hay que acordarse de hacerla cuando el club
sube fotos nuevas: ya no hay nada automático que las traiga.

Ariel eligió sacarlo con **rclone** (ya instalado, sin remote configurado):

```bash
# 1. Abre el navegador para el login de Google. Bloquea hasta que autorices.
#    Termina imprimiendo un JSON con access_token (dura 1 hora) y refresh_token.
rclone authorize drive --drive-scope=drive.readonly

# 2. Correr el sync con ese access_token.
DRIVE_ACCESS_TOKEN='ya29...' \
FOTOS_DRIVE_FOLDER="$(gh variable get FOTOS_DRIVE_FOLDER --repo arielelevy/clubajedrezposadas)" \
node scripts/sync-fotos.mjs
```

Detalles que importan:

- `rclone authorize` **no** crea `rclone.conf`: el refresh token no queda en la
  máquina, pero sí queda en la salida del comando. Si esa salida se guardó en un
  archivo (por ejemplo un comando en background), borrarlo al terminar y no
  pegar el token en el repo ni en un commit.
- La cuenta con la que se hace el login tiene que ver la carpeta del club; con
  `drive.readonly` alcanza.
- El sync es un **espejo**: lo que no está en Drive se borra de
  `src/assets/fotos/`. Si el login se hace con una cuenta que ve menos fotos que
  las que hay, se borran fotos buenas. Antes de commitear, comparar el conteo:
  `ls src/assets/fotos/*.webp | wc -l` contra `fotos.length` de
  `src/data/fotos.json` y contra el "Fotos en la carpeta de Drive: N" que
  imprime el script.
- Los HEIC de iPhone no los decodifica sharp: el script los saltea con warning.

Si algún día se quiere volver a automatizar, hay que hacer una de estas dos
(las dos las tiene que hacer Ariel, no se pueden hacer desde acá) y después
devolverle el cron a `sync-fotos.yml`:

1. Volver a poner la carpeta en «Cualquiera con el enlace → Lector». Es el modo
   por defecto del script, sin credenciales.
2. O una service account con la Drive API habilitada, la carpeta compartida como
   Lector con su mail, y la clave JSON cargada como secret del repo
   `GOOGLE_SERVICE_ACCOUNT_JSON`.

## Commitear y pushear

**No** commitear ni pushear el resultado de un sync sin que Ariel lo pida: el
push a `main` dispara el deploy a la SWA. Reportar el diff y esperar.
