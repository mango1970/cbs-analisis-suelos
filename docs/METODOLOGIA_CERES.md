# Metodología CERES — las 5 esferas

La app implementa la evaluación de la **Condición Biológica del Suelo (CBS)** del *Manual CERES* (Sabaini & Ávila, 2015). La vida del suelo se evalúa en **5 esferas** interrelacionadas. Para cada una se registra evidencia (fotos), se marcan criterios del checklist y se asigna una **valoración final**.

> La app **sugiere** un nivel a partir del checklist y del análisis de imagen, pero la **valoración final la decide el evaluador**. La sugerencia nunca reemplaza la observación directa.

## Escala de valoración

| Nivel | Nombre | Color |
|---|---|---|
| 1 | Pobre | rojo (`#c44b3f`) |
| 2 | Regular | ámbar (`#d4a853`) |
| 3 | Buena | verde (`#5a8a4a`) |

---

## 1. Detritosfera (`det`)

**Definición:** masa de restos vegetales y animales en la capa superficial, con alta actividad de hongos y meso/macrofauna. Principal fuente de materia orgánica del suelo.

**Procedimiento:** dos varas de 40 cm perpendiculares sobre el suelo → foto enmarcada → registrar profundidad de la capa → remover restos superficiales → sentir humedad y oler (olor a tierra = hongos + hojas + suelo).

**Criterios (checklist):** cubrimiento >80%; diversidad de materiales; materiales cohesionados por hifas; capa >3 cm; olor a tierra; (nivel Regular) cubrimiento 30–60%, restos sueltos; (nivel Pobre) suelo mineral expuesto, sin olor.

**Niveles:**
- **Pobre:** suelo expuesto, sin cubierta orgánica ni horizonte orgánico, sin olor.
- **Regular:** cubrimiento parcial (30–60%), restos sueltos, capa delgada (<1 cm), olor débil.
- **Buena:** cubrimiento completo (>80%), materiales diversos cohesionados por hifas, capa >3 cm, olor pronunciado.

---

## 2. Agregatosfera (`agr`)

**Definición:** espacios de la agrupación jerárquica de componentes orgánicos y minerales que forman micro y macroagregados; manifestación física de la vida del suelo.

**Procedimiento:** cubo de 20×20×20 cm con pala → dejar caer desde ~1 m → soltar bloques 1–2 veces → presión ligera en terrones con fracturas → ordenar de mayor a menor → foto con varas de 70 y 40 cm.

**Criterios:** predominio de agregados <2 cm; agregados redondeados (migajón-granular); alta friabilidad; buena proporción de tamaños; (Regular) mezcla de terrones medianos/pequeños, friabilidad moderada; (Pobre) bloques >10 cm compactos, agregados angulares/duros.

**Niveles:**
- **Pobre:** bloques grandes >10 cm compactos y angulares; requieren fuerte presión; sin friabilidad.
- **Regular:** mezcla de terrones medianos y pequeños; algo de friabilidad; proporción variable.
- **Buena:** predominio de agregados <2 cm redondeados; alta friabilidad; estructura migajón-granular.

---

## 3. Drilosfera (`dri`)

**Definición:** volumen de suelo bajo influencia de lombrices (galerías, tractos intestinales y heces ricas en nutrientes). Principal componente de bioturbación.

**Procedimiento:** usar el volumen de suelo de la Agregatosfera → búsqueda manual de lombrices → conteo en la caja → registrar número → foto del conjunto → buscar turrículos y túneles.

**Criterios:** >8 lombrices en cubo 20 cm (>200/m²); adultos y juveniles de distintos tamaños; túneles abundantes; turrículos abundantes; (Regular) 3–7 lombrices (50–100/m²), túneles dispersos; (Pobre) 0–2 lombrices (<50/m²), sin túneles ni turrículos.

**Niveles:**
- **Pobre:** 0–2 lombrices (<50/m²), sin túneles ni turrículos, sin bioturbación.
- **Regular:** 3–7 lombrices (50–100/m²), algunos túneles y turrículos, bioturbación incipiente.
- **Buena:** >8 lombrices (>200/m²), abundantes túneles y turrículos, alta bioturbación.

### Cálculo de lombrices (`wormCalc`)

El contador convierte el número de lombrices en un cubo de 20 cm a estimaciones, interpolando linealmente entre los puntos de referencia del manual (Selles et al. 2006):

| Lombrices | Lombrices/m² | kg/ha | Equivalente |
|---|---|---|---|
| 2 | 50 | 500 | 1 vaca |
| 8 | 100 | 1.000 | 2 vacas |
| 16 | 200 | 2.000 | 3 vacas |

Para valores intermedios se interpola; por encima de 16 se extrapola con la pendiente del último tramo.

---

## 4. Rizosfera (`riz`)

**Definición:** zona de influencia en torno a las raíces con exudados energéticos; principal fuerza conductora de los procesos ecosistémicos bajo la superficie.

**Procedimiento:** despejar una pared del perfil con la paleta → buscar raíces hasta 20 cm → vara de 20 cm al lado → foto de la pared limpia con raíces → observar distribución, abundancia, diámetro y entramado.

**Criterios:** raíces abundantes en todo el perfil hasta 20 cm; entramado denso y diverso; raíces de múltiples especies y grosores; buen diámetro/color; (Regular) raíces en 0–15 cm, algo de entramado; (Pobre) raíces escasas solo en superficie, finas, pálidas, sin entramado.

**Niveles:**
- **Pobre:** escasas raíces superficiales, diámetro fino/pálido, sin entramado, poca diversidad.
- **Regular:** raíces en parte del perfil (0–15 cm), diámetro medio, algo de entramado, más de una especie.
- **Buena:** abundantes en todo el perfil hasta 20 cm, entramado denso y diverso, múltiples especies.

---

## 5. Porosfera (`por`)

**Definición:** espacios de tamaños variables por actividad de raíces, lombrices, termitas y hormigas; canales para flujo de aire, agua y organismos. Hábitat aeróbico ideal.

**Procedimiento:** muestra de 10×10×20 cm cerca del cubo anterior → romper por la mitad → examinar macroporos (>0,5 mm) en la cara expuesta → foto vertical sujetando con los dedos abajo → observar tamaño, continuidad vertical y distribución.

**Criterios:** abundantes bioporos continuos de distintos tamaños; buena distribución vertical; bioporos por raíces y lombrices visibles; estructura esponjosa; (Regular) algunos macroporos discontinuos, fisuras de labranza; (Pobre) sin macroporos, estructura compacta.

**Niveles:**
- **Pobre:** sin macroporos, estructura compacta, sin bioporos ni canales.
- **Regular:** algunos macroporos discontinuos, fisuras de labranza, pocos bioporos.
- **Buena:** abundantes bioporos continuos, buena distribución vertical, estructura esponjosa.

---

## Gráfico de brechas (radar)

En el resumen se dibuja un **radar de 5 ejes** (una por esfera) con tres anillos de referencia (Pobre, Regular, Buena) y el polígono de la evaluación. La distancia al centro representa el nivel (1–3), evidenciando visualmente las **brechas** entre la condición observada y la condición "Buena".

## Checklist y pesos

Cada criterio del checklist tiene un **peso** y un **nivel objetivo**:
- Criterios "buenos" suman hacia Buena.
- Criterios de nivel Regular suman hacia Regular.
- Criterios de nivel Pobre suman hacia Pobre.

`calcCheckSug` acumula el peso de los criterios marcados por nivel objetivo y propone el nivel con mayor peso, con una confianza relativa (máx. 70%). Ver [`ANALISIS_IMAGEN.md`](ANALISIS_IMAGEN.md) para la combinación con la imagen.
