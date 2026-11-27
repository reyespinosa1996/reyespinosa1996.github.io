# AGENTS.md

Instrucciones operativas para agentes que trabajen en este repositorio. Léelas antes de modificar código, contenido o configuración.

## 1. Contexto rápido

- Sitio personal de Reinaldo Espinosa, estático y bilingüe (inglés/español).
- Dominio de producción: `https://reyespinosa.is-a.dev`.
- Repositorio remoto: `https://github.com/reyespinosa1996/reyespinosa1996.github.io.git`.
- Rama de despliegue: `master`.
- Stack actual: Hugo + PaperMod (en migración).
- Stack objetivo: Astro + TypeScript + content collections.
- El plan vive en `openspec/changes/migrate-hugo-to-astro/`.

## 2. Reglas de oro

1. **No ejecutes `git init`** ni crees un repositorio nuevo. El repositorio, el remoto y la rama ya existen.
2. **No cambies la configuración de GitHub Pages**: fuente, custom domain `reyespinosa.is-a.dev`, Enforce HTTPS ni reglas de DNS.
3. **No toques registros DNS** de `is-a.dev`.
4. **No elimines ni cambies el contenido de `CNAME`**. Si no existe, créalo en `public/CNAME` con el texto exacto `reyespinosa.is-a.dev`.
5. **No borres `README.md`, `TODO.md` ni contenido del usuario**. Puedes ampliarlos, no reemplazarlos.
6. **No borres archivos de Hugo** hasta que el sitio Astro esté verificado en producción.
7. **No hagas force push** a `master` ni reescribas historia compartida.
8. **No introduzcas secretos** en el repositorio. El ID de Umami es público y ya está en el código.
9. **No inventes equivalencias** para shortcodes de Hugo sin equivalente directo. Documéntalo como decisión manual.
10. **No cambies las URLs públicas** sin una decisión explícita del usuario. Inglés en `/`, español en `/es/`, con barra final.

## 3. Fronteras de archivos

### Planificación (OpenSpec)

- Puedes crear y editar artefactos en `openspec/changes/migrate-hugo-to-astro/`.
- Antes de implementar, lee en este orden: `proposal.md`, `specs/**/spec.md`, `design.md`, `tasks.md`.
- Marca el progreso en `tasks.md` con `- [x]` solo cuando la verificación indicada en la tarea se haya cumplido.
- No archives el cambio hasta que la verificación en producción esté completa.

### Implementación

Puedes crear o modificar:

- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `.nvmrc`.
- `src/**` (componentes, layouts, páginas, contenido, i18n, estilos, utilidades).
- `public/**` (CNAME, imágenes, favicons, robots.txt).
- `.github/workflows/deploy.yml`.
- `.gitignore`, `README.md`, `AGENTS.md`, `openspec/project.md`.

No edites a mano:

- `dist/`, `.astro/`, `node_modules/` (generados).
- `themes/PaperMod/` ni `docs/` mientras sigan como submódulos; se eliminan en la fase de limpieza.
- Archivos de build obsoletos en `public/` antes de guardar el inventario de URLs.

### Archivos que requieren confirmación

- `docs/` (wiki de PaperMod): por defecto se elimina, pero confirma antes.
- Cualquier cambio de URL, slug o estructura de contenido.
- Cualquier dependencia nueva fuera de Astro, `@astrojs/check`, `typescript`, `@astrojs/rss` y `fuse.js`.
- Cualquier cambio en Pages, DNS o ajustes del repositorio.

## 4. Flujo de trabajo

### Durante la planificación

- No edites código de producción.
- Mantén coherencia entre `proposal.md`, specs, `design.md` y `tasks.md`.
- Valida con `openspec validate migrate-hugo-to-astro`.
- Si una decisión cambia el alcance, las URLs o el comportamiento observable, pregunta antes de escribir.

### Durante la implementación

1. Crea o verifica la etiqueta `pre-astro-migration` en el último commit de Hugo.
2. Guarda el inventario de URLs actuales antes de borrar `public/`.
3. Scaffold de Astro en un directorio temporal; copia solo archivos nuevos.
4. Migra contenido y assets.
5. Implementa layout, rutas, feeds, sitemap, SEO y búsqueda.
6. Verifica localmente.
7. Reemplaza el workflow y despliega.
8. Verifica producción.
9. Elimina Hugo en un commit separado.
10. Actualiza `README.md`, `AGENTS.md` y `openspec/project.md`.

### Después de la migración

- Mantén este archivo como fuente de verdad para agentes.
- Elimina instrucciones exclusivas de la migración cuando ya no apliquen.
- Conserva el tag `pre-astro-migration` como referencia de rollback.
- No reintroduzcas Hugo, PaperMod ni sus submódulos.

## 5. Convenciones de Astro

### Componentes

- Archivos `.astro` en PascalCase (`PostCard.astro`, `LanguageSwitcher.astro`).
- Un componente por archivo; props tipadas con `interface Props`.
- Usa HTML semántico, `alt` en imágenes, `label` en formularios y navegación por teclado.
- Prefiere componentes Astro sin framework cliente. Solo añade islas React/Svelte/Vue si hay una necesidad interactiva real y aprobada.
- Estilos scoped en el componente o variables globales en `src/styles/global.css`; no importes CSS de PaperMod.
- No manipules el DOM global desde varios componentes; centraliza scripts pequeños y usa `defer`.

### Layouts y páginas

- Layouts en `src/layouts/`, páginas en `src/pages/`, UI reutilizable en `src/components/`, utilidades en `src/lib/`.
- Usa `Astro.site` para URLs absolutas.
- Respeta `trailingSlash: 'always'`: los enlaces internos terminan en `/`.
- Las rutas dinámicas usan `getStaticPaths` y filtran por `lang` y `draft`.
- No uses `base`; el sitio se sirve desde la raíz del dominio.

### Contenido Markdown

- Frontmatter YAML delimitado por `---`. No uses TOML en contenido nuevo.
- Campos obligatorios: `title`, `date`, `draft`, `lang`, `translationKey`, `tags`, `categories`.
- Campos opcionales: `description`, `author`, `cover`, `toc`, `tocOpen`.
- `translationKey` es un string único, no un array.
- `lang` debe coincidir con la carpeta (`en` o `es`).
- Los archivos españoles no llevan sufijo `.es.md`; el idioma se define por carpeta y `lang`.
- Las imágenes referenciadas desde el contenido viven en `public/images/` o `public/img/` y se enlazan con rutas absolutas (`/images/...`).
- No publiques drafts: filtra `draft` en listados, feeds, sitemap e índice de búsqueda.
- No uses MDX salvo que se apruebe; el contenido actual no tiene shortcodes ni componentes embebidos.

### i18n y rutas

- Inglés por defecto en `/`; español en `/es/`.
- No generes `/en/` como URL canónica.
- Empareja traducciones por `translationKey`.
- Si no hay traducción, el selector de idioma enlaza al home del otro idioma, no a una URL 404.
- Los textos de interfaz viven en `src/i18n/` y no se duplican en cada componente.

### SEO y analítica

- Usa un solo componente `Seo.astro` para canonical, `hreflang`, Open Graph, Twitter Cards y JSON-LD.
- Las URLs de SEO son absolutas y usan `Astro.site`.
- El script de Umami se incluye una sola vez en `BaseLayout.astro`, con `defer`.
- No añadas analítica adicional sin aprobación.

## 6. Conversión desde Hugo

### Frontmatter

| Hugo | Astro |
| --- | --- |
| `title` | `title` |
| `date` | `date` |
| `draft` | `draft` |
| `summary` / `description` | `description` |
| `tags`, `categories` | arrays |
| `cover.image/alt/caption` | `cover.image/alt/caption` |
| `translationKey` | string normalizado |
| `ShowToc` | `toc` |
| `TocOpen` | `tocOpen` |
| `type: page` | colección `pages` |
| `author` | `author` |

- Convierte TOML (`+++`) a YAML (`---`).
- Elimina campos de PaperMod que no tengan comportamiento en el nuevo layout.
- Los `_index.md` no se migran como contenido; sus títulos van a páginas o i18n.

### Partials y plantillas Go

- `layouts/partials/extend_head.html` (Umami) se convierte en parte de `BaseLayout.astro` o en un componente de analítica.
- Cualquier otra partial o plantilla Go se traduce a un componente Astro con props explícitas.
- No copies lógica de Go templates; reescribe la responsabilidad en TypeScript/Astro.

### Shortcodes

- No hay shortcodes de Hugo en el contenido actual.
- Si aparece uno:
  1. Busca si existe un componente Astro o una sintaxis Markdown equivalente.
  2. Si no hay equivalencia directa, **no inventes** una solución.
  3. Añade una tarea de decisión manual en `tasks.md` con el nombre del shortcode, el archivo y las opciones posibles.
  4. Pregunta al usuario antes de implementar.

### Tema PaperMod

- No se porta pixel a pixel. El objetivo es un blog Astro funcional y limpio.
- Reimplementa las funciones: navegación, listados, post, TOC, portada, tema claro/oscuro, selector de idioma, búsqueda, 404, RSS y metadatos.
- No importes assets CSS/JS de `themes/PaperMod`.

## 7. Comandos de verificación

Ejecuta estos comandos antes de dar una tarea por completada:

```bash
npm run check        # astro check + TypeScript
npm run build        # build estático en dist/
npm run preview      # previsualización local
```

Verificaciones específicas:

```bash
# CNAME
test -f dist/CNAME && [ "$(cat dist/CNAME)" = "reyespinosa.is-a.dev" ]

# public/ versionado
git check-ignore -v public/CNAME   # no debe devolver coincidencia

# Enlaces internos y assets (con el preview en marcha)
npx linkinator http://localhost:4321 --recurse --skip 'mailto:'

# Contenido y rutas
curl -s http://localhost:4321/index.xml | head
curl -s http://localhost:4321/sitemap.xml | head
curl -s http://localhost:4321/index.json | head

# Producción
curl -I https://reyespinosa.is-a.dev/
```

Para OpenSpec:

```bash
openspec validate migrate-hugo-to-astro
openspec status --change migrate-hugo-to-astro
```

## 8. Despliegue y CNAME

- Workflow: `.github/workflows/deploy.yml`.
- Acciones: `actions/checkout@v7`, `withastro/action@v6` (Node 24) y `actions/deploy-pages@v5`.
- Disparadores: push a `master` y `workflow_dispatch`.
- Permisos: `contents: read`, `pages: write`, `id-token: write`.
- `public/CNAME` debe existir y contener `reyespinosa.is-a.dev`.
- No añadas `actions/configure-pages` si eso implica modificar la configuración de Pages; si el action lo requiere, consulta antes.
- No cambies la fuente de Pages, el custom domain ni Enforce HTTPS.
- Si el dominio deja de resolver o Pages pierde el custom domain, **detente y pregunta**. No toques DNS por iniciativa propia.

## 9. Detente y pregunta si...

- El cambio requiere modificar una URL pública, un slug o la estructura de rutas.
- Hay que borrar `docs/`, contenido del usuario o el tag de respaldo.
- Hay que añadir una dependencia, integración o servicio no previsto.
- Hay que tocar GitHub Pages, DNS, el remoto o la rama por defecto.
- Aparece un shortcode de Hugo sin equivalente claro.
- El usuario pide un rediseño visual que va más allá del blog funcional acordado.
- Un test o build falla de una forma que requiere cambiar la arquitectura de despliegue.
- Hay conflicto entre una spec y el estado real del repositorio.

## 10. Referencias

- Migración de Hugo a Astro: <https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/>
- Despliegue en GitHub Pages: <https://docs.astro.build/en/guides/deploy/github/>
- Acción oficial de Astro: <https://github.com/withastro/action>
- i18n en Astro: <https://docs.astro.build/en/guides/internationalization/>
- Content collections: <https://docs.astro.build/en/guides/content-collections/>
- Endpoints y rutas: <https://docs.astro.build/en/guides/endpoints/>
- RSS en Astro: <https://docs.astro.build/en/guides/rss/>
- Dominio personalizado en GitHub Pages: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- Documentación de is-a.dev: <https://www.is-a.dev/docs/>
- Plan de la migración: `openspec/changes/migrate-hugo-to-astro/`

## 11. Mantenimiento

- Actualiza este archivo cuando cambien comandos, convenciones o restricciones.
- No dupliques aquí el detalle de las specs; enlaza al cambio de OpenSpec.
- Mantén las reglas de "no tocar" aunque la migración termine: el dominio y GitHub Pages siguen siendo infraestructura sensible.
