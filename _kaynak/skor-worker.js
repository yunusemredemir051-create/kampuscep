/* KampüsCepte canlı skor — Cloudflare Worker
   Kurulum: Cloudflare → Workers → Create → bu dosyayı yapıştır → Settings > Variables > Secret: API_KEY = (API-Football anahtarın).
   Anahtar sitede ya da GitHub'da durmaz; yalnızca Worker'da saklanır. Yanıt önbelleğe alınır (ücretsiz plan günde 100 istek). */
const IZIN = ["https://kampuscepte.com.tr", "https://www.kampuscepte.com.tr", "https://yunusemredemir051-create.github.io"];
const SUPER_LIG = 203, CL = 2, EL = 3, ECL = 848;
const GS = 645, FB = 611, BJK = 549, TS = 998, TR_MILLI = 777;

function ilgili(f) {
  const l = f.league.id, h = f.teams.home.id, a = f.teams.away.id, var_ = id => h === id || a === id;
  if (l === SUPER_LIG) return true;
  if (var_(TR_MILLI)) return true;
  if (l === CL) return var_(GS) || var_(FB);
  if (l === EL || l === ECL) return var_(BJK) || var_(TS);
  return false;
}
function sade(f) {
  return {
    id: f.fixture.id, lig: f.league.name, ligId: f.league.id, tur: f.league.round,
    zaman: f.fixture.date, durum: f.fixture.status.short, dk: f.fixture.status.elapsed,
    ev: { id: f.teams.home.id, ad: f.teams.home.name, gol: f.goals.home, kazandi: f.teams.home.winner },
    dep: { id: f.teams.away.id, ad: f.teams.away.name, gol: f.goals.away, kazandi: f.teams.away.winner },
    ulkeEv: f.league.country
  };
}
const CANLI = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"];

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get("Origin") || "";
    const cors = { "Access-Control-Allow-Origin": IZIN.includes(origin) ? origin : IZIN[0], "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const onbellek = caches.default, anahtar = new Request("https://skor.cache/v1");
    let yanit = await onbellek.match(anahtar);
    if (!yanit) {
      const bugun = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
      let veri, hata = null;
      try {
        const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${bugun}&timezone=Europe/Istanbul`, { headers: { "x-apisports-key": env.API_KEY } });
        veri = await r.json();
        if (veri.errors && Object.keys(veri.errors).length) hata = JSON.stringify(veri.errors);
      } catch (e) { hata = String(e); }
      const maclar = hata ? [] : (veri.response || []).filter(ilgili).map(sade);
      /* ne kadar süre saklayalım: canlı maç varsa 2 dk, 3 saat içinde başlayacak varsa 10 dk, yoksa 60 dk */
      const simdi = Date.now();
      let ttl = 3600;
      if (maclar.some(m => CANLI.includes(m.durum))) ttl = 120;
      else if (maclar.some(m => m.durum === "NS" && Math.abs(new Date(m.zaman) - simdi) < 3 * 3600e3)) ttl = 600;
      if (hata) ttl = 300;
      yanit = new Response(JSON.stringify({ guncelleme: simdi, maclar, hata }), { headers: { "content-type": "application/json", "cache-control": "public, max-age=" + ttl } });
      ctx.waitUntil(onbellek.put(anahtar, yanit.clone()));
    }
    const h = new Headers(yanit.headers); Object.entries(cors).forEach(([k, v]) => h.set(k, v));
    return new Response(yanit.body, { headers: h });
  }
};
