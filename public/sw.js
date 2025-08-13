const CACHE_NAME = "selly-socks-v2"
const urlsToCache = [
  "/",
  "/sellers",
  "/sell",
  "/messages",
  "/profile",
  "/search",
  "/offline",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/selly-socks-outline-logo.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
      .catch(() => {
        // If both cache and network fail, show offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/offline")
        }
      }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
