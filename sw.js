/* CBS Evaluador — Service Worker v3 */
var CACHE='cbs-v7';

/* Archivos locales pre-cacheados al instalar */
var LOCAL=[
  '/',
  '/app.js',
  '/supabase-config.js',
  '/services/storage.service.js',
  '/services/supabase.provider.js',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){return c.addAll(LOCAL);})
      .then(function(){return self.skipWaiting();})
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})
      );
    }).then(function(){return self.clients.claim();})
  );
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  /* Ignorar peticiones de extensiones del navegador */
  if(!e.request.url.startsWith('http'))return;

  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached)return cached;
      return fetch(e.request).then(function(response){
        /* Solo cachear respuestas válidas */
        if(response&&response.status===200&&response.type!=='opaque'){
          var clone=response.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return response;
      }).catch(function(){
        /* Sin red y sin caché: el navegador muestra error nativo */
      });
    })
  );
});
