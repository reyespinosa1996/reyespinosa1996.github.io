# Tasks

## 1. Utilidades y metadatos compartidos

- [x] 1.1 Crear `src/lib/seo.ts` con la identidad del autor (nombre, `sameAs` de GitHub y LinkedIn, correo, licencia CC BY 4.0), descripciones por defecto por idioma y tipo de página, y ayudantes para `keywords`, `BreadcrumbList` e `ItemList`; verificar que `npm run check` termina sin errores y que el módulo no duplica textos de interfaz fuera de `src/i18n/`.
- [x] 1.2 Añadir en `src/i18n/en.ts` y `src/i18n/es.ts` las descripciones por defecto para índice de posts, índice de tags, índice de categorías, término de taxonomía, búsqueda y 404; verificar que ambas exportan las mismas claves y que `npm run check` pasa.
- [x] 1.3 Extender `src/components/Seo.astro` y el paso de props en `BaseLayout.astro` para aceptar `imageAlt`, `imageWidth`, `imageHeight`, `keywords`, `breadcrumbs`, `itemList` y `noindex`, emitiendo un único bloque JSON-LD con `@graph` cuando haya varias entidades; verificar que `npm run build` genera HTML válido y que canonical, `hreflang` y `x-default` siguen presentes en `/` y `/posts/hugo-for-personal-website/`.

## 2. Metadatos por tipo de página

- [x] 2.1 Actualizar `src/layouts/PostLayout.astro` para pasar alt y dimensiones de la portada, `keywords` desde tags y categorías, `BreadcrumbList` y los tiempos `article:published_time`/`article:modified_time`; verificar en el HTML generado que un post con `cover` incluye `og:image:alt`, ambas fechas ISO, `author.sameAs` y un solo `<script type="application/ld+json">`.
- [x] 2.2 Actualizar `PageLayout.astro`, `PostsIndexLayout.astro`, `TaxonomyIndexLayout.astro` y `TaxonomyTermLayout.astro` para usar las descripciones de i18n cuando falte `description` y pasar `ItemList`/`BreadcrumbList` según corresponda; verificar que `/about/`, `/posts/`, `/tags/` y `/tags/hugo/` tienen `meta description` no vacía y el JSON-LD esperado sin valores `undefined` ni `null`.
- [x] 2.3 Declarar `noindex` en `src/pages/search.astro` y `src/pages/es/search.astro`; verificar que ambos HTML incluyen `<meta name="robots" content="noindex">` y que esas rutas dejan de aparecer en los sitemaps generados.

## 3. Archivos para motores generativos

- [x] 3.1 Crear `src/pages/llms.txt.ts` y `src/pages/es/llms.txt.ts` desde las colecciones publicadas, filtrando `draft: true` y usando `postUrl`/rutas de páginas para URLs absolutas; verificar que `curl -sI` sobre ambos endpoints devuelve 200 con `Content-Type: text/plain; charset=utf-8`, que las URLs usan `https://reyespinosa.is-a.dev/` y que ningún draft aparece.
- [x] 3.2 Crear `src/pages/llms-full.txt.ts` y `src/pages/es/llms-full.txt.ts` con título, URL canónica, atribución y cuerpo Markdown de posts y páginas publicadas; verificar que los cuatro archivos existen en `dist/`, que el cuerpo de un post publicado conserva párrafos, listas, enlaces y bloques de código, y que no aparece ningún draft.
- [x] 3.3 Incluir en el encabezado de los cuatro archivos el crédito a Reinaldo Espinosa, el enlace al sitio y la licencia CC BY 4.0 con enlace a `https://creativecommons.org/licenses/by/4.0/`; verificar con `grep` sobre `dist/` que no hay tokens, rutas `src/`, `localhost` ni secretos en los archivos generados.

## 4. Robots y sitemap coherentes

- [x] 4.1 Ampliar `public/robots.txt` con bloques `User-agent` para GPTBot, ClaudeBot, PerplexityBot, Google-Extended y CCBot con `Allow: /`, `Disallow: /admin/`, `Disallow` para los `index.json` y la línea `Sitemap` existente; verificar que `dist/robots.txt` contiene todas las directivas y que la política general sigue permitiendo las rutas públicas.
- [x] 4.2 Ajustar `src/lib/sitemap.ts` para excluir búsqueda, `/admin/` y páginas con `noindex`, manteniendo alternates y barras finales; verificar que un script de comparación entre los `canonical` del HTML publicado y `/sitemap.xml`/`/es/sitemap.xml` no encuentra URLs faltantes ni duplicadas.
- [x] 4.3 Ejecutar `npm run check` y `npm run build` y comprobar que `dist/CNAME` contiene exactamente `reyespinosa.is-a.dev`; verificar con `git diff --name-only` que no se han modificado `public/admin/`, `.github/workflows/deploy.yml` ni el contenido de `public/CNAME`.

## 5. Auditoría de URLs y verificación final

- [x] 5.1 Documentar dentro del change la auditoría de URLs y slugs con cualquier propuesta de cambio y su mapa de redirecciones, sin aplicarla; verificar que `astro.config.mjs` no incorpora redirecciones nuevas y que todas las rutas existentes siguen respondiendo 200 con la misma barra final.
- [x] 5.2 Verificar en navegador real el `<head>` de un post, un índice y `/search/`, además de `llms.txt`, `llms-full.txt` y `robots.txt`, y confirmar que el sitio público carga sin autenticación mientras `/admin/` sigue ofreciendo solo **Sign In Using Access Token**; guardar captura o registrar el DOM observado.
- [x] 5.3 Con aprobación explícita del usuario, hacer commit y push a `master` y verificar en producción que `https://reyespinosa.is-a.dev/llms.txt`, `/es/llms.txt`, `/llms-full.txt`, `/es/llms-full.txt` y `/robots.txt` devuelven 200, sin cambios en Pages, DNS ni dominio.

## Workflow follow-up

- Revisar el resultado y archivar el change cuando se considere completo.
- Sincronizar los deltas a `openspec/specs/generative-engine-optimization/spec.md` y `openspec/specs/content-and-routing/spec.md`.
