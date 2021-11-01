const CACHE_NAME = "selforder-v1";

self.addEventListener(
    "install",
    (event) => {
        // zapisanie w cache zasobów
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(["/offline/css/app.css", "/offline/favicon.ico", "/offline/images/home-title.png", "/offline/images/home-logo.png", "/offline/images/home.png", "/offline/offline.html", "/offline/js/scripts.js"])));
    },
    false
);

self.addEventListener(
    "activate",
    (event) => {
        // usunięcie wszystkich baz cache's o nazwie innej niż CACHE_NAME
        event.waitUntil(caches.keys().then((cacheNames) => Promise.all(cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)))));
    },
    false
);

// wykonywane za każdym razem, gdy przeglądarka wyśle żadanie o dany zasób
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // jeżeli żądanie o stronę główną
    if (url.pathname === "/") {
        event.respondWith(
            fetch(event.request)
                // najprawdopobniej brak połączenia z internetem
                .catch((err) => {
                    console.log(err);
                    return caches.open(CACHE_NAME).then((cache) => cache.match("/offline/offline.html"));
                })
        );
    }

    if (url.pathname.includes("/offline")) {
        event.respondWith(caches.open(CACHE_NAME).then((cache) => cache.match(event.request)));
    }
});
