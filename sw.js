self.addEventListener('fetch', function(event) {
    console.log('fetch called', event.request);
});