# Integración de IA en las evaluaciones

## Objetivo

Aumentar la calidad de las evaluaciones incorporando IA (visión por computador) que analice las **fotos de cada esfera** y aporte una estimación de condición (Pobre/Regular/Buena) con justificación, **sin reemplazar** el juicio del evaluador (human-in-the-loop).

## Punto de integración

El contrato actual de `analyzeImage(spId)` ya es el lugar ideal:

```js
// Entrada: id de esfera ('det','agr','dri','riz','por')
// Usa St.photos[spId] (dataURL)
// Salida:
{ score: 1..3, conf: 0..100, reasons: ["texto", ...] }
```

Consumidores actuales:
- `combinedSug(spId)` → combina con el checklist (60% checklist / 40% imagen).
- `renderImgResult(spId)` → muestra el resultado en pantalla.

Una IA puede **reemplazar** `analyzeImage` o **añadirse** como una tercera fuente, manteniendo el mismo formato `{score, conf, reasons}`.

## Enfoques posibles

| Enfoque | Ventaja | Desventaja |
|---|---|---|
| **API de visión en la nube** (ej. modelo multimodal) | Alta calidad, sin entrenamiento, rápido de integrar | Costo por imagen, requiere red, envía fotos a terceros |
| **Modelo on-device** (ej. WebGPU/WASM) | Sin costo por uso, privacidad, funciona offline | Tamaño, latencia, calidad menor, complejidad |
| **Modelo propio (fine-tuning)** | Adaptado a CERES y a su dominio | Requiere dataset etiquetado y mantenimiento |

### Recomendación inicial

Empezar con **API de visión en la nube** como "segunda opinión", en modo **opt-in** (el usuario decide si analizar con IA), guardando el resultado junto a la evaluación. Evaluar costo/calidad antes de hacerlo automático u offline.

## Consideraciones

- **Offline (PWA):** la app debe seguir funcionando sin red. La IA debe ser **opcional y no bloqueante**; si falla o no hay red, se usa el heurístico actual.
- **Privacidad:** las fotos pueden contener ubicación (GPS en `site`) y datos del predio. Enviar a un tercero requiere consentimiento y política de datos. Considerar anonimizar metadatos.
- **Costo y límites:** definir presupuesto/rate-limit por evaluación (5 esferas + fotos del sitio).
- **Latencia:** mostrar estado "analizando..." y permitir continuar.
- **Consistencia metodológica:** el prompt debe describir la **rúbrica CERES** de cada esfera (ver [`METODOLOGIA_CERES.md`](METODOLOGIA_CERES.md)) y pedir el mismo formato de salida.
- **Explicabilidad:** pedir motivos en lenguaje natural (campo `reasons`) para que el evaluador entienda la sugerencia.
- **No determinista:** registrar versión del modelo/prompt con cada análisis.
- **Sesgo/validación:** comparar contra evaluaciones humanas reales antes de confiar en la IA.

## Flujo propuesto (por fases)

### Fase 1 — IA como segunda opinión (opt-in)
1. Botón "Analizar con IA" en cada esfera (junto al análisis heurístico).
2. Enviar la foto + rúbrica de la esfera a la API.
3. Recibir `{score, conf, reasons}` y mostrarlo en una tarjeta distinta ("IA").
4. Guardar en la evaluación: `aiAnalysis[esfera] = {score, conf, reasons, model, ts}`.
5. `combinedSug` puede incluir la IA con un peso configurable (p. ej. 0.4 checklist / 0.3 heurístico / 0.3 IA).

### Fase 2 — Automatización asistida
- Ejecutar la IA automáticamente tras tomar la foto (si hay red), mostrando resultado no bloqueante.
- Panel de comparación: heurístico vs. IA vs. valoración humana.

### Fase 3 — Modelo adaptado
- Con suficientes evaluaciones etiquetadas, evaluar fine-tuning o modelo on-device.
- Métricas de acuerdo (p. ej. kappa) entre IA y evaluadores.

## Cambios de datos sugeridos

- Añadir `aiAnalysis` al objeto de evaluación (`data` jsonb) — no requiere cambio de columnas.
- Opcional: tabla `ai_runs` para auditoría (modelo, prompt version, costo, latencia, salida cruda).

## Tareas concretas (roadmap)

- [ ] Definir proveedor de visión y presupuesto.
- [ ] Redactar el prompt/rúbrica por esfera (basado en `METODOLOGIA_CERES.md`).
- [ ] Implementar `analyzeImageAI(spId)` con el mismo contrato `{score, conf, reasons}`.
- [ ] UI: tarjeta de resultado IA + botón opt-in + estado de carga.
- [ ] Persistir `aiAnalysis` en `cloudDoc`.
- [ ] Extender `combinedSug` con peso configurable.
- [ ] Manejo de errores/offline (fallback al heurístico).
- [ ] Política de privacidad y consentimiento para envío de fotos.
- [ ] Validación contra evaluaciones humanas.

## Preguntas abiertas

- ¿La IA debe funcionar **offline** (on-device) o se acepta depender de red?
- ¿Presupuesto por evaluación / por proyecto?
- ¿Quién es el dueño de las fotos y se permite enviarlas a un tercero?
- ¿La IA sugiere o directamente autocompleta la valoración? (recomendado: solo sugiere).
