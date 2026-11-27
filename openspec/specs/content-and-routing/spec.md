# content-and-routing Specification

## Purpose

Definir el contenido bilingüe del sitio, las URLs públicas que deben preservarse y las capacidades de presentación, navegación, sindicación, SEO y búsqueda que el sitio Astro debe ofrecer tras la migración.

## Requirements

### Requirement: Contenido bilingüe completo

El sitio SHALL publicar todo el contenido actual en inglés y español: dos posts por idioma, una página About por idioma y las páginas de listado correspondientes, sin pérdida de texto ni metadatos.

#### Scenario: Inventario de contenido
- **WHEN** se ejecuta el build
- **THEN** existen las páginas de los posts `hugo-for-personal-website` y `ventajas-website-personal-era-ia` en inglés y español, y las páginas `/about/` y `/es/about/`

#### Scenario: Contenido no truncado
- **WHEN** se compara el cuerpo renderizado de cada post con el Markdown original
- **THEN** todos los párrafos, listas, enlaces, imágenes y bloques de código del original están presentes

### Requirement: Preservación de URLs canónicas

El sitio SHALL conservar las URLs públicas actuales, con inglés en la raíz y español bajo `/es/`, incluyendo la barra final y los slugs existentes.

#### Scenario: URLs en inglés
- **WHEN** se solicitan `/`, `/about/`, `/posts/`, `/posts/hugo-for-personal-website/`, `/posts/ventajas-website-personal-era-ia/`, `/tags/` y `/categories/`
- **THEN** todas responden 200 con el contenido correspondiente

#### Scenario: URLs en español
- **WHEN** se solicitan `/es/`, `/es/about/`, `/es/posts/`, `/es/posts/hugo-for-personal-website/`, `/es/posts/ventajas-website-personal-era-ia/`, `/es/tags/` y `/es/categories/`
- **THEN** todas responden 200 con el contenido en español

#### Scenario: Slugs sin sufijo de idioma
- **WHEN** se publica un archivo cuyo nombre original era `hugo-for-personal-website.es.md`
- **THEN** la URL resultante es `/es/posts/hugo-for-personal-website/` y no incluye `.es` en el slug

### Requirement: Modelo de contenido validado

Cada entrada de contenido SHALL declarar `title`, `date`, `lang` y `translationKey`, y SHALL validarse contra un esquema en build; el frontmatter SHALL normalizarse a YAML.

#### Scenario: Frontmatter válido
- **WHEN** un post declara título, fecha, idioma, translationKey, tags y categorías
- **THEN** el build lo publica y lo incluye en las colecciones correspondientes

#### Scenario: Frontmatter inválido
- **WHEN** un post omite `title`, `date`, `lang` o `translationKey`, o usa un tipo incorrecto
- **THEN** `astro check` o el build falla con un mensaje que identifica el archivo y el campo

#### Scenario: Frontmatter TOML migrado
- **WHEN** se migra un archivo con frontmatter delimitado por `+++`
- **THEN** el archivo resultante usa YAML delimitado por `---` y conserva todos sus valores

### Requirement: Render de posts

Cada post SHALL mostrar título, fecha, cuerpo Markdown, tags, categorías, portada cuando exista, tiempo de lectura y tabla de contenidos cuando el post la habilite.

#### Scenario: Post con portada y TOC
- **WHEN** se visita un post con `cover` y `ShowToc: true`
- **THEN** se muestran la imagen de portada con su texto alternativo, el tiempo de lectura y una tabla de contenidos con enlaces a los encabezados

#### Scenario: Post sin portada
- **WHEN** se visita un post sin `cover`
- **THEN** la página renderiza sin imagen de portada y sin errores de layout

#### Scenario: Código y enlaces
- **WHEN** el Markdown contiene bloques de código, tablas GFM o enlaces externos
- **THEN** se renderizan con resaltado de sintaxis, tablas válidas y enlaces navegables

### Requirement: Páginas About

El sitio SHALL publicar `/about/` y `/es/about/` con el contenido completo de las páginas actuales y el mismo título visible en cada idioma.

#### Scenario: About en inglés
- **WHEN** se solicita `/about/`
- **THEN** se muestra el título "About me" y el contenido en inglés

#### Scenario: About en español
- **WHEN** se solicita `/es/about/`
- **THEN** se muestra el título "Sobre mi" y el contenido en español

### Requirement: Selector de idioma

Cada página SHALL ofrecer un enlace al equivalente en el otro idioma cuando exista una traducción con el mismo `translationKey`; si no existe, SHALL enlazar al inicio del otro idioma.

#### Scenario: Traducción existente
- **WHEN** un visitante está en `/posts/hugo-for-personal-website/` y activa el selector de idioma
- **THEN** navega a `/es/posts/hugo-for-personal-website/`

#### Scenario: Traducción inexistente
- **WHEN** una página no tiene equivalente en el otro idioma
- **THEN** el selector enlaza a `/` o `/es/` según corresponda, sin generar un enlace 404

### Requirement: Páginas de taxonomía

El sitio SHALL generar índices y páginas de término para tags y categorías en ambos idiomas, con enlaces a los posts asociados.

#### Scenario: Índice de tags
- **WHEN** se solicita `/tags/` o `/es/tags/`
- **THEN** se listan todos los tags usados en ese idioma con enlaces a sus páginas de término

#### Scenario: Término de tag
- **WHEN** se solicita `/tags/hugo/` o `/es/tags/hugo/`
- **THEN** se listan los posts de ese idioma que tienen el tag `hugo`

#### Scenario: Categorías
- **WHEN** se solicita `/categories/ai/` o `/es/categories/ia/`
- **THEN** se listan los posts de ese idioma asociados a la categoría correspondiente

### Requirement: Feeds RSS

El sitio SHALL publicar feeds RSS válidos en las URLs actuales, con enlaces absolutos al dominio de producción y el contenido del idioma correspondiente.

#### Scenario: Feeds principales
- **WHEN** se solicitan `/index.xml`, `/posts/index.xml`, `/es/index.xml` y `/es/posts/index.xml`
- **THEN** cada uno responde con XML válido, `Content-Type` de RSS/XML y los posts de su idioma ordenados por fecha descendente

#### Scenario: Feeds de taxonomía
- **WHEN** se solicita el feed de un tag o categoría existente
- **THEN** responde con XML válido que incluye solo los posts de ese término e idioma

#### Scenario: Enlaces absolutos
- **WHEN** se inspecciona un feed
- **THEN** los `link` y `guid` usan `https://reyespinosa.is-a.dev/...` y no `localhost` ni rutas relativas

### Requirement: Sitemap

El sitio SHALL publicar `/sitemap.xml` y `/es/sitemap.xml` con URLs absolutas de todas las páginas publicables y alternates `hreflang` cuando exista traducción.

#### Scenario: Sitemap global
- **WHEN** se solicita `/sitemap.xml`
- **THEN** responde con XML válido que incluye las páginas en inglés y español, sin drafts ni páginas de error

#### Scenario: Sitemap español
- **WHEN** se solicita `/es/sitemap.xml`
- **THEN** responde con XML válido que incluye las páginas en español y sus alternates en inglés

#### Scenario: Alternates de idioma
- **WHEN** una página tiene traducción
- **THEN** el sitemap incluye enlaces `hreflang="en"` y `hreflang="es"` hacia las dos versiones

### Requirement: Metadatos SEO y sociales

Cada página SHALL incluir título, descripción, canonical, alternates `hreflang`, Open Graph, Twitter Cards y datos estructurados JSON-LD apropiados para el tipo de página.

#### Scenario: Página de post
- **WHEN** se inspecciona el `<head>` de un post
- **THEN** incluye `canonical`, `og:title`, `og:description`, `og:image` cuando hay portada, `twitter:card` y JSON-LD de tipo `BlogPosting`

#### Scenario: Página principal
- **WHEN** se inspecciona el `<head>` de `/` o `/es/`
- **THEN** incluye canonical, descripción del sitio y JSON-LD de tipo `WebSite`

#### Scenario: Alternates
- **WHEN** una página tiene traducción
- **THEN** el `<head>` incluye `link rel="alternate" hreflang="en"` y `hreflang="es"` con las URLs correctas

### Requirement: Búsqueda client-side

El sitio SHALL ofrecer búsqueda en `/search/` y `/es/search/`, usando un índice JSON generado en build y filtrado en el navegador, sin backend.

#### Scenario: Búsqueda con resultados
- **WHEN** un visitante escribe un término que coincide con el título, contenido o tags de un post de su idioma
- **THEN** se muestran los resultados con título, resumen y enlace al post

#### Scenario: Búsqueda sin resultados
- **WHEN** el término no coincide con ningún contenido
- **THEN** se muestra un mensaje de "sin resultados" sin errores de JavaScript

#### Scenario: Índice por idioma
- **WHEN** se solicita el índice de búsqueda de un idioma
- **THEN** contiene solo posts publicados de ese idioma y no incluye drafts

### Requirement: Página 404

El sitio SHALL publicar una página 404 en `/404.html` y otra en `/es/404.html`, con navegación de regreso al inicio y al listado de posts del idioma correspondiente.

#### Scenario: Ruta inexistente en inglés
- **WHEN** se solicita una URL inexistente en la raíz
- **THEN** GitHub Pages sirve `/404.html` con enlaces a `/` y `/posts/`

#### Scenario: Ruta inexistente en español
- **WHEN** se solicita una URL inexistente bajo `/es/`
- **THEN** existe `/es/404.html` con enlaces a `/es/` y `/es/posts/`

### Requirement: Analítica Umami

Todas las páginas SHALL cargar el script de Umami configurado actualmente, una sola vez por página, sin bloquear el renderizado.

#### Scenario: Script presente
- **WHEN** se inspecciona el HTML de cualquier página publicada
- **THEN** incluye un `<script defer>` con `src="https://cloud.umami.is/script.js"` y `data-website-id="e85cd115-0d87-4f9c-a426-0f53d611e355"`

#### Scenario: Sin duplicados
- **WHEN** se carga una página
- **THEN** el script de Umami aparece exactamente una vez, incluso si la página usa un layout anidado

### Requirement: Tema claro y oscuro

El sitio SHALL ofrecer un selector de tema claro/oscuro/automático que persista la preferencia del visitante y evite un destello de tema incorrecto al cargar.

#### Scenario: Cambio de tema
- **WHEN** el visitante alterna el tema
- **THEN** la página cambia de apariencia de inmediato y la preferencia se conserva al navegar o recargar

#### Scenario: Preferencia del sistema
- **WHEN** el visitante no ha elegido un tema y su sistema usa modo oscuro
- **THEN** el sitio se muestra en modo oscuro sin un flash de fondo claro

### Requirement: Integridad de enlaces y assets

El sitio SHALL servir todos los assets referenciados y SHALL evitar enlaces internos rotos en el contenido y la navegación.

#### Scenario: Assets existentes
- **WHEN** se ejecuta un link checker sobre `dist/`
- **THEN** no hay respuestas 404 para CSS, JavaScript, imágenes, favicons ni fuentes referenciadas

#### Scenario: Enlaces internos
- **WHEN** se ejecuta un link checker sobre `dist/`
- **THEN** todos los enlaces internos apuntan a páginas o archivos existentes

### Requirement: Compatibilidad con URLs legacy

Las URLs de paginación y prefijos generados por Hugo que ya no sean canónicas SHALL redirigir a la página equivalente, en lugar de devolver 404.

#### Scenario: Paginación legacy
- **WHEN** se solicitan `/page/1/`, `/posts/page/1/`, `/tags/<tag>/page/1/` o `/categories/<category>/page/1/`
- **THEN** se redirige a `/`, `/posts/`, `/tags/<tag>/` o `/categories/<category>/` respectivamente

#### Scenario: Prefijo inglés legacy
- **WHEN** se solicita una URL bajo `/en/` que tenga equivalente canónico en la raíz
- **THEN** se redirige a la URL sin prefijo `/en/`

### Requirement: Exclusión de drafts

Los posts con `draft: true` SHALL NOT publicarse ni aparecer en listados, feeds, sitemap o índices de búsqueda.

#### Scenario: Draft en desarrollo
- **WHEN** se ejecuta el servidor de desarrollo con un post en draft
- **THEN** el post puede previsualizarse localmente si la configuración lo permite

#### Scenario: Draft en producción
- **WHEN** se ejecuta `npm run build`
- **THEN** el post en draft no genera página ni aparece en feeds, sitemap o búsqueda

### Requirement: Metadatos indexables completos

Cada página pública indexable SHALL exponer título y descripción únicos y no vacíos, canonical absoluto, alternates de idioma y una directiva `robots` acorde a su tipo.

#### Scenario: Página con metadatos propios
- **WHEN** se inspecciona el `<head>` de una página pública indexable
- **THEN** el `<title>` y la `meta description` contienen texto específico de esa página y no textos genéricos de plantilla

#### Scenario: Índices y taxonomías sin descripción en frontmatter
- **WHEN** una página de índice o taxonomía no define `description` en el contenido
- **THEN** el layout genera una descripción derivada del idioma y del conjunto de contenido, nunca una cadena vacía

#### Scenario: Páginas de utilidad
- **WHEN** se inspeccionan `/search/` y `/es/search/`
- **THEN** declaran `noindex` por ser páginas de búsqueda sin contenido indexable propio

### Requirement: Metadatos de imagen y fecha para redes

Cuando una página tenga portada, SHALL publicar `og:image:alt` y dimensiones declaradas; los posts SHALL publicar `article:published_time` y `article:modified_time` en formato ISO 8601.

#### Scenario: Post con portada
- **WHEN** un post define `cover` con imagen y texto alternativo
- **THEN** el `<head>` incluye `og:image`, `og:image:alt` con ese texto y `og:image:width` y `og:image:height` cuando las dimensiones sean conocidas

#### Scenario: Fechas del post
- **WHEN** se inspecciona el `<head>` de un post publicado
- **THEN** `article:published_time` y `article:modified_time` usan fechas ISO 8601 derivadas del frontmatter

#### Scenario: Post sin portada
- **WHEN** un post no define `cover`
- **THEN** no se emiten etiquetas `og:image` vacías ni URLs de imagen relativas

### Requirement: Datos estructurados ampliados

El sitio SHALL ampliar el JSON-LD existente con identidad de autor, migas de pan, listas de índice y palabras clave, conservando los tipos `WebSite` y `BlogPosting` actuales.

#### Scenario: Autor y palabras clave en un post
- **WHEN** se inspecciona el JSON-LD de un post
- **THEN** `author` es un `Person` con nombre Reinaldo Espinosa y `sameAs` con GitHub y LinkedIn, y `keywords` contiene sus tags y categorías

#### Scenario: Migas de pan
- **WHEN** se inspecciona el JSON-LD de un post o de una página de taxonomía
- **THEN** existe un `BreadcrumbList` con la ruta desde el inicio del idioma hasta la página actual

#### Scenario: Lista en índices
- **WHEN** se inspecciona el JSON-LD de un índice de posts o taxonomías
- **THEN** existe un `ItemList` con los elementos publicados de ese idioma

#### Scenario: JSON-LD limpio
- **WHEN** se serializa el JSON-LD de cualquier página
- **THEN** no aparecen campos con `undefined`, `null` ni URLs relativas

### Requirement: Coherencia entre canonical, sitemap y páginas indexables

Toda URL canónica indexada SHALL aparecer en el sitemap de su idioma, y el sitemap SHALL excluir drafts, páginas con `noindex` y zonas no indexables.

#### Scenario: Canonical y sitemap coinciden
- **WHEN** se comparan los `<link rel="canonical">` con `/sitemap.xml` y `/es/sitemap.xml`
- **THEN** cada URL canónica indexable aparece exactamente una vez, con barra final y dominio absoluto

#### Scenario: Drafts fuera del sitemap
- **WHEN** un post tiene `draft: true`
- **THEN** no genera canonical público ni aparece en el sitemap ni en los índices para motores

#### Scenario: Páginas no indexables fuera del sitemap
- **WHEN** una ruta declara `noindex` o está bajo `/admin/`
- **THEN** no se incluye en `/sitemap.xml` ni en `/es/sitemap.xml`
