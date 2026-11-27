# Design

## Context

Ver `proposal.md` y `specs/repository-licensing/spec.md`. El repositorio es público, no hay archivos de licencia y `package.json` no declara licencia. El usuario decidió permitir el uso del código y del contenido, con atribución obligatoria solo para el contenido. Las licencias deben ser estándar y no introducir servicios ni cambios de infraestructura.

## Goals / Non-Goals

**Goals:**

- Publicar MIT para el código y CC BY 4.0 para el contenido con avisos localizables desde el repositorio.
- Dejar claro qué licencia aplica a cada ámbito y qué obligaciones tiene quien reutiliza el contenido.
- Declarar la licencia del paquete como MIT y mantener los metadatos coherentes.
- Mantener el sitio y el repositorio públicos y sin cambios de despliegue.

**Non-Goals:**

- Añadir autenticación, DRM, ofuscación ni restricciones técnicas de acceso.
- Cambiar licencias de dependencias de terceros ni añadir dependencias nuevas.
- Modificar `src/**`, `public/**`, `.github/workflows/deploy.yml`, Pages, DNS, `CNAME`, URLs ni slugs.
- Mantener la licencia propietaria de solo lectura del plan anterior.

## Decisions

1. **Doble licencia con dos archivos en la raíz.** `LICENSE` contiene el texto completo de MIT License con `Copyright (c) 2026 Reinaldo Espinosa`, y `CONTENT-LICENSE.md` contiene el aviso de CC BY 4.0 con el crédito exigido, el enlace a `https://creativecommons.org/licenses/by/4.0/` y la instrucción de indicar cambios. Se descartó una sola licencia MIT para todo porque no exigiría atribución por el contenido; una sola CC BY 4.0 para todo porque Creative Commons la desaconseja para software; y el texto propietario anterior porque el usuario lo rechazó.

2. **`LICENSE` = MIT para que GitHub detecte la licencia del código.** Un archivo índice sin texto estándar evitaría que GitHub mostrara MIT en el repositorio. El riesgo de que se interprete que todo el repo es MIT se corrige con `CONTENT-LICENSE.md` y la sección del README.

3. **`CONTENT-LICENSE.md` usa el aviso canónico de CC BY 4.0 en lugar de copiar todo el código legal.** El texto legal completo está en la URL oficial y CC permite enlazarlo. El aviso local indica de forma explícita: crédito a Reinaldo Espinosa, enlace a la licencia y señalar si se modificó el material.

4. **README como índice de licencias.** Se añade una sección **Licenses** que separa código y contenido, enlaza ambos archivos y resume que CC BY 4.0 permite uso comercial siempre que haya atribución. No se toca el footer del sitio para evitar cambios en `src/**`.

5. **`"license": "MIT"` en `package.json`.** Corresponde al código publicado como paquete. `package-lock.json` solo se regenera si npm lo actualiza; no se editan licencias de dependencias a mano.

6. **Sin medidas técnicas ni cambios de infraestructura.** GitHub seguirá permitiendo ver, clonar y hacer fork; las licencias son condiciones legales de uso, no controles de acceso.

## Risks / Trade-offs

- **[GitHub muestra MIT para todo el repositorio]** → `CONTENT-LICENSE.md` y el README aclaran que el contenido es CC BY 4.0.
- **[La atribución no se aplica automáticamente]** → se documenta como obligación legal de quien reutiliza; no se promete verificación técnica.
- **[CC BY 4.0 permite uso comercial]** → es la decisión del usuario; se explica en el README para evitar ambigüedad.
- **[Confusión con dependencias]** → ambos archivos excluyen expresamente las licencias de terceros.
- **[Metadatos desincronizados]** → tras editar `package.json` se comprueba `npm pkg get license` y el diff del lockfile.
- **[Archivos en la raíz fuera de la lista habitual de `AGENTS.md`]** → la solicitud explícita del usuario autoriza `LICENSE` y `CONTENT-LICENSE.md`; no se crean otros archivos en la raíz.

## Migration Plan

1. Crear `LICENSE` y `CONTENT-LICENSE.md`; añadir la sección **Licenses** en `README.md`; actualizar `package.json`.
2. Regenerar `package-lock.json` solo si npm lo requiere; ejecutar `npm run check` y `npm run build`.
3. Verificar que ambos archivos están versionados, que el README enlaza cada licencia, que `npm pkg get license` devuelve `MIT`, que no hay cambios en Pages/DNS/CNAME/URLs ni dependencias nuevas, y que el sitio sigue respondiendo en `https://reyespinosa.is-a.dev/`.
4. Publicar en `master` solo con aprobación explícita. Rollback: revertir el commit; no requiere cambios de infraestructura.
