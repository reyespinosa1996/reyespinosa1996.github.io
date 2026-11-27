# Tasks

## 0. Decisiones manuales previas

- [x] 0.1 Confirmar si `docs/` (wiki de PaperMod) se elimina o se archiva fuera del repositorio; por defecto se elimina. Verificación: la decisión queda registrada en `design.md` o en este archivo y no se borra `docs/` antes de la confirmación.
- [x] 0.2 Confirmar el tratamiento de los favicons faltantes (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `safari-pinned-tab.svg`): añadirlos a `public/` o eliminar sus referencias del `<head>`. Verificación: queda una lista cerrada de archivos a añadir o referencias a quitar.
- [x] 0.3 Confirmar que la diferencia visual respecto a PaperMod es aceptable (blog Astro funcional, no réplica pixel-perfect). Verificación: la decisión ya está reflejada en `proposal.md` y `design.md`; no se abre un rediseño dentro de esta migración.

## 1. Respaldo e inventario

- [x] 1.1 Crear una etiqueta `pre-astro-migration` en el último commit de Hugo y verificar que existe. Verificación: `git tag -l pre-astro-migration` devuelve la etiqueta y `git rev-parse pre-astro-migration` apunta al commit anterior al scaffold.
- [x] 1.2 Generar un inventario de URLs actuales desde `public/` y los sitemaps, guardarlo en `/tmp/astro-migration/url-inventory.txt` y verificar que incluye home, about, posts, tags, categorías, feeds, sitemap y 404 en ambos idiomas.
- [x] 1.3 Auditar shortcodes, partials y frontmatter. Verificación: `grep -rn '{{<' content` no devuelve coincidencias; el único partial propio es `layouts/partials/extend_head.html`; queda documentada la mezcla TOML/YAML. Si aparece un shortcode sin equivalente, se añade aquí una tarea de decisión manual en lugar de inventar una solución.
- [x] 1.4 Auditar assets y favicons referenciados. Verificación: existe una lista de archivos existentes, archivos faltantes y referencias a eliminar; se confirma que `static/images/` y `static/img/` contienen los assets usados por los posts.
- [x] 1.5 Verificar el estado del CNAME. Verificación: `git ls-files | grep -i cname` y `find . -name CNAME -not -path './.git/*'` confirman que no hay CNAME versionado; se registra que la migración creará `public/CNAME` sin tocar la configuración de Pages.

## 2. Scaffold y configuración de Astro

- [x] 2.1 Crear el scaffold de Astro en un directorio temporal (`/tmp/astro-migration/scaffold`) y copiar solo los archivos nuevos al repositorio, sin ejecutar `git init` ni sobrescribir `.git`, `README.md`, `TODO.md` o cualquier CNAME existente. Verificación: `git remote -v` y `git rev-parse --git-dir` no cambian; no aparece un `.git` nuevo.
- [x] 2.2 Crear `package.json` con scripts `dev`, `build`, `preview` y `check`, y dependencias `astro`, `@astrojs/check`, `typescript`, `@astrojs/rss` y `fuse.js`; ejecutar `npm install`. Verificación: existe `package-lock.json`, `npm run build` genera `dist/` con la página inicial de scaffold y `npm run check` termina sin errores.
- [x] 2.3 Configurar `astro.config.mjs` con `site: 'https://reyespinosa.is-a.dev'`, sin `base`, `trailingSlash: 'always'`, `build.format: 'directory'` e i18n con `defaultLocale: 'en'`, `locales: ['en', 'es']` y `prefixDefaultLocale: false`. Verificación: `npm run build` genera `dist/index.html` y `dist/es/index.html`; no hay rutas con prefijo de repositorio.
- [x] 2.4 Configurar TypeScript estricto, `.nvmrc` y `engines.node` con Node 24. Verificación: `node -v` coincide con `.nvmrc` y `npm run check` valida los archivos `.astro` y `.ts`.
- [x] 2.5 Actualizar `.gitignore` para ignorar `dist/`, `.astro/`, `node_modules/` y dejar de ignorar `public/`. Verificación: `git check-ignore -v public/CNAME` no devuelve coincidencia y `git check-ignore -v dist/index.html` sí la devuelve.

## 3. Migración de contenido

- [x] 3.1 Crear la estructura `src/content/posts/{en,es}`, `src/content/pages/{en,es}` y el esquema en `src/content.config.ts` con los campos `title`, `date`, `draft`, `lang`, `translationKey`, `description`, `author`, `tags`, `categories`, `cover`, `toc` y `tocOpen`. Verificación: `npm run check` reconoce las colecciones y falla si un campo obligatorio falta.
- [x] 3.2 Migrar los dos posts y la página About en inglés, convirtiendo el frontmatter TOML (`+++`) a YAML (`---`) y normalizando `summary`/`description`, `translationKey` y `cover`. Verificación: existen `src/content/posts/en/hugo-for-personal-website.md`, `src/content/posts/en/ventajas-website-personal-era-ia.md` y `src/content/pages/en/about.md`; `npm run check` pasa.
- [x] 3.3 Migrar los dos posts y la página About en español, renombrando `*.es.md` a `*.md` para que el slug no incluya `.es`, y normalizando el frontmatter. Verificación: existen los archivos en `src/content/posts/es/` y `src/content/pages/es/`; los slugs esperados son `hugo-for-personal-website` y `ventajas-website-personal-era-ia`.
- [x] 3.4 Migrar los títulos de los `_index.md` (`Blog`) a las páginas de listado o al diccionario i18n y eliminar los `_index.md` de la colección. Verificación: no queda ningún `_index.md` en `src/content/` y `/posts/` y `/es/posts/` muestran el título correcto.
- [x] 3.5 Verificar fidelidad de contenido comparando cada archivo migrado con el original: párrafos, listas, enlaces, imágenes, bloques de código y metadatos. Verificación: checklist de los 4 posts y 2 About sin diferencias de texto ni metadatos relevantes.
- [x] 3.6 Verificar que `translationKey` en formato array (`["post-002"]`) se normaliza a string y que los pares en/es se enlazan correctamente. Verificación: cada post tiene un `translationKey` único y su equivalente en el otro idioma.

## 4. Assets, CNAME y public

- [x] 4.1 Eliminar el `public/` obsoleto solo después de guardar el inventario de URLs, crear el nuevo `public/` y mover `static/images/` a `public/images/` y `static/img/` a `public/img/`. Verificación: `public/images/hero.jpg`, `public/images/post-002.jpg`, `public/images/hugo-logo-wide.svg` y `public/img/logo.svg` existen; `public/` ya no contiene HTML de Hugo.
- [x] 4.2 Crear `public/CNAME` con el contenido exacto `reyespinosa.is-a.dev`; si en el futuro existiera un CNAME previo, conservarlo en lugar de recrearlo. Verificación: `cat public/CNAME` devuelve `reyespinosa.is-a.dev` y `npm run build` copia el archivo a `dist/CNAME`.
- [x] 4.3 Añadir los favicons acordados a `public/` o eliminar sus referencias del `<head>`. Verificación: `npm run build` y el link checker no reportan 404 para favicons ni para `apple-touch-icon`/`safari-pinned-tab`.
- [x] 4.4 Añadir `public/robots.txt` con referencia a `https://reyespinosa.is-a.dev/sitemap.xml`. Verificación: `dist/robots.txt` existe y contiene la URL absoluta del sitemap.
- [x] 4.5 Verificar que todas las imágenes y assets referenciados por el contenido resuelven. Verificación: `npm run build` y `test -f dist/images/hero.jpg`; el link checker no reporta assets faltantes.

## 5. Layout, componentes y experiencia

- [x] 5.1 Implementar `src/styles/global.css` con variables de color, tipografía, espaciado, layout responsive y estilos de contenido. Verificación: `npm run build` pasa y las páginas se ven correctamente en viewport móvil y escritorio.
- [x] 5.2 Implementar `BaseLayout.astro` con `<html lang>`, `<head>`, SEO, Umami, script de tema y estructura header/main/footer. Verificación: cada página generada incluye un solo `<script defer>` de Umami y los metadatos base.
- [x] 5.3 Implementar `Header.astro`, `Footer.astro`, navegación principal y enlaces sociales (GitHub, LinkedIn, email) con etiquetas accesibles. Verificación: los enlaces apuntan a las URLs actuales y la navegación funciona en ambos idiomas.
- [x] 5.4 Implementar `PostCard.astro`, `PostLayout.astro`, `TableOfContents.astro` y el cálculo de tiempo de lectura; mostrar portada, tags, categorías y TOC cuando corresponda. Verificación: un post con `cover` y `toc: true` muestra portada, tiempo de lectura y TOC; un post sin portada renderiza sin errores.
- [x] 5.5 Implementar el selector de tema claro/oscuro/automático con persistencia en `localStorage` y script inline para evitar FOUC. Verificación: al alternar y recargar se conserva la preferencia; con preferencia del sistema oscura no hay flash claro.
- [x] 5.6 Implementar paginación de listados para que el sitio escale, aunque con dos posts no genere páginas extra. Verificación: `/posts/` y `/es/posts/` listan todos los posts y no hay enlaces de paginación rotos.
- [x] 5.7 Añadir anclas de encabezados y enlaces directos con `rehype-slug` y `rehype-autolink-headings`. Verificación: cada encabezado del post tiene `id` y el TOC enlaza a ellos.

## 6. Routing, i18n y páginas

- [x] 6.1 Implementar `src/pages/index.astro` y `src/pages/es/index.astro` con listado de posts, perfil/intro y enlaces a About, Posts y Search. Verificación: `/` y `/es/` responden con el contenido de su idioma.
- [x] 6.2 Implementar `src/pages/about.astro` y `src/pages/es/about.astro` desde la colección `pages`. Verificación: `/about/` muestra "About me" y `/es/about/` muestra "Sobre mi".
- [x] 6.3 Implementar `src/pages/posts/index.astro`, `src/pages/posts/[...slug].astro` y sus equivalentes en `src/pages/es/posts/` con `getStaticPaths` filtrado por idioma. Verificación: las URLs `/posts/hugo-for-personal-website/`, `/posts/ventajas-website-personal-era-ia/` y sus versiones `/es/posts/.../` responden 200 con el slug correcto.
- [x] 6.4 Implementar índices y términos de tags y categorías en ambos idiomas (`/tags/`, `/tags/[tag]/`, `/categories/`, `/categories/[category]/` y `/es/...`). Verificación: `/tags/hugo/`, `/tags/ai/`, `/categories/ai/`, `/es/tags/hugo/`, `/es/categories/ia/` responden 200 y listan los posts correctos.
- [x] 6.5 Implementar el selector de idioma usando `translationKey`, con fallback al home del otro idioma cuando no haya traducción. Verificación: desde un post en inglés se navega a su equivalente en español; una página sin traducción enlaza a `/es/` sin 404.
- [x] 6.6 Implementar `src/pages/404.astro` y `src/pages/es/404.astro` con enlaces al inicio y a los posts del idioma. Verificación: `dist/404.html` y `dist/es/404.html` existen y contienen los enlaces esperados.
- [x] 6.7 Configurar redirecciones para URLs legacy: `/page/1/` → `/`, `/posts/page/1/` → `/posts/`, `/tags/<tag>/page/1/` → `/tags/<tag>/`, `/categories/<category>/page/1/` → `/categories/<category>/` y `/en/*` → `/*`. Verificación: los archivos de redirección existen en `dist/` y apuntan a la URL canónica correcta.

## 7. Feeds, sitemap, SEO, búsqueda y analítica

- [x] 7.1 Implementar feeds principales con `@astrojs/rss` en `/index.xml`, `/posts/index.xml`, `/es/index.xml` y `/es/posts/index.xml`. Verificación: cada feed es XML válido, ordena por fecha descendente, usa URLs absolutas y no incluye drafts.
- [x] 7.2 Implementar feeds de tags y categorías en ambos idiomas con `getStaticPaths`. Verificación: `/tags/hugo/index.xml`, `/categories/ai/index.xml` y sus equivalentes en español existen y contienen solo los posts del término e idioma.
- [x] 7.3 Implementar `/sitemap.xml` y `/es/sitemap.xml` con URLs absolutas, exclusión de 404/drafts y alternates `hreflang` cuando exista traducción. Verificación: ambos sitemaps son XML válido y contienen las URLs canónicas.
- [x] 7.4 Implementar `Seo.astro` con canonical, `hreflang`, Open Graph, Twitter Cards y JSON-LD (`BlogPosting`/`WebSite`). Verificación: el HTML de un post incluye canonical, `og:*`, `twitter:card`, JSON-LD y alternates; el home incluye `WebSite`.
- [x] 7.5 Implementar los índices de búsqueda `/index.json` y `/es/index.json` desde las colecciones publicadas. Verificación: cada índice contiene solo posts de su idioma, sin drafts, con `title`, `description`, `url`, `tags`, `categories` y `content`.
- [x] 7.6 Implementar `/search/` y `/es/search/` con Fuse.js, carga del índice del idioma y estados de resultados y sin resultados. Verificación: buscar un término existente muestra resultados enlazados; un término inexistente muestra el mensaje vacío sin errores de consola.
- [x] 7.7 Verificar la inclusión única de Umami en todas las páginas. Verificación: contar `data-website-id="e85cd115-0d87-4f9c-a426-0f53d611e355"` en el HTML generado devuelve exactamente 1 por página.
- [x] 7.8 Verificar la exclusión de drafts en build, listados, feeds, sitemap y búsqueda. Verificación: añadir temporalmente un post `draft: true`, ejecutar `npm run build` y confirmar que no genera página ni aparece en los índices; luego eliminarlo.

## 8. Despliegue en GitHub Pages

- [x] 8.1 Reemplazar `.github/workflows/hugo.yml` por `.github/workflows/deploy.yml` con `actions/checkout@v7`, `withastro/action@v6` (`node-version: 24`) y `actions/deploy-pages@v5`, disparado por push a `master` y `workflow_dispatch`. Verificación: el YAML es válido, usa `contents: read`, `pages: write`, `id-token: write` y no modifica la configuración de Pages.
- [x] 8.2 Añadir un paso de CI que verifique `dist/CNAME` y su contenido exacto. Verificación: el paso falla si el archivo no existe o si el contenido no es `reyespinosa.is-a.dev`, y pasa en local con `npm run build`.
- [x] 8.3 Capturar una línea base de la configuración de Pages con `gh api repos/reyespinosa1996/reyespinosa1996.github.io/pages` (solo lectura) y guardarla en `/tmp/astro-migration/pages-before.json`. Verificación: el archivo contiene fuente, custom domain y estado de HTTPS.
- [x] 8.4 Hacer merge a `master` y verificar que el workflow de GitHub Actions completa build y deploy sin errores. Verificación: el run termina en verde y el job de deploy publica el artefacto en el entorno `github-pages`.
- [x] 8.5 Verificar producción con `curl -I` y `curl -s` sobre `/`, `/about/`, `/posts/`, `/posts/hugo-for-personal-website/`, `/es/`, `/es/about/`, `/es/posts/`, `/index.xml`, `/sitemap.xml`, `/search/` y `/404.html`. Verificación: respuestas 200 (o 404 para la página de error), contenido correcto y sin `localhost` en el HTML.
- [x] 8.6 Verificar que `https://reyespinosa.is-a.dev/` sirve el sitio con HTTPS válido y sin redirección a `github.io`. Verificación: `curl -I` muestra 200, el certificado es válido y el `location` no apunta a `github.io`.
- [x] 8.7 Comparar la configuración de Pages actual con `/tmp/astro-migration/pages-before.json`. Verificación: fuente GitHub Actions, custom domain `reyespinosa.is-a.dev` y Enforce HTTPS sin cambios.
- [x] 8.8 Documentar el procedimiento de rollback (revert del commit o redeploy del tag `pre-astro-migration`) en `README.md` o `AGENTS.md`. Verificación: el procedimiento es reproducible y no requiere cambiar Pages ni DNS.

## 9. Limpieza de Hugo

- [x] 9.1 Eliminar `hugo.yaml`, `hugo.yaml.example`, `.hugo_build.lock`, `archetypes/`, `layouts/` e `i18n/`. Verificación: `grep -rn 'hugo\|PaperMod' --exclude-dir=.git --exclude-dir=openspec .` no encuentra referencias activas fuera de documentación histórica.
- [x] 9.2 Eliminar los submódulos `themes/PaperMod` y `docs/` (sujeto a la decisión 0.1) y actualizar `.gitmodules`. Verificación: `git submodule status` queda vacío, `.gitmodules` no referencia esos paths y `themes/`/`docs/` ya no existen.
- [x] 9.3 Actualizar `README.md` con una sección de desarrollo Astro (`npm install`, `npm run dev`, `npm run check`, `npm run build`, `npm run preview`) sin borrar la presentación personal. Verificación: los comandos documentados se ejecutan tal como están escritos.
- [x] 9.4 Actualizar `AGENTS.md` y `openspec/project.md` para reflejar el estado final Astro y eliminar instrucciones exclusivas de la migración. Verificación: no quedan comandos de Hugo ni referencias a PaperMod como stack activo.
- [x] 9.5 Ejecutar la verificación final local: `npm run check`, `npm run build`, `npm run preview` y link checker interno sobre `dist/`. Verificación: no hay errores de tipos, el build termina y no hay 404 internos.
- [x] 9.6 Verificar que el repositorio sigue siendo el mismo y está limpio. Verificación: `git remote -v` muestra `reyespinosa1996/reyespinosa1996.github.io`, no se ejecutó `git init` y `git status` solo muestra cambios intencionales.

## 10. Integración final

- [x] 10.1 Comparar el inventario de `/tmp/astro-migration/url-inventory.txt` con las URLs generadas en `dist/` y confirmar que todas las URLs canónicas actuales existen. Verificación: no hay URLs canónicas faltantes; las legacy tienen redirección.
- [x] 10.2 Verificar la paridad de contenido completa: 4 posts (2 en, 2 es), 2 About, listados, taxonomías, feeds, sitemap, búsqueda, 404 y Umami. Verificación: checklist de aceptación de `content-and-routing/spec.md` y `site-hosting/spec.md` sin puntos fallidos.
- [x] 10.3 Ejecutar un smoke test en producción de búsqueda, selector de idioma, toggle de tema, TOC, enlaces sociales y feeds. Verificación: todas las interacciones funcionan en `https://reyespinosa.is-a.dev/` y no hay errores en la consola del navegador.

## Workflow follow-up

- Archivar el cambio `migrate-hugo-to-astro` después de que la revisión y la verificación en producción estén completas.
- Verificar el resultado archivado y que las specs principales reflejen el nuevo comportamiento.
