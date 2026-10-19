// ============================================================
// StorageService — Capa de abstraccion de almacenamiento
// ============================================================
// app.js solo llama a StorageService.*
// El proveedor concreto se inyecta via setProvider()
// ============================================================

var StorageService = (function() {
  var _provider = null;

  // Inyectar el proveedor concreto
  function setProvider(p) {
    _provider = p;
  }

  // Sube un Blob a la ruta relativa indicada
  // relPath: "evals/{evalId}/site/sh_0"  — SIN URLs absolutas
  // Retorna Promise<void>
  function upload(relPath, blob) {
    if (!_provider) return Promise.resolve(null);
    return _provider.upload(relPath, blob);
  }

  // Guarda el objeto de evaluacion en la base de datos
  // evalObj NO debe contener dataUrls; solo fotoRefs (rutas relativas)
  // Retorna Promise<string> con el ID del documento creado
  function saveEval(evalObj) {
    if (!_provider) return Promise.resolve(null);
    return _provider.saveEval(evalObj);
  }

  // Guarda el consenso grupal
  // Retorna Promise<string> con el ID del documento
  function saveCons(consObj) {
    if (!_provider) return Promise.resolve(null);
    return _provider.saveCons(consObj);
  }

  // ========== AUTH ==========

  function getUser() {
    if (!_provider) return Promise.resolve(null);
    return _provider.getUser();
  }

  function signUp(email, password) {
    if (!_provider) return Promise.resolve({ error: { message: 'Proveedor no disponible' } });
    return _provider.signUp(email, password);
  }

  function signIn(email, password) {
    if (!_provider) return Promise.resolve({ error: { message: 'Proveedor no disponible' } });
    return _provider.signIn(email, password);
  }

  function signOut() {
    if (!_provider) return Promise.resolve();
    return _provider.signOut();
  }

  // Envia un correo con enlace para restablecer la contraseña
  function resetPassword(email) {
    if (!_provider) return Promise.resolve({ error: { message: 'Proveedor no disponible' } });
    return _provider.resetPassword(email);
  }

  // Actualiza la contraseña del usuario con la sesion de recuperacion activa
  function updatePassword(password) {
    if (!_provider) return Promise.resolve({ error: { message: 'Proveedor no disponible' } });
    return _provider.updatePassword(password);
  }

  // Escucha eventos de auth (ej. PASSWORD_RECOVERY al abrir el enlace del correo)
  function onAuthStateChange(cb) {
    if (!_provider || !_provider.onAuthStateChange) return null;
    return _provider.onAuthStateChange(cb);
  }

  // ========== GRUPOS ==========

  function crearGrupo(sitio, userId) {
    if (!_provider) return Promise.resolve(null);
    return _provider.crearGrupo(sitio, userId);
  }

  function unirseAGrupo(codigo) {
    if (!_provider) return Promise.resolve(null);
    return _provider.unirseAGrupo(codigo);
  }

  return { setProvider, upload, saveEval, saveCons, getUser, signUp, signIn, signOut, resetPassword, updatePassword, onAuthStateChange, crearGrupo, unirseAGrupo };
})();
