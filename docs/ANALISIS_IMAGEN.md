# Análisis heurístico de imagen

La app incluye un **análisis de imagen local y heurístico** que produce una estimación *orientativa* de la condición de cada esfera. **No es un modelo de IA/ML**: es un conjunto de reglas sobre color y textura, pensado como apoyo y como **punto de integración** para una futura IA (ver [`INTEGRACION_IA.md`](INTEGRACION_IA.md)).

> El resultado del análisis **nunca** decide por sí solo: la valoración final la hace el evaluador. La app lo muestra como "Sugerencia".

## Dónde está en el código (`app.js`)

| Función | Línea aprox. | Rol |
|---|---|---|
| `analyzeImage(spId)` | 469 | Calcula métricas de la foto y devuelve `{score, conf, reasons}` |
| `runAnalysis(spId)` | 646 | Dispara el análisis y guarda en `St.imgA[spId]` |
| `renderImgResult(spId)` | 635 | Muestra el resultado en pantalla |
| `calcCheckSug(spId)` | 497 | Sugerencia a partir del checklist |
| `combinedSug(spId)` | 508 | Combina checklist + imagen |

## Pipeline

1. Toma `St.photos[spId]` (dataURL de la foto de la esfera).
2. Dibuja la imagen en un canvas de **80×80 px** y lee los píxeles.
3. Calcula métricas globales:
   - `darkRatio`: proporción de píxeles oscuros (brillo medio < 80).
   - `avgR`, `avgG`, `avgB`: color promedio.
   - `varH`: variación horizontal media entre píxeles vecinos (proxy de textura).
   - `edgeV` (solo Rizosfera): variación vertical (proxy de raíces/líneas).
   - `lightPx` (solo Rizosfera): proporción de píxeles claros (brillo > 160).
   - `warmPx` (solo Drilosfera): proporción oscura si el tono es cálido (`avgR − avgB > 15`).
4. Aplica reglas por esfera para ajustar `score` (1–3) y `conf` (confianza), acumulando `reasons` legibles.
5. Recorta: `score ∈ [1,3]`, `conf ∈ [15,55]`. Devuelve `{score, conf, reasons}`.

## Reglas por esfera

### Detritosfera (`det`)
| Condición | Efecto | Motivo |
|---|---|---|
| `darkRatio > 0.4` | `score = 2.5`, `conf += 15` | Tonos oscuros (materia orgánica) |
| `darkRatio > 0.6` | `score = 2.8`, `conf += 10` | Tonalidad muy oscura |
| `darkRatio < 0.2` | `score = 1.3`, `conf += 10` | Suelo expuesto |
| `avgG > avgR + 10` | `conf += 8` | Tono verdoso (hongos) |
| Tope de confianza | 55 | |

### Agregatosfera (`agr`)
| Condición | Efecto | Motivo |
|---|---|---|
| `varH > 40` | `score = 2.6`, `conf += 15` | Alta variabilidad textural (agregados) |
| `varH < 15` | `score = 1.4`, `conf += 12` | Superficie homogénea/compacta |
| `darkRatio > 0.35` | `conf += 5` | Agregados con materia orgánica |
| Tope de confianza | 50 | |

### Drilosfera (`dri`)
| Condición | Efecto | Motivo |
|---|---|---|
| `warmPx > 0.1` | `score += 0.5`, `conf += 10` | Tonalidad cálida (posibles lombrices) |
| `varH > 30` | `conf += 5` | Textura irregular (túneles/estiercol) |
| Tope de confianza | 40 | |

### Rizosfera (`riz`)
| Condición | Efecto | Motivo |
|---|---|---|
| `lightPx > 0.15 && edgeV > 25` | `score = 2.5`, `conf += 15` | Líneas claras verticales (raíces) |
| `edgeV > 35` | `score += 0.3`, `conf += 8` | Variabilidad vertical (distribución) |
| `lightPx < 0.05` | `score = 1.3`, `conf += 8` | Pocas zonas claras (escasas raíces) |
| Tope de confianza | 50 | |

### Porosfera (`por`)
| Condición | Efecto | Motivo |
|---|---|---|
| `varH > 35` | `score = 2.4`, `conf += 12` | Irregularidad (macroporos) |
| `darkRatio > 0.3 && varH > 20` | `score += 0.3`, `conf += 8` | Zonas oscuras irregulares (bioporos) |
| `varH < 12` | `score = 1.3`, `conf += 12` | Superficie uniforme (compactación) |
| Tope de confianza | 48 | |

## Sugerencia por checklist (`calcCheckSug`)

- Cada criterio marcado suma su **peso** al nivel objetivo (`c.l`: 1 Pobre / 2 Regular / 3 Buena; por defecto 3).
- Propone el nivel con mayor peso acumulado.
- Confianza: `min(70, (peso_ganador / peso_total) * 70)`.

## Sugerencia combinada (`combinedSug`)

- Si hay checklist **y** imagen: `score = 0.6·nivelChecklist + 0.4·scoreImagen`; confianza ponderada igual.
- Si hay solo una fuente, se usa directamente.
- Nivel final: `score < 1.8 → Pobre`, `score < 2.5 → Regular`, si no `Buena`.
- Se listan los motivos de la imagen con prefijo `[Foto]`.

## Limitaciones

- Trabaja sobre una miniatura de **80×80 px** y métricas **globales**: pierde detalle espacial.
- Sensible a **iluminación, sombras y balance de blancos**.
- No detecta objetos (lombrices, raíces, agregados) de forma real; usa proxies de color/textura.
- Umbrales **empíricos**, no calibrados con un dataset.
- No distingue causas ni contexto del sitio.

## Por qué importa para la IA

`analyzeImage` es el **punto de extensión natural**: recibe la foto de una esfera y devuelve `{score, conf, reasons}`, exactamente el contrato que consumen `combinedSug` y `renderImgResult`. Una IA puede sustituir esa función manteniendo el mismo formato de salida.
