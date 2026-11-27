# Project Context

## Resumen

Sitio web personal de Reinaldo Espinosa, publicado en GitHub Pages bajo el dominio personalizado `https://reyespinosa.is-a.dev`. Es un sitio estático, bilingüe (inglés/español), centrado en un blog y una página About.

El proyecto está en migración de **Hugo + PaperMod** a **Astro**. El repositorio, el dominio, el repositorio remoto y la configuración de GitHub Pages se mantienen; no se crea un repositorio nuevo ni se cambia el DNS.

## Estado actual (Hugo)

- Generador: Hugo, tema PaperMod instalado como submódulo en `themes/PaperMod`.
- Configuración: `hugo.yaml` (con `hugo.yaml.example` como referencia).
- Contenido: `content/en/` y `content/es/`.
- Frontmatter: mixto. Algunos archivos usan TOML (`+++`) y otros YAML (`---`).
- Shortcodes: no hay shortcodes de Hugo en el contenido actual.
- Partial propio: `layouts/partials/extend_head.html`, que inyecta el script de Umami.
- Assets: `static/images/` y `static/img/`.
- Despliegue: GitHub Actions (`.github/workflows/hugo.yml`) en la rama `master`, con `actions/configure-pages`, `peaceiris/actions-hugo`, `actions/upload-pages-artifact` y `actions/deploy-pages`.
- `public/` está ignorado por Git y contiene un build obsoleto generado con `http://localhost:1313`.
- No hay archivo `CNAME` versionado; el dominio personalizado está configurado en GitHub Pages.
- El wiki de PaperMod está como submódulo en `docs/`.

## Estado objetivo (Astro)

- Generador: Astro en modo estático, con TypeScript y content collections.
- Configuración: `astro.config.mjs` con `site: 'https://reyespinosa.is-a.dev'`, sin `base`, `trailingSlash: 'always'` y `build.format: 'directory'`.
- Contenido: `src/content/posts/{en,es}/` y `src/content/pages/{en,es}/`, con frontmatter YAML validado por Zod.
- Rutas: inglés en `/`, español en `/es/`, con barras finales y slugs preservados.
- Presentación: layout Astro nativo y funcional, no una réplica pixel-perfect de PaperMod.
- Paridad funcional: posts, About, tags, categorías, RSS, sitemap, 404, SEO/Open Graph/Twitter/JSON-LD, Umami, modo claro/oscuro y selector de idioma.
- Búsqueda: client-side con Fuse.js en `/search/` y `/es/search/`, con índices `/index.json` y `/es/index.json`.
- Assets: `public/` versionado, con `public/CNAME`, imágenes y favicons.
- Despliegue: GitHub Actions con `withastro/action@v6` y `actions/deploy-pages@v5`.

## Estructura del repositorio

### Actual

```
.
├── .github/workflows/hugo.yml
├── archetypes/
├── content/
│   ├── en/
│   └── es/
├── docs/                  # submódulo wiki de PaperMod
├── i18n/
├── layouts/
├── public/                # build obsoleto, ignorado por Git
├── static/
│   ├── images/
│   └── img/
├── themes/PaperMod/       # submódulo
├── hugo.yaml
├── README.md
└── TODO.md
```

### Objetivo

```
.
├── .github/workflows/deploy.yml
├── public/
│   ├── CNAME
│   ├── images/
│   ├── img/
│   ├── favicon*
│   └── robots.txt
├── src/
│   ├── components/
│   ├── content/
│   │   ├── pages/{en,es}/
│   │   └── posts/{en,es}/
│   ├── i18n/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── es/
│   │   └── ...
│   ├── styles/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── AGENTS.md
├── README.md
└── TODO.md
```

## Dominio y despliegue

- Dominio: `https://reyespinosa.is-a.dev`.
- Repositorio remoto: `https://github.com/reyespinosa1996/reyespinosa1996.github.io.git`.
- Rama de despliegue: `master`.
- Fuente de GitHub Pages: GitHub Actions.
- Custom domain: `reyespinosa.is-a.dev` (configurado en Pages).
- HTTPS: habilitado con Enforce HTTPS.
- El subdominio `is-a.dev` ya está aprobado y funcionando; no se requieren cambios de DNS en esta migración.
- El archivo `public/CNAME` debe contener exactamente `reyespinosa.is-a.dev` para que el artefacto preserve el dominio.

## Contenido e internacionalización

- Idiomas: `en` (por defecto, en la raíz) y `es` (bajo `/es/`).
- Posts actuales:
  - `hugo-for-personal-website` (en/es).
  - `ventajas-website-personal-era-ia` (en/es).
- Páginas: `about` (en/es).
- Cada entrada debe declarar `title`, `date`, `lang`, `translationKey`, `tags` y `categories`; `description`, `author`, `cover`, `toc` y `tocOpen` son opcionales.
- Los pares de traducción se enlazan por `translationKey`.
- Los archivos españoles no deben conservar el sufijo `.es.md`; el idioma se determina por la carpeta y el campo `lang`.
- Los títulos de listados (`Blog`) viven en las páginas o en el diccionario i18n, no en `_index.md`.

## Restricciones

- Mantener el mismo repositorio, el mismo remoto y la misma rama `master`.
- No ejecutar `git init` ni crear un repositorio nuevo.
- No modificar la configuración de "Custom domain" en GitHub Pages.
- No modificar registros DNS de `is-a.dev`.
- No eliminar el CNAME; si no existe, crearlo en `public/CNAME` con el dominio exacto.
- No cambiar la fuente de Pages ni Enforce HTTPS.
- Preservar las URLs públicas actuales y los slugs.
- No borrar `README.md` ni `TODO.md`; se pueden ampliar sin perder su contenido.
- No borrar archivos de Hugo hasta que el sitio Astro esté verificado en producción.
- Si un shortcode de Hugo no tiene equivalente directo, documentarlo como decisión manual; no inventar una solución.
- No introducir un rediseño de marca ni funciones fuera del alcance (comentarios, newsletter, CMS, backend).

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo
npm run check        # astro check + TypeScript
npm run build        # build estático en dist/
npm run preview      # previsualizar dist/
```

Verificación adicional:

```bash
git check-ignore -v public/CNAME   # no debe estar ignorado
test -f dist/CNAME && cat dist/CNAME
curl -I https://reyespinosa.is-a.dev/
```

## Plan de migración

El plan detallado, las specs y las tareas están en:

- `openspec/changes/migrate-hugo-to-astro/proposal.md`
- `openspec/changes/migrate-hugo-to-astro/design.md`
- `openspec/changes/migrate-hugo-to-astro/specs/site-hosting/spec.md`
- `openspec/changes/migrate-hugo-to-astro/specs/content-and-routing/spec.md`
- `openspec/changes/migrate-hugo-to-astro/tasks.md`

## Referencias

- Migración de Hugo a Astro: <https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/>
- Despliegue en GitHub Pages: <https://docs.astro.build/en/guides/deploy/github/>
- Acción oficial de Astro para Pages: <https://github.com/withastro/action>
- i18n en Astro: <https://docs.astro.build/en/guides/internationalization/>
- Content collections: <https://docs.astro.build/en/guides/content-collections/>
- RSS en Astro: <https://docs.astro.build/en/guides/rss/>
- Dominio personalizado en GitHub Pages: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- Documentación de is-a.dev: <https://www.is-a.dev/docs/>
