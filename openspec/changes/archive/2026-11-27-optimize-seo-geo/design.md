# Design

## Context

El sitio es estático, bilingüe y se publica con Astro en GitHub Pages. `src/components/Seo.astro` ya centraliza canonical, `hreflang`, Open Graph, Twitter Cards y un bloque JSON-LD; `BaseLayout.astro` le pasa los valores que recibe de los layouts de post, página, índices y taxonomías. `src/lib/sitemap.ts` construye los sitemaps desde las colecciones y `public/robots.txt` solo declara la ubicación del sitemap. No hay `llms.txt`, la identidad del autor no aparece en los datos estructurados y varias páginas de índice no reciben descripción propia.

Las restricciones que condicionan el diseño son: no añadir dependencias npm ni servicios externos, no modificar Pages, DNS, `CNAME`, dominio ni `public/admin/`, mantener los textos de interfaz en `src/i18n/`, y no cambiar URLs públicas sin aprobación explícita. La motivación y el alcance están en `proposal.md`; el comportamiento observable está en los dos deltas de specs.

## Goals / Non-Goals

**Goals:**

- Unificar la generación de metadatos y señales citables en utilidades compartidas, de modo que layouts y endpoints usen la misma fuente de verdad.
- Completar los metadatos y el JSON-LD existentes sin sustituir los tipos `WebSite` y `BlogPosting`.
- Producir `llms.txt` y `llms-full.txt` en ambos idiomas directamente desde las colecciones publicadas, respetando `draft: true`.
- Dejar una comprobación verificable de que canonical, sitemap y robots son coherentes entre sí.

**Non-Goals:**

- Reescribir posts, páginas About ni textos del sitio más allá de los textos de interfaz necesarios en i18n.
- Cambiar slugs, rutas o barras finales sin una decisión explícita del usuario; la auditoría solo documenta propuestas y redirecciones.
- Añadir analítica, backend, base de datos, OAuth, Worker ni dependencias nuevas.
- Indexar `/admin/`, exponer tokens ni modificar la configuración de despliegue.
- Rediseñar la apariencia del sitio.

## Decisions

1. **Utilidad compartida de señales.** Crear un módulo en `src/lib/` con la identidad del autor (nombre, `sameAs`, licencia), las descripciones por defecto por idioma y tipo de página, la construcción de `BreadcrumbList`/`ItemList` y el formateo de entradas para llms. `Seo.astro` y los nuevos endpoints importan ese módulo. Alternativa descartada: duplicar los valores en cada layout y endpoint, que produciría canonicales y atribuciones divergentes.

2. **Un único componente para el `<head>`.** Extender `Seo.astro` con props opcionales para alt y dimensiones de imagen, `keywords`, `breadcrumbs`, `itemList` y directiva `robots`, en lugar de crear componentes nuevos por señal. Cuando una página requiera varias entidades, se emitirá un único `<script type="application/ld+json">` con `@graph`, conservando el objeto simple en las páginas que solo tenían `WebSite` o `BlogPosting`. Alternativa descartada: varios scripts JSON-LD, que complicaría la validación y podría duplicar entidades.

3. **Descripciones desde i18n.** Los textos por defecto para índices, taxonomías y búsqueda se añaden a `src/i18n/en.ts` y `src/i18n/es.ts`; los layouts los pasan a `Seo.astro` cuando el contenido no define `description`. Alternativa descartada: cadenas literales en los componentes, que rompería la convención de i18n del repositorio.

4. **Endpoints para los archivos llms.** Implementar `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts` y sus equivalentes bajo `src/pages/es/` como endpoints de Astro que lean `posts` y `pages`, filtren drafts y devuelvan `text/plain; charset=utf-8`. `llms-full.txt` incluirá el cuerpo Markdown de posts y páginas publicadas, precedido por título, URL canónica y atribución. Alternativa descartada: archivos escritos a mano en `public/`, que quedarían obsoletos al publicar contenido nuevo.

5. **`robots.txt` estático ampliado.** Mantener el archivo en `public/` y añadir bloques `User-agent` para GPTBot, ClaudeBot, PerplexityBot, Google-Extended y CCBot con `Allow: /`, además de `Disallow: /admin/` y `Disallow` para los índices `index.json`, conservando la línea `Sitemap`. No se convierte en endpoint porque no necesita datos de las colecciones.

6. **Exclusión de páginas de utilidad del índice.** `/search/` y `/es/search/` declaran `noindex` y se omiten al generar los sitemaps, igual que `/admin/` y los drafts. El sitemap seguirá generándose en `src/lib/sitemap.ts` para no cambiar las URLs públicas.

7. **Auditoría de URLs sin aplicación automática.** Cualquier cambio de slug o ruta sugerido se registrará con su mapa de redirecciones y requerirá aprobación explícita. Solo entonces se añadirá la redirección en `astro.config.mjs` y se actualizarán canonical, sitemap y llms en el mismo cambio.

## Risks / Trade-offs

- **[`robots.txt` no controla el acceso]** → `Disallow: /admin/` evita la indexación pero no sustituye el token del CMS; mantener el backend git-first y no exponer credenciales.
- **[Los crawlers de IA pueden ignorar `robots.txt`]** → no depender de la directiva para privacidad; los archivos generados solo contienen contenido ya público.
- **[`llms-full.txt` incrementa el tamaño del build]** → limitarlo a entradas publicadas y verificar el tamaño tras `npm run build`; excluir drafts.
- **[`@graph` puede ser interpretado distinto por validadores antiguos]** → conservar un único bloque JSON-LD y validar el HTML resultante en navegador antes de publicar.
- **[Las descripciones derivadas pueden parecer genéricas]** → usar textos específicos por tipo de página en i18n, no una sola plantilla, y revisar el `<head>` en navegador real.
- **[La auditoría puede proponer cambios de URL]** → dejar la compuerta de aprobación y no modificar canonicales ni sitemaps hasta que exista decisión explícita.

## Migration Plan

1. Implementar la utilidad compartida, las props de `Seo.astro`, los textos i18n y los textos por defecto de los layouts.
2. Añadir los cuatro endpoints llms y actualizar `public/robots.txt` y la generación de sitemaps.
3. Ejecutar `npm run check` y `npm run build`; comprobar `dist/CNAME`, los nuevos archivos en `dist/`, `curl` de los endpoints y el `<head>` en navegador real.
4. Hacer commit y push a `master` solo con aprobación explícita; el workflow existente publica sin cambios en Pages ni DNS.
5. Rollback: revertir el commit y volver a ejecutar el workflow; no hay migración de datos ni cambios de infraestructura que deshacer.
