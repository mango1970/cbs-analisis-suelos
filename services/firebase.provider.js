// ============================================================
// FirebaseProvider — Implementacion Firebase de StorageService
// ============================================================
// Usa Firebase Storage (imagenes) + Firestore (datos)
// SDK Compat v9 cargado via CDN en index.html
// ============================================================

var FirebaseProvider = (function() {
  var _db = null;
  var _storage = null;
  var _ready = false;

  function init() {
    if (!window.firebase) { console.warn('[FirebaseProvider] SDK no cargado.'); return false; }
    if (typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'TU_API_KEY') {
      console.warn('[FirebaseProvider] Config no configurada. Edita firebase-config.js'); return false;
    }
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      _db = firebase.firestore();
      _storage = firebase.storage();
      _ready = true;
      console.log('[FirebaseProvider] Inicializado correctamente.');
      return true;
    } catch (e) {
      console.warn('[FirebaseProvider] Error al inicializar:', e);
      return false;
    }
  }

  // Sube un Blob a Firebase Storage usando ruta relativa
  function upload(relPath, blob) {
    if (!_ready) return Promise.resolve(null);
    return _storage.ref(relPath).put(blob).then(function() { return null; });
  }

  // Obtiene URL firmada a partir de ruta relativa
  function getUrl(relPath) {
    if (!_ready) return Promise.resolve(null);
    return _storage.ref(relPath).getDownloadURL();
  }

  // Guarda evaluacion en Firestore (sin dataUrls, solo fotoRefs)
  function saveEval(evalObj) {
    if (!_ready) return Promise.resolve(null);
    return _db.collection('evaluaciones').add(evalObj).then(function(docRef) {
      return docRef.id;
    });
  }

  // Carga evaluaciones desde Firestore
  function loadEvals() {
    if (!_ready) return Promise.resolve([]);
    return _db.collection('evaluaciones').orderBy('ts', 'desc').get().then(function(snap) {
      return snap.docs.map(function(doc) {
        return Object.assign({ firestoreId: doc.id }, doc.data());
      });
    });
  }

  // Guarda consenso en Firestore
  function saveCons(consObj) {
    if (!_ready) return Promise.resolve(null);
    return _db.collection('consensos').add(consObj).then(function(docRef) {
      return docRef.id;
    });
  }

  return { init, upload, getUrl, saveEval, loadEvals, saveCons };
})();

// Auto-inicializar si Firebase esta habilitado
(function() {
  if (typeof FIREBASE_ENABLED !== 'undefined' && FIREBASE_ENABLED) {
    if (FirebaseProvider.init()) {
      StorageService.setProvider(FirebaseProvider);
    }
  }
})();
