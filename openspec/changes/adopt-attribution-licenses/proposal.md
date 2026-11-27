# Proposal

## Why

Tras revisar alternativas, el autor decidió permitir el uso del código y del contenido del sitio. La propuesta anterior de una licencia propietaria de solo lectura ya no refleja esa intención, así que hace falta sustituirla por licencias establecidas: MIT para el código y Creative Commons Attribution 4.0 para el contenido, con atribución obligatoria en este último caso.

## What Changes

- Aplicar **MIT License** al código fuente del proyecto y publicar el texto completo en `LICENSE`, con `Copyright (c) 2026 Reinaldo Espinosa`.
- Aplicar **CC BY 4.0** al contenido (`src/content/**` y los artículos/páginas publicados) y publicar el aviso en `CONTENT-LICENSE.md`, indicando que requiere crédito al autor, enlace a la licencia y señalar si se hicieron cambios.
- Añadir una sección **Licenses** en `README.md` que distinga ambos ámbitos y resuma las obligaciones de atribución.
- Declarar `"license": "MIT"` en `package.json` y mantener `package-lock.json` coherente.
- Mantener el repositorio y el sitio públicos, sin cambios en GitHub Pages, DNS, `CNAME`, URLs públicas ni dependencias nuevas. Las dependencias externas conservan sus propias licencias.

## Capabilities

### New Capabilities

- `repository-licensing`: condiciones de uso del código y del contenido del repositorio, con MIT para el código y CC BY 4.0 con atribución para el contenido.

### Modified Capabilities

- (ninguna)

## Impact

- Archivos nuevos: `LICENSE` y `CONTENT-LICENSE.md` en la raíz.
- Archivos modificados: `README.md`, `package.json` y, si procede, `package-lock.json`.
- Sin cambios en `src/**`, `public/**`, `.github/workflows/deploy.yml`, `public/CNAME`, DNS, dominio, URLs públicas, slugs ni dependencias npm nuevas.
- Las licencias de dependencias externas no se modifican.
