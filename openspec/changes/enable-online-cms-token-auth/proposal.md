# Proposal

## Why

El admin ya se publica en `/admin/` y permite editar online pegando un token personal, pero la pantalla de acceso muestra también **“Sign In with GitHub”**, que no puede completarse: no hay cliente OAuth y GitHub no soporta PKCE client-side para una SPA (iniciativa en pausa según la documentación de Sveltia). El usuario preguntó si hacía falta un Cloudflare Workers y, tras comparar alternativas, eligió **no introducir servicios externos** y dejar el token como único método online.

## What Changes

- Configurar `backend.auth_methods: [token]` en `public/admin/config.yml` para que el admin publicado ofrezca únicamente **Sign In Using Access Token** y no muestre un botón OAuth que no funciona.
- Precisar en `README.md` el flujo online: URL del admin en producción, creación de un PAT *fine-grained* limitado al repositorio con **Contents: Read and write** (o un token clásico con `repo`), dónde se guarda el token (local storage del navegador) y cómo revocarlo. El token nunca se escribe en archivos del repositorio.
- Mantener sin cambios el flujo local (**Work with Local Repository**), la edición directa con OpenCode y los archivos de contenido. No se crean GitHub App, Worker de Cloudflare ni ningún otro servicio externo.
- Verificar en navegador real que en producción solo aparece el acceso por token, que un token válido permite editar y que no hay secretos versionados.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `cms-authoring`: el admin publicado SHALL declarar el token personal como único método de acceso remoto, sin ofrecer un inicio de sesión OAuth que no puede completarse.

## Impact

- Configuración: `public/admin/config.yml` (nuevo `backend.auth_methods: [token]`).
- Documentación: `README.md`.
- Sin servicios externos, secretos en Cloudflare, GitHub App, dependencias npm nuevas ni cambios en `.github/workflows/deploy.yml`, `public/CNAME`, DNS, dominio, URLs públicas, slugs ni esquema Zod de contenido.
- No se amplía la excepción de `AGENTS.md`: la regla que prohíbe OAuth sigue vigente y no se toca.
