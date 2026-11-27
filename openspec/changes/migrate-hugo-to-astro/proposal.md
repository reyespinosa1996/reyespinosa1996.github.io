# Proposal

## Why

El sitio personal `reyespinosa.is-a.dev` funciona hoy con Hugo + PaperMod, pero el mantenimiento del tema (submódulo de Git), las plantillas Go y la mezcla de frontmatter TOML/YAML hacen que cada cambio de contenido o de presentación sea más costoso de lo necesario. Migrar a Astro permite conservar el sitio estático, el mismo repositorio, el dominio personalizado y GitHub Pages, con un modelo de contenido tipado, componentes reutilizables y un flujo de build más simple.

La migración debe preservar las URLs públicas y la experiencia actual (contenido bilingüe, posts, about, taxonomías, RSS, metadatos y analítica), sin tocar la configuración de dominio en GitHub Pages ni el DNS de `is-a.dev`.

## What Changes

- Reemplazar el scaffold de Hugo por un proyecto Astro con TypeScript y contenido en content collections.
- Configurar `astro.config.mjs` con `site: 'https://reyespinosa.is-a.dev'`, sin `base`, y salida estática en `dist/`.
- Migrar el contenido de `content/en` y `content/es` a `src/content/`, normalizando el frontmatter a YAML y conservando los slugs actuales.
- Conservar las rutas exactas: inglés en `/`, español en `/es/`, con barras finales (`/posts/.../`, `/about/`, `/tags/.../`, `/categories/.../`).
- Reemplazar el tema PaperMod por una implementación Astro nativa y funcional (layout, navegación, selector de idioma, modo claro/oscuro, metadatos de post, TOC, portada y paginación).
- Reemplazar el partial `layouts/partials/extend_head.html` (Umami) por un componente Astro equivalente.
- Mantener paridad funcional: RSS, sitemap, taxonomías, selector de idioma, página 404, SEO/Open Graph/Twitter Cards/JSON-LD y búsqueda client-side.
- Mover los assets de `static/` a `public/` y crear `public/CNAME` con el contenido exacto `reyespinosa.is-a.dev`.
- Reemplazar `.github/workflows/hugo.yml` por un workflow de GitHub Pages basado en `withastro/action@v6` y `actions/deploy-pages@v5`.
- Eliminar los archivos residuales de Hugo (configuración, arquetipos, layouts, i18n, tema y submódulos) una vez verificado el build.
- **BREAKING (interno)**: el proyecto deja de compilar con Hugo; ya no se podrá ejecutar `hugo` en este repositorio. La URL pública y el dominio no cambian.

### Hallazgos que condicionan el alcance

- El frontmatter está mezclado: TOML (`+++`) en `content/en/about.md`, `content/en/posts/_index.md` y el post de Hugo; YAML (`---`) en el resto de posts y arquetipos. Se normalizará a YAML.
- No hay shortcodes de Hugo en el contenido. Solo existe un partial propio: `layouts/partials/extend_head.html` (Umami).
- El despliegue actual es GitHub Actions sobre la rama `master`, no una rama `gh-pages`.
- **No existe un archivo `CNAME` versionado en el repositorio.** El dominio personalizado parece estar configurado solo en la UI de GitHub Pages. La migración añadirá `public/CNAME` sin modificar la configuración de Pages.
- `public/` está en `.gitignore` y contiene un build obsoleto generado con `http://localhost:1313`. En Astro, `public/` debe versionarse; el `.gitignore` debe ignorar `dist/` en su lugar.
- El sitio actual referencia favicons que no existen en `static/` (posibles 404 preexistentes). La migración debe inventariarlos y añadirlos o eliminar las referencias.

## Capabilities

### New Capabilities

- `site-hosting`: despliegue estático en GitHub Pages, dominio personalizado `reyespinosa.is-a.dev`, archivo `CNAME`, HTTPS, ausencia de `base` y verificación del artefacto publicado.
- `content-and-routing`: modelo de contenido bilingüe, preservación de URLs, posts y páginas, taxonomías, RSS, sitemap, SEO, búsqueda y selector de idioma.

### Modified Capabilities

Ninguna. El proyecto no tiene specs existentes en `openspec/specs/`.

## Impact

- **Contenido**: `content/en/**`, `content/es/**`, `archetypes/**` se migran a `src/content/**` y se normaliza el frontmatter.
- **Configuración**: se elimina `hugo.yaml`, `hugo.yaml.example` y `.hugo_build.lock`; se añaden `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` y `src/**`.
- **Assets**: `static/**` pasa a `public/**`; se añade `public/CNAME` y los favicons que falten.
- **Temas y submódulos**: se eliminan `themes/PaperMod` y `docs/` junto con sus entradas en `.gitmodules`. Esta eliminación se hará solo después de verificar el sitio y requerirá confirmación si se quiere conservar el wiki local.
- **CI/CD**: `.github/workflows/hugo.yml` se reemplaza por un workflow de Astro. No se modifican la fuente de Pages, el custom domain ni la configuración de HTTPS en GitHub.
- **Dependencias**: se añaden Astro, `@astrojs/check`, TypeScript, `@astrojs/rss` y `fuse.js`; se eliminan Hugo, Go y el tema PaperMod como dependencias de build.
- **Riesgos principales**: enlaces rotos por slugs o barras finales distintos; pérdida de features de PaperMod (búsqueda, TOC, metadatos); feeds/sitemap con URLs incorrectas; que `public/` siga ignorado y el CNAME no se publique; que GitHub Pages reste el dominio si el artefacto no contiene `CNAME`; recacheo de DNS/HTTPS innecesario si se toca la configuración de Pages. La estrategia de mitigación está en `design.md`.
- **Fuera de alcance**: cambios de diseño de marca, comentarios, newsletter, cambios de DNS en `is-a.dev`, cambios en la configuración de GitHub Pages y migración de `TODO.md`/`README.md` más allá de documentar los comandos de desarrollo.
