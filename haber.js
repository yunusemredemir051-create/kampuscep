/* KampüsCepte Haberler — tarih, arama, kategori süzme, görsel yükleme, paylaşma.
   Veri: haberler/veri.js (window.HABERLER), .github/scripts/haber/haber_uret.py üretir. */
(function () {
  "use strict";
  var H = window.HABERLER || [];

  /* Günün tarihi */
  var t = document.getElementById("hb-tarih");
  if (t) {
    var d = new Date();
    t.textContent = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) + ", " + d.toLocaleDateString("tr-TR", { weekday: "long" });
  }

  /* "Bugün 18.45" / "Dün 12.30": tarih yazılarını okura göre göreli gösterir */
  function goreli(kok) {
    var bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    (kok || document).querySelectorAll("time.hb-zaman[datetime]").forEach(function (t) {
      var p = t.getAttribute("datetime").split("-"); if (p.length < 3) return;
      var g = new Date(+p[0], +p[1] - 1, +p[2]), fark = Math.round((bugun - g) / 864e5), s = t.getAttribute("data-saat");
      if (fark === 0) t.textContent = "Bugün" + (s ? " " + s : "");
      else if (fark === 1) t.textContent = "Dün" + (s ? " " + s : "");
    });
  }
  goreli();

  /* Son dakika: haberde son_dakika işaretliyse yayından sonraki 24 saat boyunca etiket görünür,
     gündem şeridi "Son dakika" olur. Süre geçince etiket kendiliğinden kalkar. */
  function sonDakika(kok) {
    var simdi = Date.now(), taze = function (el) { var z = Date.parse(el.getAttribute("data-sd")); return z && simdi - z < 864e5 && simdi - z > -36e5; };
    (kok || document).querySelectorAll(".hb-sd[data-sd]").forEach(function (el) { el.hidden = !taze(el); });
    var serit = document.querySelector(".hb-gundem");
    if (serit && !kok) {
      var tazeSayi = 0;
      serit.querySelectorAll("a[data-sd]").forEach(function (a) { var t = taze(a); a.hidden = !t; if (t) tazeSayi++; });
      serit.hidden = !tazeSayi;
    }
  }
  sonDakika();

  /* Gündem kaydırıcısı: parmakla kaydırma (scroll-snap), noktalar, oklar, 6 sn'de bir kendiliğinden geçiş.
     Dokunulduğunda, fare üstündeyken, odak içindeyken ve sekme gizliyken durur; "hareketi azalt" açıksa hiç kendiliğinden geçmez. */
  var kay = document.getElementById("hb-kay");
  if (kay) {
    var iz = kay.querySelector(".hb-kay-iz"), slaytlar = kay.querySelectorAll(".hb-kay-slayt"), noktalar = kay.querySelectorAll("[data-git]");
    var aktif = 0, sayi = slaytlar.length, zamanlayici = null, durdu = false;
    var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var git = function (i) {
      aktif = (i + sayi) % sayi;
      iz.scrollTo({ left: slaytlar[aktif].offsetLeft - iz.offsetLeft, behavior: azHareket ? "auto" : "smooth" });
    };
    var isaretle = function () {
      var i = Math.round(iz.scrollLeft / Math.max(1, iz.clientWidth));
      if (i < 0 || i >= sayi) return;
      aktif = i;
      noktalar.forEach(function (b, j) { if (j === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    };
    var sayac;
    iz.addEventListener("scroll", function () { clearTimeout(sayac); sayac = setTimeout(isaretle, 60); }, { passive: true });
    noktalar.forEach(function (b) { b.addEventListener("click", function () { durdu = true; git(+b.getAttribute("data-git")); }); });
    kay.querySelectorAll("[data-yon]").forEach(function (b) { b.addEventListener("click", function () { durdu = true; git(aktif + +b.getAttribute("data-yon")); }); });
    var baslat = function () {
      clearInterval(zamanlayici);
      if (azHareket || durdu || sayi < 2) return;
      zamanlayici = setInterval(function () { if (!document.hidden) git(aktif + 1); }, 6000);
    };
    var dur = function () { clearInterval(zamanlayici); };
    kay.addEventListener("pointerenter", dur); kay.addEventListener("pointerleave", baslat);
    kay.addEventListener("focusin", dur); kay.addEventListener("focusout", baslat);
    iz.addEventListener("touchstart", function () { durdu = true; dur(); }, { passive: true });
    baslat();
  }

  /* Okuma ilerleme çubuğu (haber detay) */
  var cubuk = document.querySelector(".hb-ilerleme i"), makale = document.querySelector(".hb-makale");
  if (cubuk && makale) {
    var guncelle = function () {
      var r = makale.getBoundingClientRect(), top = r.height - innerHeight;
      cubuk.style.transform = "scaleX(" + (top > 0 ? Math.min(1, Math.max(0, -r.top / top)) : 1) + ")";
    };
    addEventListener("scroll", guncelle, { passive: true }); addEventListener("resize", guncelle); guncelle();
  }

  /* Görseller: yüklenince iskelet kalkar, yüklenemezse sade yedek görünüm */
  function gorselHazirla(kok) {
    (kok || document).querySelectorAll(".hb-gorsel img").forEach(function (img) {
      function tamam() { img.classList.add("yuklendi"); }
      function hata() { var k = img.closest(".hb-gorsel"); if (k) k.classList.add("yok"); img.remove(); }
      if (img.complete && img.naturalWidth) tamam(); else if (img.complete) hata();
      else { img.addEventListener("load", tamam, { once: true }); img.addEventListener("error", hata, { once: true }); }
    });
  }
  gorselHazirla();

  /* Arama alanı */
  var acB = document.getElementById("hb-ara-ac"), form = document.getElementById("hb-arama"), kutu = document.getElementById("hb-ara-kutu");
  if (acB && form) acB.addEventListener("click", function () {
    form.hidden = !form.hidden;
    acB.setAttribute("aria-expanded", String(!form.hidden));
    if (!form.hidden) kutu.focus();
  });

  /* Kategori ve arama süzme (yalnızca haberler/ ana sayfasında) */
  var icerik = document.getElementById("hb-icerik");
  var q = new URLSearchParams(location.search);
  var kat = q.get("kategori") || "", ara = (q.get("ara") || "").trim();
  /* Eski kategori adresleri (ör. ?kategori=sinavlara-hazirlik) yeni kategoriye yönlenir */
  var eski = window.HABER_ESKI_KOD || {};
  if (kat && eski[kat]) { kat = eski[kat]; q.set("kategori", kat); try { history.replaceState(null, "", "?" + q.toString()); } catch (e) {} }
  if (icerik && (kat || ara)) {
    function kucuk(s) { return (s || "").toLocaleLowerCase("tr-TR"); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    var liste = H.filter(function (n) {
      if (kat && n.kod !== kat) return false;
      if (ara) { var a = kucuk(ara); return kucuk(n.baslik + " " + n.ozet + " " + n.kategori + " " + n.metin).indexOf(a) !== -1; }
      return true;
    });
    var katLink = document.querySelector('.hb-kat a[href$="kategori=' + kat + '"]');
    var katAd = kat ? ((H.find(function (n) { return n.kod === kat; }) || {}).kategori || (katLink ? katLink.textContent : "")) : "";
    document.querySelectorAll(".hb-kat a").forEach(function (a) {
      var k = new URL(a.href).searchParams.get("kategori") || "";
      a.classList.toggle("aktif", !ara && k === kat);
    });
    if (ara && kutu) { kutu.value = ara; form.hidden = false; acB.setAttribute("aria-expanded", "true"); }
    var zaman = function (n) { return '<time class="hb-zaman" datetime="' + n.iso + '">' + esc(n.tarih) + (n.saat ? ", " + esc(n.saat) : "") + "</time>"; };
    var satir = function (n) {
      return '<article class="hb-satir"><a class="hb-gorsel" href="/haberler/' + n.slug + '.html" tabindex="-1" aria-hidden="true"><img src="/gorseller/haberler/' + n.gorsel + '" alt="" width="' + n.w + '" height="' + n.h + '" loading="lazy"></a>' +
        '<div><a class="hb-etiket" href="/haberler/?kategori=' + n.kod + '">' + esc(n.kategori) + '</a><h3 class="hb-baslik"><a href="/haberler/' + n.slug + '.html">' + esc(n.baslik) + '</a></h3><p class="hb-spot">' + esc(n.ozet) + "</p>" + zaman(n) + "</div></article>";
    };
    var baslik = ara ? "Arama: “" + esc(ara) + "”" : esc(katAd || "Haberler");
    var h = '<div class="hb-bolum-b" style="margin-top:28px"><h1 style="font:800 13px var(--hb-sans);letter-spacing:.12em;text-transform:uppercase;margin:0">' + baslik + "</h1></div>";
    if (!liste.length) {
      h += '<div class="hb-bos"><b>' + (ara ? "Sonuç bulunamadı" : "Bu kategoride henüz haber yok") + "</b><p>" + (ara ? "Farklı bir kelimeyle aramayı dene." : "Yeni haberler eklendikçe burada görünecek.") + '</p><button type="button" onclick="location.href=\'/haberler/\'">Tüm haberlere dön</button></div>';
    } else {
      h += '<p class="hb-sonuc-bilgi">' + liste.length + " haber</p>" + '<section class="hb-akis" style="padding-top:0">' + liste.map(satir).join("") + "</section>";
    }
    icerik.innerHTML = h;
    var g = document.querySelector(".hb-gundem"); if (g) g.hidden = true;
    document.title = (ara ? "“" + ara + "” araması" : katAd) + " – KampüsCepte Haberler";
    gorselHazirla(icerik); goreli(icerik); sonDakika(icerik);
  }

  /* Paylaş ve bağlantıyı kopyala */
  var adres = location.href.split("#")[0];
  document.querySelectorAll("[data-paylas]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (navigator.share) navigator.share({ title: document.title, url: adres }).catch(function () {});
      else kopyala(b.parentNode.querySelector("[data-kopyala]"));
    });
  });
  function kopyala(b) {
    var p = navigator.clipboard ? navigator.clipboard.writeText(adres) : Promise.reject();
    p.then(function () {
      var s = b.querySelector("span"), eski = s ? s.textContent : "";
      b.classList.add("ok"); if (s) s.textContent = "Kopyalandı";
      setTimeout(function () { b.classList.remove("ok"); if (s) s.textContent = eski; }, 1800);
    }).catch(function () { window.prompt("Bağlantıyı kopyala:", adres); });
  }
  document.querySelectorAll("[data-kopyala]").forEach(function (b) { b.addEventListener("click", function () { kopyala(b); }); });
})();
