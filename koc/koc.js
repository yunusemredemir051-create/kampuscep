/* =====================================================================
   SINAV KOÇUM – Akıllı Öğrenme ve Sınav Hazırlık Sistemi
   Motor + arayüz. İçerik koc/<ders>-*.js dosyalarından window.KOC_DERS olarak gelir.

   Pedagojik kurallar:
   · Önce seviye tespiti, sonra kişisel plan
   · Her konu: Öğren → Alıştır → Konu sınavı. Konu sınavı geçilmeden sonraki konu açılmaz
   · Konu sınavı kalınırsa: farklı anlatım + kolay sorulardan alıştırma zorunlu, sonra tekrar sınav
   · Her yanlış aralıklı tekrar kutusuna girer (10 dk → 1 → 3 → 7 → 14 gün)
   · Aynı beceride tekrarlayan hata fark edilir ve konu "eksik" işaretlenir
   · Sınava hazırlık; konu yeterliliği, soru türü çeşitliliği, tutarlılık ve deneme puanından hesaplanır
   İlerleme bu cihazda localStorage'da kalıcı tutulur ("kc-koc:<ders>").
   ===================================================================== */
(function () {
  "use strict";
  var D = window.KOC_DERS, KOK = document.getElementById("koc");
  if (!D || !KOK) return;
  var ANAHTAR = "kc-koc:" + D.id, DAK = 6e4, GUN = 864e5;
  var TUR_AD = { mc: "Çoktan seçmeli", dy: "Doğru / yanlış", bosluk: "Boşluk doldurma", kod: "Kod tamamlama", cikti: "Kod çıktısı", sira: "Sıralama", hata: "Hatalı satırı bul", akis: "Akış şeması", klasik: "Klasik / yazma" };
  var AKTIF_SINAV = ["vize"];           /* final açılınca: ["vize", "final"] */
  D.konular = D.konular.filter(function (k) { return AKTIF_SINAV.indexOf(k.sinav) >= 0; });
  D.sorular = D.sorular.filter(function (q) { return D.konular.some(function (k) { return k.no === q.k; }); });
  var KONU = {}; D.konular.forEach(function (k) { KONU[k.no] = k; });
  var SORU = {}; D.sorular.forEach(function (q) { SORU[q.id] = q; });
  var KAPSAM = { vize: D.konular.filter(function (k) { return k.sinav === "vize"; }).map(function (k) { return k.no; }), final: D.konular.map(function (k) { return k.no; }) };
  var DENEME = { vize: { ad: "Vize denemesi", sure: 60 }, final: { ad: "Final denemesi", sure: 75 } };

  /* ------------------------------------------------------------- durum */
  function bos() { return { v: 1, bas: Date.now(), sure: 0, seviye: null, konu: {}, cev: [], bec: {}, tek: {}, den: [], gor: {}, aktif: null }; }
  var S;
  try { S = JSON.parse(localStorage.getItem(ANAHTAR)) || bos(); } catch (e) { S = bos(); }
  ["konu", "bec", "tek", "gor"].forEach(function (x) { S[x] = S[x] || {}; });
  ["cev", "den"].forEach(function (x) { S[x] = S[x] || []; });
  var kayitZ;
  function kaydet(hemen) {
    clearTimeout(kayitZ);
    var f = function () { try { localStorage.setItem(ANAHTAR, JSON.stringify(S)); } catch (e) {} };
    if (hemen) f(); else kayitZ = setTimeout(f, 250);
  }
  addEventListener("pagehide", function () { kaydet(true); });
  function K(no) { return S.konu[no] || (S.konu[no] = { m: 0, ders: false, alt: false, alis: 0, sinav: [], gecti: false, bekle: false, hizli: false }); }

  /* Çalışma süresi: sayfa görünür ve son 90 sn içinde etkileşim varsa sayılır */
  var sonHareket = Date.now();
  ["pointerdown", "keydown", "scroll"].forEach(function (e) { addEventListener(e, function () { sonHareket = Date.now(); }, { passive: true }); });
  setInterval(function () { if (!document.hidden && Date.now() - sonHareket < 90e3) { S.sure += 10; kaydet(); } }, 10e3);

  /* ---------------------------------------------------------- yardımcı */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function yuzde(x) { return Math.round(x * 100); }
  function sureYaz(sn) { var d = Math.round(sn / 60); if (d < 60) return d + " dk"; return Math.floor(d / 60) + " sa " + (d % 60) + " dk"; }
  function kucuk(s) { return String(s).toLocaleLowerCase("tr"); }
  function cevaplar(k) { return S.cev.filter(function (c) { return !k || c.k === k; }); }

  /* ------------------------------------------------------ ölçme / model */
  var KAZ = [0.14, 0.2, 0.28], KAY = [0.32, 0.22, 0.14];
  function isle(q, ok, mod) {
    var c = K(q.k), z = q.z - 1;
    if (mod !== "seviye") c.m = ok ? c.m + (1 - c.m) * KAZ[z] : c.m - c.m * KAY[z];
    c.m = Math.max(0, Math.min(1, c.m));
    var b = S.bec[q.b] || (S.bec[q.b] = { d: 0, y: 0, k: q.k });
    ok ? b.d++ : b.y++;
    S.cev.push({ id: q.id, k: q.k, ok: ok ? 1 : 0, t: Date.now(), m: mod, tip: q.tip, z: q.z });
    if (S.cev.length > 3000) S.cev = S.cev.slice(-3000);
    S.gor[q.id] = Date.now();
    var t = S.tek[q.id];
    if (!ok) S.tek[q.id] = { kutu: 0, zaman: Date.now() + 10 * DAK };
    else if (t) { t.kutu++; if (t.kutu > 4) delete S.tek[q.id]; else t.zaman = Date.now() + [1, 3, 7, 14][t.kutu - 1] * GUN; }
    kaydet();
  }
  function tekrarlayanHata(q) {
    var n = 0; S.cev.forEach(function (c) { var s = SORU[c.id]; if (!c.ok && s && s.b === q.b) n++; });
    return n >= 3;
  }
  function vadesiGelen() { var n = Date.now(); return Object.keys(S.tek).filter(function (id) { return SORU[id] && S.tek[id].zaman <= n; }); }
  function zayifBeceriler(k) {
    return Object.keys(S.bec).filter(function (b) { var x = S.bec[b]; return (!k || x.k === k) && x.y >= 2 && x.y / (x.d + x.y) >= 0.4; })
      .sort(function (a, b) { return S.bec[b].y - S.bec[a].y; });
  }
  var BEC_AD = { "tanim": "Algoritmanın tanımı", "ozellik": "Algoritmanın özellikleri", "girdi-cikti": "Girdi / işlem / çıktı", "terim": "Temel terimler", "siralama": "Adım sırası", "analiz": "Problem analizi", "atama": "Atama (S = S + x)", "iz": "Algoritma izleme", "sozde-kod": "Sözde kod", "karar": "Karar adımı", "takas": "Değer takası", "dongu-adim": "Tekrar adımı", "algoritma-yazma": "Algoritma yazma", "sembol": "Akış şeması sembolleri", "akis-izleme": "Akış şeması izleme", "akis-dongu": "Döngülü akış şeması", "akis-cizme": "Akış şeması çizme", "veri-tipi": "Veri tipleri", "degisken-adi": "Değişken adı kuralları", "buyuk-kucuk": "Büyük-küçük harf duyarlılığı", "tanimlama": "Değişken tanımlama", "bicim": "Biçim belirteçleri", "anahtar-kelime": "Anahtar kelimeler", "mod": "% (mod) operatörü", "tamsayi-bolme": "Tamsayı bölmesi", "oncelik": "İşlem önceliği", "matematik-ceviri": "Matematiği koda çevirme", "kisaltma": "+=, ++ kısaltmaları", "mantiksal": "&&, || operatörleri", "esittir": "= ve == farkı", "iskelet": "Program iskeleti", "kacis": "Kaçış karakterleri (\\n, \\t)", "scanf": "scanf ve &", "gets": "gets / puts", "program-yazma": "Program yazma", "if-temel": "if - else", "else-if": "else if zinciri", "suslu-parantez": "Süslü parantez kapsamı", "noktali-virgul": "if sonrası ;", "if-ic-ice": "İç içe if", "tur-sayisi": "Döngü tur sayısı", "dongu-cikti": "Döngü çıktısı", "carpim": "Çarpım değişkeni", "do-while": "do-while", "sonsuz-dongu": "Sonsuz döngü", "for-yapi": "for yapısı", "ic-ice-tur": "İç içe tur sayısı", "desen": "Desen çıktıları", "ic-ice-sira": "İç içe çalışma sırası", "ic-ice-cikti": "İç içe döngü çıktısı", "indeks": "Dizi indeksi", "dizi-dongu": "Diziyi döngüyle dolaşma", "dizi-sinir": "Dizi sınırı", "en-buyuk": "En büyüğü bulma", "char-dizi": "Karakter dizisi", "faktoriyel": "Faktöriyel", "basamak": "Basamak ayırma", "asal": "Asal sayı (bayrak)", "kalip": "Problem kalıpları" };
  function becAd(b) { return BEC_AD[b] || b; }

  function durum(no) {
    var c = K(no);
    if (c.gecti) return "ogrenildi";
    if (no > 1 && !K(no - 1).gecti) return "kilitli";
    if (c.bekle || (cevaplar(no).length >= 4 && c.m < 0.45)) return "eksik";
    if (c.ders || cevaplar(no).length) return "ogreniliyor";
    return "acik";
  }
  var DURUM_AD = { ogrenildi: "Öğrenildi", kilitli: "Kilitli", eksik: "Eksik", ogreniliyor: "Öğreniliyor", acik: "Sıradaki" };

  function tipKapsami(liste) {
    var say = {}; S.cev.forEach(function (c) { if (c.ok && (!liste || liste.indexOf(c.k) >= 0)) say[c.tip] = (say[c.tip] || 0) + 1; });
    return Object.keys(say).filter(function (t) { return say[t] >= 2; });
  }
  function hazirlik(tur) {
    var ks = KAPSAM[tur], ms = ks.map(function (n) { var c = K(n); return c.gecti ? Math.max(c.m, 0.75) : c.m; });
    var ort = ms.reduce(function (a, b) { return a + b; }, 0) / ks.length, enAz = Math.min.apply(null, ms);
    var tip = tipKapsami(ks).length, son = S.den.filter(function (d) { return d.tur === tur; }).slice(-1)[0];
    var ogr = ks.filter(function (n) { return K(n).gecti; }).length;
    var puan = Math.min(1, ort / 0.85) * 45 + Math.min(1, tip / 7) * 15 + Math.min(1, enAz / 0.7) * 10 + (son ? son.puan / 100 * 30 : 0);
    var hazir = ogr === ks.length && enAz >= 0.7 && tip >= 6 && son && son.puan >= 70;
    var eksikler = [];
    if (ogr < ks.length) eksikler.push((ks.length - ogr) + " konu henüz öğrenilmedi");
    if (enAz < 0.7) eksikler.push("En zayıf konunda yeterlilik %" + yuzde(enAz) + " (en az %70 olmalı)");
    if (tip < 6) eksikler.push("Farklı soru türlerinde başarı: " + tip + "/6");
    if (!son) eksikler.push("Henüz " + DENEME[tur].ad.toLocaleLowerCase("tr") + " çözmedin");
    else if (son.puan < 70) eksikler.push("Son deneme puanın " + son.puan + " (en az 70)");
    return { puan: Math.round(puan), hazir: hazir, ogr: ogr, top: ks.length, enAz: enAz, tip: tip, son: son, eksikler: eksikler, acik: ogr === ks.length };
  }
  function genelSeviye() {
    var ort = D.konular.reduce(function (a, k) { return a + K(k.no).m; }, 0) / D.konular.length;
    if (ort >= 0.8) return ["Uzman", ort]; if (ort >= 0.6) return ["İyi", ort]; if (ort >= 0.3) return ["Gelişiyor", ort]; return ["Başlangıç", ort];
  }

  /* ------------------------------------------------------ soru seçimi */
  function aday(fn) { return D.sorular.filter(fn); }
  function enAzGorulen(liste) { return liste.sort(function (a, b) { return (S.gor[a.id] || 0) - (S.gor[b.id] || 0) + (Math.random() - 0.5) * 1e3; })[0]; }
  function sec(k, z, kullanilan, ozel) {
    for (var fark = 0; fark < 3; fark++) {
      var l = aday(function (q) { return q.k === k && Math.abs(q.z - z) === fark && kullanilan.indexOf(q.id) < 0 && (!ozel || ozel(q)); });
      if (l.length) return enAzGorulen(l);
    }
    return null;
  }

  /* ============================================================ GÖRÜNÜM */
  var I = {
    kilit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    tik: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    carpi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    kitap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
    kalem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    hedef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    yenile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>',
    saat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bayrak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    ampul: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  function ciz(h) { KOK.innerHTML = h; scrollTo(0, 0); }
  function ust(baslik, alt, geri) {
    return '<div class="k-ust">' + (geri !== false ? '<a class="k-geri" href="' + (geri || "#panel") + '">‹ ' + (geri && geri.indexOf("#konu") === 0 ? "Konu" : "Koç paneli") + "</a>" : "") +
      "<small>" + esc(alt || "SINAV KOÇUM") + "</small><h1>" + baslik + "</h1></div>";
  }
  function halka(p, boyut, renk, ic) {
    var r = 46, c = 2 * Math.PI * r;
    return '<svg class="halka" viewBox="0 0 110 110" width="' + boyut + '" height="' + boyut + '"><circle cx="55" cy="55" r="' + r + '" fill="none" stroke="var(--halka-zemin)" stroke-width="10"/>' +
      '<circle cx="55" cy="55" r="' + r + '" fill="none" stroke="' + renk + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (c * p / 100) + " " + c + '" transform="rotate(-90 55 55)"/>' +
      '<text x="55" y="53" text-anchor="middle" class="h-sayi">' + (ic || "%" + p) + '</text><text x="55" y="72" text-anchor="middle" class="h-alt">hazırlık</text></svg>';
  }
  function cubuk(p, sinif) { return '<div class="cubuk ' + (sinif || "") + '"><i style="width:' + Math.max(2, Math.min(100, p)) + '%"></i></div>'; }
  function mRenk(m) { return m >= 0.75 ? "iyi" : m >= 0.45 ? "orta" : "zayif"; }

  /* ---------------------------------------------------- akış şeması SVG */
  function akisSvg(dugum) {
    var W = 360, cx = 150, y = 14, H = 44, ARA = 30, par = [], oklar = [], kutular = [];
    var konum = [];
    dugum.forEach(function (n, i) {
      var h = n.k === "kos" ? 64 : H, w = n.k === "kos" ? 190 : n.k === "bas" || n.k === "son" ? 120 : 190;
      konum.push({ x: cx - w / 2, y: y, w: w, h: h });
      y += h + ARA;
    });
    function sekil(n, p) {
      var x = p.x, yy = p.y, w = p.w, h = p.h, m = n.m || (n.k === "bas" ? "Başla" : n.k === "son" ? "Dur" : ""), s;
      if (n.k === "bas" || n.k === "son") s = '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" class="ak-s ak-uc"/>';
      else if (n.k === "gir") s = '<polygon points="' + (x + 16) + "," + yy + " " + (x + w) + "," + yy + " " + (x + w - 16) + "," + (yy + h) + " " + x + "," + (yy + h) + '" class="ak-s ak-gir"/>';
      else if (n.k === "isl") s = '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + h + '" rx="4" class="ak-s ak-isl"/>';
      else if (n.k === "kos") s = '<polygon points="' + (x + w / 2) + "," + yy + " " + (x + w) + "," + (yy + h / 2) + " " + (x + w / 2) + "," + (yy + h) + " " + x + "," + (yy + h / 2) + '" class="ak-s ak-kos"/>';
      else if (n.k === "cik") s = '<path d="M' + x + "," + yy + " h" + w + " v" + (h - 8) + " q-" + w / 4 + ",14 -" + w / 2 + ",0 t-" + w / 2 + ',0 z" class="ak-s ak-cik"/>';
      else if (n.k === "don") s = '<polygon points="' + (x + 16) + "," + yy + " " + (x + w - 16) + "," + yy + " " + (x + w) + "," + (yy + h / 2) + " " + (x + w - 16) + "," + (yy + h) + " " + (x + 16) + "," + (yy + h) + " " + x + "," + (yy + h / 2) + '" class="ak-s ak-don"/>';
      return s + '<text x="' + (x + w / 2) + '" y="' + (yy + h / 2 + 5) + '" text-anchor="middle" class="ak-y">' + esc(m) + "</text>";
    }
    dugum.forEach(function (n, i) {
      var p = konum[i];
      kutular.push(sekil(n, p));
      if (i < dugum.length - 1) {
        oklar.push('<line x1="' + cx + '" y1="' + (p.y + p.h) + '" x2="' + cx + '" y2="' + (konum[i + 1].y - 2) + '" class="ak-ok" marker-end="url(#uc)"/>');
        if (n.k === "kos") oklar.push('<text x="' + (cx + 8) + '" y="' + (p.y + p.h + 17) + '" class="ak-e">Evet</text>');
      }
      if (n.k === "kos" && n.yan) {
        var yx = p.x + p.w, yy2 = p.y + p.h / 2;
        oklar.push('<line x1="' + yx + '" y1="' + yy2 + '" x2="' + (yx + 26) + '" y2="' + yy2 + '" class="ak-ok" marker-end="url(#uc)"/><text x="' + (yx + 3) + '" y="' + (yy2 - 7) + '" class="ak-e">Hayır</text>');
        kutular.push('<rect x="' + (yx + 28) + '" y="' + (yy2 - 19) + '" width="' + (W - yx - 32) + '" height="38" rx="10" class="ak-yan"/><text x="' + (yx + 28 + (W - yx - 32) / 2) + '" y="' + (yy2 + 5) + '" text-anchor="middle" class="ak-y ak-yk">' + esc(n.yan) + "</text>");
      }
      if (n.geri != null) {
        var hedef = konum[n.geri], sx = p.x, sy = p.y + p.h / 2, lx = 18;
        oklar.push('<path d="M' + sx + "," + sy + " H" + lx + " V" + (hedef.y + hedef.h / 2) + " H" + (hedef.x - 2) + '" class="ak-ok ak-geri" fill="none" marker-end="url(#uc)"/>');
      }
    });
    return '<svg class="akis" viewBox="0 0 ' + W + " " + (y - ARA + 16) + '" role="img" aria-label="Akış şeması"><defs><marker id="uc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ak-uc-ok"/></marker></defs>' + oklar.join("") + kutular.join("") + "</svg>";
  }
  function sembolTablosu() {
    var l = [["bas", "Başla / Dur", "Akışın başı ve sonu"], ["gir", "Giriş", "Kullanıcıdan veri okuma"], ["isl", "İşlem", "Hesaplama, atama"], ["kos", "Karar", "Evet / Hayır'a göre yön"], ["cik", "Çıktı", "Ekrana yazdırma"], ["don", "Döngü", "Tekrar eden adımlar"]];
    return '<div class="sembol-izgara">' + l.map(function (x) {
      var n = { k: x[0], m: x[0] === "kos" ? "?" : " " };
      var svg = akisSvg([n]).replace(/viewBox="[^"]*"/, 'viewBox="45 4 210 ' + (x[0] === "kos" ? 86 : 66) + '"');
      return '<div class="sembol"><div class="sembol-sekil">' + svg + "</div><b>" + x[1] + "</b><small>" + x[2] + "</small></div>";
    }).join("") + "</div>";
  }

  /* ------------------------------------------------------- ders blokları */
  function blok(b, i) {
    switch (b.t) {
      case "p": return '<p class="d-p">' + b.h + "</p>";
      case "hayat": return '<div class="d-hayat"><span>' + I.ampul + "</span><div><b>" + esc(b.baslik) + "</b><p>" + b.h + "</p></div></div>";
      case "tablo": return (b.baslik ? '<h3 class="d-h">' + esc(b.baslik) + "</h3>" : "") + '<div class="d-tablo"><table><thead><tr>' + b.b.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>" + b.r.map(function (r) { return "<tr>" + r.map(function (x) { return "<td>" + esc(x) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
      case "terim": return '<h3 class="d-h">' + esc(b.baslik) + '</h3><dl class="d-terim">' + b.l.map(function (x) { return "<div><dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") + "</dl>";
      case "kod": return '<div class="d-kod"><div class="d-kod-ad">' + esc(b.ad || "C") + "</div><pre>" + esc(b.k) + "</pre></div>";
      case "akis": return '<h3 class="d-h">' + esc(b.baslik) + '</h3><div class="d-akis">' + akisSvg(b.akis) + "</div>";
      case "semboller": return '<h3 class="d-h">Akış şeması sembolleri</h3>' + sembolTablosu();
      case "adim": return '<div class="d-adim" data-adim="' + i + '"><h3 class="d-h">' + esc(b.baslik) + "</h3><ol>" + b.adimlar.map(function (a, j) { return '<li class="' + (j ? "gizli" : "") + '"><b>' + esc(a[0]) + "</b>" + (a[1] ? "<span>" + esc(a[1]) + "</span>" : "") + "</li>"; }).join("") + '</ol><button class="k-btn ince" data-sonraki-adim>Sonraki adım ›</button></div>';
      case "kontrol": return '<div class="d-kontrol" data-kontrol="' + i + '"><small>Anladın mı? Kontrol et</small><p>' + b.s + '</p><div class="secenek-l">' + b.o.map(function (o, j) { return '<button class="secenek" data-kk="' + j + '"><i>' + "ABCDE"[j] + "</i><span>" + o + "</span></button>"; }).join("") + '</div><div class="d-kontrol-geri"></div></div>';
    }
    return "";
  }

  /* ------------------------------------------------------- soru görünümü */
  function soruHtml(q, ctx) {
    var h = '<div class="soru" data-tip="' + q.tip + '"><div class="soru-ust"><span class="rozet tur">' + TUR_AD[q.tip] + '</span><span class="rozet z' + q.z + '">' + ["Kolay", "Orta", "Zor"][q.z - 1] + "</span>" + (ctx && ctx.etiket ? '<span class="rozet benzer">' + ctx.etiket + "</span>" : "") + "</div>";
    h += '<div class="soru-s">' + q.s + "</div>";
    if (q.tip === "akis") h += '<div class="soru-akis">' + akisSvg(q.akis) + "</div>" + (q.ek ? '<p class="soru-ek">' + q.ek + "</p>" : "");
    if (q.kod && q.tip !== "hata" && q.tip !== "kod") h += "<pre class=\"soru-kod\">" + esc(q.kod) + "</pre>";
    var sec = ctx && ctx.cevap;
    if (q.tip === "mc" || q.tip === "akis") h += '<div class="secenek-l">' + q.o.map(function (o, j) { return '<button class="secenek' + (sec === j ? " secili" : "") + '" data-c="' + j + '"><i>' + "ABCDE"[j] + "</i><span>" + o + "</span></button>"; }).join("") + "</div>";
    else if (q.tip === "dy") h += '<div class="dy-l"><button class="secenek' + (sec === true ? " secili" : "") + '" data-c="1"><i>D</i><span>Doğru</span></button><button class="secenek' + (sec === false ? " secili" : "") + '" data-c="0"><i>Y</i><span>Yanlış</span></button></div>';
    else if (q.tip === "bosluk") h += '<input class="k-girdi" data-girdi placeholder="Cevabını yaz" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(sec || "") + '">';
    else if (q.tip === "kod") h += '<pre class="soru-kod kod-bosluk">' + esc(q.kod).replace("___", '<input data-girdi autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(sec || "") + '" size="8">') + "</pre>";
    else if (q.tip === "cikti") h += '<label class="k-etiket">Ekran çıktısı</label><textarea class="k-girdi mono" data-girdi rows="3" placeholder="Çıktıyı ekrandaki gibi yaz (satırları alt alta)" autocapitalize="off" spellcheck="false">' + esc(sec || "") + "</textarea>";
    else if (q.tip === "hata") h += '<div class="hata-kod">' + q.kod.split("\n").map(function (l, j) { return '<button class="hata-satir' + (sec === j + 1 ? " secili" : "") + '" data-c="' + (j + 1) + '"><i>' + (j + 1) + "</i><code>" + esc(l) + "</code></button>"; }).join("") + "</div>";
    else if (q.tip === "sira") {
      var dizi = ctx && ctx.sira || (ctx.sira = karistir(q.o.map(function (_, j) { return j; })));
      var secilen = sec || [];
      h += '<div class="sira-hedef">' + (secilen.length ? secilen.map(function (j, n) { return '<button class="sira-ogesi dolu" data-geri="' + n + '"><i>' + (n + 1) + "</i>" + esc(q.o[j]) + "</button>"; }).join("") : '<div class="sira-bos">Aşağıdan doğru sırayla dokun</div>') + "</div>" +
        '<div class="sira-havuz">' + dizi.filter(function (j) { return secilen.indexOf(j) < 0; }).map(function (j) { return '<button class="sira-ogesi" data-s="' + j + '">' + esc(q.o[j]) + "</button>"; }).join("") + "</div>";
    }
    else if (q.tip === "klasik") h += '<label class="k-etiket">Cevabın</label><textarea class="k-girdi mono" data-girdi rows="7" placeholder="Algoritmanı ya da kodunu buraya yaz" autocapitalize="off" spellcheck="false">' + esc(sec || "") + "</textarea>";
    return h + "</div>";
  }
  function norm(s) { return kucuk(String(s).replace(/\r/g, "")).replace(/[ \t]+/g, " ").split("\n").map(function (x) { return x.trim(); }).join("\n").replace(/\n+$/, "").trim(); }
  function normKod(s) { return kucuk(String(s)).replace(/\s+/g, ""); }
  function dogruMu(q, c) {
    if (c == null || c === "" || (Array.isArray(c) && !c.length)) return null;
    switch (q.tip) {
      case "mc": case "akis": case "hata": return c === q.c;
      case "dy": return c === q.c;
      case "bosluk": return q.c.some(function (x) { return norm(x) === norm(c); });
      case "kod": return q.c.some(function (x) { return normKod(x) === normKod(c); });
      case "cikti": return q.c.some(function (x) { return norm(x) === norm(c) || normKod(x) === normKod(c) && norm(x).split("\n").length === norm(c).split("\n").length; });
      case "sira": return c.length === q.o.length && c.every(function (v, i) { return v === i; });
    }
    return null;
  }
  function dogruCevapYaz(q) {
    switch (q.tip) {
      case "mc": case "akis": return "<b>" + "ABCDE"[q.c] + ")</b> " + q.o[q.c];
      case "dy": return "<b>" + (q.c ? "Doğru" : "Yanlış") + "</b>";
      case "bosluk": case "kod": return "<code>" + esc(q.c[0]) + "</code>";
      case "cikti": return '<pre class="cevap-pre">' + esc(q.c[0]) + "</pre>";
      case "hata": return "<b>" + q.c + ". satır:</b> <code>" + esc(q.kod.split("\n")[q.c - 1].trim()) + "</code>";
      case "sira": return "<ol class=\"cevap-sira\">" + q.o.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
    }
    return "";
  }
  /* Cevap anındaki etkileşim (seçme, yazma, sıralama). Değişince cb(cevap) çağrılır. */
  function soruBagla(kutu, q, ctx, cb) {
    kutu.querySelectorAll("[data-c]").forEach(function (b) {
      b.onclick = function () {
        if (ctx.kilit) return;
        var v = q.tip === "dy" ? b.dataset.c === "1" : +b.dataset.c;
        ctx.cevap = v; kutu.querySelectorAll("[data-c]").forEach(function (x) { x.classList.toggle("secili", x === b); }); cb && cb(v);
      };
    });
    var g = kutu.querySelector("[data-girdi]");
    if (g) g.oninput = function () { ctx.cevap = g.value; cb && cb(g.value); };
    function siraCiz() { var yeni = document.createElement("div"); yeni.innerHTML = soruHtml(q, ctx); kutu.querySelector(".soru").replaceWith(yeni.firstChild); soruBagla(kutu, q, ctx, cb); cb && cb(ctx.cevap); }
    kutu.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { if (ctx.kilit) return; ctx.cevap = (ctx.cevap || []).concat(+b.dataset.s); siraCiz(); }; });
    kutu.querySelectorAll("[data-geri]").forEach(function (b) { b.onclick = function () { if (ctx.kilit) return; ctx.cevap = ctx.cevap.slice(0, +b.dataset.geri); siraCiz(); }; });
  }
  function isaretle(kutu, q, ctx, ok) {
    ctx.kilit = true;
    kutu.querySelectorAll("[data-c]").forEach(function (b) {
      var v = q.tip === "dy" ? b.dataset.c === "1" : +b.dataset.c;
      if (v === q.c) b.classList.add("dogru"); else if (v === ctx.cevap) b.classList.add("yanlis");
      b.disabled = true;
    });
    kutu.querySelectorAll("[data-girdi]").forEach(function (g) { g.readOnly = true; g.classList.add(ok ? "dogru" : "yanlis"); });
    kutu.querySelectorAll(".sira-ogesi").forEach(function (b) { b.disabled = true; });
    if (q.tip === "sira") kutu.querySelector(".sira-hedef").classList.add(ok ? "dogru" : "yanlis");
  }
  function geriBildirimHtml(q, ctx, ok) {
    var y = !ok && q.y && ctx.cevap != null && q.y[ctx.cevap];
    var h = '<div class="geri ' + (ok ? "g-dogru" : "g-yanlis") + '"><div class="geri-bas"><span>' + (ok ? I.tik : I.carpi) + "</span><b>" + (ok ? karistir(["Doğru!", "Harika, doğru.", "Aynen öyle.", "Tam isabet."])[0] : "Bu sefer olmadı") + "</b></div>";
    if (!ok) {
      if (y) h += '<div class="geri-hata"><small>Yaptığın mantık hatası</small><p>' + y + "</p></div>";
      h += '<div class="geri-dogru"><small>Doğru cevap</small>' + dogruCevapYaz(q) + "</div>";
    }
    h += '<div class="geri-aciklama"><small>' + (ok ? "Neden doğru?" : "Nasıl çözülür?") + "</small><p>" + q.a + "</p></div>";
    if (!ok && tekrarlayanHata(q)) h += '<div class="geri-uyari">' + I.yenile + "<p><b>Bu hatayı daha önce de yaptın:</b> " + esc(becAd(q.b)) + ". Konuyu farklı bir anlatımla tekrar okumanı öneriyorum; bu soru tekrar listene eklendi.</p></div>";
    return h + "</div>";
  }
  /* Klasik soruda öz değerlendirme */
  function klasikDegerlendirHtml(q, cevap) {
    return '<div class="klasik-deg"><div class="kd-iki"><div><small>Senin cevabın</small><pre>' + esc(cevap || "(boş)") + '</pre></div><div><small>Örnek çözüm</small><pre>' + esc(q.model) + '</pre></div></div>' +
      '<small class="kd-bas">Cevabında hangileri var? Dürüstçe işaretle</small><div class="kd-olcut">' + q.olcut.map(function (o, j) { return '<label><input type="checkbox" data-olcut="' + j + '"><span>' + esc(o) + "</span></label>"; }).join("") + '</div><p class="kd-not">' + esc(q.a) + "</p></div>";
  }
  function olcutPuani(kutu, q) { var n = kutu.querySelectorAll("[data-olcut]:checked").length; return n / q.olcut.length; }

  /* ============================================================ EKRANLAR */
  var oturum = null;    // aktif alıştırma / sınav / tekrar / seviye / deneme (S.aktif ile kalıcı)

  /* ------------------------------------------------------------- PANEL */
  function sonrakiAdim() {
    if (!S.seviye) return { yaz: "Seviye tespitine başla", alt: "Yaklaşık 10 dakika · seni tanıyıp kişisel planını çıkaralım", git: "#seviye", ikon: I.hedef };
    var vg = vadesiGelen();
    if (vg.length >= 5) return { yaz: "Tekrar zamanı · " + vg.length + " soru", alt: "Daha önce yanlış yaptığın soruların zamanı geldi", git: "#tekrar", ikon: I.yenile };
    for (var i = 0; i < D.konular.length; i++) {
      var k = D.konular[i], c = K(k.no);
      if (c.gecti) continue;
      if (c.bekle && !c.altOkundu) return { yaz: k.ad + " · farklı anlatım", alt: "Konu sınavında zorlandın; bu konuyu başka bir yoldan öğrenelim", git: "#ders/" + k.no + "/alt", ikon: I.kitap };
      if (c.bekle) return { yaz: k.ad + " · destek alıştırması", alt: "Kolay sorulardan başlayıp yeniden güç kazan", git: "#alistir/" + k.no, ikon: I.kalem };
      if (!c.ders && !c.hizli) return { yaz: k.ad + " · konuyu öğren", alt: "Konu " + k.no + " · adım adım anlatım", git: "#ders/" + k.no, ikon: I.kitap };
      if (!c.alis && !c.hizli) return { yaz: k.ad + " · alıştırma", alt: "Öğrendiğini sorularla pekiştir", git: "#alistir/" + k.no, ikon: I.kalem };
      return { yaz: k.ad + " · konu sınavı", alt: c.hizli ? "Seviye tespitinde iyiydin; doğrudan sınavla kanıtla" : "Geçersen sonraki konu açılır", git: "#sinav/" + k.no, ikon: I.bayrak };
    }
    if (vg.length) return { yaz: "Tekrar · " + vg.length + " soru", alt: "Unutmamak için kısa bir tekrar", git: "#tekrar", ikon: I.yenile };
    var sonT = AKTIF_SINAV[AKTIF_SINAV.length - 1];
    return { yaz: DENEME[sonT].ad, alt: "Tüm konuları öğrendin; gerçek sınav formatında kendini dene", git: "#deneme/" + sonT, ikon: I.bayrak };
  }
  function panel() {
    var tur = AKTIF_SINAV.length < 2 ? "vize" : KAPSAM.vize.every(function (n) { return K(n).gecti; }) && S.den.some(function (d) { return d.tur === "vize" && d.puan >= 70; }) ? "final" : "vize";
    var hz = hazirlik(tur), sv = genelSeviye(), adim = sonrakiAdim();
    var top = S.cev.filter(function (c) { return c.m !== "seviye"; }), dog = top.filter(function (c) { return c.ok; }).length;
    var ogr = D.konular.filter(function (k) { return K(k.no).gecti; }).length;
    var eksik = D.konular.filter(function (k) { return durum(k.no) === "eksik"; });
    var vg = vadesiGelen();
    var h = '<section class="k-hero"><div class="kh-sol"><span class="k-marka">SINAV KOÇUM</span><h1>' + esc(D.ad) + '</h1><p>Akıllı öğrenme ve sınav hazırlık sistemi</p>' +
      '<div class="kh-durum ' + (hz.hazir ? "hazir" : "") + '">' + (hz.hazir ? I.tik + " " + DENEME[tur].ad.replace(" denemesi", "") + " sınavına hazırsın" : DENEME[tur].ad.replace(" denemesi", "") + " sınavına hazırlanıyorsun") + "</div></div>" +
      '<div class="kh-sag">' + halka(hz.puan, 118, "url(#hg)") + "</div></section>";
    h += '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs></svg>';
    h += '<a class="k-adim" href="' + adim.git + '"><span class="ka-ikon">' + adim.ikon + '</span><div><small>Sıradaki adımın</small><b>' + esc(adim.yaz) + "</b><span>" + esc(adim.alt) + '</span></div><i>' + I.ok + "</i></a>";
    h += '<div class="k-istat"><div><b>' + sv[0] + "</b><small>Genel seviye</small>" + cubuk(yuzde(sv[1]), mRenk(sv[1])) + "</div><div><b>" + ogr + "/" + D.konular.length + "</b><small>Öğrenilen konu</small>" + cubuk(ogr / D.konular.length * 100, "iyi") + "</div>" +
      "<div><b>" + top.length + "</b><small>Çözülen soru</small></div><div><b>" + (top.length ? "%" + yuzde(dog / top.length) : "—") + "</b><small>Doğru oranı" + (top.length ? " · yanlış %" + (100 - yuzde(dog / top.length)) : "") + "</small></div>" +
      "<div><b>" + sureYaz(S.sure) + "</b><small>Çalışma süresi</small></div><div><b>" + S.den.length + "</b><small>Deneme sınavı</small></div></div>";
    if (vg.length) h += '<a class="k-tekrar cam" href="#tekrar"><span>' + I.yenile + "</span><div><b>" + vg.length + ' soru tekrar bekliyor</b><small>Yanlış yaptığın sorular unutmaman için belirli aralıklarla geri gelir</small></div><i>' + I.ok + "</i></a>";
    /* konu yolu */
    h += '<h2 class="k-bolum">Öğrenme yolun</h2><div class="k-yol cam">' + D.konular.map(function (k) {
      var d = durum(k.no), c = K(k.no);
      return '<a class="yol-satir d-' + d + '" href="' + (d === "kilitli" ? "javascript:void 0" : "#konu/" + k.no) + '"><span class="yol-no">' + (d === "ogrenildi" ? I.tik : d === "kilitli" ? I.kilit : k.no) + '</span><div class="yol-orta"><b>' + esc(k.ad) + '</b><div class="yol-alt"><span class="durum-c ' + d + '">' + DURUM_AD[d] + "</span>" + (k.sinav === "final" ? '<span class="durum-c final">Final konusu</span>' : "") + (d !== "kilitli" && (c.m > 0 || d === "ogrenildi") ? "<small>Yeterlilik %" + yuzde(c.m) + "</small>" : d === "kilitli" && c.hizli ? "<small>Tespitte iyiydin · hızlı geçiş</small>" : "") + "</div>" + (d !== "kilitli" ? cubuk(yuzde(c.m), mRenk(c.m)) : "") + "</div></a>";
    }).join("") + "</div>";
    /* eksikler */
    var zb = zayifBeceriler();
    if (eksik.length || zb.length) {
      h += '<h2 class="k-bolum">Eksiklerin</h2><div class="k-eksik cam">' + (eksik.length ? '<div class="ke-konular">' + eksik.map(function (k) { return '<a href="#konu/' + k.no + '" class="ke-c">' + esc(k.kisa) + " · %" + yuzde(K(k.no).m) + "</a>"; }).join("") + "</div>" : "") +
        (zb.length ? '<small class="ke-bas">En çok zorlandığın beceriler</small><ul class="ke-l">' + zb.slice(0, 5).map(function (b) { var x = S.bec[b]; return "<li><span>" + esc(becAd(b)) + '</span><b>' + x.y + " yanlış / " + (x.d + x.y) + "</b></li>"; }).join("") + "</ul>" : "") + "</div>";
    }
    /* sınava hazırlık */
    h += '<h2 class="k-bolum">Sınava hazırlık</h2><div class="k-sinavlar">' + AKTIF_SINAV.map(function (t) {
      var x = hazirlik(t), denler = S.den.filter(function (d) { return d.tur === t; });
      return '<div class="ks-kart cam"><div class="ks-ust"><div><b>' + DENEME[t].ad + "</b><small>20 soru · " + DENEME[t].sure + " dk · " + x.top + ' konu</small></div><span class="ks-p ' + (x.hazir ? "hazir" : "") + '">%' + x.puan + "</span></div>" + cubuk(x.puan, x.hazir ? "iyi" : x.puan >= 50 ? "orta" : "zayif") +
        (x.eksikler.length ? '<ul class="ks-eksik">' + x.eksikler.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : '<p class="ks-tamam">' + I.tik + " Tüm ölçütleri karşılıyorsun.</p>") +
        (denler.length ? '<div class="ks-gecmis">' + denler.slice(-8).map(function (d) { return '<div title="' + new Date(d.t).toLocaleDateString("tr") + '"><i style="height:' + Math.max(6, d.puan) + '%" class="' + (d.puan >= 70 ? "iyi" : d.puan >= 50 ? "orta" : "zayif") + '"></i><small>' + d.puan + "</small></div>"; }).join("") + "</div>" : "") +
        (x.acik ? '<a class="k-btn ' + (x.hazir ? "" : "ana") + '" href="#deneme/' + t + '">' + I.bayrak + (denler.length ? "Yeni deneme başlat" : "Denemeyi başlat") + "</a>" : '<div class="k-btn kilitli">' + I.kilit + "Konuların hepsini öğrenince açılır</div>") + "</div>";
    }).join("") + "</div>";
    h += '<div class="k-alt-l"><a href="#seviye">' + (S.seviye ? "Seviye tespitini yeniden yap" : "Seviye tespiti") + '</a><button data-sifirla>İlerlememi sıfırla</button></div>';
    ciz(h);
    var sf = KOK.querySelector("[data-sifirla]");
    sf.onclick = function () { if (sf.dataset.onay) { S = bos(); kaydet(true); panel(); } else { sf.dataset.onay = 1; sf.textContent = "Emin misin? Tekrar dokun"; } };
  }

  /* ------------------------------------------------------------- KONU */
  function konuSayfa(no) {
    var k = KONU[no], c = K(no), d = durum(no);
    if (!k) return panel();
    if (d === "kilitli") { ciz(ust(esc(k.ad), "Konu " + no) + '<div class="k-bos cam">' + I.kilit + "<p>Bu konu, <b>" + esc(KONU[no - 1].ad) + "</b> konusunu öğrendiğinde açılacak. Önce o konunun sınavını geçmelisin.</p><a class=\"k-btn ana\" href=\"#konu/" + (no - 1) + '">Önceki konuya git</a></div>'); return; }
    var ss = c.sinav.slice(-1)[0], zb = zayifBeceriler(no);
    var sinavAcik = (c.ders || c.hizli) && (c.alis || c.hizli) && !c.bekle;
    var h = ust(esc(k.ad), "Konu " + no + " · " + (k.sinav === "final" ? "Final konusu" : "Vize konusu"));
    h += '<div class="kk-ozet cam"><div class="kk-sol">' + halka(yuzde(c.m), 92, c.m >= 0.75 ? "var(--yesil)" : c.m >= 0.45 ? "var(--turuncu)" : "var(--pembe)", "%" + yuzde(c.m)).replace(">hazırlık<", ">yeterlilik<") + '</div><div><span class="durum-c ' + d + '">' + DURUM_AD[d] + "</span><h3>Bu konuda öğreneceklerin</h3><ul>" + k.hedef.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>";
    if (c.hizli && !c.gecti) h += '<div class="k-bilgi">' + I.hedef + "<p>Seviye tespitinde bu konuyu iyi bildiğin görüldü. İstersen anlatımı atlayıp doğrudan konu sınavına girebilirsin.</p></div>";
    if (c.bekle) h += '<div class="k-bilgi uyari">' + I.yenile + "<p>Son konu sınavında hedefe ulaşamadın. Sorun değil: önce konuyu <b>farklı bir anlatımla</b> oku, sonra <b>kolay sorulardan başlayan</b> bir alıştırma yap. Ardından sınav yeniden açılır.</p></div>";
    var asama = [
      { n: 1, ad: "Öğren", alt: c.ders ? "Tamamlandı" : "Adım adım anlatım", bitti: c.ders, git: "#ders/" + no, btn: c.ders ? "Tekrar oku" : "Başla" },
      { n: 2, ad: "Alıştır", alt: c.alis ? c.alis + " oturum" : "Anında geri bildirimli sorular", bitti: c.alis > 0 && !c.bekle, git: "#alistir/" + no, btn: c.alis ? "Yeni tur" : "Başla" },
      { n: 3, ad: "Konu sınavı", alt: c.gecti ? "Geçildi" : ss ? "Son: " + ss.d + "/" + ss.n : "8 soru · geri bildirim sonda", bitti: c.gecti, git: "#sinav/" + no, btn: c.gecti ? "Tekrar gir" : "Sınava gir", kilit: !sinavAcik }
    ];
    h += '<div class="kk-asama">' + asama.map(function (a) {
      return '<div class="asama cam ' + (a.bitti ? "bitti" : "") + (a.kilit ? " kilitli" : "") + '"><span class="as-no">' + (a.bitti ? I.tik : a.n) + '</span><div><b>' + a.ad + "</b><small>" + a.alt + "</small></div>" + (a.kilit ? '<span class="as-kilit">' + I.kilit + "</span>" : '<a class="k-btn ince" href="' + a.git + '">' + a.btn + "</a>") + "</div>";
    }).join("") + "</div>";
    if (!sinavAcik && !c.gecti) h += '<p class="kk-not">Konu sınavı; ' + (c.bekle ? "farklı anlatımı okuyup bir destek alıştırması bitirince" : "anlatımı okuyup en az bir alıştırma turu tamamlayınca") + " açılır.</p>";
    h += '<div class="kk-iki"><a class="k-btn" href="#ders/' + no + '/alt">' + I.kitap + "Farklı anlatımla öğren</a></div>";
    if (zb.length) h += '<h2 class="k-bolum">Bu konudaki zayıf noktaların</h2><ul class="ke-l cam">' + zb.map(function (b) { var x = S.bec[b]; return "<li><span>" + esc(becAd(b)) + "</span><b>%" + yuzde(x.d / (x.d + x.y)) + " doğru</b></li>"; }).join("") + "</ul>";
    h += '<h2 class="k-bolum">Kısa özet</h2><ul class="kk-ozet-l cam">' + k.ozet.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    if (c.sinav.length) h += '<h2 class="k-bolum">Konu sınavı geçmişi</h2><div class="kk-gecmis cam">' + c.sinav.map(function (x, i) { return "<div><span>" + (i + 1) + ". deneme</span><b class=\"" + (x.gecti ? "iyi" : "zayif") + "\">" + x.d + "/" + x.n + (x.gecti ? " · geçti" : " · tekrar") + "</b></div>"; }).join("") + "</div>";
    ciz(h);
  }

  /* -------------------------------------------------------------- DERS */
  function dersSayfa(no, alt) {
    var k = KONU[no]; if (!k || durum(no) === "kilitli") return konuSayfa(no);
    var bl = alt ? k.alt : k.anlat;
    var h = ust(esc(k.ad), (alt ? "Farklı anlatım" : "Konu anlatımı") + " · Konu " + no, "#konu/" + no);
    h += '<div class="ders-ilerle">' + cubuk(0) + "</div>";
    h += '<article class="ders cam">' + bl.map(blok).join("") + "</article>";
    h += '<div class="ders-son cam"><h3>Özet</h3><ul>' + k.ozet.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><a class="k-btn ana genis" href="#alistir/' + no + '" data-bitir>' + I.kalem + "Anladım, alıştırmaya geç</a>" +
      (alt ? '<a class="k-btn genis" href="#ders/' + no + '">Asıl anlatımı oku</a>' : '<a class="k-btn genis" href="#ders/' + no + '/alt">Anlamadım, başka türlü anlat</a>') + "</div>";
    ciz(h);
    KOK.querySelectorAll("[data-sonraki-adim]").forEach(function (b) {
      b.onclick = function () { var g = b.parentNode.querySelector("li.gizli"); if (g) g.classList.remove("gizli"); if (!b.parentNode.querySelector("li.gizli")) b.remove(); };
    });
    KOK.querySelectorAll("[data-kontrol]").forEach(function (kutu) {
      var b = bl[+kutu.dataset.kontrol];
      kutu.querySelectorAll("[data-kk]").forEach(function (x) {
        x.onclick = function () {
          var j = +x.dataset.kk, ok = j === b.c;
          kutu.querySelectorAll("[data-kk]").forEach(function (y) { y.disabled = true; if (+y.dataset.kk === b.c) y.classList.add("dogru"); else if (y === x) y.classList.add("yanlis"); });
          kutu.querySelector(".d-kontrol-geri").innerHTML = '<div class="geri ' + (ok ? "g-dogru" : "g-yanlis") + '"><div class="geri-bas"><span>' + (ok ? I.tik : I.carpi) + "</span><b>" + (ok ? "Anlamışsın!" : "Tam oturmamış, sorun değil") + "</b></div><p>" + b.a + "</p>" + (ok ? "" : alt ? "" : '<a class="k-btn ince" href="#ders/' + no + '/alt">Bu kısmı başka türlü anlat</a>') + "</div>";
        };
      });
    });
    var bitir = function () { var c = K(no); if (alt) c.altOkundu = true; c.ders = true; kaydet(); };
    KOK.querySelector("[data-bitir]").addEventListener("click", bitir);
    var cb = KOK.querySelector(".ders-ilerle .cubuk i");
    var kay = function () { var a = KOK.querySelector(".ders"); if (!a) return removeEventListener("scroll", kay); var r = a.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height)); cb.style.width = Math.round(p * 100) + "%"; if (p > 0.97) bitir(); };
    addEventListener("scroll", kay, { passive: true }); kay();
  }

  /* ------------------------------------------------ ALIŞTIRMA / TEKRAR */
  function alistirBasla(no) {
    var c = K(no);
    if (durum(no) === "kilitli") return konuSayfa(no);
    var z = c.bekle ? 1 : c.m < 0.35 ? 1 : c.m < 0.7 ? 2 : 3;
    oturum = { tur: "alis", k: no, z: z, kul: [], sorular: [], dogru: 0, i: 0, hedef: 6, ek: 0, destek: !!c.bekle };
    S.aktif = oturum; alistirSonraki();
  }
  function tekrarBasla() {
    var ids = karistir(vadesiGelen()).slice(0, 10);
    if (!ids.length) ids = karistir(Object.keys(S.tek).filter(function (id) { return SORU[id]; })).slice(0, 8);
    if (!ids.length) { ciz(ust("Tekrar", "Aralıklı tekrar") + '<div class="k-bos cam">' + I.tik + "<p>Şu an tekrar bekleyen sorun yok. Yanlış yaptığın sorular burada belirli aralıklarla geri gelir.</p><a class=\"k-btn ana\" href=\"#panel\">Panele dön</a></div>"); return; }
    oturum = { tur: "tekrar", liste: ids, kul: [], sorular: [], dogru: 0, i: 0, hedef: ids.length, ek: 0 };
    S.aktif = oturum; alistirSonraki();
  }
  function alistirSonraki(benzer) {
    var o = oturum, q;
    if (o.tur === "tekrar") q = SORU[o.liste[o.i]];
    else {
      if (benzer) q = sec(o.k, Math.max(1, benzer.z - 1), o.kul, function (x) { return x.b === benzer.b && x.tip !== "klasik"; }) || sec(o.k, benzer.z, o.kul, function (x) { return x.tip !== "klasik"; });
      if (!q) {
        var klasikOlsun = o.i === o.hedef - 1 && K(o.k).m >= 0.45 && !o.destek;
        q = sec(o.k, o.z, o.kul, function (x) { return klasikOlsun ? x.tip === "klasik" : x.tip !== "klasik"; }) || sec(o.k, o.z, o.kul);
      }
    }
    if (!q) return alistirBitir();
    o.kul.push(q.id);
    var ctx = { etiket: benzer ? "Benzer soru · gerçekten anladın mı?" : o.tur === "tekrar" ? "Tekrar" : "" };
    var konuAd = o.tur === "tekrar" ? KONU[q.k].kisa : KONU[o.k].ad, toplam = o.hedef + o.ek;
    var h = ust(esc(o.tur === "tekrar" ? "Aralıklı tekrar" : konuAd), o.tur === "tekrar" ? "Konu: " + KONU[q.k].kisa : o.destek ? "Destek alıştırması · kolaydan zora" : "Alıştırma", o.tur === "tekrar" ? "#panel" : "#konu/" + o.k);
    h += '<div class="ot-ilerle"><span>' + (o.i + 1) + " / " + toplam + "</span>" + cubuk(o.i / toplam * 100) + "<span>" + o.dogru + " doğru</span></div>";
    h += '<div class="ot-kutu cam">' + soruHtml(q, ctx) + '<div class="ot-geri"></div><div class="ot-alt"><button class="k-btn ana genis" data-kontrol disabled>Kontrol et</button></div></div>';
    ciz(h);
    var kutu = KOK.querySelector(".ot-kutu"), btn = kutu.querySelector("[data-kontrol]");
    soruBagla(kutu, q, ctx, function (v) { btn.disabled = v == null || v === "" || (Array.isArray(v) && (q.tip !== "sira" ? !v.length : v.length < q.o.length)); });
    if (q.tip === "klasik") btn.disabled = false;
    btn.onclick = function () {
      if (q.tip === "klasik") {
        ctx.kilit = true; kutu.querySelector("[data-girdi]").readOnly = true;
        kutu.querySelector(".ot-geri").innerHTML = klasikDegerlendirHtml(q, ctx.cevap);
        btn.textContent = "Değerlendirmemi kaydet"; btn.onclick = function () {
          var p = olcutPuani(kutu, q), ok = p >= 0.6; isle(q, ok, o.tur); if (ok) o.dogru++;
          kutu.querySelector(".klasik-deg").insertAdjacentHTML("beforeend", '<div class="geri ' + (ok ? "g-dogru" : "g-yanlis") + '"><div class="geri-bas"><span>' + (ok ? I.tik : I.carpi) + "</span><b>Ölçütlerin %" + yuzde(p) + "'i karşılandı" + (ok ? "" : " · tekrar listene eklendi") + "</b></div></div>");
          kutu.querySelectorAll("[data-olcut]").forEach(function (x) { x.disabled = true; });
          devam(ok);
        };
        return;
      }
      var ok = dogruMu(q, ctx.cevap); isle(q, ok, o.tur); if (ok) o.dogru++;
      isaretle(kutu, q, ctx, ok);
      kutu.querySelector(".ot-geri").innerHTML = geriBildirimHtml(q, ctx, ok);
      devam(ok);
    };
    function devam(ok) {
      o.i++;
      if (o.tur === "alis") { if (ok) o.z = Math.min(3, o.z + (q.z >= o.z ? 1 : 0)); else o.z = Math.max(1, o.z - 1); }
      var benzerSor = !ok && o.tur === "alis" && !benzer && q.tip !== "klasik" && o.ek < 3;
      if (benzerSor) o.ek++;
      kaydet();
      btn.textContent = benzerSor ? "Benzer bir soruyla dene ›" : o.i >= o.hedef + o.ek ? "Sonucu gör ›" : "Sonraki soru ›";
      btn.disabled = false;
      btn.onclick = function () { if (o.i >= o.hedef + o.ek && !benzerSor) alistirBitir(); else alistirSonraki(benzerSor ? q : null); };
      setTimeout(function () { var g = kutu.querySelector(".ot-geri"); g && g.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 60);
    }
  }
  function alistirBitir() {
    var o = oturum; S.aktif = null;
    var n = o.i || 1, oran = o.dogru / n;
    if (o.tur === "alis") { var c = K(o.k); c.alis++; if (c.bekle) c.bekle = false; }
    kaydet(true);
    var h = ust(o.tur === "tekrar" ? "Tekrar tamamlandı" : "Alıştırma tamamlandı", o.tur === "tekrar" ? "Aralıklı tekrar" : KONU[o.k].ad, o.tur === "tekrar" ? "#panel" : "#konu/" + o.k);
    h += '<div class="sonuc cam"><div class="sonuc-ust">' + halka(yuzde(oran), 110, oran >= 0.7 ? "var(--yesil)" : oran >= 0.5 ? "var(--turuncu)" : "var(--pembe)", o.dogru + "/" + n).replace(">hazırlık<", ">doğru<") + "<div>";
    if (o.tur === "tekrar") h += "<h3>" + (oran >= 0.7 ? "Hafızan sağlam." : "Bazıları hâlâ zorluyor.") + "</h3><p>Doğru bildiğin sorular daha uzun aralıklarla, yanlışlar yakında tekrar gelecek.</p>";
    else {
      var c2 = K(o.k);
      h += "<h3>" + (oran >= 0.75 ? "Çok iyi gidiyorsun." : oran >= 0.5 ? "İyi yoldasın." : "Bu konu biraz daha çalışma istiyor.") + "</h3><p>Konu yeterliliğin: <b>%" + yuzde(c2.m) + "</b>. " + (oran >= 0.7 ? "Konu sınavına girmeye hazır görünüyorsun." : "Bir tur daha alıştırma ya da farklı anlatımı okumak iyi gelir.") + "</p>";
    }
    h += '</div></div><div class="sonuc-btn">';
    if (o.tur === "alis") h += (oran >= 0.7 ? '<a class="k-btn ana" href="#sinav/' + o.k + '">' + I.bayrak + "Konu sınavına gir</a>" : "") + '<a class="k-btn ' + (oran >= 0.7 ? "" : "ana") + '" href="#alistir/' + o.k + '">' + I.kalem + "Bir tur daha</a>" + (oran < 0.6 ? '<a class="k-btn" href="#ders/' + o.k + '/alt">' + I.kitap + "Farklı anlatım</a>" : "");
    else h += '<a class="k-btn ana" href="#panel">Panele dön</a>';
    ciz(h + "</div></div>");
    oturum = null;
  }

  /* ---------------------------------------------- KONU SINAVI / DENEME */
  function sinavHazirla(no) {
    var c = K(no);
    if (!((c.ders || c.hizli) && (c.alis || c.hizli) && !c.bekle) && !c.gecti) return konuSayfa(no);
    var kul = [], liste = [], plan = [1, 1, 2, 2, 2, 2, 3, 3];
    plan.forEach(function (z) {
      var tipler = liste.map(function (q) { return q.tip; });
      var q = sec(no, z, kul, function (x) { return x.tip !== "klasik" && tipler.filter(function (t) { return t === x.tip; }).length < 3; }) || sec(no, z, kul, function (x) { return x.tip !== "klasik"; });
      if (q) { kul.push(q.id); liste.push(q); }
    });
    sinavGiris({ tur: "sinav", k: no, ids: liste.map(function (q) { return q.id; }), cev: {}, isaret: {}, i: 0, sure: 15 * 60, ad: KONU[no].ad + " · konu sınavı" });
  }
  function denemeHazirla(tur) {
    var hz = hazirlik(tur);
    if (!hz.acik) return panel();
    var ks = KAPSAM[tur], kul = [], liste = [];
    var zPlan = karistir([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3]);
    zPlan.forEach(function (z, i) {
      var k = ks[i % ks.length];
      if (tur === "final" && i >= ks.length) k = ks[Math.floor(Math.random() * ks.length)];
      var son = S.den.length ? [].concat.apply([], S.den.filter(function (d) { return d.tur === tur; }).map(function (d) { return d.ids || []; })) : [];
      var q = sec(k, z, kul, function (x) { return x.tip !== "klasik" && son.indexOf(x.id) < 0; }) || sec(k, z, kul, function (x) { return x.tip !== "klasik"; });
      if (q) { kul.push(q.id); liste.push(q); }
    });
    liste.sort(function (a, b) { return a.z - b.z || a.k - b.k; });
    var klasik = karistir(aday(function (q) { return q.tip === "klasik" && ks.indexOf(q.k) >= 0; }));
    var kk = [], kKonu = [];
    klasik.forEach(function (q) { if (kk.length < 4 && kKonu.indexOf(q.k) < 0) { kk.push(q); kKonu.push(q.k); } });
    sinavGiris({ tur: "deneme", dt: tur, ids: liste.concat(kk).map(function (q) { return q.id; }), cev: {}, isaret: {}, i: 0, sure: DENEME[tur].sure * 60, ad: DENEME[tur].ad });
  }
  function sinavGiris(o) {
    var dn = o.tur === "deneme", nKl = o.ids.filter(function (id) { return SORU[id].tip === "klasik"; }).length;
    var h = ust(esc(o.ad), dn ? "Gerçek sınav simülasyonu" : "Konu sınavı", dn ? "#panel" : "#konu/" + o.k);
    h += '<div class="giris cam"><div class="giris-l"><div><b>' + o.ids.length + "</b><small>soru</small></div><div><b>" + Math.round(o.sure / 60) + "</b><small>dakika</small></div><div><b>" + (dn ? "100" : "%75") + "</b><small>" + (dn ? "puan" : "geçme eşiği") + "</small></div></div><ul class=\"giris-kural\">" +
      "<li>Sınav sırasında ipucu ve cevap gösterilmez; sonuçlar sonda.</li><li>Sorular arasında geçip işaretleyebilirsin.</li>" +
      (dn ? "<li>" + (o.ids.length - nKl) + " otomatik puanlanan soru × 5 puan, " + nKl + " klasik soru × 5 puan (örnek çözümle kendin puanlarsın).</li><li>Süre bitince sınav otomatik teslim edilir.</li>" : "<li>Geçmek için en az 6/8 doğru ve orta-zor sorulardan en az 3 doğru gerekir.</li><li>Geçersen sonraki konu açılır.</li>") +
      "<li>Sayfayı kapatsan bile kaldığın yerden devam edersin.</li></ul><button class=\"k-btn ana genis\" data-basla>" + I.bayrak + "Sınavı başlat</button></div>";
    ciz(h);
    KOK.querySelector("[data-basla]").onclick = function () { o.bas = Date.now(); oturum = o; S.aktif = o; kaydet(true); sinavSoru(); };
  }
  var sayacZ;
  function kalanSn(o) { return Math.max(0, Math.round(o.sure - (Date.now() - o.bas) / 1000)); }
  function sinavSoru() {
    var o = oturum, q = SORU[o.ids[o.i]], ctx = { cevap: o.cev[q.id], sira: o.siralar && o.siralar[q.id] };
    o.siralar = o.siralar || {};
    var h = '<div class="sv-ust cam"><div><small>' + esc(o.ad) + "</small><b>Soru " + (o.i + 1) + " / " + o.ids.length + '</b></div><div class="sv-sure">' + I.saat + "<span data-sure></span></div></div>";
    h += '<div class="sv-gezgin">' + o.ids.map(function (id, j) { var c = o.cev[id]; var dolu = c != null && c !== "" && !(Array.isArray(c) && !c.length); return '<button data-git="' + j + '" class="' + (j === o.i ? "aktif " : "") + (dolu ? "dolu " : "") + (o.isaret[id] ? "isaret" : "") + '">' + (j + 1) + "</button>"; }).join("") + "</div>";
    h += '<div class="ot-kutu cam">' + soruHtml(q, ctx) + '<div class="sv-alt"><button class="k-btn ince ' + (o.isaret[q.id] ? "aktif" : "") + '" data-isaret>' + I.bayrak + (o.isaret[q.id] ? "İşaretli" : "İşaretle") + '</button><div><button class="k-btn ince" data-onceki ' + (o.i ? "" : "disabled") + '>‹ Önceki</button>' + (o.i < o.ids.length - 1 ? '<button class="k-btn ana ince" data-sonraki>Sonraki ›</button>' : '<button class="k-btn ana ince" data-teslim>Teslim et</button>') + "</div></div></div>";
    h += '<button class="sv-teslim" data-teslim>Sınavı bitir ve teslim et</button>';
    ciz(h);
    if (ctx.sira) o.siralar[q.id] = ctx.sira;
    var kutu = KOK.querySelector(".ot-kutu");
    soruBagla(kutu, q, ctx, function (v) { o.cev[q.id] = v; if (ctx.sira) o.siralar[q.id] = ctx.sira; kaydet(); var g = KOK.querySelector('[data-git="' + o.i + '"]'); var dolu = v != null && v !== "" && !(Array.isArray(v) && !v.length); g && g.classList.toggle("dolu", dolu); });
    if (q.tip === "sira") o.siralar[q.id] = ctx.sira;
    KOK.querySelectorAll("[data-git]").forEach(function (b) { b.onclick = function () { o.i = +b.dataset.git; sinavSoru(); }; });
    var on = KOK.querySelector("[data-onceki]"), so = KOK.querySelector("[data-sonraki]");
    on.onclick = function () { o.i--; sinavSoru(); };
    if (so) so.onclick = function () { o.i++; sinavSoru(); };
    KOK.querySelector("[data-isaret]").onclick = function () { o.isaret[q.id] = !o.isaret[q.id]; kaydet(); sinavSoru(); };
    KOK.querySelectorAll("[data-teslim]").forEach(function (b) {
      b.onclick = function () {
        var bos = o.ids.filter(function (id) { var c = o.cev[id]; return c == null || c === "" || (Array.isArray(c) && !c.length); }).length;
        if (bos && !b.dataset.onay) { b.dataset.onay = 1; b.textContent = bos + " boş soru var · yine de teslim et"; return; }
        teslim();
      };
    });
    clearInterval(sayacZ);
    var sz = KOK.querySelector("[data-sure]");
    var tik = function () { var k = kalanSn(o); if (!sz.isConnected) return clearInterval(sayacZ); sz.textContent = Math.floor(k / 60) + ":" + ("0" + k % 60).slice(-2); sz.parentNode.classList.toggle("az", k < 300); if (k <= 0) { clearInterval(sayacZ); teslim(true); } };
    tik(); sayacZ = setInterval(tik, 1000);
  }
  function teslim(sureBitti) {
    clearInterval(sayacZ);
    var o = oturum; o.bitti = Date.now(); o.sureBitti = !!sureBitti;
    var kl = o.ids.filter(function (id) { return SORU[id].tip === "klasik"; });
    if (kl.length) return klasikPuanla(o, kl, 0);
    sonuclandir(o);
  }
  function klasikPuanla(o, kl, j) {
    var q = SORU[kl[j]];
    var h = ust("Klasik soruları puanla", (j + 1) + " / " + kl.length + " · " + esc(o.ad), false);
    h += '<div class="k-bilgi">' + I.kalem + "<p>Klasik sorularda cevabını örnek çözümle karşılaştır ve cevabında bulunan ölçütleri işaretle. Puanın işaretlediğin ölçüt oranına göre verilir; dürüst olmak gerçek seviyeni görmeni sağlar.</p></div>";
    h += '<div class="ot-kutu cam"><div class="soru-s">' + q.s + "</div>" + klasikDegerlendirHtml(q, o.cev[q.id]) + '<button class="k-btn ana genis" data-ileri>' + (j < kl.length - 1 ? "Sonraki klasik soru ›" : "Sonuç raporunu gör ›") + "</button></div>";
    ciz(h);
    var kutu = KOK.querySelector(".ot-kutu");
    KOK.querySelector("[data-ileri]").onclick = function () {
      o.kp = o.kp || {}; o.kp[q.id] = (o.cev[q.id] || "").trim() ? olcutPuani(kutu, q) : 0; kaydet();
      if (j < kl.length - 1) klasikPuanla(o, kl, j + 1); else sonuclandir(o);
    };
  }
  function sonuclandir(o) {
    var dn = o.tur === "deneme", d = 0, y = 0, b = 0, puan = 0, konu = {}, yanlislar = [], ortaZor = 0;
    o.ids.forEach(function (id) {
      var q = SORU[id], c = o.cev[id], kx = konu[q.k] || (konu[q.k] = [0, 0]);
      kx[1]++;
      if (q.tip === "klasik") {
        var p = (o.kp && o.kp[id]) || 0; puan += 5 * p; kx[0] += p;
        if (p >= 0.6) d++; else if ((c || "").trim()) y++; else b++;
        isle(q, p >= 0.6, o.tur); if (p < 0.6) yanlislar.push({ q: q, c: c });
        return;
      }
      var ok = dogruMu(q, c);
      if (ok === null) { b++; isle(q, false, o.tur); yanlislar.push({ q: q, c: c, bos: true }); return; }
      if (ok) { d++; puan += 5; kx[0]++; if (q.z >= 2) ortaZor++; } else { y++; yanlislar.push({ q: q, c: c }); }
      isle(q, ok, o.tur);
    });
    var n = o.ids.length, gecti = false;
    if (dn) {
      puan = Math.round(puan);
      S.den.push({ t: Date.now(), tur: o.dt, puan: puan, d: d, y: y, b: b, sure: Math.round((o.bitti - o.bas) / 1000), konu: konu, ids: o.ids });
    } else {
      var c = K(o.k); gecti = d / n >= 0.75 && ortaZor >= 3;
      c.sinav.push({ t: Date.now(), d: d, n: n, gecti: gecti });
      if (gecti) { c.gecti = true; c.bekle = false; c.m = Math.max(c.m, 0.8); }
      else { c.bekle = true; c.altOkundu = false; }
    }
    S.aktif = null; oturum = null; kaydet(true);
    raporCiz(o, { d: d, y: y, b: b, n: n, puan: puan, konu: konu, yanlislar: yanlislar, gecti: gecti, dn: dn });
  }
  function raporCiz(o, r) {
    var tekrarKonu = Object.keys(r.konu).filter(function (k) { return r.konu[k][0] / r.konu[k][1] < 0.6; }).map(Number);
    var h = ust(r.dn ? "Sonuç raporu" : r.gecti ? "Tebrikler, konuyu öğrendin!" : "Bu konuya biraz daha çalışalım", esc(o.ad), r.dn ? "#panel" : "#konu/" + o.k);
    var oran = r.dn ? r.puan / 100 : r.d / r.n;
    h += '<div class="sonuc cam"><div class="sonuc-ust">' + halka(r.dn ? r.puan : yuzde(oran), 120, oran >= 0.7 ? "var(--yesil)" : oran >= 0.5 ? "var(--turuncu)" : "var(--pembe)", r.dn ? String(r.puan) : r.d + "/" + r.n).replace(">hazırlık<", r.dn ? ">puan<" : ">doğru<") + "<div>";
    if (r.dn) h += "<h3>" + (r.puan >= 85 ? "Mükemmel bir sonuç." : r.puan >= 70 ? "Sınava hazır seviyedesin." : r.puan >= 50 ? "Geçer seviyedesin ama risk var." : "Henüz hazır değilsin.") + "</h3><p>" + (o.sureBitti ? "Süre doldu, sınav otomatik teslim edildi. " : "") + "Süre: " + sureYaz((o.bitti - o.bas) / 1000) + "</p>";
    else h += "<h3>" + (r.gecti ? "Sonraki konu açıldı." : "Geçme eşiği: 6/8 ve en az 3 orta-zor soru.") + "</h3><p>" + (r.gecti ? "Bu konunun yanlışları tekrar listene eklendi; aralıklarla karşına çıkacak." : "Cezalandırma yok: şimdi konuyu farklı bir anlatımla okuyup kolay sorulardan başlayan bir alıştırma yapacağız. Sonra sınav yeniden açılır.") + "</p>";
    h += '</div></div><div class="sonuc-say"><div class="iyi"><b>' + r.d + "</b><small>Doğru</small></div><div class=\"zayif\"><b>" + r.y + "</b><small>Yanlış</small></div><div><b>" + r.b + "</b><small>Boş</small></div><div><b>%" + yuzde(r.d / r.n) + "</b><small>Başarı</small></div></div></div>";
    if (r.dn) {
      h += '<h2 class="k-bolum">Konu bazlı başarı</h2><div class="kb cam">' + Object.keys(r.konu).map(function (k) { var x = r.konu[k], p = x[0] / x[1]; return '<div class="kb-s"><span>' + esc(KONU[k].kisa) + "</span>" + cubuk(yuzde(p), mRenk(p)) + "<b>" + (Math.round(x[0] * 10) / 10) + "/" + x[1] + "</b></div>"; }).join("") + "</div>";
      if (tekrarKonu.length) h += '<h2 class="k-bolum">Tekrar çalışman gereken konular</h2><div class="ke-konular cam pad">' + tekrarKonu.map(function (k) { return '<a class="ke-c" href="#konu/' + k + '">' + esc(KONU[k].ad) + "</a>"; }).join("") + "</div>";
      var hz = hazirlik(o.dt);
      h += '<div class="k-bilgi ' + (hz.hazir ? "" : "uyari") + '">' + (hz.hazir ? I.tik : I.hedef) + "<p><b>Sınava hazırlık: %" + hz.puan + ".</b> " + (hz.hazir ? "Tüm ölçütleri karşılıyorsun." : hz.eksikler.join(" · ")) + "</p></div>";
    }
    if (r.yanlislar.length) {
      h += '<h2 class="k-bolum">Yanlış ve boş soruların çözümleri</h2>' + r.yanlislar.map(function (x, i) {
        var q = x.q;
        return '<details class="cozum cam"' + (i < 2 ? " open" : "") + "><summary><span class=\"rozet " + (x.bos ? "" : "yanlis") + '">' + (x.bos ? "Boş" : "Yanlış") + "</span>" + esc(KONU[q.k].kisa) + " · " + TUR_AD[q.tip] + '</summary><div class="soru-s">' + q.s + "</div>" + (q.tip === "akis" ? '<div class="soru-akis">' + akisSvg(q.akis) + "</div>" : "") + (q.kod && q.tip !== "kod" ? '<pre class="soru-kod">' + esc(q.kod) + "</pre>" : "") +
          (q.tip === "klasik" ? '<div class="geri-dogru"><small>Örnek çözüm</small><pre class="cevap-pre">' + esc(q.model) + "</pre></div>" : '<div class="geri-dogru"><small>Doğru cevap</small>' + dogruCevapYaz(q) + "</div>" + (!x.bos && q.y && q.y[x.c] ? '<div class="geri-hata"><small>Yaptığın mantık hatası</small><p>' + q.y[x.c] + "</p></div>" : "")) +
          '<div class="geri-aciklama"><small>Açıklama</small><p>' + q.a + "</p></div></details>";
      }).join("");
    }
    h += '<div class="sonuc-btn">' + (r.dn ? '<a class="k-btn ana" href="#panel">Panele dön</a>' + (tekrarKonu.length ? '<a class="k-btn" href="#konu/' + tekrarKonu[0] + '">Eksik konuya git</a>' : "") : r.gecti ? (KONU[o.k + 1] ? '<a class="k-btn ana" href="#konu/' + (o.k + 1) + '">Sonraki konu: ' + esc(KONU[o.k + 1].kisa) + " ›</a>" : '<a class="k-btn ana" href="#panel">Panele dön</a>') : '<a class="k-btn ana" href="#ders/' + o.k + '/alt">' + I.kitap + "Farklı anlatımla öğren</a>") + "</div>";
    ciz(h);
  }

  /* ---------------------------------------------------- SEVİYE TESPİTİ */
  function seviyeGiris() {
    var h = ust("Seviye tespiti", "Seni tanıyalım", S.seviye ? "#panel" : false);
    h += '<div class="giris cam"><p class="giris-p">Hemen konu anlatmaya başlamıyoruz. Önce kısa bir tespitle neyi bildiğini, neyi bilmediğini görelim; planını buna göre hazırlayalım.</p><ul class="giris-kural"><li>Her konudan önce kolay bir soru gelir; doğru bilirsen zorluk artar.</li><li>Bilmediğin soruyu boş geçebilirsin; tahmin etmek yerine \"Bilmiyorum\" demek planını daha doğru yapar.</li><li>Cevaplar burada gösterilmez; sonunda kişisel raporunu görürsün.</li><li>Yaklaşık 10–15 soru, 10 dakika.</li></ul><button class="k-btn ana genis" data-basla>' + I.hedef + "Tespite başla</button>" + (S.seviye ? "" : '<button class="k-btn genis" data-atla>Sıfırdan başlamak istiyorum</button>') + "</div>";
    ciz(h);
    KOK.querySelector("[data-basla]").onclick = function () { oturum = { tur: "seviye", k: 1, adim: 1, sonuc: {}, kul: [], ardisik: 0, sayi: 0 }; S.aktif = oturum; seviyeSoru(); };
    var at = KOK.querySelector("[data-atla]");
    if (at) at.onclick = function () { S.seviye = { t: Date.now(), sonuc: {}, atlandi: true }; kaydet(true); if (location.hash === "#panel") yonlendir(); else location.hash = "#panel"; };
  }
  function seviyeSoru() {
    var o = oturum, k = o.k;
    if (!KONU[k] || o.ardisik >= 3) return seviyeBitir();
    var q = sec(k, o.adim, o.kul, function (x) { return x.tip !== "klasik" && x.z === o.adim; }) || sec(k, o.adim, o.kul, function (x) { return x.tip !== "klasik"; });
    if (!q) { o.k++; o.adim = 1; return seviyeSoru(); }
    o.kul.push(q.id); o.sayi++;
    var ctx = {};
    var h = ust("Seviye tespiti", "Konu " + k + " · " + KONU[k].kisa, false);
    h += '<div class="ot-ilerle"><span>Konu ' + k + " / " + D.konular.length + "</span>" + cubuk((k - 1) / D.konular.length * 100) + "<span>" + o.sayi + ". soru</span></div>";
    h += '<div class="ot-kutu cam">' + soruHtml(q, ctx) + '<div class="ot-alt iki"><button class="k-btn" data-bilmiyorum>Bilmiyorum</button><button class="k-btn ana" data-ilerle disabled>Devam ›</button></div></div>';
    ciz(h);
    var kutu = KOK.querySelector(".ot-kutu"), btn = kutu.querySelector("[data-ilerle]");
    soruBagla(kutu, q, ctx, function (v) { btn.disabled = v == null || v === "" || (Array.isArray(v) && v.length < (q.o || []).length); });
    function ilerle(ok) {
      isle(q, ok, "seviye");
      var s = o.sonuc[k] || (o.sonuc[k] = []); s.push(ok ? 1 : 0);
      if (ok && o.adim < 3) o.adim++;
      else { o.ardisik = s[0] ? 0 : o.ardisik + 1; o.k++; o.adim = 1; }
      kaydet(); seviyeSoru();
    }
    btn.onclick = function () { ilerle(!!dogruMu(q, ctx.cevap)); };
    kutu.querySelector("[data-bilmiyorum]").onclick = function () { ilerle(false); };
  }
  function seviyeBitir() {
    var o = oturum, sonuc = {};
    D.konular.forEach(function (k) {
      var s = o.sonuc[k.no], m;
      if (!s) m = 0; else if (!s[0]) m = 0.08; else if (!s[1]) m = 0.38; else if (!s[2]) m = 0.62; else m = 0.85;
      sonuc[k.no] = m;
      var c = K(k.no); if (!c.gecti) { c.m = Math.max(c.m, m); c.hizli = m >= 0.62; }
    });
    S.seviye = { t: Date.now(), sonuc: sonuc };
    S.aktif = null; oturum = null; kaydet(true);
    var bilinen = D.konular.filter(function (k) { return sonuc[k.no] >= 0.62; }), eksik = D.konular.filter(function (k) { return sonuc[k.no] < 0.62; });
    var ilk = eksik[0];
    var h = ust("Kişisel raporun hazır", "Seviye tespiti sonucu", false);
    h += '<div class="sonuc cam"><div class="sonuc-ust">' + halka(yuzde(genelSeviye()[1]), 110, "var(--mavi)", genelSeviye()[0]).replace(">hazırlık<", ">seviye<") + "<div><h3>" + (bilinen.length ? bilinen.length + " konuda temelin var." : "Sıfırdan, sağlam bir temelle başlayacağız.") + "</h3><p>" + (ilk ? "Planın <b>" + esc(ilk.ad) + "</b> konusundan başlıyor. Bildiğin konularda anlatımı atlayıp doğrudan konu sınavıyla ilerleyebilirsin." : "Tüm konularda iyi görünüyorsun; konu sınavlarıyla bunu kanıtlayıp denemeye geçebilirsin.") + "</p></div></div></div>";
    h += '<h2 class="k-bolum">Konu konu durumun</h2><div class="kb cam">' + D.konular.map(function (k) { var m = sonuc[k.no]; return '<div class="kb-s"><span>' + esc(k.kisa) + "</span>" + cubuk(yuzde(m), mRenk(m)) + "<b>" + (m >= 0.62 ? "Biliyor" : m >= 0.3 ? "Kısmen" : o.sonuc[k.no] ? "Bilmiyor" : "Sorulmadı") + "</b></div>"; }).join("") + "</div>";
    h += '<h2 class="k-bolum">Senin için plan</h2><ol class="plan cam">' + D.konular.map(function (k) { var m = sonuc[k.no]; return "<li><b>" + esc(k.kisa) + "</b><span>" + (m >= 0.62 ? "Hızlı geçiş: doğrudan konu sınavı" : m >= 0.3 ? "Anlatım + alıştırma (eksiklerini kapat)" : "Sıfırdan öğren: anlatım → alıştırma → sınav") + "</span></li>"; }).join("") + "</ol>";
    h += '<div class="sonuc-btn"><a class="k-btn ana" href="#panel">' + I.ok + "Plana başla</a></div>";
    ciz(h);
  }

  /* ------------------------------------------------------------ YÖNLENDİRME */
  function yonlendir() {
    clearInterval(sayacZ);
    var p = (location.hash.replace(/^#/, "") || "panel").split("/");
    /* Yarım kalan sınav/deneme varsa ona dön */
    if (S.aktif && (S.aktif.tur === "sinav" || S.aktif.tur === "deneme") && S.aktif.bas && !oturum) {
      oturum = S.aktif;
      if (kalanSn(oturum) <= 0) return teslim(true);
      if (location.hash !== "#devam") history.replaceState(null, "", "#devam");
      return sinavSoru();
    }
    if (oturum && (oturum.tur === "sinav" || oturum.tur === "deneme") && oturum.bas && !oturum.bitti && p[0] === "devam") return sinavSoru();
    if (!S.seviye && p[0] === "panel") return seviyeGiris();
    switch (p[0]) {
      case "seviye": return seviyeGiris();
      case "konu": return konuSayfa(+p[1]);
      case "ders": return dersSayfa(+p[1], p[2] === "alt");
      case "alistir": return alistirBasla(+p[1]);
      case "tekrar": return tekrarBasla();
      case "sinav": return sinavHazirla(+p[1]);
      case "deneme": return denemeHazirla(p[1] === "final" && AKTIF_SINAV.indexOf("final") >= 0 ? "final" : "vize");
      default: return panel();
    }
  }
  addEventListener("hashchange", yonlendir);
  yonlendir();
  window.KOC = { durum: function () { return S; } };
})();
