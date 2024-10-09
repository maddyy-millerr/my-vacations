const VERSION = "v1";

/* offline resource list */
const APP_STATIC_RESOURCES = [
    "index.html", 
    "style.css",
    "app.js",
    "vacationtracker.json",
    "assets/icons/icon-512x512.png"
];

const CACHE_NAME = `vacation-tracker-${VERSION}`;

/* handle the install event and retrieve and store the file listed for the cache */
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })()
    );
});

/* use activate event to delete any old caches so we don't run out od space.
going to delete all but the current one, then set the service worker as the controller for our app (PWA)*/
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            //get the names of existing caches
            const names = await caches.keys();

            //iterate through the list and check if each is the current cache, delete it if it isn't
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            ); //promise All

            //use the claim() method of client's interface to enable our service worker as the controller
            await clients.claim();
        })()
    ); //wait until
});

/* use the fetch event to intercept requests to the server so we can
serve up the cached pages or respond with an error or 404*/
self.addEventListener("fetch", (event) => {
    event.respondWith(
        async () => {
            //try to get resource from the cache
            const cachedResponse = await cache.match(event.request);
            if(cachedResponse) {
                return cachedResponse;
            }

            //if not in cache, try to fetch from the framework
            try {
                const networkResponse = await fetch(event.request);

                //cache new response for future use
                cache.put(event.request, networkResponse.clone());

                return networkResponse;
            } catch(error) {
                console.log("Fetch failed; returning offline page instead.", error);

                // if the request is for a page, return the index.html as a fallback
                if(event.request.mode === "navigate") {
                    return cache.match("/index.html");
                }

                // for everything else, throw an error
                //might want to return a default offline asset instead
                throw error;
            }
        })()
});