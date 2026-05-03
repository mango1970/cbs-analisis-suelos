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

  // Obtiene la URL de descarga a partir de una ruta relativa
  // Retorna Promise<string|null>
  function getUrl(relPath) {
    if (!_provider) return Promise.resolve(null);
    return _provider.getUrl(relPath);
  }

  // Guarda el objeto de evaluacion en la base de datos
  // evalObj NO debe contener dataUrls; solo fotoRefs (rutas relativas)
  // Retorna Promise<string> con el ID del documento creado
  function saveEval(evalObj) {
    if (!_provider) return Promise.resolve(null);
    return _provider.saveEval(evalObj);
  }

  // Carga todas las evaluaciones del usuario
  // Retorna Promise<Array>
  function loadEvals() {
    if (!_provider) return Promise.resolve([]);
    return _provider.loadEvals();
  }

  // Guarda el consenso grupal
  // Retorna Promise<string> con el ID del documento
  function saveCons(consObj) {
    if (!_provider) return Promise.resolve(null);
    return _provider.saveCons(consObj);
  }

  return { setProvider, upload, getUrl, saveEval, loadEvals, saveCons };
})();
