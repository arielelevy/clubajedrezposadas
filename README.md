# Club de Ajedrez Posadas — sitio oficial

Sitio del **Club de Ajedrez Posadas** (Misiones, Argentina), fundado el 12 de julio de 1926 y
en camino a su centenario: primer club dedicado exclusivamente al ajedrez de la provincia y
tercera institución ajedrecística más antigua del país.

🌐 **En producción:** https://clubdeajedrezposadas.com
(host de Azure Static Web Apps: https://blue-sky-07b9cde0f.7.azurestaticapps.net)

## Qué incluye

- **Home** — el evento del centenario (IRT "100 Años", 5 al 8 de diciembre de 2026), el club,
  el recorrido de los cien años, los talleres con el horario semanal real, el visor de partidas
  y la galería.
- **/historia** — reseña histórica oficial completa y la línea del tiempo de los cinco hitos.
- **/auspicios** — los seis niveles de auspicio de la carpeta 2026 con sus aportes, la propuesta
  de valor y los auspiciantes que ya acompañan.
- **/socios** — alta de socio (formulario online o PDF), preguntas frecuentes y la convocatoria
  abierta a presentar proyectos en el club.
- **/fotos** — la galería completa, sincronizada todos los días desde la carpeta de Google Drive
  del club (`scripts/sync-fotos.mjs`): cada foto lleva como epígrafe su subcarpeta y su fecha.
- **Visor de partidas** — tablero propio con navegación de jugadas, que lee PGN del club y también
  transmisiones en vivo de torneos de elite vía la API pública de Lichess.

## Stack

| Herramienta | Uso |
|---|---|
| Vite 8 + React 19 + TypeScript 5 | base del proyecto |
| Tailwind CSS 4 | estilos, con tokens en `src/index.css` (`@theme`), sin `tailwind.config.js` |
| React Router 7 | rutas |
| Framer Motion | animaciones y `prefers-reduced-motion` |
| Radix UI + cva | componentes de `src/components/ui` |
| chess.js | validación de jugadas del visor |
| Azure Static Web Apps | hosting y CI/CD |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # salida en dist/
npm run preview    # sirve el build
npm run assets     # regenera imágenes optimizadas en public/img
```

## Estructura

```
public/            estáticos servidos tal cual: logos, PDFs, PGN, staticwebapp.config.json
src/
  data/site.ts     TODO el contenido institucional (textos, horarios, auspicios, eventos)
  components/      Navbar, Footer, Hero, Board, GameViewer, Ornaments, ui/
  sections/        bloques del home
  pages/           Home, Historia, Auspicios, Socios, 404
  lib/             pgn.ts (parser + FEN), lichess.ts (API pública), utils.ts
```

El contenido no está hardcodeado en los componentes: **todo el texto institucional vive en
`src/data/site.ts`**. Para actualizar horarios, montos de auspicio, datos del torneo o redes,
se edita ese archivo y nada más.

## Diseño

Paleta tomada del banner institucional del centenario: grafito y negro con curvas, marfil, y el
oro del sello "100 AÑOS", con el naranja del mate como acento. Tipografías: Cormorant Garamond
(display), Inter (texto) y Bebas Neue (datos y años). Las piezas de ajedrez Unicode se usan como
sistema de iconografía.

## Deploy

Cada push a `main` dispara `.github/workflows/azure-static-web-app.yml`: typecheck → build →
deploy a Azure Static Web Apps. Los pull requests generan un entorno de preview propio que se
cierra al mergear.

| Recurso | Valor |
|---|---|
| Static Web App | `swa-clubajedrez-prod` |
| Resource group | `rg-clubajedrez-prod` (East US 2, SKU Free) |
| Secret del repo | `AZURE_STATIC_WEB_APPS_API_TOKEN` |
| Rutas y cache | `public/staticwebapp.config.json` |

## Contacto

Jujuy 1514, 3300 Posadas, Misiones · WhatsApp 3764328118 ·
[@clubdeajedrezposadas](https://www.instagram.com/clubdeajedrezposadas) en Instagram y Facebook.
