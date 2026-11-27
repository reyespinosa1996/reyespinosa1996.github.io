# Design

## Context

Ver `proposal.md` para la motivación. El admin es HTML estático en `public/admin/`, copiado a `dist/admin/`, con Sveltia CMS cargado desde CDN. El `config.yml` define `backend: github` (repo y rama), `site_url`, media e i18n, sin opciones de autenticación; por eso la interfaz muestra por defecto tanto **Sign In with GitHub** como **Sign In Using Access Token**. El segundo ya funciona en producción y está documentado en `README.md`.

La documentación oficial de Sveltia confirma que PKCE client-side para GitHub está sin implementar (proyecto en pausa) y que el flujo de código de autorización requiere un cliente OAuth con servidor para custodiar el `client secret`. El usuario descartó añadir ese servicio externo. Siguen vigentes las reglas del proyecto: sin secretos en el repositorio, build estático, sin cambios en Pages/DNS/CNAME/URLs y sin dependencias npm nuevas.

## Goals / Non-Goals

**Goals:**

- Hacer que el único método de acceso remoto visible y permitido sea el token personal, tanto en la configuración como en la interfaz publicada.
- Documentar el flujo online completo: creación del PAT con permisos mínimos, uso en `/admin/`, almacenamiento en el navegador y revocación.
- No añadir servicios, secretos ni dependencias, y no romper el flujo local ni la edición directa de archivos.

**Non-Goals:**

- OAuth con GitHub App, Cloudflare Workers, Sveltia CMS Additions, Netlify OAuth o clientes OAuth de terceros.
- Cambios en el esquema Zod, slugs, URLs, CNAME, DNS, Pages, workflow de despliegue ni dependencias npm.
- Restringir la edición local (**Work with Local Repository**) ni la edición directa de Markdown/YAML con OpenCode.
- Ampliar la excepción de CMS en `AGENTS.md` o `openspec/project.md`; no hace falta porque OAuth sigue prohibido.

## Decisions

1. **`auth_methods: [token]` en lugar de desplegar un cliente OAuth.** Sveltia soporta restringir los métodos de acceso remoto con esta opción. Alternativas descartadas: Cloudflare Workers (servicio externo nuevo), Sveltia CMS Additions (añade roles, usuarios, comentarios y bloqueos fuera de alcance), Netlify OAuth (el sitio se publica en Pages) y dejar ambos métodos (deja un botón roto en la UI).

2. **El token vive solo en el navegador.** Sveltia CMS lo guarda en el local storage y lo usa para las llamadas a la API de GitHub. No se copia al repositorio, al `config.yml` ni al artefacto `dist/`. La revocación y rotación se hacen en GitHub, sin tocar el sitio.

3. **Permisos mínimos del PAT.** Se recomienda un token *fine-grained* limitado a `reyespinosa1996/reyespinosa1996.github.io` con **Contents: Read and write**; Metadata se añade automáticamente. Como alternativa se acepta un token clásico con `repo`. No se piden permisos de Pull requests porque el flujo editorial está fuera de alcance.

4. **La documentación es parte del cambio.** `README.md` pasa a ser la fuente de verdad del acceso online, con la URL de producción y el aviso de no versionar credenciales. No se modifican `AGENTS.md` ni `openspec/project.md` porque la restricción existente ya prohíbe OAuth y permanece intacta.

5. **La interfaz sigue siendo estática.** `auth_methods` es una opción pública leída por el script del CMS en el navegador; no hay endpoints ni código de servidor y `dist/admin/` sigue siendo copiado por Astro desde `public/admin/`.

## Risks / Trade-offs

- **[Desaparece el botón “Sign In with GitHub”]** → los usuarios deben usar un PAT; se explica en `README.md` y se verifica en el DOM de producción.
- **[PAT con permisos excesivos]** → se documenta el ámbito mínimo y la revocación; el token queda en el navegador, nunca en Git.
- **[Token en local storage]** → si el navegador está comprometido, el token podría leerse; se mitiga limitándolo a un repositorio y siendo revocable.
- **[CDN sin fijar versión]** → una versión futura podría ignorar `auth_methods`; se comprueba con la versión cargada durante la verificación en navegador.
- **[El cambio requiere publicación]** → la comprobación en Producción se hace después del deploy aprobado por el usuario.

## Migration Plan

1. Añadir `backend.auth_methods: [token]` a `public/admin/config.yml` y actualizar `README.md`.
2. Ejecutar `npm run check` y `npm run build`, y confirmar que `dist/admin/config.yml` contiene `auth_methods: [token]` y no contiene `base_url`.
3. Publicar el cambio en `master` tras aprobación explícita del usuario y verificar en `https://reyespinosa.is-a.dev/admin/` que solo aparece el acceso por token; hacer una edición de prueba con un PAT del usuario y revertirla.
4. Rollback: eliminar `auth_methods: [token]` para volver a mostrar ambos métodos. No requiere cambios en Pages, DNS, CNAME, URLs ni servicios externos.
