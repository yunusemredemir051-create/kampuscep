// kc-unievi — Cloudflare Worker (aracı)
// Üniversite Evi sitesi (unievi.firat.edu.tr) yurt dışı IP'lerinden gelen bağlantılara cevap vermiyor. Menüyü okuyan
// GitHub Actions sunucuları yurt dışında olduğu için sayfayı bu Worker üzerinden çeker (bkz. ARAYUZ-PLANI.md Ek 2).
//
// Bu dosya depodan otomatik yüklenmez. Cloudflare panelinde elle yayınlanır:
//   Workers & Pages → Create → Worker → adı "kc-unievi" → Deploy → Edit code → bu dosyanın tamamını yapıştır → Deploy.
// Gizli anahtar yoktur: Worker yalnızca tek bir sabit adresi okur, başka adrese istek atmaz.
//
// Adresler:
//   /        → unievi.firat.edu.tr ana sayfasının HTML'i (10 dakika önbellekli; siteye gereksiz yük bindirmez)
//   /durum   → deneme: sayfa açılabildi mi, kaç ms sürdü, Worker hangi Cloudflare veri merkezinde çalıştı

const KAYNAK = "https://unievi.firat.edu.tr/";
const ONBELLEK_SN = 600;

async function getir() {
  const iptal = new AbortController();
  const zamanlayici = setTimeout(() => iptal.abort(), 25000);
  const bas = Date.now();
  try {
    const r = await fetch(KAYNAK, {
      signal: iptal.signal,
      headers: { "User-Agent": "Mozilla/5.0 (KampusCepte menu bot; +https://kampuscepte.com.tr)", "Accept-Language": "tr" },
      cf: { cacheTtl: ONBELLEK_SN, cacheEverything: true }
    });
    const govde = await r.text();
    return { ok: r.ok, durum: r.status, ms: Date.now() - bas, govde };
  } catch (e) {
    return { ok: false, durum: 0, ms: Date.now() - bas, hata: String(e && e.name === "AbortError" ? "zaman aşımı (25 sn)" : e) };
  } finally {
    clearTimeout(zamanlayici);
  }
}

export default {
  async fetch(istek) {
    if (istek.method !== "GET") return new Response("Yalnızca GET", { status: 405 });
    const yol = new URL(istek.url).pathname;
    const merkez = (istek.cf && istek.cf.colo) || "?";

    if (yol === "/durum") {
      const s = await getir();
      return Response.json({
        acildi: s.ok, httpDurum: s.durum, sureMs: s.ms, hata: s.hata || null,
        menuBolumuVar: !!(s.govde && s.govde.includes("fm-panel")),
        cloudflareMerkezi: merkez
      }, { headers: { "Cache-Control": "no-store" } });
    }

    if (yol !== "/") return new Response("Bulunamadı", { status: 404 });
    const s = await getir();
    if (!s.ok) return new Response(`Kaynak açılamadı: ${s.hata || "HTTP " + s.durum}`, { status: 502 });
    return new Response(s.govde, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": `public, max-age=${ONBELLEK_SN}`, "X-KC-Merkez": merkez }
    });
  }
};
