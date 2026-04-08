// ============================================================
// CONFIGURACION FIREBASE — CBS Evaluador
// ============================================================
// 1. Ve a https://console.firebase.google.com y crea un proyecto
// 2. Agrega una app web y copia la configuracion aqui
// 3. Cambia FIREBASE_ENABLED a true
// ============================================================

var FIREBASE_CONFIG = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO_ID",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
};

// Cambia a true solo cuando hayas completado la configuracion anterior
var FIREBASE_ENABLED = false;

// ============================================================
// IMPORTANTE: Las fotos se guardan como rutas relativas
// Ejemplo: "evals/{evalId}/site/sh_0" — NO como URLs absolutas
// Si migras de Firebase, solo cambia el proveedor en
// services/firebase.provider.js — el resto del codigo no cambia
// ============================================================
