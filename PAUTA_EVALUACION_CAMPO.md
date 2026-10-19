# Pauta de Evaluación en Terreno — CBS Evaluador

Usar esta pauta durante una jornada real de evaluación de suelo para detectar
puntos de mejora. Anotar cada incidencia con: hora, pantalla, descripción.

---

## 1. Flujo completo de evaluación individual

| # | Paso | Qué observar | OK | Observaciones |
|---|---|---|---|---|
| 1.1 | Abrir app en el campo (con datos móviles) | ¿Carga rápido? ¿Pide login? | ☐ | |
| 1.2 | Iniciar sesión / Crear cuenta | ¿Funciona con señal débil? ¿Error si Supabase lento? | ☐ | |
| 1.3 | Pantalla inicio → Evaluación individual | ¿Se entienden las 3 opciones? (grupal / individual / historial) | ☐ | |
| 1.4 | Llenar datos del sitio | ¿Teclado tapa campos? ¿Fecha y GPS funcionan? | ☐ | |
| 1.5 | GPS — capturar ubicación | ¿Precisión razonable? ¿Tiempo de espera aceptable? | ☐ | |
| 1.6 | Fotos del sitio (cenital + lateral) | ¿Cámara abre rápido? ¿Hasta 3 fotos sin errores? | ☐ | |
| 1.7 | Esferas (5 pantallas) — foto por esfera | ¿Se entiende cada esfera? ¿Foto, checklist, rating fluyen? | ☐ | |
| 1.8 | Contador de lombrices | ¿Botones +/- responden bien? ¿Cálculo se ve correcto? | ☐ | |
| 1.9 | Resumen final | ¿Todas las fotos se ven en galería? ¿Gráfico radar dibuja bien? | ☐ | |
| 1.10 | Volver a inicio | ¿Botón "Nueva evaluación" / "Agregar participante" visibles? | ☐ | |

---

## 2. Prueba OFFLINE (modo avión)

Activar modo avión ANTES de abrir la app.

| # | Paso | Qué observar | OK | Observaciones |
|---|---|---|---|---|
| 2.1 | Abrir app sin conexión | ¿Carga? ¿Muestra pantalla de inicio? | ☐ | |
| 2.2 | Iniciar sesión sin red | ¿Mensaje claro de "sin conexión"? ¿Permite continuar sin login? | ☐ | |
| 2.3 | Evaluación completa offline | ¿Guarda localmente? ¿Fotos, ratings, todo persiste? | ☐ | |
| 2.4 | Cerrar y reabrir offline | ¿Datos persisten al reabrir? ¿La evaluación sigue ahí? | ☐ | |
| 2.5 | Salir de modo avión | ¿Sincroniza automáticamente? ¿Toast de "pendiente de sync" aparece? | ☐ | |

---

## 3. Prueba de fotos (casos límite)

| # | Paso | Qué observar | OK | Observaciones |
|---|---|---|---|---|
| 3.1 | 10 evaluaciones con 3+ fotos cada una | ¿Se llena el almacenamiento? ¿App se ralentiza? | ☐ | |
| 3.2 | Foto en penumbra / contraluz | ¿La app procesa bien? ¿Se ve en galería? | ☐ | |
| 3.3 | Cancelar foto (no tomar) | ¿No guarda foto vacía? ¿No crashea? | ☐ | |
| 3.4 | Retake (volver a tomar) en esfera | ¿Reemplaza la foto anterior? ¿No duplica? | ☐ | |
| 3.5 | Eliminar foto en galería multi-foto | ¿Se quita correctamente? ¿No quedan huecos? | ☐ | |

---

## 4. Prueba de sincronización

Hacer evaluación offline, luego reconectar.

| # | Paso | Qué observar | OK | Observaciones |
|---|---|---|---|---|
| 4.1 | Conectar después de evaluar offline | ¿Sube fotos a Supabase? ¿Tiempo razonable? | ☐ | |
| 4.2 | Ver en historial después de sync | ¿Aparece la evaluación? ¿Fotos visibles? | ☐ | |
| 4.3 | Interrumpir sync (apagar datos a mitad) | ¿Reintenta? ¿No crashea? | ☐ | |
| 4.4 | Mala señal (1 barra / Edge) | ¿Timeout manejable? ¿Mensaje de error claro? | ☐ | |

---

## 5. Prueba de grupo (multievaluador)

Requiere 2+ dispositivos.

| # | Paso | Qué observar | OK | Observaciones |
|---|---|---|---|---|
| 5.1 | Crear grupo (dispositivo líder) | ¿Genera código de 6 caracteres? | ☐ | |
| 5.2 | Unirse al grupo (otro dispositivo) | ¿Código funciona? ¿Error si código inválido? | ☐ | |
| 5.3 | Ambos evalúan el mismo sitio | ¿Evaluaciones se asocian al grupo? | ☐ | |
| 5.4 | Pantalla de participantes | ¿Se ven los nombres de todos? | ☐ | |
| 5.5 | Consenso grupal | ¿Ratings de todos visibles? ¿Guardar consenso funciona? | ☐ | |
| 5.6 | Gráfico radar con promedio grupal | ¿Línea punteada del promedio visible? | ☐ | |
| 5.7 | Salir del grupo | ¿Vuelve a modo individual sin perder datos? | ☐ | |

---

## 6. UX y usabilidad

Observar a otra persona usar la app (idealmente sin ayuda).

| # | Qué observar | OK | Notas |
|---|---|---|---|
| 6.1 | ¿Entiende el concepto de "esferas" sin explicación? | ☐ | |
| 6.2 | ¿Sabe cuándo tomar foto cenital vs lateral? | ☐ | |
| 6.3 | ¿Los íconos y colores de rating (Pobre/Regular/Buena) son intuitivos? | ☐ | |
| 6.4 | ¿La barra de progreso ayuda a ubicarse? | ☐ | |
| 6.5 | ¿El contador de lombrices es fácil de usar? | ☐ | |
| 6.6 | ¿Entiende el gráfico radar al final? | ☐ | |
| 6.7 | ¿Sabe cómo ver el historial? | ☐ | |
| 6.8 | ¿Alguna pantalla genera confusión o duda? | ☐ | |
| 6.9 | ¿El ojito de contraseña funciona y se entiende? | ☐ | |
| 6.10 | ¿La app se siente rápida o lenta? | ☐ | |

---

## 7. Rendimiento y batería

| # | Qué medir | Resultado | Notas |
|---|---|---|---|
| 7.1 | Tiempo desde abrir app hasta poder evaluar | ___ seg | |
| 7.2 | Tiempo en tomar foto + procesar | ___ seg | |
| 7.3 | Tiempo total para 1 evaluación completa (con fotos) | ___ min | |
| 7.4 | Batería consumida en 10 evaluaciones | ___ % | |
| 7.5 | ¿App se calienta con uso prolongado? | ☐ Sí / ☐ No | |
| 7.6 | ¿Algún crash o pantalla en blanco? | ☐ Sí / ☐ No | |

---

## 8. Dispositivos probados

| Dispositivo | OS | Navegador | Observaciones |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

---

## Resumen de hallazgos

### Lo que funciona bien
1. 
2. 
3. 

### Bugs o errores encontrados
1. 
2. 
3. 

### Mejoras sugeridas (prioridad alta)
1. 
2. 
3. 

### Mejoras sugeridas (deseables)
1. 
2. 
3. 

---

*Pauta generada el 2026-05-29. Completar durante sesión de campo y entregar para análisis.*
