# Proposal

## Why

El sitio publica contenido Markdown versionado en Git, pero hoy solo se puede editar desde el editor de código; no hay una interfaz de autoría para crear posts sin trabajar directamente con frontmatter YAML. El usuario pidió un CMS estático, *git-first*, con soporte opcional para edición asistida por OpenCode. EmDash no encaja: es un CMS full-stack con base de datos y salida `server`, mientras que este proyecto debe seguir siendo un build estático en GitHub Pages. Sveltia CMS encaja con el modelo existente: edita archivos Markdown del repositorio, no necesita base de datos ni servidor, soporta i18n y ofrece recursos oficiales para agentes.

## What Changes

- Añadir una interfaz de administración estática en `public/admin/` (HTML + `config.yml`) cargada desde el CDN de Sveltia CMS, sin dependencias npm de runtime, servidor ni base de datos.
- Configurar colecciones para `src/content/posts/{en,es}/` y `src/content/pages/{en,es}/`, con i18n `multiple_folders`, manteniendo los archivos, slugs, `translationKey` y el esquema Zod actuales.
- Definir campos del CMS que generan exactamente el frontmatter que ya consume Astro (`title`, `date`, `draft`, `lang`, `translationKey`, `description`, `author`, `tags`, `categories`, `cover`, `toc`, `tocOpen`), omitiendo campos opcionales vacíos.
- Documentar el flujo local (Chrome/Edge: “Work with Local Repository”) y el opcional con token de acceso personal de GitHub para editar contra el remoto; no se guardan secretos en el repositorio.
- Añadir guía para OpenCode: los posts siguen siendo Markdown editable directamente por el agente; el repositorio puede registrar el MCP de documentación de Sveltia y su Agent Skill como ayuda para configurar el CMS (no para publicar contenido).
- Actualizar `AGENTS.md` y `openspec/project.md`, que actualmente excluyen CMS/backend, para reflejar el nuevo alcance de autoría git-first.
- No cambiar dominio, DNS, Pages, remoto, rama, URLs públicas existentes ni el workflow de despliegue. Se añade una ruta nueva `/admin/`; las URLs actuales no se modifican.

## Capabilities

### New Capabilities

- `cms-authoring`: autoría de posts y páginas bilingües mediante un CMS estático git-first, con formatos de archivo y campos compatibles con las content collections de Astro y edición posible desde OpenCode.

### Modified Capabilities

Ninguna. `content-and-routing` y `site-hosting` conservan sus requisitos: el CMS solo escribe los mismos archivos Markdown que el sitio ya consume y el build sigue siendo estático.

## Impact

- Archivos nuevos: `public/admin/index.html`, `public/admin/config.yml`, documentación de uso del CMS y guía de integración con OpenCode.
- Archivos modificados: `AGENTS.md`, `openspec/project.md` y, si se decide registrar el MCP, la configuración de OpenCode en el repositorio.
- Dependencias: ninguna nueva dependencia npm; el admin usa el script CDN de Sveltia CMS. No se introducen servicios de pago ni servicios de backend.
- Contenido existente: sin migración de archivos ni cambio de slugs; el CMS debe poder abrir y guardar los posts actuales sin perder campos.
- Despliegue: sin cambios en `.github/workflows/deploy.yml`, `CNAME`, dominio ni DNS.
- Decisiones registradas: se descarta EmDash por requerir servidor/base de datos; se descarta OAuth porque el flujo local y el token personal cubren el caso de uso personal sin secretos en el repo.
