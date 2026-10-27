const V = "sgp-v1", A = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(A)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== V).map(n => caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const cp = res.clone();
      caches.open(V).then(c => c.put(e.request, cp));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
