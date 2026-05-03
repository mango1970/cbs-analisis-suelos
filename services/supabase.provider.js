// ============================================================
// SupabaseProvider — Implementacion Supabase de StorageService
// ============================================================
// Usa Supabase Storage (imagenes) + Supabase DB (datos)
// SDK v2 cargado via CDN en index.html
// ============================================================

var SupabaseProvider = (function() {
  var _client = null;
  var _bucket = 'fotos';
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

  // Obtiene URL publica a partir de ruta relativa
  function getUrl(relPath) {
    if (!_ready) return Promise.resolve(null);
    var res = _client.storage.from(_bucket).getPublicUrl(relPath);
    return Promise.resolve(res.data.publicUrl);
  }

  // Guarda evaluacion en DB (evalObj como JSONB + ts indexado)
  function saveEval(evalObj) {
    if (!_ready) return Promise.resolve(null);
    var ts = typeof evalObj.ts === 'number' ? evalObj.ts : Date.now();
    var row = { ts: ts, data: evalObj };
    return _client.from('evaluaciones').insert(row).select('id').single()
      .then(function(res) {
        if (res.error) throw res.error;
        return String(res.data.id);
      });
  }

  // Carga evaluaciones desde DB ordenadas por ts desc
  function loadEvals() {
    if (!_ready) return Promise.resolve([]);
    return _client.from('evaluaciones').select('id, data').order('ts', { ascending: false })
      .then(function(res) {
        if (res.error) throw res.error;
        return res.data.map(function(row) {
          return Object.assign({ supabaseId: row.id }, row.data);
        });
      });
  }

  // Guarda consenso en DB
  function saveCons(consObj) {
    if (!_ready) return Promise.resolve(null);
    var ts = typeof consObj.ts === 'number' ? consObj.ts : Date.now();
    var row = { ts: ts, data: consObj };
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

  // Escuchar cambios de sesion
  function onAuthChange(callback) {
    if (!_ready) return;
    _client.auth.onAuthStateChange(function(event, session) {
      callback(session ? session.user : null);
    });
  }

  return { init, upload, getUrl, saveEval, loadEvals, saveCons, getUser, signUp, signIn, signOut, onAuthChange };
})();

// Auto-inicializar si Supabase esta habilitado
(function() {
  if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
    if (SupabaseProvider.init()) {
      StorageService.setProvider(SupabaseProvider);
    }
  }
})();
