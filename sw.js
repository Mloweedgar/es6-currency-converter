self.addEventListener('fetch', function(event) {
   if ( event.request.url.endsWith('currencies')) {
    event.respondWith(
        fetch(event.request)
        .then(function(response) {
            if (response.status == 404){
                return new Response('Whoops, not found');
            }
            return response;
            
        })
        .catch(function() {
            return new Response('Uh oh, that totally failed');
        })
    )
   }
});