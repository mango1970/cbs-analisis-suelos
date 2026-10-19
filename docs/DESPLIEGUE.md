# Despliegue

## Entorno de producción

- **Repositorio:** `https://github.com/mango1970/cbs-analisis-suelos`
- **URL pública:** `https://mango1970.github.io/cbs-analisis-suelos/`
- **Rama:** `master`
- **Hosting:** GitHub Pages, desplegado con **GitHub Actions**.

## Workflow

Archivo: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

- Se dispara en cada `push` a `master` (y manualmente con `workflow_dispatch`).
- Usa `actions/configure-pages`, `actions/upload-pages-artifact` y `actions/deploy-pages`.
- Publica la raíz del repositorio como sitio estático.

> La fuente de Pages está configurada como **GitHub Actions** (`build_type: workflow`), no como build "legacy" de rama.

## Rutas relativas (importante)

GitHub Pages sirve el proyecto bajo el subpath `/cbs-analisis-suelos/`. Por eso **todas** las rutas internas son **relativas** (sin `/` inicial):

- `index.html`: `manifest.json`, `icon.svg`, `services/*.js`, `app.js`, `sw.js`.
- `manifest.json`: `start_url: "./"` e iconos relativos.
- `sw.js`: lista `LOCAL` con `./...`.

Si se usaran rutas absolutas (`/app.js`), apuntarían a la raíz del dominio y romperían la carga.

## Publicar un cambio

1. Editar los archivos necesarios.
2. **Invalidar caché** (muy importante por el service worker):
   - Subir `CACHE` en [`sw.js`](../sw.js) (ej. `cbs-v15` → `cbs-v16`).
   - Subir el parámetro de versión de los scripts en `index.html` (`?v=12` → `?v=13`) para `app.js` y `services/*`.
   - Si cambian iconos, subir también el `?v=` de favicon/manifest y regenerar los PNG desde `icon.svg`.
3. Commit y push:
   ```bash
   git add -A
   git commit -m "descripcion del cambio"
   git push
   ```
4. El workflow de Actions despliega automáticamente (~20–60 s).
5. Verificar:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://mango1970.github.io/cbs-analisis-suelos/
   curl -s https://mango1970.github.io/cbs-analisis-suelos/index.html | grep "app.js?v="
   ```

## Configuración de Supabase para producción

En **Auth → URL Configuration**:

- **Site URL:** `https://mango1970.github.io/cbs-analisis-suelos/`
- **Redirect URLs:** agregar la misma URL (y `/**` si se usan rutas).

Sin esto, el enlace de recuperación de contraseña no vuelve correctamente a la app.

## IA (Gemini) — Edge Function

La Fase 1 usa una **Edge Function** `analizar-esfera` como proxy seguro hacia Google Gemini.

1. **API key de Google:** crear en https://aistudio.google.com
2. **Desplegar la función:** Supabase → **Edge Functions → Deploy a new function → Via editor** → nombre exacto **`analizar-esfera`** → pegar [`supabase/functions/analizar-esfera/index.ts`](../supabase/functions/analizar-esfera/index.ts) → **Deploy**.
3. **Secrets** (Edge Functions → Secrets):
   - `GEMINI_API_KEY` = tu API key
   - `GEMINI_MODEL` = *(opcional)* `gemini-2.5-flash`
4. Probar desde la app: en una esfera con foto, pulsar **"Analizar con IA"**.

> Detalle completo en [`supabase/functions/analizar-esfera/README.md`](../supabase/functions/analizar-esfera/README.md).
> La clave de Google **no** se guarda en el cliente ni en el repo.

## Actualización en dispositivos (PWA)

- El service worker se actualiza al abrir la app; puede requerir **cerrar y reabrir** dos veces.
- En caso de caché terco: recargar forzado, limpiar datos del sitio, o abrir en incógnito.
- El ícono instalado en la pantalla de inicio puede tardar en actualizar; reinstalar la PWA si es necesario.

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| 404 al cargar recursos | Ruta absoluta | Usar rutas relativas |
| Cambios no aparecen | Caché del service worker | Subir `CACHE` y `?v=`, reabrir |
| Favicon viejo | Caché de favicon del navegador | Subir `?v=`, recarga forzada/incógnito |
| Enlace de recuperación no abre la app | Redirect URL no configurada | Agregar URL en Supabase |
| Workflow en cola mucho tiempo | Incidencia de GitHub | Revisar `githubstatus.com` |
