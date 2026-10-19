// ============================================================
// SupabaseProvider — Implementacion Supabase de StorageService
// ============================================================
// Usa Supabase Storage (imagenes) + Supabase DB (datos)
// SDK v2 cargado via CDN en index.html
// ============================================================

var SupabaseProvider = (function() {
  var _client = null;
  var _bucket;
  var _ready  = false;

  function init() {
    if (!window.supabase) { console.warn('[SupabaseProvider] SDK no cargado.'); return false; }
    if (typeof SUPABASE_CONFIG === 'undefined' || !SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'TU_URL') {
      console.warn('[SupabaseProvider] Config no configurada. Edita supabase-config.js'); return false;
    }
    try {
      _client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      _bucket = (typeof SUPABASE_STORAGE_BUCKET !== 'undefined') ? SUPABASE_STORAGE_BUCKET : 'fotos';
      _ready  = true;
      console.log('[SupabaseProvider] Inicializado correctamente.');
      return true;
    } catch (e) {
      console.warn('[SupabaseProvider] Error al inicializar:', e);
      return false;
    }
  }

  // Sube un Blob a Supabase Storage usando ruta relativa
  function upload(relPath, blob) {
    if (!_ready) return Promise.resolve(null);
    return _client.storage.from(_bucket).upload(relPath, blob, { upsert: true })
      .then(function(res) {
        if (res.error) throw res.error;
        return null;
      });
  }

  // Guarda evaluacion en DB (evalObj como JSONB + ts indexado)
  function saveEval(evalObj) {
    if (!_ready) return Promise.resolve(null);
    var ts = typeof evalObj.ts === 'number' ? evalObj.ts : Date.now();
    var row = { ts: ts, data: evalObj };
    if (evalObj.user_id) { row.user_id = evalObj.user_id; }
    return _client.from('evaluaciones').insert(row).select('id').single()
      .then(function(res) {
        if (res.error) throw res.error;
        return String(res.data.id);
      });
  }

  // ========== AUTH ==========

  // Obtiene el usuario actual (null si no hay sesion)
  function getUser() {
    if (!_ready) return Promise.resolve(null);
    return _client.auth.getSession().then(function(res) {
      return res.data.session ? res.data.session.user : null;
    });
  }

  // Registro con email/password
  function signUp(email, password) {
    if (!_ready) return Promise.resolve({ error: { message: 'No inicializado' } });
    return _client.auth.signUp({ email: email, password: password });
  }

  // Inicio de sesion con email/password
  function signIn(email, password) {
    if (!_ready) return Promise.resolve({ error: { message: 'No inicializado' } });
    return _client.auth.signInWithPassword({ email: email, password: password });
  }

  // Cerrar sesion
  function signOut() {
    if (!_ready) return Promise.resolve();
    return _client.auth.signOut();
  }

  // Envia correo de recuperacion. El enlace vuelve a la app (redirectTo)
  function resetPassword(email) {
    if (!_ready) return Promise.resolve({ error: { message: 'No inicializado' } });
    var redirectTo = window.location.origin + window.location.pathname;
    return _client.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
  }

  // Actualiza la contrasena (requiere sesion de recuperacion activa)
  function updatePassword(password) {
    if (!_ready) return Promise.resolve({ error: { message: 'No inicializado' } });
    return _client.auth.updateUser({ password: password });
  }

  // Suscripcion a eventos de auth
  function onAuthStateChange(cb) {
    if (!_ready) return null;
    return _client.auth.onAuthStateChange(function(event, session) {
      cb(event, session);
    });
  }

  // ========== IA (Gemini via Edge Function) ==========

  // Analiza una foto de esfera con IA. Devuelve {score,conf,reasons} o {error}
  function analyzeSphereAI(esfera, imageBase64) {
    if (!_ready) return Promise.resolve({ error: 'No inicializado' });
    return _client.functions.invoke('analizar-esfera', {
      body: { esfera: esfera, imagenBase64: imageBase64 }
    }).then(function(res) {
      if (res.error) {
        return { error: (res.error.message || res.error.name || 'Error al llamar a la IA') };
      }
      return res.data || { error: 'Respuesta vacia de la IA' };
    }).catch(function(e) {
      return { error: String((e && e.message) || e) };
    });
  }

  return { init, upload, saveEval, getUser, signUp, signIn, signOut, resetPassword, updatePassword, onAuthStateChange, analyzeSphereAI };
})();

// Auto-inicializar si Supabase esta habilitado
(function() {
  if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
    if (SupabaseProvider.init()) {
      StorageService.setProvider(SupabaseProvider);
    }
  }
})();
