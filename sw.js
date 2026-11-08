/* Arena servis çalışanı: her zaman önce ağdan/dosyadan taze içerik alır, eski önbellekleri siler (güncellemeler takılı kalmasın). */
const SURUM = "arena-20261108-google-update2";
self.addEventListener("install", () => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((k) => Promise.all(k.filter((x) => x !== SURUM).map((x) => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-store" })
      .then((res) => {
        if (res && res.ok) { const kopya = res.clone(); caches.open(SURUM).then((c) => c.put(r, kopya)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(r).then((m) => m || caches.match(r, { ignoreSearch: true })))
  );
});
