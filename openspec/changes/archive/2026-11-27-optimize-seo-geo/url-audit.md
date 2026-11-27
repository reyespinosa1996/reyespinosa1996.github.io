# Auditoría de URLs y slugs

Estado: **propuesta no aplicada**. Este cambio conserva todas las URLs públicas, slugs y barras finales actuales. Ninguna de las redirecciones sugeridas abajo se ha añadido a `astro.config.mjs`.

## Rutas actuales verificadas

- Inglés (raíz): `/`, `/about/`, `/posts/`, `/tags/`, `/categories/` y los posts y términos publicados bajo esas rutas.
- Español (`/es/`): `/es/`, `/es/about/`, `/es/posts/`, `/es/tags/`, `/es/categories/` y los posts y términos publicados bajo esas rutas.
- Utilidades: `/search/` y `/es/search/` (declaran `noindex` y no aparecen en los sitemaps).
- Redirecciones heredadas ya existentes: `/en*` hacia las rutas canónicas en raíz y `/page/1`, `/posts/page/1`, `/tags/[tag]/page/1`, `/categories/[category]/page/1` y sus equivalentes `/es/` hacia la página canónica. Se mantienen sin cambios.

La comparación entre los `<link rel="canonical">` del HTML generado y `/sitemap.xml` + `/es/sitemap.xml` no encontró URLs faltantes ni duplicadas: 30 canónicas indexables, 30 entradas de sitemap, todas con barra final y dominio absoluto.

## Cambios evaluados y NO aplicados

| # | URL actual | Propuesta | Motivo | Redirección propuesta (no aplicada) |
|---|---|---|---|---|
| 1 | `/posts/ventajas-website-personal-era-ia/` | `/posts/advantages-personal-website-ai/` | El post está en inglés pero su slug está en español; alinear idioma y slug mejora la claridad para motores generativos. | `'/posts/ventajas-website-personal-era-ia': '/posts/advantages-personal-website-ai'` |
| 2 | `/es/posts/hugo-for-personal-website/` | `/es/posts/ventajas-hugo-sitio-personal/` | El post está en español pero su slug está en inglés. | `'/es/posts/hugo-for-personal-website': '/es/posts/ventajas-hugo-sitio-personal'` |
| 3 | `/es/tags/sitios-est%C3%A1ticos/` | `/es/tags/sitios-estaticos/` | Evitar la codificación porcentual en una URL pública citada por motores de respuesta. | `'/es/tags/sitios-estáticos': '/es/tags/sitios-estaticos'` |
| 4 | `/es/categories/tools/` | `/es/categories/herramientas/` | Categoría en español con nombre inglés; coherencia terminológica con el resto del contenido. | `'/es/categories/tools': '/es/categories/herramientas'` |

Si el usuario aprueba explícitamente alguna de estas propuestas, debe aplicarse en el mismo cambio el `redirect` en `astro.config.mjs`, la actualización del slug en el frontmatter, el canonical, los sitemaps y los cuatro archivos `llms*.txt`, y verificarse que la URL antigua responde con redirección y la nueva con 200.

## Comprobación de que no se aplicaron

- `git diff -- astro.config.mjs` no muestra cambios: no hay redirecciones nuevas.
- Las rutas listadas arriba responden 200 en la previsualización local con la misma barra final.
- Nota de codificación: `curl -sI https://reyespinosa.is-a.dev/robots.txt` confirma que GitHub Pages sirve los `.txt` con `Content-Type: text/plain; charset=utf-8`. El servidor de previsualización de Astro omite el `charset` y por eso muestra los caracteres UTF-8 como `Â·` solo en local; no se añadió un BOM ni se cambió la configuración de Pages.
