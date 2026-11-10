/* KampüsCepte geri sistemi — tüm sayfalarda yüklenir.
   Web:     başlıkta logonun solunda beliren yuvarlak geri düğmesi (mobil), masaüstünde içerik üstünde "‹ Ana sayfa" hapı,
            Esc tuşu (ana uygulamada), tarayıcı geri tuşu (index.html içindeki popstate yakalayıcı).
   Android: Capacitor App eklentisinin donanım/jest geri olayı; ana sayfada "Çıkmak için tekrar geri bas" uyarısıyla çift basışta çıkış.
   Değiştirince tüm sayfalardaki geri.js?v= numarasını artır. */
(function () {
  "use strict";
  if (window.__kcGeri) return; window.__kcGeri = 1;
  var d = document, kok = d.documentElement;
  var CHEVRON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';

  var css = [
    /* mobil başlık: logonun solundaki yuvarlak düğme */
    ".kc-geri-sar{display:inline-flex;align-items:center;min-width:0}",
    ".kc-geri-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin-right:10px;padding:0;",
    "border-radius:12px;border:1px solid var(--cizgi,#e6e9f4);background:var(--cam-guclu,rgba(255,255,255,.92));color:var(--yazi,#141b34);cursor:pointer;",
    "box-shadow:0 4px 12px -6px rgba(40,60,140,.35);font:inherit;-webkit-tap-highlight-color:transparent;",
    "transition:width .28s cubic-bezier(.2,.8,.2,1),margin .28s cubic-bezier(.2,.8,.2,1),opacity .2s ease,transform .28s cubic-bezier(.2,.8,.2,1),background .2s,color .2s,border-color .2s}",
    ".kc-geri-btn svg{transition:transform .2s ease}",
    ".kc-geri-btn:hover{background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);border-color:var(--mavi,#3b5bfd)}",
    ".kc-geri-btn:hover svg{transform:translateX(-2px)}",
    ".kc-geri-btn:active{transform:scale(.9)}",
    ".kc-geri-btn:focus-visible,.kc-geri-masa:focus-visible{outline:2px solid var(--mavi,#3b5bfd);outline-offset:2px}",
    ".kc-geri-sar.kc-dar .logo,.kc-geri-sar.kc-dar .marka{font-size:0!important;gap:0!important}",
    ".kc-geri-btn.gizli{width:0;margin-right:0;opacity:0;transform:translateX(-10px) scale(.6);border-width:0;pointer-events:none;box-shadow:none}",
    /* masaüstü: içerik üstünde hap */
    ".kc-geri-masa{display:none;align-items:center;gap:6px;height:36px;padding:0 16px 0 10px;margin:0 0 16px;border-radius:999px;",
    "border:1px solid var(--cizgi,#e6e9f4);background:var(--cam-guclu,rgba(255,255,255,.92));color:var(--yazi,#141b34);",
    "font:600 13.5px/1 var(--font,inherit);cursor:pointer;box-shadow:0 6px 18px -10px rgba(40,60,140,.35);",
    "-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s,border-color .2s,transform .15s}",
    ".kc-geri-masa svg{width:18px;height:18px;transition:transform .2s ease}",
    ".kc-geri-masa:hover{background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);border-color:var(--mavi,#3b5bfd)}",
    ".kc-geri-masa:hover svg{transform:translateX(-3px)}",
    ".kc-geri-masa:active{transform:scale(.96)}",
    ".kc-geri-masa small{font:500 12px/1 var(--font,inherit);color:var(--soluk,#6b7390);margin-right:2px}",
    "@media (min-width:821px){html.kc-geri-var .kc-geri-masa{display:inline-flex;animation:kcGeriBel .28s cubic-bezier(.2,.8,.2,1)}}",
    "@keyframes kcGeriBel{from{opacity:0;transform:translateX(-10px)}}",
    /* geri dönüşte sayfa soldan gelir */
    "html.kc-geri-anim .sayfa.aktif{animation:kcGeriGir .3s cubic-bezier(.2,.8,.2,1)!important}",
    "@keyframes kcGeriGir{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:none}}",
    /* Android: çıkış uyarısı */
    ".kc-geri-tost{position:fixed;left:50%;bottom:calc(112px + env(safe-area-inset-bottom,0px));z-index:9999;transform:translate(-50%,12px);opacity:0;",
    "padding:11px 18px;border-radius:999px;background:rgba(20,27,52,.92);color:#fff;font:600 13.5px/1.2 var(--font,sans-serif);white-space:nowrap;",
    "box-shadow:0 10px 30px -10px rgba(0,0,0,.45);pointer-events:none;transition:opacity .2s ease,transform .25s cubic-bezier(.2,.8,.2,1)}",
    ".kc-geri-tost.acik{opacity:1;transform:translate(-50%,0)}",
    "html[data-tema=koyu] .kc-geri-btn,html[data-tema=koyu] .kc-geri-masa{background:rgba(30,37,62,.9);border-color:#2b3350;color:#f0f3fe}",
    "html[data-tema=koyu] .kc-geri-tost{background:rgba(240,243,254,.95);color:#141b34}",
    "@media (prefers-reduced-motion:reduce){.kc-geri-btn,.kc-geri-masa,.kc-geri-tost{transition:none!important;animation:none!important}html.kc-geri-anim .sayfa.aktif{animation:none!important}}"
  ].join("");
  var st = d.createElement("style"); st.textContent = css; d.head.appendChild(st);

  function titret() { try { if (window.KC_SES && KC_SES.titret) KC_SES.titret(8); } catch (e) {} }
  function animasyon() { kok.classList.add("kc-geri-anim"); clearTimeout(animasyon.t); animasyon.t = setTimeout(function () { kok.classList.remove("kc-geri-anim"); }, 400); }

  var UYG = window.KC_GERI_UYG;               // ana sayfa uygulaması (index.html)
  var mobilBtn = null, masaBtn = null;

  function dugme(cls, etiket) {
    var b = d.createElement("button"); b.type = "button"; b.className = cls;
    b.setAttribute("aria-label", etiket || "Geri"); b.title = etiket || "Geri";
    return b;
  }
  function logonunSolunaKoy(logo, b) {
    var sar = d.createElement("span"); sar.className = "kc-geri-sar";
    logo.parentNode.insertBefore(sar, logo); sar.appendChild(b); sar.appendChild(logo);
  }

  /* ---------- Ana sayfa uygulaması ---------- */
  function uygGeri() { if (!UYG.dene()) return false; animasyon(); UYG.geri(); titret(); guncelle(); return true; }
  function guncelle() {
    var var_ = UYG.dene(), hedef = UYG.hedef();
    kok.classList.toggle("kc-geri-var", var_);
    if (mobilBtn) { mobilBtn.classList.toggle("gizli", !var_); mobilBtn.tabIndex = var_ ? 0 : -1; mobilBtn.setAttribute("aria-hidden", var_ ? "false" : "true"); mobilBtn.setAttribute("aria-label", hedef === "Kapat" ? "Kapat" : "Geri: " + hedef); }
    if (masaBtn && var_) {
      var yazi = hedef === "Kapat" ? "Geri" : hedef;
      if (masaBtn.dataset.yazi !== yazi) { masaBtn.dataset.yazi = yazi; masaBtn.innerHTML = CHEVRON + "<span>" + yazi + "</span>"; masaBtn.setAttribute("aria-label", "Geri: " + hedef); }
    }
  }
  function uygKur() {
    var logo = d.querySelector(".mobil-ust .logo");
    if (logo) { mobilBtn = dugme("kc-geri-btn gizli"); mobilBtn.innerHTML = CHEVRON; mobilBtn.onclick = uygGeri; logonunSolunaKoy(logo, mobilBtn); }
    var main = d.querySelector("main");
    if (main) { masaBtn = dugme("kc-geri-masa"); masaBtn.onclick = uygGeri; var ust = main.querySelector(".mobil-ust"); main.insertBefore(masaBtn, ust ? ust.nextSibling : main.firstChild); }
    var bekleyen = 0;
    var planla = function () { if (bekleyen) return; bekleyen = requestAnimationFrame(function () { bekleyen = 0; guncelle(); }); };
    try { new MutationObserver(planla).observe(d.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "hidden"] }); } catch (e) {}
    addEventListener("popstate", function () { setTimeout(guncelle, 30); });
    d.addEventListener("kc-geri", planla);
    /* tarayıcı geri tuşunda da soldan gelme animasyonu */
    addEventListener("popstate", animasyon, true);
    /* Esc: açık bir şey ya da alt sayfa varsa bir adım geri */
    d.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (uygGeri()) e.preventDefault();
    });
    guncelle();
  }

  /* ---------- Diğer sayfalar (yurt, not, yol arkadaşı...) ---------- */
  var anaAdres = "/";
  function sayfaGeri() {
    titret();
    var ayniSite = false;
    try { ayniSite = !!d.referrer && new URL(d.referrer).origin === location.origin; } catch (e) {}
    if (ayniSite && history.length > 1) history.back();
    else location.href = anaAdres;
  }
  function sayfaKur() {
    var logo = null, l = d.querySelectorAll(".logo, .marka");
    for (var i = 0; i < l.length; i++) if (l[i].querySelector("img") && l[i].offsetParent !== null) { logo = l[i]; break; }
    if (logo && logo.getAttribute("href")) anaAdres = logo.href;
    /* sayfanın kendi geri bağlantısı varsa (ör. ders.html "‹ Ders notları") ikinci bir düğme koyma */
    var kendi = d.querySelector(".geri, [data-geri]");
    if (!logo || (kendi && kendi.offsetParent !== null)) return;
    var b = dugme("kc-geri-btn"); b.innerHTML = CHEVRON; b.onclick = sayfaGeri;
    var ust = logo.parentNode, h0 = ust.offsetHeight;
    var kap = logo.closest("header") || ust;
    function kardesler() { return [].slice.call(kap.querySelectorAll("a,button,span,div")).filter(function (x) { return !logo.contains(x) && !x.contains(logo) && !(sar && sar.contains(x)) && x.offsetParent !== null &&
      (/^(A|BUTTON)$/.test(x.tagName) || [].some.call(x.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) &&
      x.getBoundingClientRect().width < kap.getBoundingClientRect().width * .6; }); }
    var ilk = kardesler(), y0 = ilk.map(function (x) { return x.offsetHeight; });
    logonunSolunaKoy(logo, b);
    /* dar ekranda başlık sıkışırsa logonun yazısını gizle, ikon kalsın */
    var sar = b.parentNode, kardes;
    function sigdir() {
      sar.classList.remove("kc-dar"); kardes = kardesler();
      var r = sar.getBoundingClientRect(), sikisik = ust.offsetHeight > Math.max(h0, 36) + 10 || ust.scrollWidth > ust.clientWidth + 1 || logo.scrollWidth > logo.clientWidth + 1;
      if (logo.scrollWidth > logo.clientWidth + 1) r = { left: r.left, right: r.left + 46 + logo.scrollWidth, top: r.top, bottom: r.bottom };
      kardes.forEach(function (x, i) {
        if (!x.getBoundingClientRect || sar.contains(x)) return;
        var k = x.getBoundingClientRect();
        var j = ilk.indexOf(x); if (j >= 0 && x.offsetHeight > y0[j] + 10) sikisik = true;
        if (k.width && k.left < r.right + 16 && k.right > r.left && k.top < r.bottom && k.bottom > r.top) sikisik = true;
      });
      if (sikisik) sar.classList.add("kc-dar");
    }
    sigdir(); addEventListener("resize", sigdir); addEventListener("load", sigdir); setTimeout(sigdir, 900);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(sigdir);
  }

  /* ---------- Android donanım / jest geri tuşu ---------- */
  var tost = null, sonBasis = 0;
  function tostGoster(yazi) {
    if (!tost) { tost = d.createElement("div"); tost.className = "kc-geri-tost"; tost.setAttribute("role", "status"); d.body.appendChild(tost); }
    tost.textContent = yazi; tost.classList.add("acik");
    clearTimeout(tostGoster.t); tostGoster.t = setTimeout(function () { tost.classList.remove("acik"); }, 1900);
  }
  function androidKur() {
    var C = window.Capacitor, App = C && C.Plugins && C.Plugins.App;
    if (!App || !App.addListener) return;
    try {
      App.addListener("backButton", function (ev) {
        if (UYG) {
          if (uygGeri()) return;
          var simdi = Date.now();
          if (simdi - sonBasis < 2000) { try { App.exitApp(); } catch (e) {} return; }
          sonBasis = simdi; titret(); tostGoster("Çıkmak için tekrar geri bas");
          return;
        }
        /* not, yurt vb. sayfalar: geçmişte geri, yoksa ana sayfaya */
        if (ev && ev.canGoBack) history.back(); else location.href = "/";
      });
    } catch (e) {}
  }

  function kur() { if (UYG) uygKur(); else sayfaKur(); androidKur(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", kur); else kur();
})();
