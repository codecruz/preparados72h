// Service worker: cachea el portal completo para que funcione sin conexión.
const CACHE = "prep72-v24";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "assets/styles.css", "assets/app.js", "assets/data.js", "assets/calc.js", "assets/news.js", "assets/world.js", "assets/figuras.js", "assets/icon.svg",
  "assets/img/nudo-as-de-guia.svg", "assets/img/nudo-ballestrinque.svg", "assets/img/nudo-tensor.jpg", "assets/img/nudo-pescador-doble.svg"];

self.addEventListener("install", (e) => {
  // cache: "reload": al instalar una versión nueva se descargan los archivos del servidor, no copias antiguas del navegador
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la red (contenido fresco) y, si falla, la caché.
// Los archivos propios se piden con cache: "no-cache": el navegador pregunta siempre al servidor si han
// cambiado (si no, responde 304 sin descargar nada), así una versión nueva se ve en cuanto hay conexión.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const propio = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(
    fetch(propio ? new Request(e.request.url, { cache: "no-cache", credentials: "same-origin" }) : e.request)
      .then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
