/* CBS Evaluador — Service Worker v5 */
var CACHE='cbs-v13';

/* Recursos locales pre-cacheados al instalar */
var LOCAL=[
  './',
  './index.html',
  './app.js',
  './supabase-config.js',
  './services/storage.service.js',
  './services/supabase.provider.js',
  './services/localdb.service.js',
  './manifest.json',
  './icon.svg',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

/* CDN externos — cache para funcionamiento offline */
var CDN=[
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){
        return c.addAll(LOCAL).catch(function(err){
          console.warn('[SW] Error pre-caching local resources:', err);
        });
      })
      .then(function(){
        return caches.open(CACHE).then(function(c){
          return Promise.all(CDN.map(function(url){
            return c.add(url).catch(function(){});
          }));
        });
      })
      .then(function(){
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  if(!e.request.url.startsWith('http'))return;

  /* No cachear llamadas a la API de Supabase — siempre pedir fresco */
  if(e.request.url.indexOf('supabase.co/auth')>-1)return;
  if(e.request.url.indexOf('supabase.co/rest')>-1)return;
  if(e.request.url.indexOf('supabase.co/storage')>-1)return;

  /* Navegacion: network-first (trae siempre lo ultimo, con fallback offline) */
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(function(response){
        if(response&&response.status===200){
          var clone=response.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return response;
      }).catch(function(){
        return caches.match(e.request).then(function(cached){
          return cached||caches.match('./index.html');
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached)return cached;
      return fetch(e.request).then(function(response){
        if(response&&response.status===200&&response.type!=='opaque'){
          var clone=response.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return response;
      }).catch(function(){});
    })
  );
});
