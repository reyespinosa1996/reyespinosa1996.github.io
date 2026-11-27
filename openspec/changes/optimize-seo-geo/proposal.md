# Proposal

## Why

El sitio ya publica canonical, `hreflang`, Open Graph, Twitter Cards, JSON-LD y sitemap, pero los motores de respuesta con IA necesitan señales más explícitas para citar el contenido y varios índices y páginas de taxonomía tienen metadatos incompletos o genéricos. Optimizar esas señales sin reescribir los artículos ni tocar el despliegue mejora el descubrimiento y la atribución manteniendo las URLs y la publicación actuales.

## What Changes

- Completar los metadatos indexables: descripción única y no vacía en cada página pública, `og:image:alt` y dimensiones cuando exista portada, tiempos de publicación/modificación en Open Graph y directivas `robots` coherentes con el tipo de página.
- Ampliar los datos estructurados sin sustituir los actuales: identidad del autor con `sameAs` (GitHub, LinkedIn y correo), `BreadcrumbList` en posts y taxonomías, `ItemList` en índices y `keywords` derivadas de tags y categorías.
- Generar `llms.txt` y `llms-full.txt` en inglés y español a partir de las colecciones publicadas, con enlaces canónicos, resúmenes y atribución al autor; excluyendo drafts.
- Actualizar `robots.txt` para declarar acceso a crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot), excluir `/admin/` y los índices JSON de la indexación, y mantener el `Sitemap` existente.
- Auditar URLs y slugs: documentar cualquier cambio propuesto junto con su mapa de redirecciones. **No se aplicará** ningún cambio de URL, slug o estructura de rutas sin decisión explícita del usuario, conforme a `AGENTS.md`.
- Verificar el resultado con `npm run check`, `npm run build`, comprobación de `dist/CNAME`, `curl` de los nuevos endpoints y revisión real en navegador del `<head>` y del contenido citables.

No hay cambios rupturistas. El contenido existente no se reescribe; los nuevos archivos se derivan de las colecciones ya publicadas.

## Capabilities

### New Capabilities

- `generative-engine-optimization`: señales legibles por motores generativos: archivos `llms.txt`/`llms-full.txt`, política de crawlers de IA y contenido citables con atribución al autor.

### Modified Capabilities

- `content-and-routing`: nuevos requisitos de metadatos indexables completos, datos estructurados ampliados y coherencia entre canonical, sitemap y páginas indexables.

## Impact

- Código: `src/components/Seo.astro`, `src/layouts/BaseLayout.astro`, `src/layouts/PostLayout.astro`, layouts de índices y taxonomías, `src/lib/sitemap.ts` y una utilidad compartida para la identidad del autor y las señales citables.
- Nuevas rutas estáticas: `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts` y sus equivalentes bajo `src/pages/es/`.
- Contenido estático: `public/robots.txt`. Posible limpieza de constantes obsoletas en `src/consts.ts` (`Astro Blog` / `Welcome to my website!`) para evitar metadatos genéricos.
- Sin dependencias npm nuevas, sin servidor ni backend, sin cambios en `public/admin/`, GitHub Pages, DNS, `CNAME`, dominio ni URLs públicas existentes.
- Sin reescritura de posts ni páginas; los archivos nuevos se generan en build desde `src/content/**` y respetan `draft: true`.
