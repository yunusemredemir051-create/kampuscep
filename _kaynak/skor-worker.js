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

/* workers.dev adresinde caches.default (Cache API) ÇALIŞMAZ; bu yüzden her istek API'ye gidip dakikalık limiti dolduruyordu.
   Çözüm: isolate belleğinde önbellek + aynı anda gelen istekleri tek isteğe indirme + hata olursa boş liste döndürme. */
let SON = null, BITIS = 0, BEKLEYEN = null;

async function yenile(env) {
  const bugun = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
  let veri, hata = null;
  try {
    const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${bugun}&timezone=Europe/Istanbul`,
      { headers: { "x-apisports-key": env.API_KEY }, cf: { cacheTtl: 60, cacheEverything: true } });
    veri = await r.json();
    if (veri.errors && Object.keys(veri.errors).length) hata = JSON.stringify(veri.errors);
  } catch (e) { hata = String(e); }
  const simdi = Date.now();
  if (hata) {                                  /* hata: skor gösterme (boş liste), 2 dk sonra tekrar dene */
    BITIS = simdi + 120000;
    return { guncelleme: simdi, maclar: [], hata };
  }
  const maclar = (veri.response || []).filter(ilgili).map(sade);
  let ttl = 3600;
  if (maclar.some(m => CANLI.includes(m.durum))) ttl = 90;
  else if (maclar.some(m => m.durum === "NS" && Math.abs(new Date(m.zaman) - simdi) < 3 * 3600e3)) ttl = 600;
  SON = { guncelleme: simdi, maclar, hata: null };
  BITIS = simdi + ttl * 1000;
  return SON;
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = { "Access-Control-Allow-Origin": IZIN.includes(origin) ? origin : IZIN[0], "Vary": "Origin", "content-type": "application/json", "cache-control": "no-store" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    let govde;
    if (SON && Date.now() < BITIS) govde = SON;
    else {
      if (!BEKLEYEN) BEKLEYEN = yenile(env).finally(() => { BEKLEYEN = null; });
      govde = await BEKLEYEN;
    }
    return new Response(JSON.stringify(govde), { headers: cors });
  }
};
