# Backend Supabase

La app usa **Supabase** para autenticación, almacenamiento de fotos y persistencia de evaluaciones.

## Proyecto y configuración

- Credenciales en [`../supabase-config.js`](../supabase-config.js):
  - `SUPABASE_CONFIG.url`
  - `SUPABASE_CONFIG.anonKey` (clave pública `anon`)
  - `SUPABASE_STORAGE_BUCKET = "fotos"`
  - `SUPABASE_ENABLED = true`

> La clave `anon` es pública por diseño; la seguridad depende de **RLS**. La clave `service_role` **no** se usa ni se guarda en el cliente.

## Esquema de base de datos

### Tabla `evaluaciones`

Almacena una fila por evaluación individual.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | bigint / identity (PK) | Autogenerado |
| `ts` | bigint | Marca de tiempo (ms) |
| `data` | jsonb | Documento completo de la evaluación |
| `user_id` | uuid | Autor (`auth.users.id`) |

El objeto guardado en `data` (construido en `uploadEvalToCloud`) tiene la forma:

```json
{
  "id": "eval_1699999999999",
  "site": {
    "ev": "nombre evaluador", "ce": "centro productivo", "un": "unidad de manejo",
    "fe": "2026-01-01", "ri": "2026-01-01", "zo": "zona", "pu": "punto",
    "lat": -33.0, "lng": -70.0, "alt": 500, "acc": 8
  },
  "photoRefs": {
    "sh": ["evals/eval_.../site/sh_0"],
    "sd": ["evals/eval_.../site/sd_0"],
    "det": ["evals/eval_.../spheres/det"]
  },
  "ratings": { "det": 2, "agr": 3, "dri": 1, "riz": 2, "por": 3 },
  "notes": { "det": "observación..." },
  "checks": { "det": { "0": true, "2": true } },
  "wormCount": 8,
  "ts": "2026-01-01T12:00:00.000Z",
  "user_id": "uuid-del-evaluador"
}
```

> Las fotos **no** se guardan como dataURL en la nube: el cliente sube el binario al bucket y conserva en `photoRefs` solo las **rutas relativas**.

### Tablas eliminadas

Las tablas `grupos` y `consensos` (evaluación participativa) fueron **eliminadas** al simplificar el producto a evaluación individual. Si se reimplementa la consolidación entre evaluadores, ver [`SEGUIMIENTO.md`](SEGUIMIENTO.md).

## Storage

- Bucket: **`fotos`**.
- Rutas de subida (generadas en `uploadEvalToCloud`):
  - `evals/{evalId}/site/{sh|sd}_{i}` — fotos del sitio.
  - `evals/{evalId}/spheres/{esfera}` — foto por esfera.
- Las imágenes se redimensionan en el cliente (`resizeImage`, máx. 1200 px, JPEG 0.8) antes de subir.
- Las subidas requieren usuario autenticado. Actualmente no hay política de `DELETE` (borrar requiere `service_role` o dashboard).

## Autenticación

Configuración usada por la app:

- **Proveedor:** Email/Contraseña.
- **Confirmación de email:** desactivada (registro inmediato). Al crear la cuenta se obtiene sesión al instante.
- **Política de contraseña:** exige al menos una minúscula, una mayúscula y un dígito.
- **Secure password change:** activado. En sesiones de login normal, cambiar la contraseña exige `current_password`; **las sesiones de recuperación están exentas** (por eso el flujo "olvidé mi contraseña" funciona).
- **Recuperación de contraseña:** se envía vía `resetPasswordForEmail` con `redirectTo = origin + pathname`. El enlace debe estar en **Auth → URL Configuration → Redirect URLs**.
  - Producción: `https://mango1970.github.io/cbs-analisis-suelos/`
  - Local: `http://localhost:8080/` y `http://localhost:8080/**`
- **Límite de correo:** el servicio de email por defecto permite ~2 envíos/hora (configurar SMTP propio para producción).

## RLS (Row Level Security)

`evaluaciones` tiene RLS activo. Políticas vigentes:

```sql
alter table evaluaciones enable row level security;

-- Cada usuario solo lee sus evaluaciones
create policy "evaluaciones_select_own" on public.evaluaciones
  for select to authenticated using (user_id = auth.uid());

-- Cada usuario solo inserta evaluaciones propias
create policy "evaluaciones_insert_own" on public.evaluaciones
  for insert to authenticated with check (user_id = auth.uid());
```

Resultado comprobado: un usuario `anon` recibe `[]` al consultar `evaluaciones` (sin acceso a datos).

## Migración de referencia (SQL aplicado)

```sql
-- Simplificación a evaluación individual
drop table if exists consensos cascade;
drop table if exists grupos cascade;
alter table evaluaciones drop column if exists grupo_id cascade;

alter table evaluaciones enable row level security;

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'evaluaciones'
  loop
    execute format('drop policy if exists %I on public.evaluaciones', pol.policyname);
  end loop;
end $$;

create policy "evaluaciones_select_own" on public.evaluaciones
  for select to authenticated using (user_id = auth.uid());

create policy "evaluaciones_insert_own" on public.evaluaciones
  for insert to authenticated with check (user_id = auth.uid());
```

## Notas de seguridad

- La clave `anon` está en el repo (es pública, pero debe mantenerse acompañada de RLS estricta).
- El bucket `fotos` permite subir a usuarios autenticados; evaluar si conviene hacerlo privado con políticas por usuario cuando se implemente la consulta de datos.
- Rotar `service_role` y la contraseña de base si alguna vez se comparten.
