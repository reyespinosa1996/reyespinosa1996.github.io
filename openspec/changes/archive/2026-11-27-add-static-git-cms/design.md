# Design

## Context

El sitio es un build estático de Astro (`output: static`) desplegado en GitHub Actions a Pages. Las colecciones `posts` y `pages` cargan Markdown desde `src/content/{posts,pages}/{en,es}/` con un esquema Zod en `src/content.config.ts`; las URLs, los slugs, los feeds, el sitemap y el índice de búsqueda se derivan de esos archivos. Ver `proposal.md` para la motivación y `specs/cms-authoring/spec.md` para el contrato de comportamiento.

Las restricciones que condicionan el diseño son: no tocar Pages, DNS, dominio, remoto ni rama; no cambiar URLs públicas existentes; mantener el build estático y `CNAME`; no versionar secretos; y no añadir dependencias fuera de las ya aprobadas sin decisión explícita.

## Goals / Non-Goals

**Goals:**

- Permitir crear y editar posts y páginas bilingües desde una interfaz de navegador sin exponer un backend propio.
- Que el CMS escriba exactamente los archivos Markdown que Astro ya consume, con frontmatter válido para Zod.
- Que el flujo por defecto funcione en local sin credenciales y que OpenCode pueda editar el contenido con herramientas de archivo.
- Integrar el admin en el build estático actual sin cambiar el workflow de despliegue.

**Non-Goals:**

- Migrar el sitio a Node/Cloudflare ni introducir base de datos, SSR o Live Collections.
- Cambiar las URLs canónicas, los slugs, la estructura de carpetas de contenido ni el esquema Zod.
- Añadir autenticación OAuth, roles, comentarios, programación de publicaciones ni plugins de CMS.
- Convertir la interfaz en un MCP de contenido: el soporte para OpenCode es edición directa de archivos y, de forma opcional, documentación asistida.
- Rediseñar el sitio público.

## Decisions

### 1. Sveltia CMS como interfaz git-first

Se añade una página HTML estática que carga Sveltia CMS desde su CDN, en lugar de integrar un CMS en el pipeline de build.

- **Por qué:** lee y escribe archivos del repositorio, no necesita servidor ni base de datos, tiene soporte i18n y guía específica para Astro, y ofrece flujo local sin autenticación. Encaja con un sitio estático en Pages.
- **Alternativas descartadas:** EmDash (full-stack, requiere salida `server`, SQLite/D1 y cambiar el despliegue); Keystatic/Decap (añaden dependencias o Flint más acoplamiento al proyecto); editar solo Markdown (no resuelve la necesidad de interfaz de autoría).
- **Consecuencia:** el admin depende de un script de terceros servido por CDN; no se fija versión, siguiendo la recomendación del proveedor para evitar cargas obsoletas.

### 2. Admin como archivo estático en `public/admin/`

`public/admin/index.html` y `public/admin/config.yml` se copian tal cual a `dist/admin/`. El HTML incluye `<meta name="robots" content="noindex">` y carga el script sin `type="module"` ni hojas de estilo adicionales.

- **Por qué:** Astro no sirve `index.html` de `public/` para la ruta `/admin/` en desarrollo, por lo que se usa `/admin/index.html` en local; en producción la ruta canónica será `/admin/`. Usar una página `.astro` provocaría recargas por HMR que pueden interrumpir guardados.
- **Alternativa descartada:** una ruta `src/pages/admin.astro`, descartada por el problema de recarga y por mezclar el admin con el pipeline de contenido.
- **Consecuencia:** se añade una ruta pública nueva (`/admin/`) sin modificar ninguna existente; el sitemap no la incluye.

### 3. Configuración alineada con las content collections

`config.yml` define un backend GitHub apuntando a `reyespinosa1996/reyespinosa1996.github.io` en `master`, `media_folder: public/images` y `public_folder: /images`, e i18n con `structure: multiple_folders` y localidades `[en, es]`. Las colecciones `posts` y `pages` apuntan a `src/content/posts` y `src/content/pages`, de modo que la estructura resultante es `src/content/posts/{en,es}/<slug>.md`.

- Campos visibles: `title`, `date` (datetime ISO), `draft` (boolean, por defecto `true`), `description`, `author`, `tags`, `categories`, `cover` (objeto con `image`, `alt`, `caption`), `toc`, `tocOpen` y el cuerpo Markdown. Los campos específicos de cada idioma (`title`, `description`, `tags`, cuerpo) usan `i18n: true`; los valores compartidos (`date`, `draft`, `author`, `categories`, `cover`, `toc`, `tocOpen`) usan `i18n: duplicate`.
- Campos ocultos: `lang` con valor `{{locale}}` e `i18n: true`, y `translationKey` con valor `{{uuid_short}}` e `i18n: duplicate` para que la traducción herede la misma clave. Los campos ocultos necesitan una opción `i18n` explícita para guardarse en todos los idiomas. Los archivos actuales conservan sus valores porque el valor por defecto solo se aplica cuando el campo falta.
- `output.omit_empty_optional_fields: true` evita escribir `null` o listas vacías que rechazaría el esquema Zod.
- **Por qué:** mantiene el contrato de datos actual y permite que el selector de idioma siga funcionando sin tocar `src/lib/content.ts`.
- **Alternativa descartada:** reorganizar el contenido en un único archivo por entrada con claves por idioma; obligaría a cambiar `src/content.config.ts`, las rutas y los slugs.

### 4. Flujo de edición y credenciales

El flujo por defecto es el local: con el servidor de Astro en marcha, el usuario elige “Work with Local Repository” en un navegador Chromium y selecciona la raíz del proyecto. El CMS escribe archivos; el usuario revisa el diff y hace commit/push con Git. La edición remota desde el admin publicado se documenta como opcional mediante un token de acceso personal introducido en el navegador, con permisos de lectura y escritura sobre el repositorio.

- **Por qué:** cubre el caso de uso personal sin registrar una app OAuth ni guardar secretos en el repositorio.
- **Alternativa descartada:** OAuth con GitHub App o servicios de autenticación; añade infraestructura externa innecesaria para un único editor.
- **Consecuencia:** el flujo local depende de File System Access API (Chrome/Edge/Brave) y no hace push automático.

### 5. Soporte para OpenCode

El contenido sigue siendo Markdown/YAML versionado, así que OpenCode puede crear o editar posts con sus herramientas de archivo normales y el build refleja los cambios sin adaptadores. La documentación del repo explica cómo verificar el esquema después de una edición (`npm run check`) y, como opción, cómo registrar el MCP de documentación de Sveltia y su Agent Skill para ayudar a mantener `config.yml`.

- **Por qué:** evita un servicio de contenido adicional y preserva el historial de Git como fuente de verdad.
- **Alternativa descartada:** un MCP que publique contenido; no existe una integración propia necesaria y ampliaría el alcance.
- **Consecuencia:** la asistencia de agentes es documentación y edición de archivos, no una API de edición de CMS.

### 6. Documentación y alcance

`AGENTS.md` y `openspec/project.md` se actualizan para permitir explícitamente un CMS estático git-first como excepción acotada a la regla que excluía CMS/backend, manteniendo intactas las reglas de dominio, Pages, CNAME, URLs y dependencias.

## Risks / Trade-offs

- [El script del CDN no está disponible o cambia] → el sitio público y el contenido no dependen de él; se puede editar Markdown directamente y se documenta la alternativa. Si se necesita autosuficiencia, se evaluará el paquete npm con aprobación explícita.
- [El guardado desde el CMS reformatea Markdown existente] → probar primero con una copia, revisar el diff antes de hacer commit y usar el modo raw para sintaxis no soportada; no guardar entradas antiguas en bloque.
- [Campos ocultos o vacíos rompen la validación Zod] → `npm run check` y `npm run build` en CI; verificar que `translationKey` se hereda en la traducción y que los opcionales se omiten.
- [La interfaz local no hace push] → el flujo documentado exige revisar el diff y hacer commit/push manualmente; así se mantiene la revisión humana.
- [Navegador incompatible con File System Access API] → documentar Chrome/Edge y la alternativa de edición directa en Git.
- [El admin se indexa o se confunde con contenido] → `noindex` en la página, exclusión del sitemap y sin enlaces desde la navegación pública.

## Migration Plan

1. Añadir los archivos del admin y la configuración; no se mueve ni reescribe ningún archivo de contenido.
2. Verificar en local que los posts actuales abren y que un guardado de prueba no altera su semántica; descartar el cambio de prueba antes de continuar.
3. Crear un post de prueba en ambos idiomas, ejecutar `npm run check` y `npm run build`, y comprobar rutas, feeds, sitemap e índice de búsqueda.
4. Eliminar el post de prueba, actualizar documentación y hacer push a `master`; el workflow existente publica el admin junto al sitio.
5. Rollback: revertir el commit que añadió el admin. No hay migración de datos ni cambios de infraestructura que revertir.

## Resolved Scope Decisions

- El alcance implementado cubre el flujo local sin credenciales. La edición remota con un token personal se documenta como opcional, pero no se configura OAuth ni se guarda ningún token en el repositorio.
- El MCP de documentación de Sveltia y su Agent Skill se documentan como ayuda opcional para mantener la configuración del CMS. No se registra un MCP en la configuración de OpenCode del repositorio; los posts se editan directamente como Markdown/YAML.
