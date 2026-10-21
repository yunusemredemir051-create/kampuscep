/* KampüsCepte — özel gün temaları.
   O gün (ya da birkaç gün öncesinden) ana sayfa afişi, site renkleri ve süslemeler kendiliğinden değişir.
   ÖNİZLEME: herhangi bir sayfaya ?tarih=2026-10-29 eklenirse site o günü yaşıyormuş gibi görünür
   (yalnızca o tarayıcı sekmesinde; ?tarih=kapat ile çıkılır).
   Hicri takvime bağlı günler (kandiller, Ramazan, bayramlar) her yıl elle güncellenmelidir. */
(function () {
  "use strict";
  const IMG = "/gorseller/ozel/";
  const RENK = {
    "cumhuriyet": ["#ab0327", "#8e011f"], "yilbasi": ["#15247a", "#5e40ea"], "ogretmenler": ["#365dfc", "#4c5efc"],
    "sinav": ["#314cfc", "#4052fc"], "ramazan-bayrami": ["#694bf0", "#8555db"], "ramazan": ["#0e195a", "#4a2cc1"],
    "ramazan-giris": ["#091354", "#31239a"], "23-nisan": ["#619afa", "#9575fc"], "regaip": ["#131971", "#3f29aa"],
    "kurban": ["#6542f2", "#8e57d5"], "19-mayis": ["#c60b2c", "#ec3532"], "kadir": ["#0b0e5d", "#4d26c4"],
    "berat": ["#131968", "#3a32c5"], "mirac": ["#070d53", "#5232c3"], "babalar": ["#4160fc", "#3081f4"],
    "anneler": ["#f984b7", "#965dfb"], "mevlid": ["#13196a", "#6534a0"], "15-temmuz": ["#02194a", "#15153b"],
    "deprem": ["#101e37", "#0d101b"], "30-agustos": ["#b0051e", "#ab031d"], "10-kasim": ["#071023", "#000513"]
  };
  const TUR = {
    milli:   { mavi: "#d0142c", mor: "#e63946", acik: "#ffe5e8", sus: "konfeti", renkler: ["#e30a17", "#ff5a6a", "#f6c453"] },
    anma:    { mavi: "#3b4256", mor: "#5d6680", acik: "#e8eaf0", anma: true },
    dini:    { mavi: "#3a2fa8", mor: "#c8941c", acik: "#ece8ff", sus: "yildiz" },
    bayram:  { mavi: "#6a3fd6", mor: "#e09a26", acik: "#f1e9ff", sus: "konfeti", renkler: ["#f6c453", "#8b5cf6", "#ff8a3d", "#e94e77"] },
    yilbasi: { mavi: "#2a3fd0", mor: "#d42a3c", acik: "#e6ebff", sus: "kar" },
    anne:    { mavi: "#d6457f", mor: "#8b5cf6", acik: "#ffe6f0", sus: "kalp" },
    baba:    { mavi: "#2f6fe0", mor: "#2ba3c9", acik: "#e3f0ff", sus: "kalp" },
    okul:    {}
  };
  const pazar = (yil, ay, kacinci) => { const d = new Date(Date.UTC(yil, ay - 1, 1)); const ilk = (7 - d.getUTCDay()) % 7; return iso(new Date(Date.UTC(yil, ay - 1, 1 + ilk + 7 * (kacinci - 1)))); };
  const ILLER = "Kahramanmaraş · Hatay · Adıyaman · Malatya · Gaziantep · Osmaniye · Diyarbakır · Şanlıurfa · Adana · Kilis · Elazığ";

  /* gunler: "AA-GG" her yıl tekrar eder, "YYYY-AA-GG" tek seferlik, [bas, bit] aralık. once: kaç gün önceden başlasın. oncelik: çakışmada büyük olan kazanır */
  const TEMALAR = [
    { id: "cumhuriyet", ad: "29 Ekim Cumhuriyet Bayramı", tur: "milli", gunler: ["10-29"], oncelik: 5,
      baslik: "Cumhuriyet Bayramımız kutlu olsun!", alt: y => `Cumhuriyetimizin ${y - 1923}. yılı kutlu olsun.` },
    { id: "10-kasim", ad: "10 Kasım Atatürk'ü Anma", tur: "anma", gunler: ["11-10"], oncelik: 9,
      baslik: "Saygı ve özlemle anıyoruz", alt: y => `Ulu Önder Mustafa Kemal Atatürk'ü aramızdan ayrılışının ${y - 1938}. yılında rahmet, minnet ve özlemle anıyoruz.` },
    { id: "ogretmenler", ad: "24 Kasım Öğretmenler Günü", tur: "okul", sus: "kalp", gunler: ["11-24"], oncelik: 4,
      baslik: "Öğretmenler Günü kutlu olsun!", alt: "Bize emek veren tüm hocalarımıza teşekkürler." },
    { id: "regaip", ad: "Regaip Kandili", tur: "dini", gunler: ["2026-12-10"], oncelik: 7, baslik: "Regaip Kandiliniz mübarek olsun", alt: "Üç ayların ilk kandili; dualarınız kabul olsun." },
    { id: "yilbasi", ad: "Yılbaşı", tur: "yilbasi", gunler: ["01-01"], once: 3, oncelik: 5,
      onceBaslik: "Yeni yıla az kaldı!", baslik: "Mutlu yıllar!", alt: y => `${y} sana sağlık, başarı ve bol mutluluk getirsin.` },
    { id: "mirac", ad: "Miraç Kandili", tur: "dini", gunler: ["2027-01-04"], oncelik: 7, baslik: "Miraç Kandiliniz mübarek olsun", alt: "Bu mübarek gece dualarınıza vesile olsun." },
    { id: "berat", ad: "Berat Kandili", tur: "dini", gunler: ["2027-01-22"], oncelik: 7, baslik: "Berat Kandiliniz mübarek olsun", alt: "Bu mübarek gece hayırlara vesile olsun." },
    { id: "deprem", ad: "6 Şubat Depremleri Anma", tur: "anma", gunler: ["02-06"], oncelik: 9,
      baslik: "6 Şubat'ı unutmadık", alt: "6 Şubat 2023 depremlerinde hayatını kaybedenleri rahmetle anıyoruz.", iller: ILLER },
    { id: "ramazan-giris", ad: "Ramazan'a hoş geldin (ilk sahur)", tur: "dini", gunler: ["2027-02-07"], oncelik: 6,
      baslik: "Hoş geldin Ramazan", alt: "Bu gece ilk sahur. Hayırlı Ramazanlar!" },
    { id: "ramazan", ad: "Ramazan ayı", tur: "dini", gunler: [["2027-02-08", "2027-03-07"]], oncelik: 3, etiket: n => `Ramazan'ın ${n}. günü`,
      baslik: "Hayırlı Ramazanlar", alt: "On bir ayın sultanı bereket, huzur ve sağlık getirsin." },
    { id: "kadir", ad: "Kadir Gecesi", tur: "dini", gunler: ["2027-03-05"], oncelik: 7, baslik: "Kadir Geceniz mübarek olsun", alt: "Bin aydan hayırlı bu gecede dualarınız kabul olsun." },
    { id: "ramazan-bayrami", ad: "Ramazan Bayramı", tur: "bayram", gunler: [["2027-03-09", "2027-03-11"]], arife: "2027-03-08", oncelik: 6,
      onceBaslik: "Yarın bayram!", baslik: "Ramazan Bayramınız mübarek olsun!", alt: "Bayramın huzuru ve sevinci sevdiklerinizle birlikte olsun." },
    { id: "23-nisan", ad: "23 Nisan", tur: "milli", gunler: ["04-23"], once: 1, oncelik: 5,
      onceBaslik: "Yarın 23 Nisan!", baslik: "23 Nisan kutlu olsun!", alt: y => `Ulusal Egemenlik ve Çocuk Bayramımızın ${y - 1920}. yılı kutlu olsun.` },
    { id: "anneler", ad: "Anneler Günü", tur: "anne", gunler: [y => pazar(y, 5, 2)], oncelik: 4, baslik: "Anneler Günü kutlu olsun!", alt: "Bugün annene bir telefon aç, bir sarıl." },
    { id: "kurban", ad: "Kurban Bayramı", tur: "bayram", gunler: [["2027-05-16", "2027-05-19"]], arife: "2027-05-15", oncelik: 6,
      onceBaslik: "Yarın bayram!", baslik: "Kurban Bayramınız mübarek olsun!", alt: "Bayramınız sevdiklerinizle birlikte, bereketli ve huzurlu geçsin." },
    { id: "19-mayis", ad: "19 Mayıs", tur: "milli", gunler: ["05-19"], once: 1, oncelik: 7,
      onceBaslik: "Yarın 19 Mayıs!", baslik: "19 Mayıs kutlu olsun!", alt: y => `Atatürk'ü Anma, Gençlik ve Spor Bayramımızın ${y - 1919}. yılı kutlu olsun.` },
    { id: "babalar", ad: "Babalar Günü", tur: "baba", gunler: [y => pazar(y, 6, 3)], oncelik: 4, baslik: "Babalar Günü kutlu olsun!", alt: "Bugün babana bir telefon aç, bir sarıl." },
    { id: "15-temmuz", ad: "15 Temmuz", tur: "anma", gunler: ["07-15"], oncelik: 9,
      baslik: "15 Temmuz Demokrasi ve Milli Birlik Günü", alt: "15 Temmuz şehitlerimizi rahmetle, gazilerimizi minnetle anıyoruz." },
    { id: "mevlid", ad: "Mevlid Kandili (tarih yaklaşık)", tur: "dini", gunler: ["2027-08-13"], oncelik: 7, baslik: "Mevlid Kandiliniz mübarek olsun", alt: "Bu mübarek gece hayırlara vesile olsun." },
    { id: "30-agustos", ad: "30 Ağustos Zafer Bayramı", tur: "milli", gunler: ["08-30"], once: 1, oncelik: 5,
      onceBaslik: "Yarın 30 Ağustos!", baslik: "Zafer Bayramımız kutlu olsun!", alt: y => `Büyük Zafer'in ${y - 1922}. yıl dönümü kutlu olsun.` },
    /* sınav haftaları (en düşük öncelik) */
    ...[["Vize haftası", "2026-11-16", "2026-11-29"], ["Final haftası", "2027-01-04", "2027-01-17"], ["Bütünleme haftası", "2027-01-25", "2027-01-31"],
        ["Vize haftası", "2027-03-29", "2027-04-11"], ["Final haftası", "2027-05-31", "2027-06-13"], ["Bütünleme haftası", "2027-06-21", "2027-06-27"]]
      .map(([ad, b, s]) => ({ id: "sinav", ad, tur: "okul", gunler: [[b, s]], oncelik: 1, etiket: n => `${ad} · ${n}. gün`,
        baslik: "Sınavlarında başarılar!", alt: "Notlar ve testler KampüsCepte'de seni bekliyor. Kolay gelsin!" }))
  ];

  /* ---------- tarih yardımcıları ---------- */
  function iso(d) { return d.toISOString().slice(0, 10); }
  function gun(s) { return new Date(s + "T00:00:00Z"); }
  function ekle(s, n) { const d = gun(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function fark(a, b) { return Math.round((gun(b) - gun(a)) / 864e5); }
  function bugunTR() {
    try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
    catch (e) { return iso(new Date(Date.now() + 3 * 3600e3)); }
  }
  function yaz(s) { return gun(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long", timeZone: "UTC" }); }

  function anaGunler(t, yil) {
    const l = [];
    for (const g of t.gunler) {
      if (typeof g === "function") l.push(g(yil));
      else if (Array.isArray(g)) { for (let d = g[0]; d <= g[1]; d = ekle(d, 1)) l.push(d); }
      else if (g.length === 5) l.push(yil + "-" + g);
      else l.push(g);
    }
    return [...new Set(l)].sort();
  }
  function arifesi(t, yil) { return t.arife ? (t.arife.length === 5 ? yil + "-" + t.arife : t.arife) : null; }

  function bul(tarih) {
    const yil = +tarih.slice(0, 4), adaylar = [];
    for (const t of TEMALAR) for (const y of [yil - 1, yil, yil + 1]) {
      const gl = anaGunler(t, y); if (!gl.length) continue;
      const ilk = gl[0], son = gl[gl.length - 1], arife = arifesi(t, y);
      if (tarih >= ilk && tarih <= son) adaylar.push({ t, y, durum: "ana", sira: gl.indexOf(tarih) + 1, cok: gl.length > 1, p: t.oncelik + .5 });
      else if (arife && tarih === arife) adaylar.push({ t, y, durum: "arife", p: t.oncelik + .4 });
      else if (t.once && tarih < ilk && fark(tarih, ilk) <= t.once) adaylar.push({ t, y, durum: "once", kalan: fark(tarih, ilk), p: t.oncelik });
    }
    adaylar.sort((a, b) => b.p - a.p);
    return adaylar;
  }

  /* ---------- önizleme ---------- */
  let tarih = bugunTR(), onizleme = false;
  try {
    const q = new URLSearchParams(location.search).get("tarih");
    if (q === "kapat") sessionStorage.removeItem("kc-tarih");
    else if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) sessionStorage.setItem("kc-tarih", q);
    const s = sessionStorage.getItem("kc-tarih");
    if (s) { tarih = s; onizleme = true; }
  } catch (e) {}

  const adaylar = bul(tarih);
  if (onizleme) {
    const n = document.createElement("div");
    n.style.cssText = "position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9999;background:#141b34;color:#fff;font:700 12px/1.2 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.9;white-space:nowrap";
    n.innerHTML = `Önizleme: ${yaz(tarih)}${adaylar[0] ? " · " + adaylar[0].t.ad : " · özel gün yok"} <a href="?tarih=kapat" style="color:#9fb3ff;margin-left:6px">kapat</a>`;
    document.body.appendChild(n);
  }
  if (!adaylar.length) return;

  const a = adaylar[0], t = a.t, T = Object.assign({}, TUR[t.tur] || {}, t);
  const deger = v => typeof v === "function" ? v(a.y) : v;
  const baslik = a.durum === "ana" ? T.baslik : (T.onceBaslik || T.baslik);
  const alt = deger(a.durum === "ana" ? T.alt : (T.onceAlt || T.alt));
  let etiket;
  if (a.durum === "arife") etiket = "Arife · " + yaz(tarih);
  else if (a.durum === "once") etiket = a.kalan === 1 ? "Yarın" : `${a.kalan} gün kaldı`;
  else etiket = T.etiket ? T.etiket(a.sira) : (a.cok ? `${a.sira}. gün · ${yaz(tarih)}` : yaz(tarih));
  if (t.id === "yilbasi" && a.durum === "once" && a.kalan === 1) etiket = "Bu gece yılbaşı";
  // aynı güne denk gelen ikinci bir bayram varsa küçük not olarak ekle (ör. 19 Mayıs + Kurban Bayramı 4. gün)
  const ikinci = adaylar.find(x => x.t.id !== t.id && x.durum === "ana" && x.t.tur !== "okul");
  if (ikinci) etiket += " · " + (ikinci.t.etiket ? ikinci.t.etiket(ikinci.sira) : ikinci.t.ad + (ikinci.cok ? " " + ikinci.sira + ". gün" : ""));

  /* ---------- uygula ---------- */
  const kok = document.documentElement;
  kok.classList.add("ozel", "ozel-" + t.id);
  if (T.anma) kok.classList.add("ozel-anma");
  if (T.mavi) { kok.style.setProperty("--mavi", T.mavi); kok.style.setProperty("--mor", T.mor); kok.style.setProperty("--mavi-acik", T.acik); }
  const r = RENK[t.id] || ["#3765fe", "#5b61fc"];

  const css = document.createElement("style");
  css.textContent = `
  .ozel .afis{background:linear-gradient(180deg,${r[0]},${r[1]})!important}
  .ozel .afis .ust-bilgi{z-index:2;text-shadow:0 2px 12px rgba(0,0,0,.28)}
  .ozel .afis .ozel-iller{display:block;margin-top:10px;font-size:11.5px;line-height:1.55;color:rgba(255,255,255,.85);font-weight:600}
  .ozel-anma .afis{box-shadow:0 18px 40px -22px rgba(0,0,0,.6)}
  html.ozel-anma *,html.ozel-anma *::before,html.ozel-anma *::after{animation:none!important;transition:none!important}
  .ozel-serit{position:relative;z-index:5;padding:9px 16px;text-align:center;color:#fff;font:700 13px/1.4 inherit;background:linear-gradient(90deg,${r[0]},${r[1]})}
  .ozel-serit span{font-weight:500;opacity:.9;margin-left:6px}
  .ozel-sus{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
  .ozel-sus i{position:absolute;display:block}
  .ozel-kar i{top:-10px;width:6px;height:6px;border-radius:50%;background:#fff;opacity:.85;animation:oz-kar linear infinite}
  .ozel-yildiz i{width:3px;height:3px;border-radius:50%;background:#ffe6a3;box-shadow:0 0 6px 2px rgba(255,214,120,.6);animation:oz-parla ease-in-out infinite}
  .ozel-yagmur{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:9998}
  .ozel-yagmur i{position:absolute;top:-20px;display:block;animation:oz-dus linear forwards}
  .ozel-yagmur.kalp i{top:auto;bottom:-30px;font-style:normal;animation-name:oz-yuksel}
  .ozel-sayfa-kar{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:40}
  .ozel-sayfa-kar i{position:absolute;top:-12px;display:block;border-radius:50%;background:#fff;box-shadow:0 0 4px rgba(120,140,220,.6);animation:oz-kar-sayfa linear infinite}
  @keyframes oz-kar-sayfa{to{transform:translate(30px,105vh)}}
  @keyframes oz-kar{to{transform:translate(20px,300px)}}
  @keyframes oz-parla{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.2)}}
  @keyframes oz-dus{to{transform:translate(var(--x),110vh) rotate(720deg);opacity:.9}}
  @keyframes oz-yuksel{0%{opacity:0}15%{opacity:.9}to{transform:translate(var(--x),-105vh) scale(1.2);opacity:0}}
  @media (max-width:820px){
    .ozel .afis::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,${r[0]} 0%,${r[0]}d9 40%,${r[0]}00 78%)}
    .ozel .afis .ust-bilgi{max-width:60%}
    .ozel .afis .ust-bilgi h1{font-size:21px}
  }
  @media (prefers-reduced-motion:reduce){.ozel-sus,.ozel-yagmur,.ozel-sayfa-kar{display:none}}`;
  document.head.appendChild(css);

  const afis = document.querySelector(".afis");
  if (afis) {
    const img = afis.querySelector("img");
    if (img) { img.src = IMG + t.id + ".webp"; img.removeAttribute("fetchpriority"); }
    const k = afis.querySelector("#tarih"), h = afis.querySelector("#selam"), p = afis.querySelector(".ust-bilgi p");
    if (k) k.textContent = etiket;
    if (h) h.textContent = baslik;
    if (p) { p.textContent = alt; if (T.iller) { const s = document.createElement("span"); s.className = "ozel-iller"; s.textContent = T.iller; p.appendChild(s); } }
  } else if (document.body) {
    const s = document.createElement("div"); s.className = "ozel-serit";
    s.innerHTML = `<b></b><span></span>`; s.querySelector("b").textContent = baslik; s.querySelector("span").textContent = T.anma ? "" : alt;
    document.body.prepend(s);
  }

  /* ---------- Ramazan: iftar / imsak sayacı, imsakiye, fener süsü ---------- */
  ramazan();
  function ramazan() {
    const BAS = "2027-02-08", SON = "2027-03-08";   // ilk oruç ve son oruç (Diyanet 2027 takvimi)
    if (tarih < ekle(BAS, -1) || tarih > SON) return;
    /* Diyanet verisi vakitler.json'dan gelir (her gün otomatik güncellenir, ~30 gün ileriyi kapsar).
       O güne ait veri henüz yoksa aşağıdaki yaklaşık değerler kullanılır ve "yaklaşık" yazılır. */
    const YAKLASIK = {"2027-02-07":["05:53","17:58"],"2027-02-08":["05:52","17:59"],"2027-02-09":["05:52","18:01"],"2027-02-10":["05:51","18:02"],
      "2027-02-11":["05:50","18:03"],"2027-02-12":["05:49","18:04"],"2027-02-13":["05:48","18:05"],"2027-02-14":["05:47","18:06"],"2027-02-15":["05:45","18:07"],
      "2027-02-16":["05:44","18:08"],"2027-02-17":["05:43","18:10"],"2027-02-18":["05:42","18:11"],"2027-02-19":["05:41","18:12"],"2027-02-20":["05:40","18:13"],
      "2027-02-21":["05:38","18:14"],"2027-02-22":["05:37","18:15"],"2027-02-23":["05:36","18:16"],"2027-02-24":["05:35","18:17"],"2027-02-25":["05:33","18:18"],
      "2027-02-26":["05:32","18:19"],"2027-02-27":["05:31","18:20"],"2027-02-28":["05:29","18:21"],"2027-03-01":["05:28","18:23"],"2027-03-02":["05:26","18:24"],
      "2027-03-03":["05:25","18:25"],"2027-03-04":["05:24","18:26"],"2027-03-05":["05:22","18:27"],"2027-03-06":["05:21","18:28"],"2027-03-07":["05:19","18:29"],
      "2027-03-08":["05:18","18:30"]};
    let V = null;
    const vakit = g => (V && V[g]) ? { imsak: V[g][0], aksam: V[g][4], kesin: true } : (YAKLASIK[g] ? { imsak: YAKLASIK[g][0], aksam: YAKLASIK[g][1], kesin: false } : null);
    const sn = t => +t.slice(0, 2) * 3600 + +t.slice(3, 5) * 60;
    const saniyeTR = () => {
      try { const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()).split(":"); return (+p[0] % 24) * 3600 + +p[1] * 60 + +p[2]; }
      catch (e) { const d = new Date(Date.now() + 3 * 3600e3); return d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds(); }
    };
    const iki = n => String(n).padStart(2, "0");
    const sure = x => `${iki(Math.floor(x / 3600))}:${iki(Math.floor(x % 3600 / 60))}:${iki(x % 60)}`;
    const toplam = fark(BAS, SON) + 1;

    kok.classList.add("rz");
    kok.style.setProperty("--zemin", "#f5f0e4");
    const st = document.createElement("style");
    st.textContent = `
    html.rz body{background-color:#f5f0e4}
    .rz .afis .ust-bilgi h1{font-size:24px}
    .rz-kutu{margin-top:10px;color:#fff}
    .rz-kutu .rz-et{font-size:13px;font-weight:700;color:#f6d77e;letter-spacing:.2px}
    .rz-kutu .rz-sayac{font:800 40px/1.05 var(--font,inherit);letter-spacing:1px;color:#ffe08a;text-shadow:0 2px 18px rgba(246,196,83,.45);font-variant-numeric:tabular-nums}
    .rz-hap{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
    .rz-hap span{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:5px 9px;font-size:12.5px;font-weight:700;color:#fff}
    .rz-hap span b{color:#ffe08a;margin-left:4px}
    .rz-alt{display:flex;align-items:center;gap:10px;margin-top:10px;font-size:12px;font-weight:600;color:rgba(255,255,255,.85)}
    .rz-cubuk{flex:1;max-width:220px;height:5px;border-radius:9px;background:rgba(255,255,255,.2);overflow:hidden}
    .rz-cubuk i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#f6c453,#ffe08a)}
    .rz-imsakiye{margin-top:10px;border:1px solid rgba(255,224,138,.55);background:rgba(0,0,0,.18);color:#ffe08a;font:700 12.5px var(--font,inherit);padding:6px 12px;border-radius:99px;cursor:pointer}
    .rz-not{font-size:11px;color:rgba(255,255,255,.7);margin-left:6px}
    .rz-dlg{border:0;border-radius:22px;padding:0;max-width:440px;width:calc(100% - 32px);box-shadow:0 30px 60px -20px rgba(20,24,90,.5)}
    .rz-dlg::backdrop{background:rgba(14,18,60,.55)}
    .rz-dlg header{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;background:linear-gradient(120deg,#1a1f5c,#3a2a8c);color:#fff}
    .rz-dlg header b{font-size:17px}.rz-dlg header small{display:block;color:#f6d77e;font-weight:600;font-size:12px}
    .rz-dlg header button{border:0;background:rgba(255,255,255,.15);color:#fff;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer}
    .rz-dlg .rz-tablo{max-height:60vh;overflow:auto}
    .rz-dlg table{width:100%;border-collapse:collapse;font-size:14px}
    .rz-dlg th,.rz-dlg td{padding:9px 14px;text-align:left;border-bottom:1px solid #eee7d6}
    .rz-dlg th{position:sticky;top:0;background:#faf6ec;font-size:12px;color:#8a7a52}
    .rz-dlg tr.bugun td{background:#fff3cf;font-weight:800}
    .rz-sus{position:absolute;top:0;left:0;right:0;height:110px;pointer-events:none;z-index:1;overflow:hidden}
    .rz-sus .s{position:absolute;top:0;transform-origin:50% 0;animation:rz-salla 4s ease-in-out infinite}
    .rz-sus .s::before{content:"";position:absolute;left:50%;top:0;width:1px;height:var(--ip);background:linear-gradient(#c8941c,#e9c766)}
    .rz-sus svg{position:absolute;left:50%;top:var(--ip);transform:translateX(-50%);filter:drop-shadow(0 4px 6px rgba(120,80,0,.25))}
    @keyframes rz-salla{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
    @media (max-width:820px){.rz-kutu .rz-sayac{font-size:32px}.rz .afis .ust-bilgi h1{font-size:19px}.rz-sus{height:84px}.rz-sus svg{transform:translateX(-50%) scale(.8)}}
    @media (prefers-reduced-motion:reduce){.rz-sus .s{animation:none}}`;
    document.head.appendChild(st);

    /* asılı fener, hilal ve yıldızlar */
    const ALTIN = 'fill="#e6b84a" stroke="#b07d12" stroke-width="1.2"';
    const SEKIL = {
      fener: `<svg width="30" height="50" viewBox="0 0 30 50"><path d="M15 0v3" stroke="#b07d12"/><path d="M9 4h12l-2 4H11z" ${ALTIN}/><rect x="6" y="8" width="18" height="26" rx="5" ${ALTIN}/><path d="M11 12h3v18h-3zM16 12h3v18h-3z" fill="#fff4c9" opacity=".9"/><path d="M8 34h14l-3 5h-8z" ${ALTIN}/><circle cx="15" cy="43" r="2.5" ${ALTIN}/></svg>`,
      hilal: `<svg width="30" height="32" viewBox="0 0 30 32"><path d="M20 2a14 14 0 1 0 8 25A11 11 0 1 1 20 2z" ${ALTIN}/></svg>`,
      yildiz: `<svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 1l2.6 6.4L20 8l-5 4.4L16.4 20 11 16.6 5.6 20 7 12.4 2 8l6.4-.6z" ${ALTIN}/></svg>`
    };
    const sus = document.createElement("div"); sus.className = "rz-sus"; sus.setAttribute("aria-hidden", "true");
    [["yildiz", 58, 10], ["fener", 66, 24], ["yildiz", 74, 44], ["hilal", 82, 14], ["fener", 90, 34], ["yildiz", 97, 12]]
      .forEach(([t, x, ip], i) => { const e = document.createElement("div"); e.className = "s"; e.style.left = x + "%"; e.style.setProperty("--ip", ip + "px"); e.style.animationDelay = -(i * .7) + "s"; e.style.animationDuration = (3.4 + (i % 3) * .6) + "s"; e.innerHTML = SEKIL[t]; sus.appendChild(e); });
    const afisEl = document.querySelector(".afis");
    if (afisEl) afisEl.appendChild(sus);   // süs yalnızca ana sayfa afişinin sağ üstünde

    const afisKutu = document.querySelector(".afis .ust-bilgi");
    let kutu = null, seritYazi = null;
    if (afisKutu) {
      const p = afisKutu.querySelector("p"); if (p) p.style.display = "none";
      kutu = document.createElement("div"); kutu.className = "rz-kutu";
      kutu.innerHTML = `<div class="rz-et"></div><div class="rz-sayac">--:--:--</div>
        <div class="rz-hap"><span>İmsak<b class="rz-i">--:--</b></span><span>İftar<b class="rz-a">--:--</b></span></div>
        <div class="rz-alt"><span class="rz-gun"></span><div class="rz-cubuk"><i></i></div></div>
        <button class="rz-imsakiye" type="button">İmsakiye ›</button><span class="rz-not"></span>`;
      afisKutu.appendChild(kutu);
      kutu.querySelector(".rz-imsakiye").onclick = imsakiyeAc;
    } else {
      const serit = document.querySelector(".ozel-serit");
      if (serit) { const a = serit.querySelector("span"); if (a) a.textContent = ""; seritYazi = document.createElement("span"); serit.appendChild(seritYazi); }
    }

    function guncelle() {
      const s = saniyeTR();
      let et = null, kalan = 0, gosterGun = tarih;
      if (tarih < BAS) { const v = vakit(BAS); if (v) { et = "İlk sahurun bitişine (imsak)"; kalan = 86400 - s + sn(v.imsak); gosterGun = BAS; } }
      else {
        const v = vakit(tarih);
        if (v) {
          if (s < sn(v.imsak)) { et = "İmsaka kalan"; kalan = sn(v.imsak) - s; }
          else if (s < sn(v.aksam)) { et = "İftara kalan"; kalan = sn(v.aksam) - s; }
          else if (tarih < SON) { const v2 = vakit(ekle(tarih, 1)); if (v2) { et = "İmsaka kalan"; kalan = 86400 - s + sn(v2.imsak); gosterGun = ekle(tarih, 1); } }
        }
      }
      const gv = vakit(gosterGun);
      const gunNo = Math.min(toplam, Math.max(0, fark(BAS, tarih) + 1));
      if (kutu) {
        kutu.style.display = et ? "" : "none";
        if (!et) return;
        kutu.querySelector(".rz-et").textContent = et;
        kutu.querySelector(".rz-sayac").textContent = sure(kalan);
        kutu.querySelector(".rz-i").textContent = gv.imsak;
        kutu.querySelector(".rz-a").textContent = gv.aksam;
        kutu.querySelector(".rz-gun").textContent = "Elazığ · " + (gunNo ? `${gunNo}/${toplam}. gün` : "yarın ilk oruç");
        kutu.querySelector(".rz-cubuk i").style.width = (gunNo / toplam * 100) + "%";
        kutu.querySelector(".rz-not").textContent = gv.kesin ? "" : "Vakitler yaklaşık";
      } else if (seritYazi) {
        seritYazi.textContent = et ? `${et.replace("İlk sahurun bitişine (imsak)", "İlk imsaka kalan")}: ${sure(kalan)}` : "";
      }
    }
    function imsakiyeAc() {
      let d = document.querySelector(".rz-dlg");
      if (!d) {
        d = document.createElement("dialog"); d.className = "rz-dlg";
        document.body.appendChild(d);
        d.addEventListener("click", e => { if (e.target === d) d.close(); });
      }
      let satir = "", tum = true;
      for (let g = BAS, n = 1; g <= SON; g = ekle(g, 1), n++) {
        const v = vakit(g); if (!v.kesin) tum = false;
        satir += `<tr class="${g === tarih ? "bugun" : ""}"><td>${n}</td><td>${gun(g).toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short", timeZone: "UTC" })}</td><td>${v.imsak}</td><td>${v.aksam}</td></tr>`;
      }
      d.innerHTML = `<header><div><b>Elazığ İmsakiyesi</b><small>Ramazan 1448 · ${tum ? "Diyanet" : "kesinleşmeyen günler yaklaşıktır"}</small></div><button aria-label="Kapat">×</button></header>
        <div class="rz-tablo"><table><thead><tr><th>Gün</th><th>Tarih</th><th>İmsak</th><th>İftar</th></tr></thead><tbody>${satir}</tbody></table></div>`;
      d.querySelector("header button").onclick = () => d.close();
      if (d.showModal) d.showModal(); else d.setAttribute("open", "");
      const b = d.querySelector("tr.bugun"); if (b) b.scrollIntoView({ block: "center" });
    }
    fetch("/vakitler.json", { cache: "no-cache" }).then(r => r.json()).then(j => { V = j.gunler || null; }).catch(() => {})
      .finally(() => { guncelle(); setInterval(guncelle, 1000); });
  }

  /* ---------- süsleme ---------- */
  if (T.anma || !T.sus) return;
  try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) {}
  const rnd = (a, b) => a + Math.random() * (b - a);
  if ((T.sus === "kar" || T.sus === "yildiz") && afis) {
    const k = document.createElement("div"); k.className = "ozel-sus ozel-" + T.sus;
    for (let i = 0; i < (T.sus === "kar" ? 26 : 22); i++) {
      const e = document.createElement("i");
      e.style.left = rnd(0, 100) + "%";
      if (T.sus === "kar") { const b = rnd(3, 7); e.style.width = e.style.height = b + "px"; e.style.animationDuration = rnd(6, 12) + "s"; e.style.animationDelay = -rnd(0, 12) + "s"; }
      else { e.style.top = rnd(4, 70) + "%"; e.style.left = rnd(2, 55) + "%"; e.style.animationDuration = rnd(2, 4.5) + "s"; e.style.animationDelay = -rnd(0, 4) + "s"; }
      k.appendChild(e);
    }
    afis.insertBefore(k, afis.querySelector(".ust-bilgi"));
  }
  if (T.sus === "kar") {
    const k = document.createElement("div"); k.className = "ozel-sayfa-kar";
    for (let i = 0; i < 22; i++) {
      const e = document.createElement("i"), b = rnd(3, 7);
      e.style.left = rnd(0, 100) + "vw"; e.style.width = e.style.height = b + "px"; e.style.opacity = rnd(.35, .8);
      e.style.animationDuration = rnd(9, 18) + "s"; e.style.animationDelay = -rnd(0, 18) + "s";
      k.appendChild(e);
    }
    document.body.appendChild(k);
  }
  if (T.sus === "konfeti" || T.sus === "kalp") {
    const anahtar = "kc-sus-" + t.id + "-" + tarih, depo = onizleme ? sessionStorage : localStorage;
    try { if (depo.getItem(anahtar)) return; depo.setItem(anahtar, "1"); } catch (e) { return; }
    const y = document.createElement("div"); y.className = "ozel-yagmur" + (T.sus === "kalp" ? " kalp" : "");
    const renkler = T.renkler || ["#f06292", "#e91e63", "#ff8a80"];
    for (let i = 0; i < (T.sus === "kalp" ? 14 : 26); i++) {
      const e = document.createElement("i");
      e.style.left = rnd(0, 100) + "vw"; e.style.setProperty("--x", rnd(-60, 60) + "px");
      e.style.animationDuration = rnd(3.5, 6.5) + "s"; e.style.animationDelay = rnd(0, 1.8) + "s";
      if (T.sus === "kalp") { e.textContent = "♥"; e.style.color = renkler[i % renkler.length]; e.style.fontSize = rnd(14, 26) + "px"; }
      else { e.style.width = rnd(6, 10) + "px"; e.style.height = rnd(10, 16) + "px"; e.style.background = renkler[i % renkler.length]; e.style.borderRadius = "2px"; }
      y.appendChild(e);
    }
    document.body.appendChild(y);
    setTimeout(() => y.remove(), 9500);
  }
})();
