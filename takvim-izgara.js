/* Akademik takvim — ay görünümü.
   veri.js içindeki `takvim` dizisini okur; yeni veri ya da kayıt tutmaz.
   Bölüm değişince ana.js zamanCiz() çağırır, ızgara da onunla yeniden çizilir. */
(function () {
  "use strict";
  var kutu = document.getElementById("kct");
  if (!kutu || typeof takvim === "undefined") return;

  var GUNLER = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  var TUR = { sinav: "Sınav", tatil: "Tatil", kayit: "Kayıt ve başvuru", donem: "Dönem" };
  var bg = new Date(); bg.setHours(0, 0, 0, 0);
  var ay = new Date(bg.getFullYear(), bg.getMonth(), 1);
  var secili = new Date(bg);

  function gun(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function ayni(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function kacis(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function olaylar(d) {
    return takvim.filter(function (o) { return gun(o.bas) <= d && d <= gun(o.bit || o.bas); });
  }
  function sinir() {
    var en = null, son = null;
    takvim.forEach(function (o) {
      var b = gun(o.bas), e = gun(o.bit || o.bas);
      if (!en || b < en) en = b; if (!son || e > son) son = e;
    });
    if (!en) { en = bg; son = bg; }
    return [new Date(en.getFullYear(), en.getMonth(), 1), new Date(son.getFullYear(), son.getMonth(), 1)];
  }

  function ciz() {
    var s = sinir();
    if (ay < s[0]) ay = new Date(s[0]); if (ay > s[1]) ay = new Date(s[1]);
    var baslik = ay.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    var ilk = new Date(ay); ilk.setDate(1 - ((ay.getDay() + 6) % 7));
    var sonGun = new Date(ay.getFullYear(), ay.getMonth() + 1, 0);
    var hafta = Math.ceil((((ay.getDay() + 6) % 7) + sonGun.getDate()) / 7);
    var h = '<div class="kct-ust">' +
      '<h2>' + kacis(baslik) + '</h2>' +
      '<button type="button" class="kct-bugun" data-kct="bugun">Bugün</button>' +
      '<button type="button" data-kct="geri" aria-label="Önceki ay"' + (ay <= s[0] ? " disabled" : "") + '><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" data-kct="ileri" aria-label="Sonraki ay"' + (ay >= s[1] ? " disabled" : "") + '><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '</div><div class="kct-izgara" role="grid" aria-label="' + kacis(baslik) + '">';
    GUNLER.forEach(function (g) { h += '<div class="kct-gunad" role="columnheader">' + g + '</div>'; });
    for (var i = 0; i < hafta * 7; i++) {
      var d = new Date(ilk); d.setDate(ilk.getDate() + i);
      var ol = olaylar(d), sinif = "kct-h";
      if (d.getMonth() !== ay.getMonth()) sinif += " dis";
      if (i % 7 > 4) sinif += " hs";
      if (ayni(d, bg)) sinif += " bugun";
      if (ayni(d, secili)) sinif += " secili";
      var cubuk = "";
      ol.slice(0, 3).forEach(function (o) {
        cubuk += '<span class="kct-b kct-' + o.tur + (ayni(d, gun(o.bas)) ? " ilk" : "") + (ayni(d, gun(o.bit || o.bas)) ? " son" : "") + '"></span>';
      });
      var etiket = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }) +
        (ol.length ? ": " + ol.map(function (o) { return o.ad; }).join(", ") : "");
      h += '<button type="button" role="gridcell" class="' + sinif + '" data-gun="' + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() +
        '" aria-label="' + kacis(etiket) + '"' + (ayni(d, secili) ? ' aria-selected="true"' : "") + '><span class="kct-n">' + d.getDate() + '</span>' + cubuk + '</button>';
    }
    h += '</div>';
    var so = olaylar(secili);
    h += '<div class="kct-gun" aria-live="polite"><h3>' + kacis(secili.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })) + (ayni(secili, bg) ? " · bugün" : "") + '</h3>';
    if (so.length) {
      h += '<ul>' + so.map(function (o) {
        return '<li><i class="kct-b kct-' + o.tur + '"></i><span>' + kacis(o.ad) + '<small>' + (typeof aralik === "function" ? kacis(aralik(o)) + " · " : "") + TUR[o.tur] + (o.tahmini ? " · tahmini" : "") + '</small></span></li>';
      }).join("") + '</ul>';
    } else {
      h += '<p>Bu gün için takvimde kayıt yok.</p>';
    }
    h += '</div><div class="kct-a" aria-hidden="true"><span><i class="kct-sinav"></i>Sınav</span><span><i class="kct-tatil"></i>Tatil</span><span><i class="kct-kayit"></i>Kayıt</span><span><i class="kct-donem"></i>Dönem</span></div>';
    kutu.innerHTML = h;
  }

  kutu.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.kct === "geri") ay = new Date(ay.getFullYear(), ay.getMonth() - 1, 1);
    else if (b.dataset.kct === "ileri") ay = new Date(ay.getFullYear(), ay.getMonth() + 1, 1);
    else if (b.dataset.kct === "bugun") { secili = new Date(bg); ay = new Date(bg.getFullYear(), bg.getMonth(), 1); }
    else if (b.dataset.gun) {
      var p = b.dataset.gun.split("-"); secili = new Date(+p[0], +p[1] - 1, +p[2]);
      if (secili.getMonth() !== ay.getMonth()) ay = new Date(secili.getFullYear(), secili.getMonth(), 1);
    } else return;
    ciz();
    var odak = b.dataset.gun ? kutu.querySelector(".kct-h.secili") : kutu.querySelector('[data-kct="' + b.dataset.kct + '"]');
    if (odak) odak.focus({ preventScroll: true });
  });

  if (typeof window.zamanCiz === "function") {
    var eski = window.zamanCiz;
    window.zamanCiz = function () { var r = eski.apply(this, arguments); try { ciz(); } catch (e) {} return r; };
  }
  ciz();
})();
