// Service worker: cachea el portal completo para que funcione sin conexión.
const CACHE = "prep72-v16";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "assets/styles.css", "assets/app.js", "assets/data.js", "assets/calc.js", "assets/news.js", "assets/world.js", "assets/figuras.js", "assets/icon.svg",
  "assets/img/nudo-as-de-guia.svg", "assets/img/nudo-ballestrinque.svg", "assets/img/nudo-tensor.jpg", "assets/img/nudo-pescador-doble.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la red (contenido fresco) y, si falla, la caché.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
