/* KampüsCepte service worker — sayfalar hızlı açılsın, internet yokken de çalışsın.
   - Sayfalar (HTML): önce internetten; 3 sn içinde cevap gelmezse önbellekteki kopya gösterilir (arkada yenisi iner).
   - veri.js ve .json dosyaları (menüler, vakitler): her zaman önce internetten — menü hep güncel kalır.
   - Sürüm numaralı (?v=) JS ve CSS: önbellekten anında, arkada yenisi iner. Dosyayı değiştirince ?v= numarasını artır.
   - Sürüm numarasız JS: önce internetten, olmazsa önbellekten.
   - Görseller, PDF'ler ve yazı tipleri: önce önbellekten. */
const SURUM = "kc-v228";
const TEMEL = ["./", "index.html", "veri.js", "cerez.js", "tema.js", "favicon.svg", "manifest.webmanifest",
               "ikonlar/ikon-192.png", "ikonlar/ikon-512.png", "kc.css", "ana.css", "takvim-izgara.js", "masaustu.css", "uygulama.css", "yazitipi/nunito-latin.woff2", "yazitipi/nunito-latin-ext.woff2", "kodatolye.js", "vize.js", "dersler.html", "gizlilik.html", "hakkimizda.html", "404.html"];
const SAYFA_BEKLE = 3000;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(TEMEL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

/* Önbelleğe yaz; sürüm numaralı dosyanın eski sürümlerini (aynı yol, farklı ?v=) sil */
function sakla(r, y, eskileriSil) {
  if (!(y.ok || y.type === "opaque")) return Promise.resolve();
  const k = y.clone();
  return caches.open(SURUM).then(c => {
    const yaz = c.put(r, k);
    if (!eskileriSil) return yaz;
    const yol = new URL(r.url).pathname;
    return Promise.all([yaz, c.keys().then(ks => Promise.all(ks.filter(x => {
      const u = new URL(x.url);
      return u.pathname === yol && x.url !== r.url;
    }).map(x => c.delete(x))))]);
  }).catch(() => {});
}

/* İnternetten çek; cevap gelince önbelleğe yazılması işçi kapanmadan tamamlansın diye hemen kayda alınır */
function ag(e, r, eskileriSil) {
  const p = fetch(r);
  e.waitUntil(p.then(y => sakla(r, y, eskileriSil)).catch(() => {}));
  return p;
}
const yedek = r => caches.match(r, { ignoreSearch: true }).then(o => o || (r.mode === "navigate" ? caches.match("./") : undefined));

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const yazitipi = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (u.origin !== location.origin && !yazitipi) return;      // Firebase, WhatsApp vb. hiç karışma

  // Sayfalar: önce internet, 3 sn'de gelmezse önbellek (internet cevabı yine de önbelleğe yazılır)
  if (r.mode === "navigate") {
    const p = ag(e, r);
    e.respondWith(new Promise(coz => {
      let bitti = false;
      const bitir = y => { if (!bitti && y) { bitti = true; coz(y); } };
      const sayac = setTimeout(() => yedek(r).then(bitir), SAYFA_BEKLE);
      p.then(y => { clearTimeout(sayac); bitir(y); })
       .catch(() => { clearTimeout(sayac); yedek(r).then(o => bitir(o || Response.error())); });
    }));
    return;
  }
  if (yazitipi) {
    e.respondWith(caches.match(r).then(o => o || ag(e, r)));
    return;
  }

  const yol = u.pathname;
  const kod = /\.(js|css)$/.test(yol);
  const veri = yol.endsWith("/veri.js") || /\.(json|webmanifest|html)$/.test(yol) || yol.endsWith("/");

  // Menü verisi, JSON ve sürüm numarasız JS: her zaman önce internet, olmazsa önbellek
  if (veri || (kod && !u.searchParams.has("v"))) {
    e.respondWith(ag(e, r).catch(() => yedek(r)));
    return;
  }

  // Sürüm numaralı (?v=) JS/CSS: önbellekten anında, arkada güncelle
  if (kod) {
    e.respondWith(caches.match(r).then(o => {
      const p = ag(e, r, true);
      if (o) { p.catch(() => {}); return o; }
      return p.catch(() => yedek(r));
    }));
    return;
  }

  // Görseller, PDF'ler vb.: önce önbellek
  e.respondWith(caches.match(r).then(o => o || ag(e, r)));
});
