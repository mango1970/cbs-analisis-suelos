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
| Integración de IA | ⏳ Próximo paso (ver [`INTEGRACION_IA.md`](INTEGRACION_IA.md)) |

---

## Bitácora de cambios

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

### IA (siguiente gran paso)
- [ ] Decidir enfoque (API de visión vs. on-device) y presupuesto.
- [ ] Redactar rúbrica/prompt por esfera.
- [ ] Implementar `analyzeImageAI` con contrato `{score, conf, reasons}`.
- [ ] UI opt-in + persistencia de `aiAnalysis` + fallback offline.
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
