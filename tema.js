/* KampüsCepte koyu mod.
   HERKESE_ACIK = false iken yalnızca önizlemeyi açan görür:
     aç:     herhangi bir sayfaya  ?koyu=onizleme
     kapat:  ?koyu=kapat
   Onaydan sonra HERKESE_ACIK = true yap (ve sayfalardaki tema.js?v= numarasını artır).
   Tercih localStorage "kc-tema" içinde: "acik" | "koyu" | "sistem" (varsayılan: sistem = telefonun ayarı).
   Bu dosya <head> içinde defer OLMADAN yüklenir; böylece sayfa açılırken beyaz parlama olmaz. */
(function () {
  var HERKESE_ACIK = true;

  var kok = document.documentElement;
  function oku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function yaz(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function stil(css) { var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); }

  // Tema düğmeleri, özellik açık değilken hiç görünmesin
  stil("html:not(.tema-var) .tema-ui{display:none!important}");

  /* Genel önizleme: herhangi bir sayfaya ?onizleme=<ad> eklenince bu tarayıcıda <html class="oniz-<ad>"> olur.
     ?onizleme=kapat hepsini kapatır. Sayfalar yeni özelliği bu sınıfa göre gösterir. */
  try {
    var oq = new URLSearchParams(location.search).get("onizleme"), ol = JSON.parse(localStorage.getItem("kc-onizleme") || "[]");
    if (oq === "kapat") ol = []; else if (oq && /^[a-z0-9-]+$/.test(oq) && ol.indexOf(oq) < 0) ol.push(oq);
    if (oq) localStorage.setItem("kc-onizleme", JSON.stringify(ol));
    for (var oi = 0; oi < ol.length; oi++) kok.classList.add("oniz-" + ol[oi]);
  } catch (e) {}

  try {
    var q = new URLSearchParams(location.search).get("koyu");
    if (q === "onizleme") { yaz("kc-koyu-onizleme", "1"); if (!oku("kc-tema")) yaz("kc-tema", "koyu"); }
    else if (q === "kapat") yaz("kc-koyu-onizleme", null);
  } catch (e) {}
  var onizleme = !HERKESE_ACIK && oku("kc-koyu-onizleme") === "1";
  if (!HERKESE_ACIK && !onizleme) return;
  kok.classList.add("tema-var");

  /* ---------- Renk temaları (takımlar) ----------
     Açık/Koyu moddan bağımsızdır; yalnızca vurgu rengini, açılış afişini ve arka plan ışımasını değiştirir.
     Tercih localStorage "kc-renk": "" (klasik mavi) | turk | gs | fb | bjk | ts | amed | erzincan | elazig | antep
     a = açık modda vurgu, k = koyu modda vurgu, t = açık vurgu zemini (rgb), h = afiş gradyanı, g1/g2 = ışıma rgb */
  var RENKLER = [
    { id: "zumrut", m: "#0b6b4b", ad: "Zümrüt", c: ["#0e9f6e", "#0b6b4b"], a: "#0e9f6e", k: "#34d399", t: "221,243,232", h: "linear-gradient(120deg,#0e9f6e,#0b6b4b)", g1: "14,159,110", g2: "11,107,75" },
    { id: "gunbatimi", m: "#e5484d", ad: "Gün Batımı", c: ["#ff7a45", "#e5484d"], a: "#ee5a2c", k: "#ff9566", t: "255,229,216", h: "linear-gradient(120deg,#ff7a45,#e5484d)", g1: "255,122,69", g2: "229,72,77" },
    { id: "okyanus", m: "#3b82f6", ad: "Okyanus", c: ["#22d3ee", "#3b82f6"], a: "#1d8fd6", k: "#22d3ee", t: "216,240,252", h: "linear-gradient(120deg,#22d3ee,#3b82f6)", g1: "34,211,238", g2: "59,130,246" },
    { id: "lavanta", m: "#6d4ae0", ad: "Lavanta", c: ["#8b5cf6", "#6d4ae0"], a: "#8b5cf6", k: "#b197fc", t: "235,227,255", h: "linear-gradient(120deg,#8b5cf6,#6d4ae0)", g1: "139,92,246", g2: "109,74,224" },
    { id: "turk", m: "#ff8a93",     ad: "Türk",         c: ["#e30a17", "#ffffff"], a: "#d4081a", k: "#ff5a66", t: "255,222,225", h: "linear-gradient(120deg,#e30a17,#b8000f)", g1: "227,10,23", g2: "255,120,120" },
    { id: "",         ad: "Klasik",       c: ["#3b5bfd", "#8d5cf6"], a: "#3b5bfd", k: "#6b84ff", t: "230,235,255", h: "linear-gradient(120deg,#3a63fd,#8d5cf6)", g1: "90,110,255", g2: "255,138,61" },
    { id: "gs", m: "#fdb912",       ad: "Galatasaray",  c: ["#a90432", "#fdb912"], a: "#a90432", k: "#ff5c7d", t: "255,226,232", h: "linear-gradient(120deg,#a90432,#d9182f 55%,#fdb912)", g1: "169,4,50", g2: "253,185,18" },
    { id: "fb", m: "#ffd800",       ad: "Fenerbahçe",   c: ["#12296b", "#ffd800"], a: "#163a93", k: "#ffd800", t: "224,232,255", h: "linear-gradient(120deg,#0c1d55,#1d3fa6 60%,#ffd800)", g1: "29,63,166", g2: "255,216,0" },
    { id: "bjk", m: "#8a8d93",      ad: "Beşiktaş",     c: ["#111111", "#ffffff"], a: "#1b1b1b", k: "#b9bcc4", t: "232,232,234", h: "linear-gradient(120deg,#0b0b0b,#3b3b3d)", g1: "70,70,75", g2: "150,150,155" },
    { id: "ts", m: "#1294de",       ad: "Trabzonspor",  c: ["#7d0f35", "#1294de"], a: "#7d0f35", k: "#ff6f9b", t: "255,226,236", h: "linear-gradient(120deg,#7d0f35,#a02a63 55%,#1294de)", g1: "125,15,53", g2: "18,148,222" },
    { id: "amed", m: "#0f8a3c",     ad: "Amedspor",     c: ["#d3202b", "#0f8a3c"], a: "#c91b27", k: "#ff6a73", t: "255,228,229", h: "linear-gradient(120deg,#c91b27,#e2a817 52%,#0f8a3c)", g1: "201,27,39", g2: "15,138,60" },
    { id: "erzincan", m: "#7a0f13", ad: "Erzincanspor", c: ["#d71920", "#141414"], a: "#d71920", k: "#ff5d63", t: "255,225,226", h: "linear-gradient(120deg,#151515,#7a0f13 55%,#d71920)", g1: "215,25,32", g2: "40,40,40" },
    { id: "elazig", m: "#c25a6f",   ad: "Elazığspor",   c: ["#7a1426", "#ffffff"], a: "#7a1426", k: "#e5718a", t: "250,226,231", h: "linear-gradient(120deg,#5e0f1d,#8f1b33 65%,#c25a6f)", g1: "122,20,38", g2: "200,100,120" },
    { id: "antep", m: "#8c0010",    ad: "Gaziantep FK", c: ["#e1001a", "#111111"], a: "#d4001a", k: "#ff5565", t: "255,225,228", h: "linear-gradient(120deg,#e1001a,#8c0010 60%,#111111)", g1: "225,0,26", g2: "30,30,30" }
  ];
  (function () {
    var css = "";
    RENKLER.forEach(function (r) {
      if (!r.id) return;
      var S = 'html[data-renk="' + r.id + '"]';
      css += S + "{--mavi:" + r.a + ";--mor:" + r.m + ";--mavi-acik:rgb(" + r.t + ");--afis-bg:" + r.h + ";--afis-bg-masaustu:" + r.h + ";--afis-golge:0 18px 40px -20px " + r.a + "}" +
        S + " .isik{background:radial-gradient(520px 380px at 90% 0%,rgba(" + r.g2 + ",.16),transparent 70%),radial-gradient(600px 460px at -5% 25%,rgba(" + r.g1 + ",.17),transparent 70%),var(--zemin)}" +
        S + '[data-tema="koyu"]{--mavi:' + r.k + ";--mor:" + r.m + ";--mavi-acik:color-mix(in srgb," + r.k + " 22%,#141a2c)!important}" +
        S + '[data-tema="koyu"] .isik{background:radial-gradient(520px 380px at 90% 0%,rgba(' + r.g2 + ',.13),transparent 70%),radial-gradient(600px 460px at -5% 25%,rgba(' + r.g1 + ',.2),transparent 70%),var(--zemin)}' +
        S + '[data-tema="koyu"] .btn.ana,' + S + '[data-tema="koyu"] .filtre button.aktif{color:' + (r.id === "fb" || r.id === "bjk" ? "#101322" : "#fff") + "}\n";
    });
    /* seçici düğmeleri (iki renkli yuvarlak) */
    css += ".renk-sec{display:grid;grid-template-columns:repeat(auto-fill,minmax(66px,1fr));gap:8px 6px}" +
      ".renk-dugme{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;padding:7px 2px;border-radius:14px;font:700 11px/1.2 var(--font,system-ui);color:var(--soluk,#6b7390);text-align:center}" +
      ".renk-dugme i{display:block;width:34px;height:34px;border-radius:50%;border:2px solid var(--cam-guclu,#fff);box-shadow:0 0 0 1px var(--cizgi,#e6e9f4)}" +
      ".renk-dugme.aktif{background:var(--mavi-acik);color:var(--yazi,#141b34)}.renk-dugme.aktif i{box-shadow:0 0 0 2.5px var(--mavi)}" +
      ".renk-dugme:focus-visible{outline:2px solid var(--mavi);outline-offset:1px}";
    stil(css);
  })();
  function renkOku() { var r = oku("kc-renk") || ""; return RENKLER.some(function (x) { return x.id === r; }) ? r : ""; }
  function renkUygula() {
    var r = kok.classList.contains("ozel-renkli") ? "" : renkOku(); /* özel günde seçilen takım teması geçici olarak devre dışı */
    if (r) kok.setAttribute("data-renk", r); else kok.removeAttribute("data-renk");
    var b = document.querySelectorAll("[data-renk-sec]");
    for (var i = 0; i < b.length; i++) {
      var on = b[i].getAttribute("data-renk-sec") === r;
      b[i].classList.toggle("aktif", on);
      if (on && b[i].parentNode) b[i].parentNode.setAttribute("data-aktif-ad", b[i].getAttribute("title") || ""); b[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && kok.getAttribute("data-tema") !== "koyu") {
      var cur = RENKLER.filter(function (x) { return x.id === r; })[0];
      m.setAttribute("content", r && cur ? cur.a : "#eef3ff");
    }
  }
  function renkSecicileriKur() {
    document.querySelectorAll(".renk-sec").forEach(function (kutu) {
      if (kutu.getAttribute("data-kuruldu")) return;
      kutu.setAttribute("data-kuruldu", "1");
      kutu.innerHTML = RENKLER.map(function (r) {
        return '<button type="button" class="renk-dugme" data-renk-sec="' + r.id + '" aria-pressed="false" title="' + r.ad + '" aria-label="' + r.ad + '"><i style="background:linear-gradient(135deg,' +
          r.c[0] + ' 0 50%,' + r.c[1] + ' 50% 100%)"></i>' + r.ad + "</button>";
      }).join("");
    });
    renkUygula();
  }
  window.kcRenk = { ayarla: function (r) { yaz("kc-renk", r || null); renkUygula(); }, liste: RENKLER, aktif: renkOku, yenile: renkUygula };
  renkUygula();
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-renk-sec]");
    if (b) kcRenk.ayarla(b.getAttribute("data-renk-sec"));
  });

  var K = 'html[data-tema="koyu"]';
  var kurallar = [
    /* renk değişkenleri */
    ["", "color-scheme:dark;--zemin:#0e1220!important;--cam:rgba(30,36,60,.72);--cam-guclu:rgba(38,45,74,.94);--cam-kenar:rgba(255,255,255,.07);" +
      "--golge:0 10px 30px -12px rgba(0,0,0,.6);--kart:#1a2034;--kart-2:#2a3352;--mavi:#6b84ff;" +
      "--mavi-acik:color-mix(in srgb,var(--mavi) 22%,#141a2c)!important;--turuncu-acik:rgba(255,138,61,.16);--yesil-acik:rgba(22,182,122,.16);" +
      "--pembe-acik:rgba(242,85,127,.16);--mor-acik:rgba(139,92,246,.2);--yazi:#e7eaf6;--soluk:#98a0bd;--cizgi:rgba(255,255,255,.09)"],
    [" body", "background-color:var(--zemin)!important;color:var(--yazi)"],
    [" .isik", "background:radial-gradient(520px 380px at 90% 0%,rgba(255,138,61,.13),transparent 70%)," +
      "radial-gradient(600px 460px at -5% 25%,rgba(90,110,255,.2),transparent 70%)," +
      "radial-gradient(520px 420px at 80% 100%,rgba(40,190,140,.1),transparent 70%),var(--zemin)"],

    /* beyaz kutular, düğmeler, giriş alanları */
    [" .yurt-sec," + K + " .gunler button:not(.aktif)," + K + " .filtre button:not(.aktif)," + K + " .sinif-sekme button:not(.aktif)," +
      K + " input:not([type=checkbox]):not([type=radio]):not([type=range])," + K + " select," + K + " textarea," +
      K + " .btn:not(.ana):not(.yesil):not(.soluk)," + K + " .noktalar button:not(.dogru):not(.yanlis)," + K + " .kelime," +
      K + " .sik:not(.dogru):not(.yanlis)," + K + " .kucuk-btn," + K + " .site-btn," + K + " .kisayol a," + K + " .kart:not(.cam)," +
      K + " .dg-btn," + K + " .dg-ad," + K + " .dg-form textarea," + K + " .yf-ek button",
      "background:var(--kart)"],
    [" .kart:not(.cam)", "box-shadow:0 10px 30px -12px rgba(0,0,0,.6)"],
    [" .secici button.aktif," + K + " .sekmeler button.aktif," + K + " .gun-sec button.aktif," + K + " .secim button.aktif",
      "background:var(--kart-2);box-shadow:none"],
    [" .secici," + K + " .sekmeler," + K + " .gun-sec," + K + " .secim," + K + " .tatil-bilgi div," + K + " .kopru.notr," +
      K + " .sonuc .satirlar div," + K + " .ilan-bilgi span:not(.yesil):not(.dolu)," + K + " .sik .harf," + K + " .btn.soluk," +
      K + " .ozet span," + K + " .rozet.yakinda," + K + " .sekme:hover", "background:rgba(255,255,255,.06)"],
    [" .cubuk," + K + " .ilerleme", "background:rgba(255,255,255,.08)"],
    [" .yan," + K + " .alt-menu", "background:rgba(22,27,46,.92)"],
    [" .filtre button.aktif", "background:var(--mavi);border-color:var(--mavi);color:#fff"],
    [" .toast", "background:#2a3150"],
    [" .vitrin", "border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.03)"],

    /* açık zemine göre seçilmiş koyu yazı renkleri */
    [" .tahmini", "color:#ffc46b;background:rgba(255,170,40,.14)"],
    [" .kopru", "color:#4fd8a4"],
    [" .etiket.turuncu", "color:#ff9d5c"],
    [" .soluk-kart b", "color:var(--soluk)"],
    [" .ok", "color:#5b6382"],
    [" .not-kutu", "color:#ffb27a"],
    [" .uyari", "color:#ffae73"],
    [" .ban-uyari", "color:#ff8fae"],
    [" .aciklama.iyi", "color:#5fe0ad"],
    [" .aciklama.kotu", "color:#ff8fae"],
    [" .sik:hover:not([disabled])", "border-color:rgba(107,132,255,.6)"],
    [" .kelime", "border-color:rgba(107,132,255,.4)"],
    [" .bosluk-giris", "border-bottom-color:rgba(107,132,255,.5);background:rgba(107,132,255,.1)"],
    [" .kart:not(.cam) p a," + K + " .kart:not(.cam) li a", "color:#93a5ff"],
    [" .kart:not(.cam) .soluk", "color:var(--soluk)"],
    [" a.ikincil", "background:rgba(107,132,255,.16);color:#a3b3ff"],

    /* yorumlar, yemek fotoğrafları, sponsor kartı */
    [" .dg-btn.secili.iyi", "background:rgba(22,182,122,.16);color:#4fd8a4;border-color:rgba(22,182,122,.35)"],
    [" .dg-btn.secili.kotu", "background:rgba(242,85,127,.16);color:#ff8fae;border-color:rgba(242,85,127,.35)"],
    [" .dg-y", "background:rgba(255,255,255,.04)"],
    [" .yf", "box-shadow:0 0 0 2px rgba(255,255,255,.08),0 4px 12px -4px rgba(0,0,0,.5)"],
    [" .ck", "background:var(--cam);border-color:var(--cam-kenar)"],
    [" .ck-baslik", "color:var(--yazi)"],
    [" .ck-icerik", "color:var(--soluk)"],

    /* Ramazan imsakiyesi */
    [" .rz-dlg", "background:var(--kart);color:var(--yazi)"],
    [" .rz-dlg th", "background:#262d47;color:#d6c58f"],
    [" .rz-dlg th," + K + " .rz-dlg td", "border-bottom-color:rgba(255,255,255,.08)"],
    [" .rz-dlg tr.bugun td", "background:rgba(246,196,83,.16)"]
  ];
  stil(kurallar.map(function (k) { return K + k[0] + "{" + k[1] + "}"; }).join("\n") +
    /* tema seçici ve ana sayfadaki hızlı düğme */
    "\n.secici.uc{grid-template-columns:repeat(3,1fr)}" +
    "\n.tema-dugme{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;cursor:pointer;padding:0;color:var(--yazi,#141b34);background:var(--kart,#fff);border:1px solid var(--cizgi,#e6e9f4);box-shadow:0 2px 8px rgba(20,27,52,.08)}" +
    "\n.tema-sag{display:flex;align-items:center;gap:10px}" +
    "\n.tema-dugme svg{width:20px;height:20px}" +
    "\n.tema-dugme .tema-gunes," + K + " .tema-dugme .tema-ay{display:none}" + K + " .tema-dugme .tema-gunes{display:block}" +
    "\n.yan .tema-dugme{width:32px;height:32px}.yan .tema-dugme svg{width:17px;height:17px}" +
    "\n.tema-onizleme{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9999;background:#141b34;color:#fff;" +
    "font:700 12px/1.2 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.9;white-space:nowrap;box-shadow:0 6px 18px -6px rgba(0,0,0,.4)}" +
    "\n.tema-onizleme a{all:unset;cursor:pointer;color:#9fb3ff;margin-left:6px;text-decoration:underline}" +
    "\n" + K + " .tema-onizleme{background:#e7eaf6;color:#141b34}" + K + " .tema-onizleme a{color:#3b5bfd}");

  var mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  var meta = document.querySelector('meta[name="theme-color"]');
  var ilkRenk = meta ? meta.getAttribute("content") : "#eef3ff";

  function tercih() { var t = oku("kc-tema"); return t === "acik" || t === "koyu" ? t : "sistem"; }
  function dugmeler() {
    var t = tercih();
    var b = document.querySelectorAll("[data-tema-sec]");
    for (var i = 0; i < b.length; i++) {
      var secili = b[i].getAttribute("data-tema-sec") === t;
      b[i].classList.toggle("aktif", secili); b[i].setAttribute("aria-pressed", secili ? "true" : "false");
    }
  }
  function uygula() {
    var t = tercih(), koyu = t === "koyu" || (t === "sistem" && !!(mq && mq.matches));
    kok.setAttribute("data-tema", koyu ? "koyu" : "acik");
    if (meta) meta.setAttribute("content", koyu ? "#0e1220" : (renkOku() ? (RENKLER.filter(function (x) { return x.id === renkOku(); })[0] || {}).a || ilkRenk : ilkRenk));
    try {   // Android uygulamasında durum çubuğu
      var SB = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.StatusBar;
      if (SB) { SB.setStyle({ style: koyu ? "DARK" : "LIGHT" }); SB.setBackgroundColor({ color: koyu ? "#0e1220" : "#eef3ff" }); }
    } catch (e) {}
    dugmeler();
  }
  window.kcTema = { ayarla: function (t) { yaz("kc-tema", t); uygula(); }, tercih: tercih };
  uygula();
  if (mq) { if (mq.addEventListener) mq.addEventListener("change", uygula); else if (mq.addListener) mq.addListener(uygula); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-tema-sec],[data-tema-degistir]");
    if (!b) return;
    if (b.hasAttribute("data-tema-sec")) kcTema.ayarla(b.getAttribute("data-tema-sec"));
    else kcTema.ayarla(kok.getAttribute("data-tema") === "koyu" ? "acik" : "koyu");
  });
  var DUGME = '<button class="tema-dugme" type="button" data-tema-degistir aria-label="Koyu ve açık mod arasında geç">' +
    '<svg class="tema-ay" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '<svg class="tema-gunes" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>';
  document.addEventListener("DOMContentLoaded", function () {
    renkSecicileriKur();
    // Diğer sayfalarda üst başlığın sağına düğme ekle (ana sayfada düğme sayfanın içinde zaten var)
    var ust = document.querySelector("header.ust, div.ust");
    if (ust && !document.querySelector(".tema-dugme")) {
      var sag = document.createElement("div"); sag.className = "tema-sag";
      if (ust.children.length > 1) sag.appendChild(ust.lastElementChild);
      sag.insertAdjacentHTML("beforeend", DUGME); ust.appendChild(sag);
    }
    dugmeler();
    if (onizleme) {
      var n = document.createElement("div");
      n.className = "tema-onizleme";
      n.innerHTML = 'Koyu mod önizlemesi <a href="?koyu=kapat">kapat</a>';
      document.body.appendChild(n);
    }
  });
})();
