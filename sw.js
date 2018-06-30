self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('currency-conveter-static-v1')
        .then(function(cache) {
            return cache.addAll(
                [
                    '/',
                    'build/main.bundle.js',
                    'css/main.css',
                    'https://free.currencyconverterapi.com/api/v5/currencies'
                ]
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) return response;
            return fetch(event.request);
        })
    );
});