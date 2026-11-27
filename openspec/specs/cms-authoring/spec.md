# cms-authoring Specification

## Purpose

Define la autoría git-first de contenido bilingüe: una interfaz estática que crea y edita los mismos archivos Markdown que consume el sitio, sin backend ni base de datos, y que permite que OpenCode edite el contenido directamente en el repositorio.

## Requirements

### Requirement: Interfaz de autoría estática

El sitio SHALL ofrecer una interfaz de administración servida como archivos estáticos junto al sitio publicado, que SHALL leer y escribir los archivos de contenido del repositorio sin requerir un servidor de aplicación, base de datos ni servicio de almacenamiento propio.

#### Scenario: Admin publicado con el sitio
- **WHEN** se ejecuta el build y se inspecciona `dist/`
- **THEN** existe la interfaz de administración en `dist/admin/` junto al resto de archivos estáticos

#### Scenario: Acceso al admin
- **WHEN** se solicita `/admin/` en el sitio publicado
- **THEN** se carga la interfaz de autoría sin depender de un runtime del lado del servidor

#### Scenario: Sin infraestructura nueva
- **WHEN** se revisa el despliegue y las dependencias del proyecto
- **THEN** no hay base de datos, adaptador de servidor, endpoint propio ni servicio de backend añadido para publicar contenido

### Requirement: Compatibilidad con el modelo de contenido existente

La interfaz de autoría SHALL crear y editar entradas en `src/content/posts/` y `src/content/pages/` usando archivos Markdown con frontmatter YAML que cumple el esquema vigente de las content collections.

#### Scenario: Abrir una entrada existente
- **WHEN** se abre un post o la página About existente en la interfaz de autoría
- **THEN** se muestran todos sus valores actuales, incluidos `title`, `date`, `lang`, `translationKey`, `tags`, `categories` y `cover` cuando exista

#### Scenario: Guardar una entrada existente
- **WHEN** se guarda una entrada ya publicada desde la interfaz de autoría
- **THEN** el archivo conserva los campos obligatorios, los campos opcionales existentes y el cuerpo Markdown, sin cambiar la ruta del archivo ni el slug

#### Scenario: Crear una entrada válida
- **WHEN** se crea un post nuevo con los campos obligatorios del esquema
- **THEN** `npm run check` y `npm run build` terminan correctamente y el post aparece en sus listados y feeds correspondientes

#### Scenario: Campos opcionales vacíos
- **WHEN** se guarda una entrada con campos opcionales sin valor
- **THEN** esos campos se omiten del frontmatter en lugar de escribirse como `null`, cadena vacía o lista vacía que invalide el esquema

### Requirement: Autoría bilingüe enlazada

El contenido SHALL organizarse por idioma en subcarpetas `en/` y `es/` dentro de cada colección, y la interfaz de autoría SHALL permitir gestionar las dos versiones de una misma entrada como traducciones vinculadas.

#### Scenario: Crear la traducción de un post
- **WHEN** se crea la versión en español de un post publicado en inglés desde la interfaz de autoría
- **THEN** se escribe un archivo en `src/content/posts/es/` con el mismo slug, `lang: es` y un `translationKey` que permite al selector de idioma enlazar ambas versiones

#### Scenario: Slug sin sufijo de idioma
- **WHEN** se crea o edita una entrada en español
- **THEN** el nombre del archivo y la URL pública no incluyen el sufijo `.es`

#### Scenario: Páginas bilingües
- **WHEN** se edita la página About en cualquiera de los dos idiomas
- **THEN** se actualiza únicamente el archivo de ese idioma en `src/content/pages/{en,es}/` y `/about/` y `/es/about/` siguen resolviendo

### Requirement: Control de borradores desde la interfaz

La interfaz de autoría SHALL permitir marcar entradas como borrador y SHALL respetar el campo `draft` existente al publicar el sitio.

#### Scenario: Guardar como borrador
- **WHEN** se guarda un post con `draft: true` desde la interfaz de autoría
- **THEN** el build no genera su página ni lo incluye en listados, feeds, sitemap ni índices de búsqueda

#### Scenario: Publicar un borrador
- **WHEN** se cambia `draft` a `false` y se ejecuta el build
- **THEN** el post se publica en la URL derivada de su idioma y slug

### Requirement: Edición por agentes sobre archivos del repositorio

El contenido SHALL permanecer como Markdown y YAML legibles y editables en el repositorio, de modo que OpenCode SHALL poder crear y modificar posts usando únicamente operaciones sobre archivos, sin APIs privativas del CMS.

#### Scenario: Edición de un post por OpenCode
- **WHEN** OpenCode modifica el frontmatter o el cuerpo de un archivo de post en `src/content/posts/`
- **THEN** el siguiente build refleja el cambio en la página, los feeds y el índice de búsqueda correspondientes

#### Scenario: Creación de un post por OpenCode
- **WHEN** OpenCode crea un archivo Markdown con el mismo esquema de frontmatter en la carpeta de idioma correcta
- **THEN** la interfaz de autoría puede abrirlo y el build lo publica como cualquier otro post

#### Scenario: Recarga de la interfaz
- **WHEN** se edita un archivo fuera de la interfaz y se recarga el admin
- **THEN** la interfaz muestra el contenido actualizado del archivo

### Requirement: Credenciales fuera del repositorio

El repositorio SHALL NOT contener credenciales de acceso al CMS. La edición local SHALL funcionar sin autenticación remota y la edición contra el repositorio remoto SHALL usar credenciales introducidas por el usuario en su navegador.

#### Scenario: Flujo local sin token
- **WHEN** un usuario abre la interfaz de autoría contra su checkout local
- **THEN** puede editar y guardar archivos sin configurar OAuth, tokens ni secretos en el repositorio

#### Scenario: Sin secretos versionados
- **WHEN** se inspecciona el repositorio y el artefacto publicado
- **THEN** no hay tokens, claves de API ni secretos del CMS incluidos en archivos versionados ni en `dist/`

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
