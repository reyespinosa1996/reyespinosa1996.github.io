# Tasks

## 1. Andamiaje estático del admin

- [x] 1.1 Crear `public/admin/index.html` con título, `<meta name="robots" content="noindex">` y el script CDN de Sveltia CMS sin `type="module"` ni estilos propios; verificar que `npm run build` copia el archivo a `dist/admin/index.html` y que el archivo no contiene tokens ni secretos.
- [x] 1.2 Crear `public/admin/config.yml` con backend `github` para `reyespinosa1996/reyespinosa1996.github.io` en `master`, `media_folder: public/images`, `public_folder: /images`, e i18n `multiple_folders` con `locales: [en, es]` y `default_locale: en`; verificar que no incluye credenciales y que el admin no muestra errores de configuración al abrirlo.
- [x] 1.3 Arrancar `npm run dev`, abrir `http://localhost:[port]/admin/index.html` en Chromium/Edge y verificar con DOM/screenshot que se carga la interfaz de Sveltia; confirmar que en local se usa `/admin/index.html` y que el build publica la ruta `/admin/`.

## 2. Compatibilidad con las content collections

- [x] 2.1 Definir en `config.yml` las colecciones `posts` y `pages` apuntando a `src/content/posts` y `src/content/pages`, con `format: yaml-frontmatter`, i18n activado y campos `title`, `description` y cuerpo con `i18n: true`; verificar que el admin lista los posts existentes en `en/` y `es/` y la página About en ambos idiomas.
- [x] 2.2 Definir `date`, `draft`, `author`, `categories` y `cover` como campos compartidos (`i18n: duplicate`), y `tags` como campo traducible; verificar que un post existente se abre con `title`, `date`, `lang`, `translationKey`, `tags`, `categories` y `cover` correctamente en el editor.
- [x] 2.3 Añadir los campos ocultos `lang` (`default: '{{locale}}'`, `i18n: true`) y `translationKey` (`default: '{{uuid_short}}'`, `i18n: duplicate`), y configurar `output.omit_empty_optional_fields: true`; verificar que guardar una entrada temporal con opcionales vacíos no escribe `null`, cadenas vacías ni listas vacías.
- [x] 2.4 Guardar una copia temporal de un post existente desde el admin y verificar con `git diff` que conserva ruta, slug, campos obligatorios, opcionales existentes y cuerpo Markdown; descartar la copia temporal antes de continuar.

## 3. Autoría bilingüe, borradores y OpenCode

- [x] 3.1 Crear un post temporal en inglés y habilitar su traducción al español desde el admin; verificar que se escriben `src/content/posts/en/<slug>.md` y `src/content/posts/es/<slug>.md`, con `lang` correcto, el mismo `translationKey`, sin sufijo `.es` y con enlace de idioma en la página publicada.
- [x] 3.2 Marcar el post temporal como `draft: true`, ejecutar `npm run build` y verificar que no aparece en su página, listados, feeds, sitemap ni índice de búsqueda; cambiarlo a `false`, reconstruir y verificar que aparece en la URL derivada de su idioma y slug.
- [x] 3.3 Crear un post temporal editando directamente Markdown/YAML como lo haría OpenCode, recargar el admin y verificar que el nuevo post aparece en la interfaz y que el build lo publica; eliminar los posts temporales y confirmar con `git status` que no quedan archivos de prueba.
- [x] 3.4 Documentar en `README.md` el flujo local (Astro dev + “Work with Local Repository”), el requisito de navegador Chromium, la opción de token personal para edición remota y cómo editar posts con OpenCode; verificar que las instrucciones copiadas/pegadas funcionan y que no recomiendan guardar secretos en el repo.

## 4. Reglas del proyecto y documentación

- [x] 4.1 Actualizar `AGENTS.md` para permitir explícitamente un CMS estático git-first como excepción acotada a la regla que excluía CMS/backend; verificar que permanecen intactas las reglas de dominio, Pages, CNAME, URLs públicas y dependencias.
- [x] 4.2 Actualizar `openspec/project.md` para reflejar la autoría git-first sin cambiar las URLs existentes ni los specs base; verificar que `openspec validate --specs` termina correctamente.
- [x] 4.3 Verificar que `public/CNAME` sigue conteniendo exactamente `reyespinosa.is-a.dev` y que `.github/workflows/deploy.yml` no ha cambiado.

## 5. Verificación integral

- [x] 5.1 Ejecutar `npm run check` y `npm run build`, y verificar en `dist/` la presencia de `admin/index.html`, `admin/config.yml`, `index.xml`, `sitemap.xml` e `index.json` sin errores.
- [x] 5.2 Arrancar `npm run preview` y verificar en navegador con DOM/screenshot que `/admin/` carga la interfaz, que `/`, `/es/`, `/about/` y `/es/about/` siguen funcionando y que la navegación pública no enlaza al admin.
- [x] 5.3 Revisar `git diff --stat` y `git status --short` y verificar que solo cambian los archivos previstos, que no hay secretos en el repositorio ni en `dist/`, y que no se han tocado DNS, remoto, rama ni Pages.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
