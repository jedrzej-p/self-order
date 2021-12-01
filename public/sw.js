(() => {
    "use strict";

    const CACHE_NAME = "self-order-v1";

    const WebPush = {
        init() {
            self.addEventListener("install", this.install.bind(this));
            self.addEventListener("activate", this.activate.bind(this));
            self.addEventListener("fetch", this.fetch.bind(this));
            self.addEventListener("push", this.notificationPush.bind(this));
            self.addEventListener("notificationclick", this.notificationClick.bind(this));
        },

        install(event) {
            // zapisanie w cache zasobów
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(["/offline/css/app.css", "/offline/favicon.ico", "/offline/images/home-title.png", "/offline/images/home-logo.png", "/offline/images/home.png", "/offline/offline.html", "/offline/js/scripts.js"])));
        },

        activate(event) {
            // usunięcie wszystkich baz cache's o nazwie innej niż CACHE_NAME
            event.waitUntil(caches.keys().then((cacheNames) => Promise.all(cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)))));
        },

        fetch(event) {
            const url = new URL(event.request.url);

            // jeżeli żądanie o stronę główną
            if (url.pathname === "/" || url.pathname === "/context") {
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
        },

        notificationPush(event) {
            if (!(self.Notification && self.Notification.permission === "granted")) {
                return;
            }
            var msg = event.data.text();
            console.log(msg);
            if (event.data) {
              //  console.log(event.data.json());
                event.waitUntil(this.sendNotification(event.data.json()));
            }
        },

        notificationClick(event) {
            // console.log(event.notification)

            if (event.action === "some_action") {
                // Do something...
            } else {
                self.clients.openWindow("/");
            }
        },

        sendNotification(data) {
            return self.registration.showNotification(data.title, data);
        },
    };

    WebPush.init();
})();
