'use strict';

var d = new Date();
var staticCacheNames = 'currency-conveter-static-v' + d.getTime();
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(staticCacheNames).then(function (cache) {
        return cache.addAll(['/', 'build/main.bundle.js', 'css/main.css', 'https://free.currencyconverterapi.com/api/v5/currencies']);
    }));
});

self.addEventListener('activate', function (event) {
    console.log('activate called');
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.filter(function (cacheName) {
            return cacheName.startsWith('currency-conveter-') && cacheName != staticCacheNames;
        }).map(function (cacheName) {
            return caches.delete(cacheName);
        }));
    }));
});
// comm
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response) return response;
        return fetch(event.request);
    }));
});
