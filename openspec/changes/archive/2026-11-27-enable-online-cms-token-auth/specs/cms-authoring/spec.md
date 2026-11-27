# Spec Delta

## ADDED Requirements

### Requirement: Método de acceso online con token

El admin publicado SHALL declarar el token de acceso personal como único método de autenticación remota y SHALL NO ofrecer un inicio de sesión OAuth que no pueda completarse, manteniendo la edición sobre archivos Markdown/YAML del repositorio.

#### Scenario: Método único en producción
- **WHEN** se abre `https://reyespinosa.is-a.dev/admin/`
- **THEN** se ofrece **Sign In Using Access Token** y no se muestra **Sign In with GitHub**

#### Scenario: Edición online con un token válido
- **WHEN** un usuario introduce un token personal con acceso de escritura a `reyespinosa1996/reyespinosa1996.github.io` y permiso **Contents: Read and write**
- **THEN** puede listar y guardar posts y páginas en `en` y `es` en el repositorio remoto

#### Scenario: Token sin permisos de escritura
- **WHEN** se introduce un token sin acceso de escritura al repositorio
- **THEN** el CMS no guarda cambios en `src/content/posts/` ni en `src/content/pages/`

#### Scenario: Configuración sin credenciales ni OAuth
- **WHEN** se inspeccionan `public/admin/config.yml` y `dist/admin/config.yml`
- **THEN** contienen `auth_methods: [token]`, no contienen `base_url` y no incluyen client IDs, secretos ni tokens

#### Scenario: Sin servicios nuevos
- **WHEN** se revisa el despliegue y las dependencias del proyecto
- **THEN** no hay GitHub App, Worker de Cloudflare, cliente OAuth ni backend añadido para publicar contenido

#### Scenario: Flujo local intacto
- **WHEN** se abre el admin con `npm run dev` y se elige **Work with Local Repository**
- **THEN** se puede editar y guardar contenido sin introducir ningún token

#### Scenario: Revocación del token
- **WHEN** se revoca el token personal en GitHub
- **THEN** el usuario deja de poder guardar cambios hasta introducir un token válido
