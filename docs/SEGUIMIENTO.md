# Seguimiento del proyecto

Bitácora viva del proyecto: estado, decisiones, cambios y próximos pasos. **Actualizar este archivo** al cerrar cada etapa.

- **Producto:** CBS Evaluador (Condición Biológica del Suelo — CERES).
- **Versión:** v1.0 beta.
- **Estado:** operativo en producción — flujo de **evaluación individual**.
- **Producción:** https://mango1970.github.io/cbs-analisis-suelos/

---

## Estado actual (resumen)

| Área | Estado |
|---|---|
| Evaluación individual (5 esferas) | ✅ Operativo |
| Fotos + análisis heurístico | ✅ Operativo |
| Checklist + valoración + radar | ✅ Operativo |
| Historial local + export JSON | ✅ Operativo |
| Sync a Supabase (evaluaciones + fotos) | ✅ Operativo |
| Auth + recuperación de contraseña | ✅ Operativo |
| PWA / offline | ✅ Operativo |
| Evaluación participativa/grupal | ❌ Retirada del producto |
| Integración de IA | ⚠️ Fase 1 implementada; bloqueada por 401 de auth al invocar la Edge Function (ver bitácora) |

---

## Bitácora de cambios

### 2026-10 — Fase 1 IA: implementada y desplegada; bloqueada por 401 (RETOMAR AQUÍ)

**Hecho:**
- **Frontend (en producción):** botón "Analizar con IA" por esfera, tarjeta "Segunda opinión (IA)", `aiAnalysis` guardado en la evaluación, sugerencia combinada con pesos (Checklist 0.45 + heurístico 0.25 + IA 0.30) y bloque de IA en el resumen.
- **Edge Function `analizar-esfera`** desplegada por el usuario; secret `GEMINI_API_KEY` configurado.
- **Los logs confirman que la función es alcanzada** (pares `OPTIONS` + `POST`; CORS OK).

**Bloqueo actual:** al pulsar "Analizar con IA", la función responde **401 Unauthorized** en `auth.getUser()`, antes de llamar a Gemini.

**Diagnóstico:** la app envía el **token de sesión vencido** (Supabase lo expira en ~1 h y `functions.invoke` no lo refresca). **No** es la API key de Google ni la configuración de Supabase (verificado: una key/config mala daría 500/502, no 401).

**Plan para retomar (pendiente):**
1. `services/supabase.provider.js` → `analyzeSphereAI`: refrescar el token antes de invocar (`getSession()` → si `expires_at` vence en <60 s, `refreshSession()`).
2. Mejorar el error: leer `res.error.context.json()` y mostrar `body.error` (en vez de "non-2xx status code").
3. Edge Function: devolver `detail` del error de auth + `console.error` para diagnosticar si persiste (requiere re-pegar `index.ts` en el dashboard).
4. Bump de versión/caché + push; re-probar.
5. Prueba rápida: **cerrar sesión y volver a entrar** (token nuevo) antes de invocar.

### 2026-10 — Cita de la fuente metodológica

- Se reemplazó la cita corta por la **referencia completa** de la metodología en `README.md`, `docs/METODOLOGIA_CERES.md` y `MANUAL_DE_USO.md`:
  > Sabaini, C. y Ávila, G. (2015). *Manual de determinación de la condición biológica de suelo in situ e in visu en los sistemas agrícolas.* Programa de Restauración Biológica de Suelo (RBS), Centro Regional de Innovación Hortofrutícola de Valparaíso. 57 pp. Quillota, Chile.
- En la **UI de la app** se mantiene un texto breve: "Basado en: Sabaini & Ávila, 2015 — Manual CERES".
- Se mantiene separada la referencia de lombrices (Selles et al. 2006).

### 2026-10 — Fase 1 de IA (Gemini)

- **Edge Function `analizar-esfera`**: proxy seguro a Google Gemini (la clave vive como secret). Recibe la foto de una esfera y devuelve `{score, conf, reasons}`.
- **Frontend**: botón **"Analizar con IA"** por esfera, tarjeta "Segunda opinión (IA)", y guardado en `aiAnalysis[esfera]` dentro de la evaluación.
- **Sugerencia combinada** ahora pondera Checklist + heurístico + IA.
- **Fallback**: sin red o error de IA, sigue funcionando con heurístico + checklist.
- **Pendiente de despliegue (usuario)**: crear la Edge Function en Supabase y configurar `GEMINI_API_KEY`.

### 2026-10 — Documentación y sincronización diferida

- **Documentación completa:** README, arquitectura, metodología CERES, backend, análisis de imagen, roadmap de IA, despliegue y este seguimiento.
- **Manual de uso** (`MANUAL_DE_USO.md`) orientado al evaluador en terreno.
- **Sincronización diferida:** si una evaluación se termina **sin conexión**, queda local con aviso "N sin sincronizar" y se **sube automáticamente** (evaluación + fotos) al recuperar la conexión. Antes no se reintentaba.

### 2026-10 — Puesta en marcha y simplificación

- **Verificación y puesta online**
  - Se detectó el proyecto Supabase pausado; se reactivó.
  - Se corrigieron rutas absolutas → **relativas** para GitHub Pages (subpath).
  - Se publicó en GitHub Pages (repo `mango1970/cbs-analisis-suelos`).
  - Se migró el despliegue de build "legacy" a **GitHub Actions** (más confiable).
- **Iconos / PWA**
  - Regeneración de PNG (favicon, apple-touch, 192/512) desde `icon.svg` con Inkscape.
  - Cache-busting del favicon (`?v=`) y bump de caché del service worker.
- **Recuperación de contraseña**
  - Se agregó "¿Olvidaste tu contraseña?" + pantalla "Nueva Contraseña".
  - Se corrigió la detección del enlace de recuperación capturando el hash **antes** de que el SDK lo consuma (el evento `PASSWORD_RECOVERY` por sí solo llegaba tarde).
- **Simplificación a evaluación individual**
  - Se **retiró** toda la evaluación participativa: grupo por código, consenso, participantes y "agregar participante".
  - Supabase: se **eliminaron** las tablas `grupos` y `consensos`, y la columna `grupo_id`.
  - Se reforzó **RLS** en `evaluaciones` (cada usuario solo lee/inserta lo suyo; `anon` sin acceso).
  - Código: eliminadas ~325 líneas y bump de versión/caché.

### Antes (histórico relevante, commits previos)

- Migración de Firebase a Supabase.
- Auth con email/contraseña.
- Migración a IndexedDB para persistencia offline.
- Robustez de sync y manejo de errores.

---

## Decisiones de diseño

1. **Una evaluación = un evaluador.** Se prioriza la evaluación individual; la consolidación entre evaluadores se manejará por fuera (o en una fase futura).
2. **La app no inventa el resultado.** El checklist y el análisis heurístico **sugieren**; la valoración final es humana.
3. **Capa de servicios desacoplada.** `StorageService` permite cambiar de backend sin tocar `app.js`.
4. **Offline-first.** La captura y el guardado son locales (IndexedDB); la nube es best-effort.
5. **Datos identificables.** Cada evaluación se asocia a `user_id` y al nombre del evaluador, lista para análisis posterior.
6. **Sin build step.** Archivos estáticos editables directamente.

---

## Pendientes / próximos pasos

### Corto plazo
- [ ] Probar el flujo individual completo en producción (login → evaluación → sync → historial) en un dispositivo real.
- [ ] Eliminar usuarios de prueba de Supabase (`cbs.qa.test@gmail.com`, `cbs.qa.test2@gmail.com`) en **Authentication → Users**.
- [ ] Borrar el archivo de prueba `evals/test_probe.txt` del bucket `fotos` (si sigue).
- [ ] Revisar si el bucket `fotos` debe ser privado con políticas por usuario.

### Documentación
- [x] README.
- [x] Arquitectura.
- [x] Metodología CERES.
- [x] Backend Supabase.
- [x] Análisis de imagen.
- [x] Roadmap de IA.
- [x] Despliegue.
- [x] Seguimiento (este archivo).

### IA (Fase 1 — en curso)
- [x] Decidir enfoque: Google Gemini (API) vía Supabase Edge Function (proxy seguro).
- [x] Rúbrica/prompt por esfera (en la Edge Function).
- [x] `analyzeSphereAI` con contrato `{score, conf, reasons}` + UI + `aiAnalysis` + fallback.
- [ ] **Resolver 401 de auth** (refresco de token en cliente + detalle de error en la función).
- [ ] Validación contra evaluaciones humanas.

### Futuro (consolidación de datos)
- [ ] Definir cómo se agregan evaluaciones de distintos evaluadores (promedio, filtros por sitio/fecha).
- [ ] Posible reconstrucción de un flujo multi-evaluador **sobre** el modelo actual (sin volver al grupo por código).

---

## Notas operativas

- **Supabase:** `SUPABASE_ENABLED = true`; credenciales `anon` en `supabase-config.js`.
- **Auth:** confirmación de email desactivada; contraseña con mayúscula/minúscula/número.
- **Recuperación de contraseña:** requiere la URL de producción en *Redirect URLs* de Supabase.
- **Caché:** al publicar, subir `CACHE` en `sw.js` y el `?v=` en `index.html`.
- **Pruebas locales:** servir por HTTP (`python -m http.server 8080`), no `file://`.

---

## Cómo mantener este documento

Al cerrar una tarea:
1. Añadir una entrada en **Bitácora** (fecha + resumen).
2. Actualizar **Estado actual** y marcar los **Pendientes**.
3. Registrar cualquier **decisión** nueva en su sección.
