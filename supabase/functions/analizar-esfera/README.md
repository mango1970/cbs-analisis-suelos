# Edge Function: `analizar-esfera`

Analiza una foto de una esfera CBS con **Google Gemini** y devuelve `{ score, conf, reasons }`.
La clave de Google vive aquí (como secret), **nunca** en la app.

## 1. Obtener la API key de Google

1. Entra a https://aistudio.google.com
2. Crea una **API key** de Gemini (Google AI Studio).
3. (Opcional) Elige el modelo; por defecto la función usa `gemini-2.5-flash`.

## 2. Desplegar la función (desde el dashboard)

1. En Supabase: **Edge Functions → Deploy a new function → Via editor**.
2. Nombre: **`analizar-esfera`** (exacto).
3. Pega el contenido de [`index.ts`](index.ts).
4. **Deploy**.

> Alternativa con CLI:
> ```bash
> supabase functions deploy analizar-esfera --project-ref <REF>
> ```

## 3. Configurar los secrets

En **Edge Functions → Secrets** (o **Project Settings → Edge Functions → Secrets**):

| Secret | Valor |
|---|---|
| `GEMINI_API_KEY` | tu API key de Google AI Studio |
| `GEMINI_MODEL` | *(opcional)* ej. `gemini-2.5-flash` |

> Con CLI: `supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=gemini-2.5-flash`

## 4. Probar

La app llama con el SDK: `supabase.functions.invoke('analizar-esfera', { body: { esfera, imagenBase64 } })`.

Respuesta esperada:

```json
{ "score": 2.4, "conf": 72, "reasons": ["...", "..."], "model": "gemini-2.5-flash" }
```

- `score`: 1 (Pobre) a 3 (Buena)
- `conf`: 0–100
- `reasons`: motivos legibles

En caso de error devuelve `{ "error": "..." }` con status 4xx/5xx.

## Notas

- La función valida el JWT del usuario (debe estar logueado en la app).
- La imagen se envía como base64 (JPEG redimensionado a ~1024 px en el cliente).
- CORS habilitado para llamadas desde el navegador.
- Costo: ~$0.0005 por evaluación (5 fotos) con modelos Flash-Lite.
