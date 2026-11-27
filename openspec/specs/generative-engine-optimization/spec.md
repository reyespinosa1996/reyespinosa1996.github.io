# generative-engine-optimization Specification

## Purpose

Define las señales públicas que permiten a motores generativos descubrir, rastrear y citar el contenido bilingüe del sitio con atribución, sin servicios externos ni cambios en las URLs publicadas.

## Requirements

### Requirement: Índice de contenido para motores generativos

El sitio SHALL publicar `llms.txt` y `es/llms.txt` derivados del contenido publicado, con URLs canónicas absolutas, títulos, resúmenes y atribución al autor, excluyendo los drafts.

#### Scenario: Índice en inglés
- **WHEN** se solicita `https://reyespinosa.is-a.dev/llms.txt`
- **THEN** responde 200 con `text/plain; charset=utf-8` y lista los posts publicados en inglés con sus URLs canónicas y el crédito a Reinaldo Espinosa

#### Scenario: Índice en español
- **WHEN** se solicita `https://reyespinosa.is-a.dev/es/llms.txt`
- **THEN** responde 200 con los posts publicados en español y sus URLs canónicas bajo `/es/`

#### Scenario: Entradas completas y absolutas
- **WHEN** se inspecciona una entrada del índice
- **THEN** incluye título, resumen tomado de `description` o del título, y una URL absoluta con el dominio de producción, sin `localhost` ni rutas relativas

#### Scenario: Exclusión de borradores
- **WHEN** un post tiene `draft: true`
- **THEN** no aparece en `llms.txt` ni en `es/llms.txt`

### Requirement: Texto completo para citas

El sitio SHALL publicar `llms-full.txt` y `es/llms-full.txt` con el cuerpo de los contenidos publicados en texto plano, conservando encabezados, enlaces y atribución, sin incluir drafts.

#### Scenario: Texto completo en inglés
- **WHEN** se solicita `/llms-full.txt`
- **THEN** responde 200 con el texto de los posts publicados en inglés, separados por título y URL canónica

#### Scenario: Texto completo en español
- **WHEN** se solicita `/es/llms-full.txt`
- **THEN** responde 200 con el texto de los posts publicados en español y sus URLs bajo `/es/`

#### Scenario: Fidelidad del contenido
- **WHEN** se compara un post en `llms-full.txt` con su Markdown original publicado
- **THEN** conserva párrafos, listas, enlaces y bloques de código sin truncarlos

#### Scenario: Borrador excluido del texto completo
- **WHEN** un post tiene `draft: true`
- **THEN** no aparece en `llms-full.txt` ni en `es/llms-full.txt`

### Requirement: Política de rastreo para crawlers de IA

El archivo `robots.txt` SHALL permitir explícitamente el rastreo del sitio público por crawlers de IA conocidos y SHALL excluir las zonas no indexables, manteniendo la directiva `Sitemap` existente.

#### Scenario: Crawlers de IA permitidos
- **WHEN** se solicita `/robots.txt`
- **THEN** incluye directivas `Allow: /` para GPTBot, ClaudeBot, PerplexityBot, Google-Extended y CCBot, además de `Sitemap: https://reyespinosa.is-a.dev/sitemap.xml`

#### Scenario: Zonas excluidas
- **WHEN** se inspecciona la política de rastreo
- **THEN** `/admin/` y los archivos `index.json` quedan excluidos mediante `Disallow`

#### Scenario: Rastreo general intacto
- **WHEN** un crawler estándar distinto de los anteriores solicita una página pública
- **THEN** la política no bloquea el acceso a las rutas públicas del sitio

### Requirement: Atribución en las señales para motores

Cada archivo generado para motores SHALL identificar al autor, el sitio y la licencia CC BY 4.0 del contenido, y SHALL NO incluir secretos ni rutas internas.

#### Scenario: Encabezado de atribución
- **WHEN** se lee el encabezado de `llms.txt` o `llms-full.txt`
- **THEN** nombra a Reinaldo Espinosa, enlaza `https://reyespinosa.is-a.dev/` e indica CC BY 4.0 con enlace a `https://creativecommons.org/licenses/by/4.0/`

#### Scenario: Uso conforme de un fragmento
- **WHEN** un motor cita un fragmento obtenido de estos archivos
- **THEN** la atribución puede incluir autor, URL canónica, enlace a la licencia e indicación de cambios

#### Scenario: Sin secretos ni rutas locales
- **WHEN** se inspeccionan los archivos generados
- **THEN** no contienen tokens, claves, rutas de `src/` ni rutas absolutas del entorno de desarrollo

### Requirement: Estabilidad de URLs durante la optimización

La optimización SHALL NO cambiar URLs públicas, slugs ni estructuras de rutas; cualquier cambio propuesto SHALL documentarse y SHALL requerir confirmación explícita antes de aplicarse.

#### Scenario: URLs tras la publicación
- **WHEN** se publica este cambio y se solicitan las rutas existentes
- **THEN** responden 200 con los mismos slugs y barras finales que antes del cambio

#### Scenario: Propuesta de cambio de slug
- **WHEN** la auditoría sugiere modificar un slug o una ruta
- **THEN** se documenta junto con su mapa de redirecciones y no se aplica sin aprobación explícita del usuario

#### Scenario: Cambio aprobado
- **WHEN** el usuario aprueba expresamente un cambio de URL
- **THEN** se aplican las redirecciones y se actualizan canonical, sitemap y archivos llms en el mismo cambio
