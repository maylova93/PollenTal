const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v2";
const apiCacheName = "site-api-v3";
const fallbackPage = "/fallback.html";

// Statisk cache (HTML, CSS, JS, billeder osv.)
const STATIC_ASSETS = [
    "/index.html",
    "/map.html",
    "/settings.html",
    "/fallback.html",
    "/assets/css/style.css",
    "/assets/css/mobile.css",
    "/assets/css/desktop.css",
    "/assets/js/app.js",
    "/assets/js/location.js",
    "/assets/js/storage.js",
    "/assets/js/settings.js",
    "/assets/images/pollen.png",
    "/assets/images/home.png",
    "/assets/images/map.png",
    "/assets/images/settings.png"
];

// 📌 Begræns cache-størrelse
const limitCacheSize = async (cacheName, numAllowedFiles) => {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    while (keys.length > numAllowedFiles) {
        await cache.delete(keys[0]);
        keys.shift();
    }
};

// 📌 Installér Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker installeret");

    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log("Caching statiske filer");
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting(); // Aktiver service worker med det samme
});

// 📌 Aktivér Service Worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker aktiveret");

    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== staticCacheName && key !== dynamicCacheName && key !== apiCacheName)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim(); // Tving browseren til at bruge den nye SW
});

// 📌 Håndtering af fetch-event
self.addEventListener("fetch", (event) => {
    if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
        // Fix Chrome-extension bug
        if (!(event.request.url.indexOf("http") === 0)) return;

        event.respondWith(
            caches.match(event.request).then((cacheRes) => {
                return (
                    cacheRes ||
                    fetch(event.request)
                        .then((fetchRes) => {
                            return caches.open(dynamicCacheName).then((cache) => {
                                cache.put(event.request.url, fetchRes.clone());
                                limitCacheSize(dynamicCacheName, 2); // Begræns cache-størrelsen
                                return fetchRes;
                            });
                        })
                        .catch(() => {
                            if (event.request.destination === "document") {
                                return caches.match(fallbackPage).then((res) => res || Response.error());
                            }
                        })
                );
            })
        );
    }
});
