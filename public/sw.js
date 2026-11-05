const V='ar-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 if(/\/(assets|p)\//.test(u.pathname)||/\.(webp|png|woff2)$/.test(u.pathname)){e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);if(m)return m;const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}))}});
