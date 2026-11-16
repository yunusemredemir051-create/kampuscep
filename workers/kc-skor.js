// kc-skor — Cloudflare Worker (https://kc-skor.yunusemredemir051.workers.dev)
// Ana sayfadaki maç skorları (skor.js) için API-Football'dan günün ilgili maçlarını çeker ve önbelleğe alır.
// Bu dosya Cloudflare'deki yayındaki sürümün kopyasıdır (16 Kasım 2026). Depodan otomatik yüklenmez;
// değişiklikler Cloudflare panelinde (Workers & Pages → kc-skor → Edit code) elle yayınlanır.
// API anahtarı koda yazılmaz: Cloudflare'de "API_KEY" gizli değişkeninde durur.

const IZIN = ["https://kampuscepte.com.tr", "https://www.kampuscepte.com.tr", "https://yunusemredemir051-create.github.io"];

// Takım ve lig kimlikleri (API-Football)
const GS = 645, FB = 611, BJK = 549, TS = 998, TR = 777;

function ilgili(f) {
  const l = f.league.id, h = f.teams.home.id, a = f.teams.away.id;
  const v = id => h === id || a === id;
  if (l === 203) return true;                       // Süper Lig
  if (v(TR)) return true;                           // Türkiye milli takımı
  if (l === 2) return v(GS) || v(FB);               // Şampiyonlar Ligi
  if (l === 3 || l === 848) return v(BJK) || v(TS); // Avrupa Ligi / Konferans Ligi
  return false;
}

function sade(f) {
  return {
    a: f.fixture.id, lig: f.league.name, ligId: f.league.id, zaman: f.fixture.date,
    durum: f.fixture.status.short, dk: f.fixture.status.elapsed,
    ev:  { id: f.teams.home.id, ad: f.teams.home.name, gol: f.goals.home, kazandi: f.teams.home.winner },
    dep: { id: f.teams.away.id, ad: f.teams.away.name, gol: f.goals.away, kazandi: f.teams.away.winner }
  };
}

const CANLI = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"];

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get("Origin") || "";
    const cors = { "Access-Control-Allow-Origin": IZIN.includes(origin) ? origin : IZIN[0], "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    const onbellek = caches.default;
    const anahtar = new Request("https://skor.cache/v1");
    let yanit = await onbellek.match(anahtar);

    if (!yanit) {
      const bugun = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
      let veri = null, hata = null;
      try {
        const r = await fetch("https://v3.football.api-sports.io/fixtures?date=" + bugun + "&timezone=Europe/Istanbul",
          { headers: { "x-apisports-key": env.API_KEY } });
        veri = await r.json();
        if (veri.errors && Object.keys(veri.errors).length) hata = JSON.stringify(veri.errors);
      } catch (e) { hata = String(e); }

      const maclar = hata ? [] : (veri.response || []).filter(ilgili).map(sade);
      const simdi = Date.now();
      let ttl = 3600;                                                       // maç yoksa 1 saat
      if (maclar.some(m => CANLI.includes(m.durum))) ttl = 120;             // canlı maç varsa 2 dk
      else if (maclar.some(m => m.durum === "NS" && Math.abs(new Date(m.zaman) - simdi) < 3 * 3600000)) ttl = 600;
      if (hata) ttl = 300;

      yanit = new Response(JSON.stringify({ guncelleme: simdi, maclar: maclar, hata: hata, toplam: veri && veri.results }),
        { headers: { "content-type": "application/json", "cache-control": "public, max-age=" + ttl } });
      ctx.waitUntil(onbellek.put(anahtar, yanit.clone()));
    }

    const h = new Headers(yanit.headers);
    Object.keys(cors).forEach(k => h.set(k, cors[k]));
    return new Response(yanit.body, { headers: h });
  }
};
