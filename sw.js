
const cacheName='v1';
const cacheAssets =[
    '/',
    '/index.html',
    '/restaurant.html',

    '/js/main.js',
    '/js/jquery-3.3.1.min.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js',

    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',

    '/css/styles.css',

    '/data/restaurants.json',
]

self.addEventListener("install",e=>{
    console.log("sw installed")
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('caching files')
            cache.addAll(cacheAssets)
            .then(()=>self.skipWaiting())
        })
    )
})

self.addEventListener("activate",e=>{
    console.log("sw activated")
    //remove unwanted cache
    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('clearing old cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})


//fetch
self.addEventListener("fetch",e=>{
    console.log('sw fetching')
    e.respondWith(
        fetch(e.request)
        .catch(()=>{
            caches.match(e.request)
        })
    )
})


