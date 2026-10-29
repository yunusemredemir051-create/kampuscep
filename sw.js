/* KampüsCepte service worker — sayfalar internet yokken de açılsın.
   Sayfalar ve veri.js önce internetten (güncel menü için), olmazsa önbellekten gelir.
   Görseller, PDF'ler ve yazı tipleri önce önbellekten gelir. */
const SURUM = "kc-v143";
const TEMEL = ["./", "index.html", "veri.js", "cerez.js", "tema.js", "favicon.svg", "manifest.webmanifest",
               "ikonlar/ikon-192.png", "ikonlar/ikon-512.png", "dersler.html", "gizlilik.html", "hakkimizda.html", "404.html"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(TEMEL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const yazitipi = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (u.origin !== location.origin && !yazitipi) return;      // Firebase, WhatsApp vb. hiç karışma
  const agOnce = r.mode === "navigate" || /\.(html|js|json|webmanifest)$/.test(u.pathname) || u.pathname.endsWith("/");
  if (agOnce && !yazitipi) {
    e.respondWith(fetch(r).then(y => { if (y.ok) { const k = y.clone(); caches.open(SURUM).then(c => c.put(r, k)); } return y; })
      .catch(() => caches.match(r, { ignoreSearch: true }).then(o => o || (r.mode === "navigate" ? caches.match("./") : undefined))));
  } else {
    e.respondWith(caches.match(r).then(o => o || fetch(r).then(y => {
      if (y.ok || y.type === "opaque") { const k = y.clone(); caches.open(SURUM).then(c => c.put(r, k)); }
      return y;
    })));
  }
});
