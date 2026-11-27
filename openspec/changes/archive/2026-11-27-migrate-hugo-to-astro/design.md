# Design

## Context

Ver `proposal.md` para la motivación. El estado actual que condiciona el diseño es:

- Sitio Hugo con tema PaperMod instalado como submódulo Git (`themes/PaperMod`) y wiki de PaperMod como submódulo (`docs/`).
- Contenido bilingüe en `content/en` y `content/es`; inglés servido en `/` y español en `/es/`.
- Frontmatter mixto: TOML (`+++`) y YAML (`---`). No hay shortcodes de Hugo en el contenido; solo un partial propio (`layouts/partials/extend_head.html`) para Umami.
- Taxonomías de tags y categorías, feeds RSS, sitemap, 404, metadatos sociales y analítica Umami.
- Despliegue con GitHub Actions (`.github/workflows/hugo.yml`) en la rama `master`, usando `actions/configure-pages`, `peaceiris/actions-hugo`, `actions/upload-pages-artifact` y `actions/deploy-pages`.
- No hay `CNAME` versionado. `public/` está ignorado y contiene un build obsoleto con `http://localhost:1313`.
- Hay dos posts y dos páginas About; el volumen de contenido es pequeño, pero el modelo debe escalar.
- Restricciones: mismo repositorio, mismo dominio `reyespinosa.is-a.dev`, sin tocar DNS ni la configuración de Pages, URLs públicas preservadas, diseño Astro nativo funcional (no réplica pixel-perfect de PaperMod), paridad funcional más búsqueda.

## Goals / Non-Goals

**Goals:**

- Proyecto Astro estático con TypeScript, content collections y esquema validado.
- Preservar exactamente las URLs canónicas actuales y los slugs, incluidas barras finales.
- Mantener paridad funcional: posts, About, i18n, taxonomías, RSS, sitemap, SEO, 404, Umami, modo claro/oscuro y navegación.
- Añadir búsqueda client-side en ambos idiomas.
- Publicar `public/CNAME` con `reyespinosa.is-a.dev` y desplegar con `withastro/action@v6`.
- Dejar el repositorio sin dependencias de Hugo una vez verificado el sitio.

**Non-Goals:**

- Reproducir PaperMod pixel a pixel o conservar su CSS/templates.
- Rediseñar la marca, tipografía o identidad visual más allá de un layout funcional y limpio.
- Añadir comentarios, newsletter, CMS, backend o funciones dinámicas.
- Cambiar registros DNS, el custom domain de Pages, la rama por defecto o el repositorio remoto.
- Reescribir el contenido o traducir textos nuevos.
- Migrar el wiki `docs/` de PaperMod; se elimina o se archiva fuera del repositorio.

## Decisions

### 1. Astro estático con content collections

Se usará Astro en modo estático (`output: 'static'` por defecto) y content collections con esquema Zod. La estructura propuesta es:

```
src/
  content/
    posts/
      en/*.md
      es/*.md
    pages/
      en/about.md
      es/about.md
  content.config.ts
  layouts/
  components/
  pages/
  i18n/
  lib/
  styles/
public/
  CNAME
  images/
  img/
  favicon*
```

- Los posts se separan por carpeta de idioma y declaran `lang` explícito para filtrar y validar.
- Las páginas About van a una colección `pages` para no mezclarlas con el listado de posts.
- Los `_index.md` de Hugo no se migran como contenido: los títulos de listados (`Blog`) se gestionan desde las páginas y el diccionario i18n.
- Se normaliza todo el frontmatter a YAML. Astro acepta YAML y TOML, pero un solo formato simplifica el esquema, los diffs y las herramientas.
- Alternativa considerada: mantener `content/` y usar un loader `glob()` con `base`. Se descarta porque mezcla la estructura Hugo con la de Astro y complica las rutas por idioma.
- Alternativa considerada: una sola colección con `lang` en frontmatter. Se descarta porque la separación por carpeta hace imposible publicar un post en el idioma equivocado por error y simplifica los `getStaticPaths`.

### 2. Esquema de frontmatter y mapeo desde Hugo

Esquema mínimo por post:

```ts
{
  title: string;
  date: Date;
  draft: boolean;        // default false
  lang: 'en' | 'es';
  translationKey: string;
  description?: string;  // desde summary o description
  author?: string[];
  tags: string[];
  categories: string[];
  cover?: { image: string; alt: string; caption?: string };
  toc?: boolean;         // desde ShowToc
  tocOpen?: boolean;     // desde TocOpen
}
```

Mapeo:

| Hugo | Astro |
| --- | --- |
| `title` | `title` |
| `date` | `date` (Date) |
| `draft` | `draft` |
| `summary` / `description` | `description` (unificar; `summary` como fallback) |
| `tags`, `categories` | arrays de strings |
| `cover.image/alt/caption` | `cover.image/alt/caption` |
| `translationKey` (string o array) | string normalizado |
| `ShowToc` | `toc` |
| `TocOpen` | `tocOpen` |
| `ShowReadingTime`, `ShowShareButtons`, `ShowBreadCrumbs`, `ShowCodeCopyButtons` | defaults globales del layout; no se guardan por post salvo que se necesite una excepción |
| `type: page` | colección `pages` |
| `author` | `author` |

Los campos de PaperMod que no aportan comportamiento en el nuevo layout se eliminan del frontmatter. `translationKey` se normaliza a string porque el post actual usa un array (`["post-002"]`).

Alternativa considerada: conservar todos los campos de Hugo en el frontmatter. Se descarta porque el esquema quedaría lleno de campos muertos y sería más fácil cometer errores.

### 3. Routing i18n manual para preservar URLs

Se configura Astro i18n con `defaultLocale: 'en'`, `locales: ['en', 'es']` y `prefixDefaultLocale: false`. Las rutas se declaran explícitamente para mantener el inglés en la raíz y el español bajo `/es/`:

```
src/pages/index.astro
src/pages/about.astro
src/pages/posts/index.astro
src/pages/posts/[...slug].astro
src/pages/tags/index.astro
src/pages/tags/[tag].astro
src/pages/categories/index.astro
src/pages/categories/[category].astro
src/pages/search.astro
src/pages/404.astro
src/pages/es/index.astro
src/pages/es/about.astro
src/pages/es/posts/index.astro
src/pages/es/posts/[...slug].astro
src/pages/es/tags/index.astro
src/pages/es/tags/[tag].astro
src/pages/es/categories/index.astro
src/pages/es/categories/[category].astro
src/pages/es/search.astro
src/pages/es/404.astro
```

Configuración clave:

```js
export default defineConfig({
  site: 'https://reyespinosa.is-a.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
```

- `trailingSlash: 'always'` y `build.format: 'directory'` producen `/about/index.html` y URLs con barra final, igual que Hugo.
- No se usa `base`.
- Los `getStaticPaths` de los routes dinámicos filtran por `lang` y devuelven `params.slug` igual al nombre de archivo sin extensión.
- Los archivos españoles que hoy terminan en `.es.md` se renombran a `.md` dentro de `src/content/posts/es/` y `src/content/pages/es/`, de modo que el slug sea `hugo-for-personal-website`, no `hugo-for-personal-website.es`.
- Alternativa considerada: `prefixDefaultLocale: true` y redirects desde la raíz. Se descarta porque rompe las URLs actuales y añade complejidad de redirects en GitHub Pages.
- Alternativa considerada: generar todo con un solo `[...path].astro`. Se descarta por legibilidad y porque las rutas explícitas facilitan el checklist de paridad.

### 4. Layout y componentes Astro nativos

Se implementará un layout funcional, no una copia de PaperMod:

- `BaseLayout.astro`: `<html lang>`, `<head>`, SEO, Umami, theme bootstrap, header, main, footer.
- `Header.astro`: navegación por idioma, selector de idioma, toggle de tema, enlace a búsqueda.
- `Footer.astro`: copyright y enlaces sociales existentes (GitHub, LinkedIn, email).
- `PostCard.astro`: título, fecha, descripción, tags y portada opcional.
- `PostLayout.astro`: metadatos, portada, TOC, contenido renderizado, navegación anterior/siguiente.
- `TableOfContents.astro`: construido desde `headings` de `render(entry)`.
- `Seo.astro`: canonical, hreflang, Open Graph, Twitter Cards, JSON-LD.
- `LanguageSwitcher.astro`: usa `translationKey` para enlazar equivalentes; fallback al home del otro idioma.
- `ThemeToggle.astro`: ciclo auto/claro/oscuro con `localStorage` y script inline para evitar FOUC.
- `SearchBox.astro` / `SearchResults.astro`: Fuse.js sobre el índice JSON.
- `Pagination.astro`: paginación de listados si el número de posts crece; con dos posts no genera páginas extra.

La paleta y tipografía se definen con CSS custom properties en `src/styles/global.css`. No se importa CSS de PaperMod.

Alternativa considerada: portar PaperMod a Astro componente por componente. Se descarta por el alcance y porque el usuario eligió un blog Astro funcional, no una réplica visual.

### 5. Render de Markdown, TOC y tiempo de lectura

- Astro renderiza Markdown con `render(entry)`; se habilitan tablas GFM y resaltado de código con Shiki (incluido en Astro).
- Se añaden `rehype-slug` y `rehype-autolink-headings` para conservar anclas de encabezados y enlaces directos.
- El TOC se genera con `headings` que devuelve `render()` y se muestra solo si `toc` es verdadero.
- El tiempo de lectura se calcula en `src/lib/reading-time.ts` a partir del cuerpo Markdown (palabras / 200), sin dependencia externa.
- No se usa MDX: no hay shortcodes ni componentes embebidos en el contenido actual. Si en el futuro se necesitan, se añade `@astrojs/mdx` como cambio separado.
- Alternativa considerada: usar el plugin `remark-reading-time`. Se descarta para evitar una dependencia por una función de pocas líneas.

### 6. Feeds RSS con URLs exactas

Se usa `@astrojs/rss` en endpoints estáticos:

```
src/pages/index.xml.ts              -> /index.xml
src/pages/posts/index.xml.ts        -> /posts/index.xml
src/pages/tags/[tag]/index.xml.ts   -> /tags/<tag>/index.xml
src/pages/categories/[category]/index.xml.ts
src/pages/es/index.xml.ts           -> /es/index.xml
src/pages/es/posts/index.xml.ts     -> /es/posts/index.xml
src/pages/es/tags/[tag]/index.xml.ts
src/pages/es/categories/[category]/index.xml.ts
```

- Cada endpoint filtra por idioma y por término, ordena por fecha descendente y usa `site: Astro.site` para generar enlaces absolutos.
- Los endpoints de taxonomía usan `getStaticPaths` para emitir un feed por cada tag/categoría existente.
- Se excluyen drafts.
- Alternativa considerada: un solo feed global. Se descarta porque los feeds actuales son por idioma y por taxonomía, y preservar sus URLs es parte del contrato.

### 7. Sitemap y robots

Se generan endpoints propios:

```
src/pages/sitemap.xml.ts     -> /sitemap.xml
src/pages/es/sitemap.xml.ts  -> /es/sitemap.xml
```

- Se construyen desde las colecciones publicadas más las rutas estáticas (`/`, `/about/`, `/posts/`, `/tags/`, `/categories/`, `/search/` y equivalentes en español).
- Cada URL usa `Astro.site` y `trailingSlash: 'always'`.
- Se incluyen `xhtml:link` con `hreflang="en"` y `hreflang="es"` cuando exista traducción.
- Se excluyen `404` y drafts.
- `public/robots.txt` referencia `https://reyespinosa.is-a.dev/sitemap.xml`.
- Alternativa considerada: `@astrojs/sitemap`. Se descarta porque emite `sitemap-index.xml`/`sitemap-0.xml` por defecto, lo que no coincide con las URLs actuales y exigiría un paso de renombrado.

### 8. Búsqueda client-side con Fuse.js

- En build se generan `/index.json` y `/es/index.json` con `{ title, description, url, tags, categories, content }` de los posts publicados de cada idioma.
- `/search/` y `/es/search/` cargan el índice de su idioma y usan Fuse.js con pesos en título, descripción y tags.
- El índice se genera desde una función compartida en `src/lib/search-index.ts` para que página y endpoint usen la misma lógica.
- Se añade "Search"/"Buscar" a la navegación principal.
- Alternativa considerada: Pagefind. Se descarta porque añade un paso de indexación post-build y cambia la UX; Fuse.js replica el comportamiento de PaperMod y es suficiente para el volumen actual.

### 9. SEO, metadatos y JSON-LD

`Seo.astro` recibe `title`, `description`, `canonical`, `image`, `type`, `lang` y `translations`:

- `canonical` absoluto con `Astro.site`.
- `link rel="alternate" hreflang="en|es|x-default"` cuando exista traducción.
- Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale`).
- Twitter Cards (`summary_large_image` cuando hay portada).
- JSON-LD `BlogPosting` para posts y `WebSite` para home.
- La imagen de portada se resuelve a URL absoluta.

Alternativa considerada: integración de SEO de terceros. Se descarta para mantener control sobre los campos y evitar dependencias.

### 10. Analítica Umami

- El script se incluye una sola vez en `BaseLayout.astro`.
- Se conservan los valores actuales: `src="https://cloud.umami.is/script.js"` y `data-website-id="e85cd115-0d87-4f9c-a426-0f53d611e355"`.
- Se declara `defer` para no bloquear el render.
- Alternativa considerada: mover la configuración a variables de entorno. Se descarta porque el ID es público y el sitio es estático; si se quiere parametrizar, se hace en un cambio posterior.

### 11. Tema claro/oscuro

- Variables CSS para ambos temas.
- Script inline en `<head>` que lee `localStorage` y, si no hay preferencia, usa `prefers-color-scheme`, y aplica `data-theme` antes de pintar.
- `ThemeToggle` alterna auto/claro/oscuro y persiste la elección.
- Alternativa considerada: solo `prefers-color-scheme`. Se descarta porque el sitio actual ofrece un selector y perderlo sería una regresión funcional.

### 12. Migración de assets y CNAME

- Se elimina el `public/` obsoleto (build de Hugo con `localhost`) antes de crear el nuevo.
- `static/images/` → `public/images/`; `static/img/` → `public/img/`.
- Se crea `public/CNAME` con el contenido exacto `reyespinosa.is-a.dev`.
- Se inventarian las referencias a favicons (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `safari-pinned-tab.svg`) y se añaden a `public/` o se eliminan del `<head>` si no se van a usar. Esto evita 404 preexistentes.
- `.gitignore` debe ignorar `dist/`, `.astro/`, `node_modules/` y dejar de ignorar `public/`.
- Alternativa considerada: usar `src/assets/` y el pipeline de imágenes de Astro. Se descarta para preservar las rutas `/images/...` y `/img/...` sin cambios; se puede adoptar después como optimización.

### 13. Workflow de GitHub Pages

Se reemplaza `.github/workflows/hugo.yml` por `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- `withastro/action@v6` detecta npm por `package-lock.json`, instala, ejecuta `npm run build` y sube `dist/`.
- No se incluye `actions/configure-pages` porque el custom domain ya está configurado y no se desea modificarlo; si el action lo requiere en el futuro, se añade sin cambiar settings.
- Se fija Node 24 en el action y se añade `engines.node`/`.nvmrc` para paridad local.
- Alternativa considerada: build manual con `npm ci` + `actions/upload-pages-artifact`. Se descarta porque `withastro/action` es el camino oficial y reduce pasos.

### 14. Estrategia de migración y eliminación de Hugo

La migración se hace en commits pequeños y verificables:

1. Crear una etiqueta o rama de respaldo en el último commit de Hugo (`pre-astro-migration`) sin crear un repositorio nuevo.
2. Scaffold de Astro en un directorio temporal y copiar solo los archivos nuevos, para no sobrescribir `.git`, `CNAME` (si existiera), `README.md` ni `TODO.md`.
3. Migrar contenido y assets.
4. Implementar layout, rutas, feeds, sitemap, búsqueda y SEO.
5. Verificar build, preview, URLs y assets.
6. Reemplazar el workflow y desplegar a Pages.
7. Solo después de verificar el sitio publicado, eliminar archivos Hugo y submódulos en un commit separado.

- `themes/PaperMod` y `docs/` se eliminan con `git submodule deinit -f` + `git rm`, y se actualiza `.gitmodules`. Si se quiere conservar el wiki, se archiva fuera del repo antes.
- `hugo.yaml`, `hugo.yaml.example`, `.hugo_build.lock`, `archetypes/`, `layouts/`, `i18n/` y `themes/` se eliminan.
- `README.md` se conserva y se le añade una sección de desarrollo Astro; `TODO.md` se conserva.
- Alternativa considerada: hacer la migración en un repositorio nuevo y cambiar el remoto. Se descarta por la restricción explícita de mantener el mismo repositorio y dominio.

### 15. Verificación

- `npm run check` (Astro check + TypeScript) y `npm run build`.
- `npm run preview` para smoke test local.
- Link checker sobre `dist/` (por ejemplo `npx linkinator dist --recurse`) para enlaces y assets.
- Comparación contra un inventario de URLs generado antes de borrar `public/` (home, about, posts, tags, categorías, feeds, sitemap, 404).
- Verificación de `dist/CNAME` y de su contenido exacto.
- `curl -I https://reyespinosa.is-a.dev/` y de rutas clave después del deploy.
- `gh api repos/reyespinosa1996/reyespinosa1996.github.io/pages` (solo lectura) para confirmar custom domain, fuente y HTTPS antes/después.
- Prueba manual de búsqueda, selector de idioma, toggle de tema, TOC y enlaces sociales.

## Risks / Trade-offs

- **URLs rotas por slugs o barras finales** → inventario de URLs antes de migrar, `trailingSlash: 'always'`, `build.format: 'directory'`, tests de rutas y link checker. Los archivos `.es.md` se renombran para evitar slugs con `.es`.
- **Pérdida de features de PaperMod** → checklist de paridad (posts, about, tags, categorías, RSS, sitemap, 404, SEO, Umami, tema, búsqueda). El diseño es funcional, no pixel-perfect; se acepta una diferencia visual deliberada.
- **CNAME no publicado** → `public/CNAME` versionado, `.gitignore` corregido y verificación `test -f dist/CNAME && [ "$(cat dist/CNAME)" = "reyespinosa.is-a.dev" ]` en el build o en CI.
- **`public/` sigue ignorado** → cambiar `.gitignore` en el primer commit de scaffold y verificar con `git check-ignore -v public/CNAME` que no esté ignorado.
- **GitHub Pages pierde el custom domain** → no tocar la configuración de Pages; el CNAME del artefacto la respalda. Si aun así se pierde, se restaura manualmente en Settings → Pages, sin cambios de DNS.
- **Recacheo de DNS/HTTPS** → no se cambian registros DNS ni el dominio; el certificado TLS existente sigue siendo válido. Se verifica con `curl -I` después del deploy. Si GitHub regenera el certificado, puede haber una ventana breve; se monitorea.
- **Pérdida de contenido o metadatos** → migración archivo por archivo, esquema Zod, comparación de cuerpos y revisión de los 4 posts + 2 About.
- **Feeds/sitemap con `localhost` o rutas relativas** → usar `Astro.site` y validar el XML generado; test de que no aparece `localhost` en `dist`.
- **Búsqueda con índice desactualizado** → el índice se genera en build desde las mismas colecciones; se excluyen drafts; se prueba en preview.
- **Duplicación del script de Umami** → una sola inclusión en `BaseLayout`; test de conteo en HTML generado.
- **Favicons 404 preexistentes** → inventario y decisión de añadir archivos o eliminar referencias; el link checker debe pasar sin 404.
- **Submódulos y `.gitmodules` mal eliminados** → hacerlo en un commit posterior a la verificación; `git submodule status` debe quedar vacío y `git status` limpio.
- **Diferencias de API de content collections según versión de Astro** → al instalar, revisar la versión mayor y usar `src/content.config.ts` con `glob()` para Astro 5+; si se instala Astro 4, usar `src/content/config.ts`. Esto se resuelve en el primer paso de implementación, no cambia el enfoque.
- **Node distinto entre local y CI** → fijar Node 24 en `withastro/action` y en `.nvmrc`/`engines`.

## Migration Plan

1. **Respaldo**: crear tag `pre-astro-migration` en el último commit de Hugo y verificar que `git status` esté limpio (salvo `openspec/`).
2. **Inventario**: guardar la lista de URLs actuales desde `public/` y los sitemaps; identificar favicons y assets referenciados.
3. **Scaffold**: crear el proyecto Astro en un directorio temporal, copiar `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` y `src/`; no ejecutar `git init` ni sobrescribir `.git`, `CNAME`, `README.md` o `TODO.md`.
4. **Contenido**: mover y renombrar archivos, normalizar frontmatter, definir el esquema y validar con `astro check`.
5. **Assets**: crear el nuevo `public/`, mover imágenes, añadir `CNAME` y favicons, actualizar `.gitignore`.
6. **Sitio**: implementar layouts, rutas, i18n, taxonomías, feeds, sitemap, SEO, búsqueda, 404 y Umami.
7. **Verificación local**: `npm run check`, `npm run build`, `npm run preview`, link checker y comparación de URLs.
8. **CI/CD**: reemplazar el workflow, hacer push a una rama de trabajo, verificar el deploy de preview si se habilita, y luego merge a `master`.
9. **Verificación en producción**: `curl` a rutas clave, comprobar CNAME, HTTPS, feeds, sitemap, búsqueda y selector de idioma.
10. **Limpieza**: eliminar archivos y submódulos de Hugo en un commit separado; actualizar README con comandos de Astro; confirmar que `hugo` ya no es necesario.
11. **Rollback**: si algo falla en producción, revertir el commit del workflow/sitio o volver a desplegar el tag `pre-astro-migration` mediante un revert; no se requiere cambiar Pages ni DNS.

## Decisiones manuales confirmadas

- **`docs/` (wiki de PaperMod)**: se elimina del repositorio junto con el submódulo, sin archivar copia local. Confirmado por el usuario.
- **Favicons**: los cinco archivos referenciados por el sitio Hugo (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `safari-pinned-tab.svg`) no existen en los assets originales y no se añaden. El `<head>` de Astro no los referencia; en su lugar se publica un único `public/favicon.svg` derivado de `public/img/logo.svg` y se enlaza desde `BaseLayout.astro`. Confirmado por el usuario.

## Notas de implementación

- **Renderizado real verificado en navegador**: los componentes `.astro` no deben envolver su marcado en `<template>`. En una iteración intermedia se añadió ese envoltorio y el build seguía pasando, pero los navegadores renderizaban las páginas en blanco porque todo el documento quedaba dentro de un template inerte. Se corrigió y se comprobó en preview que home, posts, búsqueda, 404, selector de idioma, toggle de tema y Fuse.js funcionan. Cualquier verificación futura debe incluir una revisión visual o de DOM en navegador, no solo HTML estático.

## Open Questions

Ninguna. Las URLs legacy de paginación se resuelven con redirecciones a los listados canónicos, según `content-and-routing/spec.md`; no se replica la paginación de Hugo.
