/* KampüsCepte — ortak alt bilgi (footer). Sayfadaki <footer class="alt-bilgi"> kutusunu zengin sürümle değiştirir. */
(function () {
  "use strict";
  var f = document.querySelector("footer.alt-bilgi");
  if (!f) return;
  var Y = function (h, t) { return '<a href="/' + h + '">' + t + "</a>"; };
  var yil = new Date().getFullYear();
  var css = document.createElement("style");
  css.textContent =
    "footer.kc-alt{all:unset;display:block;margin:64px 0 0;padding:34px 0 calc(26px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--cizgi,#e6e9f2);font-family:var(--font,inherit);color:var(--soluk,#6b7390)}" +
    ".kc-alt .ka-izgara{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1.2fr;gap:28px}" +
    ".kc-alt .ka-marka a.ka-logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--yazi,#141b34);font-weight:900;font-size:20px;letter-spacing:-.02em}" +
    ".kc-alt .ka-marka img{width:38px;height:38px;border-radius:10px}" +
    ".kc-alt .ka-slogan{margin:8px 0 6px;font-weight:800;color:var(--yazi,#141b34);font-size:14px}" +
    ".kc-alt .ka-marka p{margin:0;font-size:13.5px;line-height:1.6;max-width:300px}" +
    ".kc-alt .ka-rozet{display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:6px 11px;border-radius:999px;background:var(--mavi-acik,#eef0ff);color:var(--mavi,#5b5bf5);font-size:12px;font-weight:800}" +
    ".kc-alt h4{margin:0 0 12px;font-size:14.5px;font-weight:900;color:var(--mavi,#5b5bf5);letter-spacing:-.01em}" +
    ".kc-alt ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}" +
    ".kc-alt li a,.kc-alt .ka-ilet a{color:var(--yazi,#141b34);opacity:.78;text-decoration:none;font-size:13.8px;font-weight:600}" +
    ".kc-alt li a:hover,.kc-alt .ka-ilet a:hover{opacity:1;color:var(--mavi,#5b5bf5)}" +
    ".kc-alt .ka-iki{grid-template-columns:1fr 1fr;column-gap:14px}" +
    ".kc-alt .ka-ilet{display:grid;gap:9px;font-size:13.8px}" +
    ".kc-alt .ka-ilet span{display:block;font-size:12px;opacity:.8}" +
    ".kc-alt .ka-alt{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:30px;padding-top:18px;border-top:1px solid var(--cizgi,#e6e9f2);font-size:12.8px}" +
    ".kc-alt .ka-alt a{color:inherit;font-weight:700;text-decoration:none;margin-left:16px}" +
    ".kc-alt .ka-alt a:hover{color:var(--mavi,#5b5bf5)}" +
    "@media (max-width:980px){.kc-alt .ka-izgara{grid-template-columns:1fr 1fr}.kc-alt .ka-marka{grid-column:1/-1}}" +
    "@media (max-width:520px){footer.kc-alt{margin-top:40px;padding-bottom:calc(110px + env(safe-area-inset-bottom,0px))}.kc-alt .ka-izgara{gap:24px 16px}.kc-alt .ka-alt{flex-direction:column}.kc-alt .ka-alt a{margin:0 14px 0 0}}";
  document.head.appendChild(css);
  f.className = "kc-alt";
  f.innerHTML =
    '<div class="ka-izgara">' +
      '<div class="ka-marka"><a class="ka-logo" href="/index.html"><img src="/ikonlar/logo-128.png" alt="">KampüsCepte</a>' +
        '<div class="ka-slogan">Kampüs hayatın cebinde.</div>' +
        '<p>Elazığ\'daki üniversite öğrencileri için yurt yemek menüleri, ders notları, testler, vize provaları, akademik takvim ve yol arkadaşı tek yerde.</p>' +
        '<span class="ka-rozet">✓ Öğrenciler için ücretsiz</span></div>' +
      '<div><h4>Yurtlar</h4><ul>' +
        "<li>" + Y("ahmet-kabakli/", "Ahmet Kabaklı") + "</li><li>" + Y("fethi-sekin/", "Fethi Sekin") + "</li><li>" + Y("sare-ana/", "Sare Ana") + "</li><li>" + Y("izzetpasa/", "İzzetpaşa") + "</li><li>" + Y("harput/", "Harput") + "</li><li>" + Y("omer-bilginoglu/", "Ömer Bilginoğlu") + "</li><li>" + Y("firat/", "Elazığ Fırat") + "</li>" +
      "</ul></div>" +
      '<div><h4>Ders notları</h4><ul>' +
        "<li>" + Y("index.html#ybs-1", "YBS 1. sınıf") + "</li><li>" + Y("index.html#ybs-2", "YBS 2. sınıf") + "</li><li>" + Y("index.html#ybs-3", "YBS 3. sınıf") + "</li><li>" + Y("index.html#ortak", "Ortak dersler") + "</li><li>" + Y("dersler.html", "Tüm dersler") + "</li>" +
      "</ul></div>" +
      '<div><h4>Keşfet</h4><ul>' +
        "<li>" + Y("index.html#takvim", "Akademik takvim") + "</li><li>" + Y("index.html#araclar", "Ortalama hesapla") + "</li><li>" + Y("yol-arkadasi/", "Yol arkadaşı") + "</li><li>" + Y("magaza.html", "Sponsorlarımız") + "</li><li>" + Y("reklam/", "Reklam ver") + "</li>" +
      "</ul></div>" +
      '<div><h4>İletişim</h4><div class="ka-ilet">' +
        '<a href="mailto:iletisim@kampuscepte.com.tr"><span>E-posta</span>iletisim@kampuscepte.com.tr</a>' +
        '<a href="mailto:iletisim@kampuscepte.com.tr?subject=%C3%96neri"><span>Öneri ve istek</span>Fikrini yaz</a>' +
        '<a href="mailto:iletisim@kampuscepte.com.tr?subject=Hata%20bildirimi"><span>Hata mı gördün?</span>Hata bildir</a>' +
      "</div></div>" +
    "</div>" +
    '<div class="ka-alt"><span>© ' + yil + " KampüsCepte · Elazığ · Notlar ücretsizdir, para ile satılamaz.</span>" +
      "<span>" + Y("hakkimizda.html", "Hakkımızda") + Y("gizlilik.html", "Gizlilik ve çerezler") + "</span></div>";
})();
