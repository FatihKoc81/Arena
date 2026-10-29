const CACHE = "beyin-firtinasi";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE && x.startsWith("beyin-firtinasi")).map(x => caches.delete(x))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  url.searchParams.set("_t", Date.now());
  e.respondWith(
    fetch(url.toString(), { cache: "no-store" })
      .then(r => {
        if (r.ok) {
          const kopya = r.clone();
          caches.open(CACHE).then(c => c.put(req, kopya));
        }
        return r;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});