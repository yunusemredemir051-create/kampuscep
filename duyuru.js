/* KampüsCepte — tek seferlik duyuru penceresi.
   BITIS tarihine kadar, kullanıcı kapatana kadar her sayfada açılışta gösterilir; kapatınca bir daha çıkmaz.
   Yeni duyuru için KIMLIK'i değiştir (eski kapatma kaydı yeni duyuruyu etkilemesin).
   Görsel: gorseller/duyuru/guvenlik.webp varsa o gösterilir, yoksa yerleşik kalkan çizimi. */
(function () {
  var KIMLIK = "kc-duyuru-guvenlik-2026-11";
  var BITIS = new Date("2026-11-06T00:00:00+03:00");
  var GORSEL = "/gorseller/duyuru/guvenlik.webp";

  var ZORLA = /[?&]duyuru=goster/.test(location.search); // önizleme: kapatılmış olsa da göster
  if (new Date() >= BITIS && !ZORLA) return;
  try { if (!ZORLA && localStorage.getItem(KIMLIK) === "kapali") return; } catch (e) {}

  var css = "" +
    ".kd-perde{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;" +
    "background:rgba(12,16,34,.46);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2);opacity:0;transition:opacity .28s ease}" +
    ".kd-perde.acik{opacity:1}" +
    ".kd-kart{position:relative;width:100%;max-width:400px;max-height:calc(100dvh - 40px);overflow:auto;border-radius:28px;" +
    "background:linear-gradient(180deg,#ffffff 0%,#f7f9ff 100%);color:#141b34;box-shadow:0 30px 80px -20px rgba(20,27,52,.55),0 0 0 1px rgba(59,91,253,.08);" +
    "transform:translateY(18px) scale(.97);transition:transform .38s cubic-bezier(.2,.9,.25,1.15);font-family:inherit}" +
    ".kd-perde.acik .kd-kart{transform:none}" +
    ".kd-ust{position:relative;height:160px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:28px 28px 0 0;" +
    "background:radial-gradient(240px 160px at 20% 10%,rgba(139,92,246,.35),transparent 70%),radial-gradient(260px 180px at 85% 90%,rgba(59,91,253,.4),transparent 70%),linear-gradient(135deg,#eef2ff,#f5efff)}" +
    ".kd-ust img{max-height:150px;max-width:86%;object-fit:contain;margin-top:6px}" +
    ".kd-ust svg{width:96px;height:96px;filter:drop-shadow(0 14px 22px rgba(59,91,253,.35))}" +
    ".kd-kapat{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "background:rgba(255,255,255,.75);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#3a4260;box-shadow:0 4px 12px rgba(20,27,52,.12);transition:transform .15s}" +
    ".kd-kapat:active{transform:scale(.92)}.kd-kapat svg{width:18px;height:18px}" +
    ".kd-govde{padding:20px 24px 24px}" +
    ".kd-rozet{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;letter-spacing:.3px;padding:5px 11px;border-radius:99px;" +
    "background:rgba(59,91,253,.1);color:#3b5bfd}" +
    ".kd-rozet i{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18)}" +
    ".kd-govde h2{margin:2px 0 8px;font-size:22px;line-height:1.2;letter-spacing:-.4px;font-weight:800}" +
    ".kd-govde p{margin:0 0 10px;font-size:14.5px;line-height:1.55;color:#4a5272}" +
    ".kd-liste{list-style:none;margin:14px 0 4px;padding:0;display:grid;gap:8px}" +
    ".kd-liste li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.45;color:#3a4260;padding:10px 12px;border-radius:14px;background:rgba(59,91,253,.05)}" +
    ".kd-liste b{color:#141b34}" +
    ".kd-liste span.ik{flex:none;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;margin-top:1px}" +
    ".kd-tesekkur{margin:14px 0 0!important;font-weight:600;color:#141b34!important}" +
    ".kd-btn{margin-top:18px;width:100%;border:0;cursor:pointer;padding:14px 18px;border-radius:16px;font:inherit;font-weight:700;font-size:15.5px;color:#fff;" +
    "background:linear-gradient(135deg,#3b5bfd,#8b5cf6);box-shadow:0 14px 28px -12px rgba(59,91,253,.7);transition:transform .15s}" +
    ".kd-btn:active{transform:scale(.98)}.kd-btn:focus,.kd-kapat:focus{outline:none!important}.kd-btn:focus-visible{box-shadow:0 0 0 3px rgba(139,92,246,.45),0 14px 28px -12px rgba(59,91,253,.7)}" +
    "html[data-tema=\"koyu\"] .kd-kart{background:linear-gradient(180deg,#171d33 0%,#12172a 100%);color:#e8ebf7;box-shadow:0 30px 80px -20px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.06)}" +
    "html[data-tema=\"koyu\"] .kd-ust{background:radial-gradient(240px 160px at 20% 10%,rgba(139,92,246,.35),transparent 70%),radial-gradient(260px 180px at 85% 90%,rgba(59,91,253,.4),transparent 70%),linear-gradient(135deg,#1c2342,#221a3d)}" +
    "html[data-tema=\"koyu\"] .kd-kapat{background:rgba(23,29,51,.75);color:#c9cfe6}" +
    "html[data-tema=\"koyu\"] .kd-govde p{color:#aab2cf}" +
    "html[data-tema=\"koyu\"] .kd-liste li{background:rgba(255,255,255,.05);color:#c3c9e2}" +
    "html[data-tema=\"koyu\"] .kd-liste b,html[data-tema=\"koyu\"] .kd-tesekkur{color:#eef0fa!important}" +
    "html[data-tema=\"koyu\"] .kd-rozet{background:rgba(124,145,255,.16);color:#9fb0ff}" +
    "@media (prefers-reduced-motion:reduce){.kd-perde,.kd-kart{transition:none}}";

  var KALKAN = '<svg viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="kdg" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#3b5bfd"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>' +
    '<path d="M48 8 80 20v24c0 21-13.6 36.4-32 44C29.6 80.4 16 65 16 44V20Z" fill="url(#kdg)"/>' +
    '<path d="M48 16 72 25v19c0 16-10 28-24 34.5V16Z" fill="#fff" opacity=".14"/>' +
    '<path d="m35 48 9 9 18-19" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CARPI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function goster() {
    if (document.getElementById("kd-perde")) return;
    var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    var p = document.createElement("div");
    p.className = "kd-perde"; p.id = "kd-perde";
    p.innerHTML =
      '<div class="kd-kart" role="dialog" aria-modal="true" aria-labelledby="kd-baslik">' +
        '<div class="kd-ust"><span class="kd-gorsel">' + KALKAN + '</span>' +
          '<button type="button" class="kd-kapat" aria-label="Kapat">' + CARPI + '</button></div>' +
        '<div class="kd-govde">' +
          '<h2 id="kd-baslik">Bilgilendirme</h2>' +
          '<p>2–3 Kasım tarihlerinde uygulamamıza yönelik spam saldırıları gerçekleşti. Gerekli güvenlik önlemleri alınarak anında müdahale edildi. Ders notları, yemek menüleri ve Yol Arkadaşı hizmet vermeye devam ediyor.</p>' +
          '<p class="kd-tesekkur">KampüsCepte\'yi tercih ettiğiniz için teşekkür ederiz. 💙</p>' +
          '<button type="button" class="kd-btn">Anladım</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(p);

    // Çizilmiş görsel yüklendiyse kalkan yerine onu göster
    var img = new Image();
    img.onload = function () { var g = p.querySelector(".kd-gorsel"); if (g) { g.innerHTML = ""; img.alt = ""; g.appendChild(img); } };
    img.src = GORSEL;

    var onceki = document.activeElement;
    var eskiTasma = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { p.classList.add("acik"); });
    var btn = p.querySelector(".kd-btn");
    setTimeout(function () { try { btn.focus({ preventScroll: true }); } catch (e) {} }, 300);

    function kapat() {
      try { localStorage.setItem(KIMLIK, "kapali"); } catch (e) {}
      p.classList.remove("acik");
      document.documentElement.style.overflow = eskiTasma;
      document.removeEventListener("keydown", tus);
      setTimeout(function () { p.remove(); try { onceki && onceki.focus && onceki.focus(); } catch (e) {} }, 300);
    }
    function tus(e) { if (e.key === "Escape") kapat(); }
    p.querySelector(".kd-kapat").addEventListener("click", kapat);
    btn.addEventListener("click", kapat);
    p.addEventListener("click", function (e) { if (e.target === p) kapat(); });
    document.addEventListener("keydown", tus);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(goster, 350); });
  else setTimeout(goster, 350);
})();
