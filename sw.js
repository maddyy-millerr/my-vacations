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

//send a message to the client
function sendMessageToPWA(message) {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage(message);
        });
    });
}

//send  a message every ten seconds
setInterval(() => {
    sendMessageToPWA({type: "update", data: "New data available"});
}, 10000);

//listen for messages from the app
self.addEventListener("message", (event) => {
    console.log("Service workers received a message: ", event.data);

    //can respond back if needed
    event.source.postMessage({
        type: "response",
        data: "message received by SW"
    });
});

//create a broadcast channel - name here needs to match the name in the app
const channel = new BroadcastChannel("pwa_channel");

//listen for messages
channel.onmessage = (event) => {
    console.log("Received a message in Service Worker: ", event.data);
    
    //echo the message back to the PWA
    channel.postMessage("Service Worker received: " + event.data);
};

//open or create the database
let db;
const dbName = "SyncDatabase";
const request = indexedDB.open(dbName, 1); //name and version needs to match app.js

request.onerror = function (event) {
    console.error("Database error: " + event.target.error);
};

request.onsuccess = function (event) {
  //now we actually have our db
    db = event.target.result;
    console.log("Database opened successfully in service worker");
};

self.addEventListener("sync", function(event) {
    if(event.tag === "send-data") {
        event.waitUntil(sendDataToServer());
    }
});

function sendDataToServer() {
    return getAllPendingData()
        .then(function(dataList){
            return Promise.all(dataList.map(function(item){
                //simulate sending data
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if(Math.random() > 0.1) { //90% success rate
                            console.log("Data sent successfully: ", item.data);
                            resolve(item.id);
                        } else {
                            reject(new Error("Failed to send data"));
                        }
                    }, 1000);
                })
                .then(function(){
                    //if successful, remove the item from the db
                    return removeDataFromIndexedDB(item.id);
                });
            }));
        });
} //send data to srver

function getAllPendingData() {
    return new Promise((resolve, reject) => {
        //transaction to read from db
        const transaction = db.transaction(["pendingData"], "readonly");
        const objectStore = transaction.objectStore("pendingData");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject("Error fetching data: " + event.target.error);
        };
    });
}

function removeDataFromIndexedDB(id) {
    return new Promise((resolve, reject) => {
          const transaction = db.transaction(["pendingData"], "readwrite");
          const objectStore = transaction.objectStore("pendingData");
          const request = objectStore.delete(id);

           request.onsuccess = function (event) {
                 resolve();
           };

           request.onerror = function (event) {
               reject("Error removing data: " + event.target.error);
          };
      });
}