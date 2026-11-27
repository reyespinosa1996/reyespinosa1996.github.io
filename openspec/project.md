# Project Context

## Resumen

Sitio web personal de Reinaldo Espinosa, publicado en GitHub Pages bajo el dominio personalizado `https://reyespinosa.is-a.dev`. Es un sitio estático, bilingüe (inglés/español), centrado en un blog y una página About. El stack es Astro + TypeScript + content collections; la migración desde Hugo + PaperMod quedó verificada en producción.

## Stack y estado actual

- Generador: Astro en modo estático, salida en `dist/`.
- Configuración: `astro.config.mjs` con `site: 'https://reyespinosa.is-a.dev'`, sin `base`, `trailingSlash: 'always'` y `build.format: 'directory'`.
- Contenido: `src/content/posts/{en,es}/` y `src/content/pages/{en,es}/`, con frontmatter YAML validado por Zod en `src/content.config.ts`.
- Rutas: inglés en `/`, español en `/es/`, con barras finales y slugs preservados.
- Presentación: layouts Astro nativos y funcionales, no una réplica pixel-perfect de PaperMod.
- Paridad funcional: posts, About, tags, categorías, RSS, sitemap, 404, SEO/Open Graph/Twitter/JSON-LD, Umami, modo claro/oscuro y selector de idioma.
- Búsqueda: client-side con Fuse.js en `/search/` y `/es/search/`, con índices `/index.json` y `/es/index.json`.
- Assets: `public/` versionado, con `public/CNAME`, `favicon.svg`, imágenes y `robots.txt`.
- Despliegue: GitHub Actions (`.github/workflows/deploy.yml`) con `withastro/action@v6` y `actions/deploy-pages@v5`, verificación de `dist/CNAME` incluida.
- Rollback: tag local `pre-astro-migration` con el último estado Hugo.

## Estructura del repositorio

```
.
├── .github/workflows/deploy.yml
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   ├── images/
│   ├── img/
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
- El subdominio `is-a.dev` ya está aprobado; no se requieren cambios de DNS.
- `public/CNAME` contiene exactamente `reyespinosa.is-a.dev` y se copia al artefacto.

## Contenido e internacionalización

- Idiomas: `en` (por defecto, en la raíz) y `es` (bajo `/es/`).
- Posts actuales:
  - `hugo-for-personal-website` (en/es).
  - `ventajas-website-personal-era-ia` (en/es).
- Páginas: `about` (en/es).
- Cada entrada declara `title`, `date`, `lang`, `translationKey`, `tags` y `categories`; `description`, `author`, `cover`, `toc` y `tocOpen` son opcionales.
- Los pares de traducción se enlazan por `translationKey`.
- Los archivos españoles no conservan el sufijo `.es.md`; el idioma se determina por la carpeta y el campo `lang`.
- Los títulos de listados viven en las páginas o en el diccionario i18n, no en `_index.md`.

## Restricciones

- Mantener el mismo repositorio, el mismo remoto y la misma rama `master`.
- No ejecutar `git init` ni crear un repositorio nuevo.
- No modificar la configuración de "Custom domain" en GitHub Pages ni los registros DNS de `is-a.dev`.
- No cambiar la fuente de Pages ni Enforce HTTPS.
- No eliminar `CNAME`, `README.md` ni `TODO.md`.
- Preservar las URLs públicas actuales y los slugs.
- No reintroducir Hugo, PaperMod ni sus submódulos.
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
openspec validate migrate-hugo-to-astro
```

## Historial de la migración

El plan, las specs y las tareas de la migración ya completada están en:

- `openspec/changes/migrate-hugo-to-astro/proposal.md`
- `openspec/changes/migrate-hugo-to-astro/design.md`
- `openspec/changes/migrate-hugo-to-astro/specs/site-hosting/spec.md`
- `openspec/changes/migrate-hugo-to-astro/specs/content-and-routing/spec.md`
- `openspec/changes/migrate-hugo-to-astro/tasks.md`

## Referencias

- Despliegue en GitHub Pages: <https://docs.astro.build/en/guides/deploy/github/>
- Acción oficial de Astro para Pages: <https://github.com/withastro/action>
- i18n en Astro: <https://docs.astro.build/en/guides/internationalization/>
- Content collections: <https://docs.astro.build/en/guides/content-collections/>
- RSS en Astro: <https://docs.astro.build/en/guides/rss/>
- Dominio personalizado en GitHub Pages: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- Documentación de is-a.dev: <https://www.is-a.dev/docs/>
