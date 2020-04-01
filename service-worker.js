const FILES_TO_CACHE = [
    "/",
    "public/index.html",
    "public/style.css",
    "public/index.js",
    "public/icons/icon-192x192.png",
    "public/icons/icon-512x512.png"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

// Call Install Event
self.addEventListener("install", e => {
    console.log("Service Worker Installed.");
    e.waitUntil(
        caches.open(PRECACHE)
            .then(cache => {
                console.log("Service Worker Caching Files");
                cache.addAll(FILES_TO_CACHE);
            })
            .then(self.skipWaiting())
    );
});

// Call Activate Event
self.addEventListener("activate", e => {
    console.log("Service Worker Activated.");
    const currentCaches = [PRECACHE, RUNTIME];
    e.waitUntil(
        // This will catch if the cache we're looking for isn't there, clear the cache.
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Call Fetch Event
self.addEventListener("fetch", event => {
    console.log("Service Worker Fetching")
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            }).catch(err => cache.match(event.request));
                        });
                });
            })
        );
    }
});