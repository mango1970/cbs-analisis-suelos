# Arquitectura

## Visión general

CBS Evaluador es una **PWA estática** sin build step. Todo el cliente es HTML + JavaScript vanilla. La app funciona 100% offline para captura y guarda localmente; cuando hay red, sincroniza con Supabase en segundo plano.

```
┌──────────────────────────────────────────────────────────────┐
│                        index.html (UI)                        │
│  Pantallas .scr: login, inicio, sitio, fotos, esferas,        │
│  resumen, historial, recuperación de contraseña               │
└───────────────┬──────────────────────────────────────────────┘
                │ onclick / funciones globales
┌───────────────▼──────────────────────────────────────────────┐
│                          app.js                               │
│  Estado (St), esferas (SP), navegación (nav), auth UI,        │
│  fotos, análisis heurístico, valoración, radar, historial     │
└───────┬─────────────────────────────────────┬────────────────┘
        │                                     │
┌───────▼───────────────────────┐   ┌─────────▼─────────────────┐
│ services/storage.service.js   │   │ services/localdb.service  │
│  (abstracción de storage)     │   │  IndexedDB (offline)      │
└───────┬───────────────────────┘   └───────────────────────────┘
        │ _provider
┌───────▼───────────────────────┐
│ services/supabase.provider.js │──────► Supabase
│  Auth + Storage + Postgres    │        (Auth, Storage, REST)
└───────────────────────────────┘
```

## Capa de servicios

La app **nunca** llama a Supabase directamente: siempre pasa por `StorageService`.

- **`services/storage.service.js`** — interfaz única. El proveedor concreto se inyecta con `setProvider()`. Expone: `upload`, `saveEval`, auth (`getUser`, `signUp`, `signIn`, `signOut`, `resetPassword`, `updatePassword`, `onAuthStateChange`).
- **`services/supabase.provider.js`** — implementación real con `@supabase/supabase-js@2`. Se inicializa si `SUPABASE_ENABLED === true` y las credenciales son válidas.
- **`services/localdb.service.js`** — almacenamiento offline con IndexedDB (`evals`, `history`, `consensus`). Incluye migración desde `localStorage` y solicita almacenamiento persistente.

Esta separación permite cambiar de proveedor (por ejemplo, otro backend) tocando solo `supabase.provider.js`.

## Estado y navegación

- **`St`** (en `app.js`) contiene el estado en memoria: `site` (datos del sitio + GPS), `photos` (sitio y esferas), `ratings`, `notes`, `checks`, `wormCount`, `imgA` (análisis de imagen) y `evals`.
- **`SP`** define las 5 esferas con su procedimiento, criterios y niveles (ver [`METODOLOGIA_CERES.md`](METODOLOGIA_CERES.md)).
- **`nav(n)`** muestra una pantalla y dispara el render correspondiente:
  - `0` inicio · `1` datos del sitio · `2` fotos · `3–7` las 5 esferas · `8` resumen · `9` historial.
- La barra de progreso (`updProg`) reconstruye los puntos de avance y bloquea el salto al resumen si falta valorar alguna esfera.

## Flujo de una evaluación individual

1. **Login** (`handleAuth`) → `CURRENT_USER {id,email}`.
2. **Datos del sitio** (`saveSite`) + GPS opcional (`captureGeo`).
3. **Fotos del sitio** (`mkPhotoGallery` / `addPhoto`) — cenital y lateral, hasta 3 c/u.
4. **Por esfera** (`renderSphere`):
   - Foto (`photoTaken`) → análisis heurístico opcional (`runAnalysis` → `analyzeImage`).
   - Checklist (`togCheck`) → sugerencia (`calcCheckSug`).
   - Sugerencia combinada foto + checklist (`combinedSug`).
   - Lombrices (`adjWorm` → `wormCalc`) en la Drilosfera.
   - Valoración manual (`setR`).
5. **Finalizar** (`finishEval`) → arma el objeto `ev`, lo guarda en el historial y en IndexedDB, y lanza la subida en segundo plano (`uploadEvalToCloud`).
6. **Resumen** (`renderSummary`) → radar (`drawRadar`) + fotos + valoraciones.
7. **Historial** (`renderHistory`) → ver, exportar JSON (`exportEval`) o eliminar todo (`resetAll`).

## Sincronización

`uploadEvalToCloud(ev, evalId)`:

1. Recorre `ev.photos`; por cada foto redimensiona (`resizeImage` a máx. 1200 px, JPEG 0.8) y sube al bucket `fotos` con ruta `evals/{evalId}/{site|spheres}/{clave}_{i}`.
2. Construye un documento `cloudDoc` con `site`, `photoRefs` (solo rutas relativas, nunca dataURLs), `ratings`, `notes`, `checks`, `wormCount`, `ts` y `user_id`.
3. `StorageService.saveEval(cloudDoc)` → inserta en la tabla `evaluaciones`.
4. Marca la evaluación local como `synced` (y guarda `cloudId`). Devuelve una `Promise<boolean>` (éxito/fallo).

### Sincronización diferida (offline → online)

- La evaluación se guarda **siempre** primero en IndexedDB, con sus fotos (dataURLs) y `synced:false`.
- Si se finalizó **sin red**, `syncPendingEvals()` la deja pendiente.
- **Al recuperar conexión** (evento `online`) y **al iniciar sesión** (`authDone`), `syncPendingEvals()` sube automáticamente todas las evaluaciones pendientes (`!synced && !cloudId`) con sus fotos.
- Guarda `_syncing` para evitar ejecuciones concurrentes.
- La pantalla de inicio muestra **"N sin sincronizar"** (`updatePendingIndicator`); al completarse, el aviso desaparece y aparece el toast de sincronización.

> `uploadEvalToCloud` es idempotente por seguridad: si la evaluación ya tiene `synced` o `cloudId`, no se vuelve a subir.

## Autenticación

- Sesión gestionada por Supabase; `checkAuth()` consulta `getUser()` al iniciar.
- Si no hay sesión, se muestra la pantalla de login (`showAuth`).
- **Recuperación de contraseña**: el enlace del correo vuelve a la app con `#...type=recovery`. El hash se captura **antes** de cargar el SDK (`window.__CBS_INITIAL_HASH`) para mostrar la pantalla de nueva contraseña; además se escucha el evento `PASSWORD_RECOVERY` (`onAuthStateChange`).

## Offline y service worker

`sw.js`:

- Precachea los archivos locales (`LOCAL`) y CDNs (Tailwind, fuentes, Font Awesome, Supabase SDK).
- **Navegación:** *network-first* (trae siempre lo último, con fallback a caché offline).
- **Resto:** *cache-first*.
- **Nunca** cachea llamadas a `supabase.co/auth|rest|storage` (siempre red).
- Al cambiar archivos de la app, se debe **subir `CACHE`** en `sw.js` para invalidar el caché viejo.

## Convenciones

- JavaScript ES5-ish (funciones `function`, sin módulos) para máxima compatibilidad.
- Sin dependencias de build; se edita y se recarga.
- Los textos de UI están en español.
