# CBS Evaluador

Aplicación web (PWA) para evaluar la **Condición Biológica del Suelo (CBS)** según la metodología **CERES** (Sabaini & Ávila, 2015). Permite registrar en campo (*in situ* e *in visu*) las **5 esferas** del suelo con fotografías, checklist de criterios, análisis heurístico de imagen, valoración y un gráfico de brechas.

> **Estado:** v1.0 beta — flujo de **evaluación individual** (un evaluador por evaluación).
> La evaluación participativa/grupal (código de grupo, consenso y multievaluador) fue **retirada** del producto. Ver el historial en [`docs/SEGUIMIENTO.md`](docs/SEGUIMIENTO.md).

---

## Características

- **5 esferas del suelo:** Detritosfera, Agregatosfera, Drilosfera, Rizosfera y Porosfera.
- **Registro fotográfico:** fotos del sitio (cenital y lateral, hasta 3 por vista) y una foto por esfera.
- **Análisis heurístico de imagen:** estimación orientativa de la condición por esfera a partir de color/textura (ver [`docs/ANALISIS_IMAGEN.md`](docs/ANALISIS_IMAGEN.md)).
- **Checklist de criterios** del manual, con peso por criterio y nivel objetivo.
- **Contador de lombrices** con conversión a lombrices/m², kg/ha y "vacas/ha" (referencia Selles et al. 2006).
- **Valoración final** Pobre / Regular / Buena (1 / 2 / 3) por esfera.
- **Gráfico de brechas** (radar) en el resumen.
- **Historial local** (IndexedDB) con exportación a JSON.
- **Sincronización a Supabase** de evaluaciones y fotos, asociada al `user_id` del evaluador.
- **PWA instalable** y funcionamiento offline (service worker).
- **Autenticación** email/contraseña con recuperación de contraseña.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| UI | HTML + CSS (Tailwind CDN) + Font Awesome, JavaScript vanilla |
| Persistencia local | IndexedDB (`services/localdb.service.js`) |
| Backend | Supabase (Auth + Postgres + Storage) |
| PWA | `manifest.json` + service worker (`sw.js`) |
| Despliegue | GitHub Pages vía GitHub Actions (`.github/workflows/deploy.yml`) |

No hay build step: son archivos estáticos.

---

## Estructura del proyecto

```
.
├── index.html                  # UI: pantallas de login, evaluación, resumen, historial
├── app.js                      # Lógica principal (estado, esferas, análisis, sync)
├── supabase-config.js          # URL, anon key, bucket y flag de Supabase
├── services/
│   ├── storage.service.js      # Capa de abstracción de almacenamiento
│   ├── supabase.provider.js    # Implementación Supabase (auth, storage, DB)
│   └── localdb.service.js      # Persistencia local con IndexedDB
├── sw.js                       # Service worker (offline / caché)
├── manifest.json               # Manifiesto PWA
├── icon.svg / *.png            # Iconos (favicon, apple-touch, PWA)
├── PAUTA_EVALUACION_CAMPO.md   # Guía de prueba en terreno (checklist manual)
└── docs/                       # Documentación técnica
```

---

## Ejecutar en local

La app es estática, pero **debe servirse por HTTP** (no abrir con `file://`), porque usa service worker, cámara y geolocalización.

```bash
# Desde la raíz del proyecto (requiere Python 3)
python -m http.server 8080

# O con Node
npx http-server -p 8080
```

Abrir: `http://localhost:8080/`

> Para probar desde el celular en la misma red Wi-Fi, usar `http://<IP-LAN-de-tu-PC>:8080/`.

---

## Configuración de Supabase

Las credenciales y el bucket están en [`supabase-config.js`](supabase-config.js):

```js
var SUPABASE_CONFIG = { url: "...", anonKey: "..." };
var SUPABASE_ENABLED = true;
var SUPABASE_STORAGE_BUCKET = "fotos";
```

El esquema de la base, RLS, storage y auth están documentados en [`docs/BACKEND_SUPABASE.md`](docs/BACKEND_SUPABASE.md).

---

## Despliegue

GitHub Pages con GitHub Actions. Pasos y consideraciones de caché en [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

---

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Arquitectura, capa de servicios, flujo de datos, offline. |
| [`docs/METODOLOGIA_CERES.md`](docs/METODOLOGIA_CERES.md) | Las 5 esferas, escalas, cálculo de lombrices y radar. |
| [`docs/BACKEND_SUPABASE.md`](docs/BACKEND_SUPABASE.md) | Tablas, columnas, RLS, storage y auth. |
| [`docs/ANALISIS_IMAGEN.md`](docs/ANALISIS_IMAGEN.md) | Análisis heurístico actual (base para la IA). |
| [`docs/INTEGRACION_IA.md`](docs/INTEGRACION_IA.md) | Roadmap para incorporar IA a las evaluaciones. |
| [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) | Publicación y actualización. |
| [`docs/SEGUIMIENTO.md`](docs/SEGUIMIENTO.md) | Bitácora de cambios y próximos pasos. |

---

## Créditos

- Metodología: **Manual CERES — Sabaini & Ávila 2015**.
- Referencia de lombrices: Selles et al. 2006.
- © 2026 Mauricio Núñez G. — Todos los derechos reservados.
