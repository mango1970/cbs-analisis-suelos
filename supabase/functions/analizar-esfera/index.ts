// ============================================================
// Supabase Edge Function: analizar-esfera
// ============================================================
// Recibe { esfera, imagenBase64 } y devuelve { score, conf, reasons }
// usando Google Gemini (Google AI Studio).
//
// Requiere los secrets de la función:
//   GEMINI_API_KEY  (obligatorio)  -> API key de Google AI Studio
//   GEMINI_MODEL    (opcional)     -> por defecto "gemini-2.5-flash"
//
// La clave NUNCA se expone al cliente: la app llama a esta función.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RUBRICS: Record<string, string> = {
  det: `DETRITOSFERA: capa de restos vegetales y animales sobre el suelo, con actividad de hongos y fauna; principal fuente de materia organica.
Observa: cubrimiento del suelo, diversidad de materiales (hojas, rastrojos, restos de poda), cohesion por hifas de hongos, espesor de la capa, estado de descomposicion.
Niveles:
- Pobre (1): suelo desnudo, sin cubierta organica, sin horizonte organico.
- Regular (2): cubrimiento parcial (30-60%), restos sueltos sin cohesion, capa delgada (<1 cm).
- Buena (3): cubrimiento completo (>80%), materiales diversos cohesionados por hifas, capa >3 cm.`,
  agr: `AGREGATOSFERA: agregados del suelo (estructura); manifestacion fisica de la vida del suelo.
Observa: tamano y forma de los agregados (redondeados vs angulares), friabilidad visible (terrones que se desmenuzan con poca presion), proporcion de tamanos.
Niveles:
- Pobre (1): bloques grandes >10 cm compactos y angulares; cuesta romperlos.
- Regular (2): mezcla de terrones medianos y pequenos; algo de friabilidad.
- Buena (3): predominio de agregados <2 cm redondeados (migajon-granular), alta friabilidad.`,
  dri: `DRILOSFERA: suelo influido por lombrices (galerias, turriculos, heces ricas en nutrientes).
Observa: presencia de lombrices, tuneles/galerias en el perfil o superficie, turriculos (monticulos de estiercol) en la superficie.
Niveles:
- Pobre (1): 0-2 lombrices, sin tuneles ni turriculos.
- Regular (2): 3-7 lombrices, algunos tuneles/turriculos dispersos.
- Buena (3): >8 lombrices, abundantes tuneles y turriculos.`,
  riz: `RIZOSFERA: zona de influencia de las raices con exudados energeticos; motor de la vida del suelo.
Observa: abundancia, distribucion (superficial/hasta 20 cm), diametro, color y entramado de raices visibles.
Niveles:
- Pobre (1): raices escasas y superficiales, finas/palidas, sin entramado.
- Regular (2): raices en parte del perfil (0-15 cm), algo de entramado, mas de una especie.
- Buena (3): raices abundantes en todo el perfil hasta 20 cm, entramado denso y diverso.`,
  por: `POROSFERA: poros y canales del suelo para aire y agua, creados por raices, lombrices y fauna.
Observa: macroporos (>0,5 mm), bioporos, continuidad vertical, distribucion, compacidad de la estructura.
Niveles:
- Pobre (1): sin macroporos visibles, estructura compacta.
- Regular (2): algunos macroporos discontinuos, fisuras de labranza.
- Buena (3): abundantes bioporos continuos de distintos tamanos, estructura esponjosa.`,
};

function buildPrompt(esfera: string): string {
  return `Eres un evaluador experto en la metodologia CERES de Condicion Biologica del Suelo.
Analiza la fotografia de la esfera "${esfera}" y estima su condicion.

Rubrica:
${RUBRICS[esfera]}

Responde SOLO con JSON valido con esta forma exacta:
{"score": <numero de 1 a 3>, "conf": <entero 0-100>, "reasons": ["motivo 1", "motivo 2"]}

Donde score: 1=Pobre, 2=Regular, 3=Buena.
Basa la respuesta SOLO en lo visible en la imagen. Si la imagen no permite una buena evaluacion, usa una confianza baja.`;
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Metodo no permitido' }, 405);

  try {
    // 1. Validar el usuario autenticado
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: 'No autorizado' }, 401);

    // 2. Leer y validar el cuerpo
    const body = await req.json().catch(() => ({}));
    const esfera = String(body.esfera || '');
    const imagenBase64 = String(body.imagenBase64 || '');
    if (!RUBRICS[esfera]) return json({ error: 'Esfera invalida' }, 400);
    if (!imagenBase64) return json({ error: 'Falta la imagen' }, 400);

    // 3. Clave y modelo
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return json({ error: 'Falta configurar GEMINI_API_KEY en los secrets de la funcion' }, 500);
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';

    // 4. Llamar a Gemini
    const geminiBody = {
      contents: [{
        parts: [
          { text: buildPrompt(esfera) },
          { inline_data: { mime_type: 'image/jpeg', data: imagenBase64 } },
        ],
      }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            score: { type: 'NUMBER' },
            conf: { type: 'INTEGER' },
            reasons: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['score', 'conf', 'reasons'],
        },
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = data?.error?.message || `Error de Gemini (${resp.status})`;
      return json({ error: msg }, 502);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return json({ error: 'Respuesta vacia de Gemini' }, 502);

    let out: any = null;
    try { out = JSON.parse(text); } catch { out = null; }
    if (!out) return json({ error: 'Respuesta no valida de Gemini' }, 502);

    // 5. Normalizar salida
    const score = Math.max(1, Math.min(3, Number(out.score) || 2));
    const conf = Math.max(0, Math.min(100, Math.round(Number(out.conf) || 50)));
    const reasons = Array.isArray(out.reasons) ? out.reasons.slice(0, 6).map(String) : [];

    return json({
      score: Math.round(score * 10) / 10,
      conf,
      reasons,
      model,
    }, 200);
  } catch (e) {
    return json({ error: String((e as any)?.message || e) }, 500);
  }
});
