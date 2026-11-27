# AGENTS.md

Instrucciones operativas para agentes que trabajen en este repositorio. Léelas antes de modificar código, contenido o configuración.

## 1. Contexto rápido

- Sitio personal de Reinaldo Espinosa, estático y bilingüe (inglés/español).
- Dominio de producción: `https://reyespinosa.is-a.dev`.
- Repositorio remoto: `https://github.com/reyespinosa1996/reyespinosa1996.github.io.git`.
- Rama de despliegue: `master`.
- Stack: Astro + TypeScript + content collections. Hugo/PaperMod fue retirado tras la migración verificada en producción.
- Inglés en `/`, español en `/es/`, con barra final.

## 2. Reglas de oro

1. **No ejecutes `git init`** ni crees un repositorio nuevo. El repositorio, el remoto y la rama ya existen.
2. **No cambies la configuración de GitHub Pages**: fuente, custom domain `reyespinosa.is-a.dev`, Enforce HTTPS ni reglas de DNS.
3. **No toques registros DNS** de `is-a.dev`.
4. **No elimines ni cambies el contenido de `CNAME`**. Debe existir en `public/CNAME` con el texto exacto `reyespinosa.is-a.dev`.
5. **No borres `README.md`, `TODO.md` ni contenido del usuario**. Puedes ampliarlos, no reemplazarlos.
6. **No hagas force push** a `master` ni reescribas historia compartida.
7. **No introduzcas secretos** en el repositorio. El ID de Umami es público y ya está en el código.
8. **No cambies las URLs públicas** sin una decisión explícita del usuario. Inglés en `/`, español en `/es/`, con barra final.
9. **No reintroduzcas Hugo, PaperMod ni sus submódulos.**
10. El tag `pre-astro-migration` se conserva como referencia de rollback; no lo borres.

## 3. Fronteras de archivos

### Puedes crear o modificar

- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `.nvmrc`.
- `src/**` (componentes, layouts, páginas, contenido, i18n, estilos, utilidades).
- `public/**` (CNAME, imágenes, favicon, robots.txt).
- `.github/workflows/deploy.yml`.
- `.gitignore`, `README.md`, `AGENTS.md`, `openspec/**`.

### No edites a mano

- `dist/`, `.astro/`, `node_modules/` (generados).

### Requieren confirmación

- Cambios de URL, slug o estructura de contenido.
- Dependencias nuevas fuera de Astro, `@astrojs/check`, `typescript`, `@astrojs/rss`, `fuse.js` y los plugins de markdown ya instalados.
- Cualquier cambio en Pages, DNS, remoto o rama por defecto.
- Rediseño visual que vaya más allá del blog funcional acordado.

## 4. Convenciones de Astro

### Componentes y layouts

- Archivos `.astro` en PascalCase (`PostCard.astro`, `LanguageSwitcher.astro`); un componente por archivo.
- Props tipadas con `interface Props`. No envuelvas el marcado en `<template>`: eso deja las páginas en blanco en el navegador aunque el build pase.
- Usa HTML semántico, `alt` en imágenes, `label` en formularios y navegación por teclado.
- Prefiere componentes Astro sin framework cliente. Solo añade islas si hay una necesidad interactiva real y aprobada.
- Estilos scoped en el componente o variables globales en `src/styles/global.css`.
- Centraliza scripts pequeños y usa `defer` donde corresponda.
- Layouts en `src/layouts/`, páginas en `src/pages/`, UI reutilizable en `src/components/`, utilidades en `src/lib/`.

### Contenido Markdown

- Frontmatter YAML delimitado por `---`. No uses TOML ni MDX.
- Campos obligatorios: `title`, `date`, `draft`, `lang`, `translationKey`, `tags`, `categories`.
- Campos opcionales: `description`, `author`, `cover`, `toc`, `tocOpen`.
- `translationKey` es un string único; `lang` coincide con la carpeta (`en` o `es`).
- Los archivos españoles no llevan sufijo `.es.md`.
- Imagenes referenciadas desde contenido: rutas absolutas bajo `/images/` o `/img/`.
- Filtra `draft` en listados, feeds, sitemap e índices de búsqueda.

### i18n, SEO y analítica

- Inglés por defecto en `/`; español en `/es/`. No generes `/en/` como canónica.
- Textos de interfaz en `src/i18n/`, sin duplicarlos en componentes.
- Un solo componente `Seo.astro` para canonical, `hreflang`, Open Graph, Twitter Cards y JSON-LD, con URLs absolutas desde `Astro.site`.
- Un solo script de Umami en `BaseLayout.astro`, con `defer`. No añadas analítica adicional sin aprobación.

## 5. Verificación

```bash
npm run check        # astro check + TypeScript
npm run build        # build estático en dist/
npm run preview      # previsualización local
```

Comprobaciones específicas:

```bash
test -f dist/CNAME && [ "$(cat dist/CNAME)" = "reyespinosa.is-a.dev" ]
git check-ignore -v public/CNAME   # no debe devolver coincidencia
npx linkinator http://localhost:4321 --recurse --skip 'mailto:'
curl -s http://localhost:4321/index.xml | head
curl -s http://localhost:4321/sitemap.xml | head
curl -s http://localhost:4321/index.json | head
curl -I https://reyespinosa.is-a.dev/
openspec validate --specs
```

Toda verificación debe incluir una comprobación real en navegador (DOM/screenshot), no solo HTML generado: el build puede pasar aunque las páginas estén en blanco.

## 6. Despliegue y CNAME

- Workflow: `.github/workflows/deploy.yml`.
- Acciones: `actions/checkout@v7`, `withastro/action@v6` (Node 24) y `actions/deploy-pages@v5`.
- Disparadores: push a `master` y `workflow_dispatch`.
- Permisos: `contents: read`, `pages: write`, `id-token: write`.
- El workflow verifica que `dist/CNAME` existe y contiene `reyespinosa.is-a.dev`.
- No cambies la fuente de Pages, el custom domain ni Enforce HTTPS.
- Si el dominio deja de resolver o Pages pierde el custom domain, **detente y pregunta**. No toques DNS por iniciativa propia.

## 7. Detente y pregunta si...

- El cambio requiere modificar una URL pública, un slug o la estructura de rutas.
- Hay que borrar contenido del usuario o el tag de respaldo.
- Hay que añadir una dependencia, integración o servicio no previsto.
- Hay que tocar GitHub Pages, DNS, el remoto o la rama por defecto.
- El usuario pide un rediseño visual fuera del blog funcional acordado.
- Un test o build falla de forma que requiere cambiar la arquitectura de despliegue.

## 8. Referencias

- Despliegue en GitHub Pages: <https://docs.astro.build/en/guides/deploy/github/>
- Acción oficial de Astro: <https://github.com/withastro/action>
- i18n en Astro: <https://docs.astro.build/en/guides/internationalization/>
- Content collections: <https://docs.astro.build/en/guides/content-collections/>
- Endpoints y rutas: <https://docs.astro.build/en/guides/endpoints/>
- RSS en Astro: <https://docs.astro.build/en/guides/rss/>
- Dominio personalizado en GitHub Pages: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
- Documentación de is-a.dev: <https://www.is-a.dev/docs/>

## 9. Mantenimiento

- Actualiza este archivo cuando cambien comandos, convenciones o restricciones.
- Conserva las reglas de "no tocar" para el dominio y GitHub Pages.
