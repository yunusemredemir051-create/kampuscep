/* =====================================================================
   KampüsCepte · SPONSORLARIMIZ
   Yeni sponsor eklemek için SPONSORLAR listesine bir kayıt ekle.
   Görseller: /gorseller/vitrin/ (kare, en az 264 px)
   · Yurtlar (menüler) sayfasında "Sponsorlarımız" alanı otomatik çizilir (#sponsorlar-alani)
   · Her sponsorun mağaza sayfası: /magaza.html?s=<id>
   ===================================================================== */
window.SPONSORLAR = [
  {
    id: "cadde-katik",
    ad: "Cadde Katık",
    tur: "Dürüm · Fast food",
    slogan: "Ahmet Kabaklı Yurdu'nun tam karşısında, sıcak tavuk dürüm",
    konum: "Ahmet Kabaklı Yurdu karşısı, Elazığ",
    harita: "Cadde Katık Elazığ",
    tel: "+904245022323",
    telYaz: "0424 502 23 23",
    renk: ["#e53935", "#7a1d14"],
    logo: "/gorseller/vitrin/caddekatik-menu1.webp",
    kategoriler: [
      { ad: "Menüler", urunler: [
        { ad: "Menü 1", icerik: "Tavuk dürüm · patates · ayran", fiyat: "200 TL", resim: "/gorseller/vitrin/caddekatik-menu1.webp" },
        { ad: "Menü 1 Plus", icerik: "Tavuk dürüm · patates · kola", fiyat: "220 TL", resim: "/gorseller/vitrin/caddekatik-menu1plus.webp" }
      ] },
      { ad: "Aile menüleri", urunler: [
        { ad: "Aile Menüsü 1", icerik: "3 tavuk dürüm · patates · 1 L içecek", fiyat: "550 TL", resim: "/gorseller/vitrin/caddekatik-aile1.webp" },
        { ad: "Aile Menüsü 2", icerik: "4 tavuk dürüm · patates · 1 L içecek", fiyat: "650 TL", resim: "/gorseller/vitrin/caddekatik-aile2.webp" },
        { ad: "Aile Menüsü 3", icerik: "5 tavuk dürüm · patates · 1 L içecek", fiyat: "750 TL", resim: "/gorseller/vitrin/caddekatik-aile3.webp", one: "Arkadaşlarınla en avantajlı" }
      ] }
    ]
  }
];

(function () {
  var kutular = document.querySelectorAll("#sponsorlar-alani, .sponsorlar-alani");
  if (!kutular.length || !window.SPONSORLAR.length) return;
  var st = document.createElement("style");
  st.textContent =
    ".sp-alan{margin-top:26px}" +
    ".sp-bas{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin:0 2px 12px}" +
    ".sp-bas small{display:block;font-size:11.5px;font-weight:700;color:var(--soluk)}" +
    ".sp-bas h2{margin:2px 0 0;font-size:21px;letter-spacing:-.5px}" +
    ".sp-bas a{font-size:13px;font-weight:700;color:var(--mavi);text-decoration:none;white-space:nowrap}" +
    ".sp-serit{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;margin:0 -2px;scrollbar-width:none}" +
    ".sp-serit::-webkit-scrollbar{display:none}" +
    ".sp-kart{position:relative;flex:0 0 100%;max-width:420px;scroll-snap-align:start;display:block;border-radius:var(--r-3);overflow:hidden;text-decoration:none;color:#fff;isolation:isolate;" +
    "background:var(--sp1);box-shadow:var(--golge);transition:transform .15s}" +
    ".sp-kart:active{transform:scale(.985)}" +
    ".sp-kart::after{content:'';position:absolute;right:-60px;top:-80px;width:220px;height:220px;border-radius:50%;background:none;z-index:-1}" +
    ".sp-ust{display:flex;gap:14px;align-items:center;padding:16px 16px 12px}" +
    ".sp-logo{width:56px;height:56px;border-radius:var(--r-3);object-fit:cover;flex:none;border:2px solid rgba(255,255,255,.5);box-shadow:var(--golge)}" +
    ".sp-ust div{min-width:0}.sp-rozet{display:inline-block;font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:var(--r-hap);background:rgba(255,255,255,.2)}" +
    ".sp-ust b{display:block;font-size:19px;letter-spacing:-.4px;margin-top:4px}.sp-ust span.t{font-size:12.5px;opacity:.85;font-weight:600}" +
    ".sp-urunler{display:flex;gap:8px;padding:0 16px}" +
    ".sp-urunler img{width:64px;height:64px;border-radius:var(--r-2);object-fit:cover;flex:none;border:1.5px solid rgba(255,255,255,.35)}" +
    ".sp-urunler i{display:grid;place-items:center;width:64px;height:64px;border-radius:var(--r-2);background:rgba(255,255,255,.14);font-style:normal;font-weight:700;font-size:14px;flex:none}" +
    ".sp-alt{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px 16px}" +
    ".sp-alt small{font-size:12px;font-weight:600;opacity:.85;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".sp-gez{flex:none;display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border-radius:var(--r-2);background:#fff;color:var(--sp1);font-weight:700;font-size:13.5px}" +
    ".sp-gez svg{width:16px;height:16px}" +
    ".sp-bos{flex:0 0 78%;max-width:300px;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:center;gap:6px;padding:18px;border-radius:var(--r-3);text-decoration:none;color:var(--yazi);" +
    "border:1.5px dashed color-mix(in srgb,var(--yazi) 16%,transparent);background:rgba(255,255,255,.45)}" +
    ".sp-bos b{font-size:15px}.sp-bos span{font-size:12.5px;color:var(--soluk);line-height:1.45}.sp-bos em{font-style:normal;font-size:13px;font-weight:700;color:var(--mavi);margin-top:4px}" +
    "html[data-tema=koyu] .sp-bos{background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.14)}" +
    "@media (min-width:821px){.sp-kart{flex-basis:420px}}";
  document.head.appendChild(st);
  var ok = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var tek = window.SPONSORLAR.length === 1;
  var html = '<section class="sp-alan"><div class="sp-bas"><div><small>Öğrencilere özel</small><h2>Sponsorlarımız</h2></div><a href="/magaza.html">Tümü</a></div><div class="sp-serit">' +
    window.SPONSORLAR.map(function (s) {
      var u = [].concat.apply([], s.kategoriler.map(function (k) { return k.urunler; }));
      return '<a class="sp-kart" style="--sp1:' + s.renk[0] + ";--sp2:" + s.renk[1] + (tek ? ";flex-basis:84%" : "") + '" href="/magaza.html?s=' + s.id + '">' +
        '<div class="sp-ust"><img class="sp-logo" src="' + s.logo + '" alt="" width="56" height="56" loading="lazy"><div><span class="sp-rozet">Sponsor</span><b>' + s.ad + '</b><span class="t">' + s.tur + "</span></div></div>" +
        '<div class="sp-urunler">' + u.slice(0, 3).map(function (x) { return '<img src="' + x.resim + '" alt="" width="64" height="64" loading="lazy">'; }).join("") + (u.length > 3 ? "<i>+" + (u.length - 3) + "</i>" : "") + "</div>" +
        '<div class="sp-alt"><small>📍 ' + s.konum.split(",")[0] + '</small><span class="sp-gez">Mağazayı gez' + ok + "</span></div></a>";
    }).join("") +
    (tek ? '<a class="sp-bos" href="/sponsor/"><b>İşletmeni burada gör</b><span>Öğrencilerin her gün baktığı menü sayfasında yerini al.</span><em>Bilgi al ›</em></a>' : "") +
    "</div></section>";
  kutular.forEach(function (k) { k.innerHTML = html; });
})();
