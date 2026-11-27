# Spec Delta

## Purpose

Define cómo se construye y publica el sitio estático en GitHub Pages bajo el dominio personalizado `reyespinosa.is-a.dev`, preservando el repositorio, el dominio y la configuración de Pages existentes.

## ADDED Requirements

### Requirement: Build estático reproducible

El proyecto SHALL compilar el sitio con Astro en modo estático y producir el artefacto publicable en `dist/`, sin depender de Hugo ni de un runtime de servidor.

#### Scenario: Build local exitoso
- **WHEN** se ejecuta `npm run build` en un checkout limpio con dependencias instaladas
- **THEN** el comando termina con código 0 y genera `dist/index.html`, `dist/es/index.html` y los assets referenciados

#### Scenario: Verificación de tipos y contenido
- **WHEN** se ejecuta `astro check` o el script `npm run check`
- **THEN** el comando valida el esquema de content collections y falla si un post no cumple los campos obligatorios

#### Scenario: Build fallido no publica
- **WHEN** el build o la verificación fallan en GitHub Actions
- **THEN** el job de deploy no se ejecuta y la versión previamente publicada permanece disponible

### Requirement: Despliegue en GitHub Pages con Astro

El flujo de GitHub Actions SHALL compilar el sitio con `withastro/action@v6` y desplegar el artefacto con `actions/deploy-pages@v5` cuando se hace push a `master` o se ejecuta manualmente.

#### Scenario: Push a master
- **WHEN** se hace push a la rama `master`
- **THEN** el workflow instala dependencias, ejecuta el build de Astro, sube el artefacto de Pages y despliega en el entorno `github-pages`

#### Scenario: Ejecución manual
- **WHEN** se dispara el workflow con `workflow_dispatch`
- **THEN** se ejecuta el mismo build y deploy sin requerir un nuevo commit

#### Scenario: Permisos mínimos
- **WHEN** el workflow se ejecuta
- **THEN** usa `contents: read`, `pages: write` e `id-token: write`, y no requiere credenciales adicionales

### Requirement: Dominio personalizado y archivo CNAME

El artefacto de build SHALL incluir un archivo `CNAME` en la raíz con el contenido exacto `reyespinosa.is-a.dev`, y la configuración de dominio personalizado de GitHub Pages SHALL permanecer sin cambios.

#### Scenario: CNAME en el artefacto
- **WHEN** finaliza `npm run build`
- **THEN** existe `dist/CNAME` y su contenido, sin espacios adicionales, es `reyespinosa.is-a.dev`

#### Scenario: Dominio servido con HTTPS
- **WHEN** se visita `https://reyespinosa.is-a.dev/` después del despliegue
- **THEN** la respuesta es 200, el certificado TLS es válido para el dominio y no hay redirecciones a `github.io`

#### Scenario: Configuración de Pages intacta
- **WHEN** se revisa la configuración de Pages del repositorio antes y después de la migración
- **THEN** la fuente sigue siendo GitHub Actions, el custom domain sigue siendo `reyespinosa.is-a.dev` y Enforce HTTPS sigue habilitado

### Requirement: Sitio servido desde la raíz del dominio

El sitio SHALL servirse desde la raíz del dominio, sin `base` en la configuración de Astro, de modo que todas las rutas y assets absolutos resuelvan directamente contra `https://reyespinosa.is-a.dev/`.

#### Scenario: Assets en la raíz
- **WHEN** se carga una página en `/` o `/es/`
- **THEN** los enlaces a CSS, JavaScript e imágenes usan rutas absolutas como `/assets/...` o `/images/...`, no rutas con prefijo de repositorio

#### Scenario: Sin prefijo de repositorio
- **WHEN** se inspecciona el HTML generado
- **THEN** no aparecen rutas del tipo `/reyespinosa1996.github.io/` ni un `base` distinto de `/`

### Requirement: Publicación de assets estáticos

El build SHALL copiar a `dist/` los archivos de `public/`, incluyendo `CNAME`, imágenes y favicons, y SHALL versionar `public/` en el repositorio.

#### Scenario: Assets copiados
- **WHEN** se ejecuta `npm run build`
- **THEN** `dist/images/hero.jpg`, `dist/images/post-002.jpg`, `dist/img/logo.svg` y `dist/CNAME` existen

#### Scenario: public versionado
- **WHEN** se revisa el control de versiones
- **THEN** `public/` no está ignorado por `.gitignore` y `dist/` sí lo está

### Requirement: Continuidad del dominio sin cambios de DNS

La migración SHALL NOT modificar registros DNS de `is-a.dev`, la configuración de custom domain de GitHub Pages ni el repositorio remoto; solo SHALL verificar que el dominio sigue apuntando al sitio publicado.

#### Scenario: Sin cambios de infraestructura
- **WHEN** se compara la configuración de DNS y Pages antes y después de la migración
- **THEN** no hay cambios en registros DNS, repositorio remoto ni custom domain

#### Scenario: Verificación posterior al deploy
- **WHEN** el nuevo workflow termina correctamente
- **THEN** `curl -I https://reyespinosa.is-a.dev/` devuelve 200 y el contenido corresponde al nuevo sitio Astro

### Requirement: Rollback operativo

El despliegue SHALL ser atómico y SHALL permitir volver a la versión anterior mediante un revert del commit o una nueva ejecución del workflow, sin cambiar la configuración de Pages.

#### Scenario: Revert de un cambio
- **WHEN** se revierte el commit que introdujo un problema y se hace push a `master`
- **THEN** el workflow vuelve a construir y publicar la versión anterior en el mismo dominio

#### Scenario: Re-ejecución del workflow
- **WHEN** se vuelve a ejecutar el workflow de un commit anterior desde la UI de Actions
- **THEN** el sitio se reconstruye y publica sin intervención manual en Pages
