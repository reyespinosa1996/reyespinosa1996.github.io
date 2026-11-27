# Tasks

## 1. Configuración y documentación

- [x] 1.1 Añadir `backend.auth_methods: [token]` a `public/admin/config.yml` sin tocar `repo`, `branch`, media ni i18n; verificar que `npm run check` pasa, que `npm run build` genera `dist/admin/config.yml` con `auth_methods: [token]` y que no aparece `base_url`.
- [x] 1.2 Actualizar `README.md` con el acceso online: URL `https://reyespinosa.is-a.dev/admin/`, creación de un PAT *fine-grained* limitado al repositorio con **Contents: Read and write** (o token clásico con `repo`), aviso de que Sveltia lo guarda solo en el navegador e instrucciones para revocarlo; verificar que en ningún paso se pide guardar el token en archivos ni en el repositorio.
- [x] 1.3 Confirmar que no hacen falta cambios en `AGENTS.md` ni `openspec/project.md` porque la excepción existente prohíbe OAuth y no se amplía; verificar que permanecen intactas las reglas de dominio, Pages, CNAME, URLs públicas, dependencias y rama.
- [ ] 1.4 Con aprobación explícita del usuario, publicar el cambio en `master` y verificar con `curl` que `https://reyespinosa.is-a.dev/admin/config.yml` refleja `auth_methods: [token]`.

## 2. Verificación

- [ ] 2.1 Abrir `/admin/` en producción con navegador real y verificar en DOM/screenshot que solo aparece **Sign In Using Access Token** y no **Sign In with GitHub**; guardar la captura.
- [ ] 2.2 Iniciar sesión online con un PAT válido introducido por el usuario (handoff) y verificar que se listan Posts y Pages en `en` y `es` y que se puede guardar una edición de prueba; eliminar la edición y confirmar con `git status` que no quedan archivos de prueba.
- [ ] 2.3 Verificar que un token sin permisos de escritura no permite guardar cambios y que, al revocar un PAT en GitHub, se pierde el acceso hasta introducir uno válido; documentar el resultado.
- [x] 2.4 Verificar con `npm run check`, `npm run build` y un escaneo de secretos que no hay tokens en el repositorio ni en `dist/`, que `public/CNAME` sigue siendo exactamente `reyespinosa.is-a.dev` y que el workflow, el remoto, la rama y las URLs no han cambiado; comprobar además con `npm run dev` que **Work with Local Repository** sigue funcionando sin token.

## Workflow follow-up

- Archivar el cambio después de la revisión.
