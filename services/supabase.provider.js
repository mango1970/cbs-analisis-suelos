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
    if (evalObj.grupo_id) { row.grupo_id = evalObj.grupo_id; }
    return _client.from('evaluaciones').insert(row).select('id').single()
      .then(function(res) {
        if (res.error) throw res.error;
        return String(res.data.id);
      });
  }

  // Guarda consenso en DB
  function saveCons(consObj) {
    if (!_ready) return Promise.resolve(null);
    var ts = typeof consObj.ts === 'number' ? consObj.ts : Date.now();
    var row = { ts: ts, data: consObj };
    if (consObj.user_id) { row.user_id = consObj.user_id; }
    if (consObj.grupo_id) { row.grupo_id = consObj.grupo_id; }
    return _client.from('consensos').insert(row).select('id').single()
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

  // ========== GRUPOS ==========

  // Crea un grupo con codigo de 6 caracteres unico
  function crearGrupo(sitio, userId) {
    if (!_ready) return Promise.resolve(null);
    var codigo = '';
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (var i = 0; i < 6; i++) { codigo += chars[Math.floor(Math.random() * chars.length)]; }
    return _client.from('grupos').insert({
      codigo: codigo,
      sitio: sitio,
      creado_por: userId
    }).select('*').single().then(function(res) {
      if (res.error) throw res.error;
      return res.data;
    });
  }

  // Busca un grupo por su codigo
  function unirseAGrupo(codigo) {
    if (!_ready) return Promise.resolve(null);
    return _client.from('grupos').select('*').eq('codigo', codigo).single().then(function(res) {
      if (res.error) return null;
      return res.data;
    });
  }

  return { init, upload, saveEval, saveCons, getUser, signUp, signIn, signOut, crearGrupo, unirseAGrupo };
})();

// Auto-inicializar si Supabase esta habilitado
(function() {
  if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
    if (SupabaseProvider.init()) {
      StorageService.setProvider(SupabaseProvider);
    }
  }
})();
