const CACHE_NAME = "coop-keeper-v2";

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// FETCH (CACHE FIRST)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((res) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, res.clone());
              return res;
            });
          })
          .catch(() => caches.match("/index.html"))
      );
    })
  );
});