# Spec Delta

## Purpose

Define las condiciones de uso del código y del contenido del repositorio, con MIT para el software y CC BY 4.0 con atribución para los artículos y páginas publicados.

## ADDED Requirements

### Requirement: Código bajo licencia MIT

El proyecto SHALL publicar el código fuente bajo MIT License e SHALL incluir el texto completo de la licencia con el titular y el año.

#### Scenario: Consulta de la licencia del código
- **WHEN** una persona abre el archivo `LICENSE` del repositorio
- **THEN** encuentra el texto de MIT License con `Copyright (c) 2026 Reinaldo Espinosa`

#### Scenario: Reutilización del código
- **WHEN** una persona copia, modifica o redistribuye el código conservando el aviso de copyright y la licencia
- **THEN** ese uso está permitido por MIT License

### Requirement: Contenido bajo CC BY 4.0 con atribución

El proyecto SHALL publicar los artículos y páginas bajo Creative Commons Attribution 4.0 International, que exige crédito al autor, enlace a la licencia e indicar si se realizaron cambios.

#### Scenario: Reutilización conforme del contenido
- **WHEN** una persona reutiliza un artículo o una página indicando el crédito a Reinaldo Espinosa, enlazando `https://creativecommons.org/licenses/by/4.0/` y señalando los cambios
- **THEN** ese uso está permitido por CC BY 4.0, incluso con fines comerciales

#### Scenario: Reutilización sin atribución
- **WHEN** una persona reutiliza el contenido sin dar crédito, sin enlazar la licencia o sin indicar los cambios
- **THEN** ese uso no cumple las condiciones de CC BY 4.0

### Requirement: Distinción clara de ámbitos

El proyecto SHALL documentar qué licencia se aplica al código y cuál al contenido, para que un visitante pueda identificar las obligaciones de cada uno.

#### Scenario: Consulta desde el README
- **WHEN** una persona abre `README.md`
- **THEN** encuentra una sección que distingue MIT para el código y CC BY 4.0 para el contenido

#### Scenario: Consulta desde el repositorio
- **WHEN** una persona abre la página pública del repositorio
- **THEN** encuentra los archivos de licencia que corresponden a ambos ámbitos

### Requirement: Exclusión de dependencias de terceros

Las licencias del proyecto SHALL aplicarse únicamente al código y al contenido originales, y SHALL NO sustituir ni modificar las licencias de dependencias externas.

#### Scenario: Revisión de dependencias
- **WHEN** se revisa una dependencia instalada con licencia propia
- **THEN** sigue rigiéndose por su licencia original y no por MIT ni CC BY 4.0 del proyecto

### Requirement: Publicación sin cambios técnicos

La adopción de licencias SHALL NO introducir autenticación, restricciones de acceso, cambios de URL ni modificaciones en la publicación del sitio.

#### Scenario: Repositorio y sitio después del cambio
- **WHEN** se publican las licencias y se visita el repositorio y `https://reyespinosa.is-a.dev/`
- **THEN** ambos siguen siendo públicos y accesibles sin iniciar sesión

#### Scenario: Naturaleza de los avisos
- **WHEN** se interpretan los archivos de licencia
- **THEN** se entiende que establecen condiciones legales de uso y no mecanismos técnicos de control
