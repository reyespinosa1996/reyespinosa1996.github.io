# Spec Delta

## ADDED Requirements

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
