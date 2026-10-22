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

  try {
    var q = new URLSearchParams(location.search).get("koyu");
    if (q === "onizleme") { yaz("kc-koyu-onizleme", "1"); if (!oku("kc-tema")) yaz("kc-tema", "koyu"); }
    else if (q === "kapat") yaz("kc-koyu-onizleme", null);
  } catch (e) {}
  var onizleme = !HERKESE_ACIK && oku("kc-koyu-onizleme") === "1";
  if (!HERKESE_ACIK && !onizleme) return;
  kok.classList.add("tema-var");

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
    if (meta) meta.setAttribute("content", koyu ? "#0e1220" : ilkRenk);
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
