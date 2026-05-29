// ============================================================
// LocalDBService — Almacenamiento local con IndexedDB
// ============================================================
// Reemplaza localStorage para persistencia offline robusta.
// Usa IndexedDB para evals, historial y consensos.
// Incluye migracion automatica desde localStorage.
// Registra persistent storage si esta disponible.
// ============================================================

var LocalDB = (function() {
  var DB_NAME = 'cbs_evaluador';
  var DB_VERSION = 1;
  var _db = null;
  var _ready = false;

  function init() {
    return new Promise(function(resolve) {
      if (!window.indexedDB) {
        console.warn('[LocalDB] IndexedDB no disponible. Usando localStorage como fallback.');
        _ready = false;
        resolve(false);
        return;
      }

      var req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('evals')) {
          db.createObjectStore('evals', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('consensus')) {
          db.createObjectStore('consensus', { keyPath: 'id' });
        }
      };

      req.onsuccess = function(e) {
        _db = e.target.result;
        _ready = true;
        console.log('[LocalDB] IndexedDB inicializada.');

        if (navigator.storage && navigator.storage.persist) {
          navigator.storage.persist().then(function(granted) {
            if (granted) console.log('[LocalDB] Almacenamiento persistente concedido.');
          });
        }

        resolve(true);
      };

      req.onerror = function(e) {
        console.warn('[LocalDB] Error al abrir IndexedDB:', e.target.error);
        _ready = false;
        resolve(false);
      };

      req.onblocked = function() {
        console.warn('[LocalDB] IndexedDB bloqueada.');
        _ready = false;
        resolve(false);
      };
    });
  }

  function _clear(storeName) {
    return new Promise(function(resolve) {
      if (!_ready || !_db) { resolve(); return; }
      var tx = _db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      var req = store.clear();
      req.onsuccess = function() { resolve(); };
      req.onerror = function() { resolve(); };
    });
  }

  function _putAll(storeName, items) {
    return new Promise(function(resolve) {
      if (!_ready || !_db) { resolve(); return; }
      var tx = _db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      store.clear();
      items.forEach(function(item) { store.put(item); });
      tx.oncomplete = function() { resolve(); };
      tx.onerror = function() { resolve(); };
    });
  }

  function _getAll(storeName) {
    return new Promise(function(resolve) {
      if (!_ready || !_db) { resolve([]); return; }
      var tx = _db.transaction(storeName, 'readonly');
      var store = tx.objectStore(storeName);
      var req = store.getAll();
      req.onsuccess = function() { resolve(req.result || []); };
      req.onerror = function() { resolve([]); };
    });
  }

  // ========== Evaluaciones ==========

  function saveEvals(evals) {
    if (!_ready) {
      try { localStorage.setItem('cbs_ev', JSON.stringify(evals)); } catch(e) {}
      return Promise.resolve();
    }
    return _putAll('evals', evals);
  }

  function loadEvals() {
    return _getAll('evals').then(function(evals) {
      if (evals.length > 0) return evals;

      // Migracion desde localStorage
      try {
        var stored = localStorage.getItem('cbs_ev');
        if (stored) {
          var legacyEvals = JSON.parse(stored);
          if (Array.isArray(legacyEvals) && legacyEvals.length > 0) {
            console.log('[LocalDB] Migrando ' + legacyEvals.length + ' evaluaciones desde localStorage...');
            return _putAll('evals', legacyEvals).then(function() {
              return legacyEvals;
            });
          }
        }
      } catch(e) { console.warn('[LocalDB] Error migrando evaluaciones:', e); }

      return [];
    });
  }

  // ========== Historial ==========

  function saveHistory(history) {
    if (!_ready) {
      try { localStorage.setItem('cbs_history', JSON.stringify(history)); } catch(e) {}
      return Promise.resolve();
    }
    return _putAll('history', history).then(function() {
      try { localStorage.setItem('cbs_history_backup', JSON.stringify(history)); } catch(e) {}
    });
  }

  function loadHistory() {
    return _getAll('history').then(function(history) {
      if (history.length > 0) return history;

      // Migracion desde localStorage
      try {
        var backup = localStorage.getItem('cbs_history_backup');
        if (backup) {
          var parsed = JSON.parse(backup);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('[LocalDB] Migrando historial desde backup localStorage...');
            _putAll('history', parsed).catch(function(){});
            return parsed;
          }
        }
        var stored = localStorage.getItem('cbs_history');
        if (stored) {
          var parsed2 = JSON.parse(stored);
          if (Array.isArray(parsed2) && parsed2.length > 0) {
            console.log('[LocalDB] Migrando historial desde localStorage legacy...');
            _putAll('history', parsed2).catch(function(){});
            return parsed2;
          }
        }
      } catch(e) { console.warn('[LocalDB] Error migrando historial:', e); }

      return [];
    });
  }

  // ========== Consenso ==========

  function saveConsensus(cons) {
    if (!_ready) {
      try { localStorage.setItem('cbs_cons', JSON.stringify(cons)); } catch(e) {}
      return Promise.resolve();
    }
    return _clear('consensus').then(function() {
      if (Object.keys(cons).length > 0) {
        return new Promise(function(resolve) {
          var tx = _db.transaction('consensus', 'readwrite');
          var store = tx.objectStore('consensus');
          store.put({ id: 'current', data: cons });
          tx.oncomplete = function() { resolve(); };
          tx.onerror = function() { resolve(); };
        });
      }
    }).then(function() {
      try { localStorage.setItem('cbs_cons_backup', JSON.stringify(cons)); } catch(e) {}
    });
  }

  function loadConsensus() {
    return _getAll('consensus').then(function(items) {
      if (items.length > 0 && items[0].data && Object.keys(items[0].data).length > 0) {
        return items[0].data;
      }

      // Migracion desde localStorage
      try {
        var backup = localStorage.getItem('cbs_cons_backup');
        if (backup) return JSON.parse(backup);
        var stored = localStorage.getItem('cbs_cons');
        if (stored) return JSON.parse(stored);
      } catch(e) {}

      return {};
    });
  }

  // ========== Limpieza ==========

  function clearAll() {
    if (!_ready) {
      try { localStorage.removeItem('cbs_ev'); localStorage.removeItem('cbs_cons'); localStorage.removeItem('cbs_history'); } catch(e) {}
      return Promise.resolve();
    }
    return _clear('evals').then(function() {
      return _clear('history');
    }).then(function() {
      return _clear('consensus');
    }).then(function() {
      try {
        localStorage.removeItem('cbs_ev');
        localStorage.removeItem('cbs_cons');
        localStorage.removeItem('cbs_cons_backup');
        localStorage.removeItem('cbs_history');
        localStorage.removeItem('cbs_history_backup');
      } catch(e) {}
    });
  }

  return {
    init: init,
    saveEvals: saveEvals,
    loadEvals: loadEvals,
    saveHistory: saveHistory,
    loadHistory: loadHistory,
    saveConsensus: saveConsensus,
    loadConsensus: loadConsensus,
    clearAll: clearAll
  };
})();
