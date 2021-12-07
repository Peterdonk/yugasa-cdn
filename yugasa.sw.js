const cacheName = 'v2';

// window = self;

self.addEventListener('load', function() {
		navigator.serviceWorker
    .register('./pwa/yugasa.sw.js')
    .then(function() { alert('Service Worker Registered'); })
    
    .catch(function (err) {
            alert('ServiceWorker registration failed: ', err);
    });
    
});



// Call Install Event
self.addEventListener('install', e => {
  alert('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', e => {
  alert('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            alert('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
  alert('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
