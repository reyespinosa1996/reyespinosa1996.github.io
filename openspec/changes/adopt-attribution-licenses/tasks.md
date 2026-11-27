# Tasks

## 1. Licencias y documentación

- [x] 1.1 Crear `LICENSE` en la raíz con el texto completo de MIT License y `Copyright (c) 2026 Reinaldo Espinosa`; verificar que el archivo existe, contiene las cláusulas MIT y el aviso de copyright correcto.
- [x] 1.2 Crear `CONTENT-LICENSE.md` en la raíz con el aviso de CC BY 4.0 que exige crédito a Reinaldo Espinosa, enlace a `https://creativecommons.org/licenses/by/4.0/` e indicar si se hicieron cambios; verificar que aparecen esos tres elementos.
- [x] 1.3 Añadir una sección **Licenses** a `README.md` que distinga MIT para el código y CC BY 4.0 para el contenido, enlace ambos archivos y resuma la atribución requerida; verificar que los enlaces resuelven y que el resto del README permanece igual.
- [x] 1.4 Establecer `"license": "MIT"` en `package.json` y regenerar `package-lock.json` solo si npm lo requiere; verificar con `npm pkg get license` el valor `MIT` y que el diff del lockfile no cambia licencias de dependencias.

## 2. Verificación local y publicación

- [x] 2.1 Ejecutar `npm run check` y `npm run build`; verificar que terminan sin errores, que `dist/CNAME` sigue siendo exactamente `reyespinosa.is-a.dev` y que `git diff` no muestra cambios en `src/**`, `public/**`, `.github/workflows/deploy.yml`, URLs, slugs ni dependencias nuevas.
- [ ] 2.2 Con aprobación explícita del usuario, hacer commit y push a `master`; verificar que `https://raw.githubusercontent.com/reyespinosa1996/reyespinosa1996.github.io/master/LICENSE` devuelve 200 con el texto MIT, que `CONTENT-LICENSE.md` también es accesible y que `curl -I https://reyespinosa.is-a.dev/` devuelve 200.
- [ ] 2.3 Verificar en navegador real que la página pública del repositorio muestra `LICENSE`, que el README muestra la sección **Licenses** y que `https://reyespinosa.is-a.dev/` sigue cargando sin autenticación; guardar capturas o registrar el DOM observado.
- [x] 2.4 Verificar con un escaneo de secretos que los archivos de licencia y el README no incluyen credenciales ni datos privados adicionales, y que solo contienen los avisos legales previstos; documentar el resultado.

## Workflow follow-up

- Archivar el cambio después de la revisión y confirmar que `openspec/specs/repository-licensing/spec.md` queda creado al sincronizar el delta.
