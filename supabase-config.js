// ============================================================
// CONFIGURACION SUPABASE — CBS Evaluador
// ============================================================
// 1. Ve a https://supabase.com y crea un proyecto (gratis, sin tarjeta)
// 2. En Settings > API copia la Project URL y anon public key aqui
// 3. Cambia SUPABASE_ENABLED a true
// ============================================================

var SUPABASE_CONFIG = {
  url:     "https://bxszkhdhdeofakkygkph.supabase.co",
  anonKey: "sb_publishable_VKMqN0WjrU3kOrVIbs6fZg_S94tJ-fr"
};

// Cambia a true solo cuando hayas completado la configuracion anterior
var SUPABASE_ENABLED = true;

// Nombre del bucket de Storage donde se guardan las fotos
var SUPABASE_STORAGE_BUCKET = "fotos";

// ============================================================
// IMPORTANTE: Las fotos se guardan como rutas relativas
// Ejemplo: "evals/{evalId}/site/sh_0" — NO como URLs absolutas
// Si migras de proveedor, solo cambia supabase.provider.js
// ============================================================
