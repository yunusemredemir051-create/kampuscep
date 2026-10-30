/* =====================================================================
   KampüsCepte · Kod Atölyesi motoru
   ders.json içindeki "atolye" bölümünü çizer. ders.html tarafından kullanılır.
   Adım türleri: satir, sec, coklusec, metin, tablo, yaz, adim
   ===================================================================== */
(function () {
  "use strict";
  var C = null;                         // { ders, yol, kok, oku, yaz, git }
  var Q = null, Dur = null;             // açık soru, kayıt
  var filtre = 0;

  /* ---------- yardımcılar ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escA(s) { return esc(s).replace(/"/g, "&quot;"); }
  var KW = new Set("abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while var partial get set value".split(" "));
  var TIP = /^[A-Z][A-Za-z0-9_]*$/;

  /* C# için küçük renklendirici: satır satır HTML dizisi döndürür */
  function boya(kod) {
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|\b\d+(?:[.,]\d+)?[mMdDfF]?\b|[A-Za-z_ğüşöçıİĞÜŞÖÇ]\w*)/g;
    var son = 0, m, parcalar = [];
    function ekle(sinif, metin) { parcalar.push([sinif, metin]); }
    while ((m = re.exec(kod))) {
      if (m.index > son) ekle("", kod.slice(son, m.index));
      var t = m[0], c = "";
      if (t[0] === "/" ) c = "yo";
      else if (t[0] === '"' || t[0] === "'") c = "st";
      else if (/^\d/.test(t)) c = "sy";
      else if (KW.has(t)) c = "an";
      else if (TIP.test(t)) c = "tp";
      ekle(c, t); son = m.index + t.length;
    }
    if (son < kod.length) ekle("", kod.slice(son));
    var satirlar = [""];
    parcalar.forEach(function (p) {
      p[1].split("\n").forEach(function (par, i) {
        if (i > 0) satirlar.push("");
        if (par !== "") satirlar[satirlar.length - 1] += p[0] ? '<i class="' + p[0] + '">' + esc(par) + "</i>" : esc(par);
      });
    });
    return satirlar;
  }

  function kodBloku(kod, baslik, opt) {
    opt = opt || {};
    var sat = boya(kod.kod !== undefined ? kod.kod : kod);
    var bas = kod.bas || 1;
    var h = '<div class="at-kod' + (opt.secilebilir ? " secilebilir" : "") + '">';
    if (baslik) h += '<div class="at-kod-b"><span class="nok"><i></i><i></i><i></i></span>' + baslik + "</div>";
    h += '<pre>';
    sat.forEach(function (s, i) {
      var no = bas + i, ek = "";
      if (opt.vurgu && opt.vurgu.indexOf(no) >= 0) ek = " vurgu";
      h += (opt.secilebilir ? '<button type="button" class="sat' : '<span class="sat') + ek + '" data-no="' + no + '">' +
        '<b class="ln">' + no + '</b><code>' + (s || " ") + "</code>" + (opt.secilebilir ? "</button>" : "</span>");
    });
    return h + "</pre></div>";
  }

  /* kod normalleştirme (yorumsuz, boşluksuz) */
  function yorumsuz(k) {
    var o = "", i = 0, n = k.length;
    while (i < n) {
      var c = k[i], d = k[i + 1];
      if (c === '"') { var j = i + 1; while (j < n && k[j] !== '"' && k[j] !== "\n") { if (k[j] === "\\") j++; j++; } o += k.slice(i, j + 1); i = j + 1; }
      else if (c === "'") { var j2 = i + 1; while (j2 < n && k[j2] !== "'" && k[j2] !== "\n") { if (k[j2] === "\\") j2++; j2++; } o += k.slice(i, j2 + 1); i = j2 + 1; }
      else if (c === "/" && d === "/") { while (i < n && k[i] !== "\n") i++; }
      else if (c === "/" && d === "*") { var e = k.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; o += " "; }
      else { o += c; i++; }
    }
    return o;
  }
  var bosluksuz = function (s) { return String(s).replace(/[\s ]+/g, ""); };
  function say(h, p) { var n = 0, i = -1; while ((i = h.indexOf(p, i + 1)) >= 0 && p) { n++; } return n; }

  function kriterSonuc(k, ham, temiz) {
    var H = k.ham ? ham : temiz, p;
    if (k.any) return k.any.some(function (x) { return H.indexOf(bosluksuz(x)) >= 0; });
    if (k.all) return k.all.every(function (x) { return H.indexOf(bosluksuz(x)) >= 0; });
    if (k.yok) return k.yok.every(function (x) { return H.indexOf(bosluksuz(x)) < 0; });
    if (k.esit) return say(ham, bosluksuz(k.esit[0])) === say(ham, bosluksuz(k.esit[1])) && say(ham, bosluksuz(k.esit[0])) > 0;
    if (k.say) {
      var n = k.say.p.reduce(function (t, x) { return t + say(H, bosluksuz(x)); }, 0);
      return n >= (k.say.min || 0) && n <= (k.say.max === undefined ? 1e9 : k.say.max);
    }
    return false;
  }
  function disi(k, temiz) { // sınıf düzeyinde mi (süslü parantez derinliği 0)
    var pat = bosluksuz((k.any || k.all || [])[0] || ""), i = temiz.indexOf(pat);
    if (i < 0) return false;
    var d = 0; for (var j = 0; j < i; j++) { if (temiz[j] === "{") d++; else if (temiz[j] === "}") d--; }
    return d === 0;
  }
  function yazSkor(adim, kod) {
    var ham = bosluksuz(kod), temiz = bosluksuz(yorumsuz(kod));
    var r = adim.kriter.map(function (k) {
      if (k.disi) return k.any.some(function (x) { var pat = bosluksuz(x), i = temiz.indexOf(pat); if (i < 0) return false; var d = 0; for (var j = 0; j < i; j++) { if (temiz[j] === "{") d++; else if (temiz[j] === "}") d--; } return d === 0; });
      return kriterSonuc(k, ham, temiz);
    });
    return r;
  }

  /* girdi karşılaştırma */
  function fold(s) {
    return String(s).toLocaleLowerCase("tr").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/â/g, "a");
  }
  function norm(s, mod) {
    s = String(s).replace(/<[^>]+>/g, "").trim();
    if (mod === "liste") return fold(s).replace(/[^a-z0-9]+/g, "");
    s = fold(s).replace(/[\s ]+/g, "").replace(/[−–—]/g, "-").replace(/[.,]$/, "");
    if (/^-?\d+[.,]\d+$/.test(s)) s = s.replace(",", ".");
    return s;
  }
  function girdiDogru(g, v) {
    v = String(v === undefined || v === null ? "" : v).trim();
    if (!v) return false;
    if (g.mod === "tire") return /^[\-−–—]+$|^yok\.?$/i.test(v);
    if (g.h) return g.c.some(function (c) { return c.trim() === v; });
    return g.c.some(function (c) { return norm(c, g.mod) === norm(v, g.mod); });
  }

  /* ---------- kayıt ---------- */
  var ANAHTAR = function () { return "kc-at:" + C.yol; };
  function kayitOku() { return C.oku(ANAHTAR()) || {}; }
  function kayitYaz(tum) { C.yaz(ANAHTAR(), tum); }
  function soruKaydi(id) { var t = kayitOku(); return t[id] || { a: [], p: [] }; }
  function soruKaydet(id, kay) { var t = kayitOku(); t[id] = kay; kayitYaz(t); }
  function ortalama(kay) {
    var ps = (kay.p || []).filter(function (x) { return x !== null && x !== undefined; });
    return ps.length ? ps.reduce(function (a, b) { return a + b; }, 0) / ps.length : 0;
  }
  function puanlanan(q) { return q.adimlar.filter(function (a) { return a.t !== "adim"; }).length; }
  function durum(q) {
    var k = soruKaydi(q.id), bitti = k.bitti === true, n = k.a.filter(function (x) { return x !== undefined && x !== null; }).length;
    return { bitti: bitti, n: n, ort: ortalama(k), basladi: n > 0 };
  }

  /* ---------- liste ---------- */
  var ELMAS = function (n) { return '<span class="at-elmas" title="Zorluk">' + "◆".repeat(n) + '<s>' + "◆".repeat(3 - n) + "</s></span>"; };
  function bolumAdi(n) { var u = C.ders.uniteler.find(function (x) { return x.no === n; }); return u ? u.ad : "Bölüm " + n; }
  function sorular() { return C.ders.atolye.sorular; }
  function toplam() { return C.ders.atolye ? C.ders.atolye.sorular.length : 0; }
  function genelOzet() {
    var s = sorular(), b = 0, ps = 0;
    s.forEach(function (q) { var d = durum(q); if (d.bitti) { b++; ps += d.ort; } });
    return { toplam: s.length, bitti: b, ort: b ? ps / b : 0 };
  }

  function listeHtml(f) {
    filtre = f === undefined ? filtre : f;
    var s = sorular(), o = genelOzet();
    var bolumler = C.ders.uniteler.filter(function (u) { return s.some(function (q) { return q.id.split(".")[0] === String(u.no); }); });
    var h = '<section class="at-giris cam"><div class="at-giris-ust"><span class="at-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg></span><div><h2>Kod Atölyesi</h2><p>Kitabın tüm “Kendini Test Et” soruları burada çözülür: hata avla, kodu izle, çıktıyı tahmin et, kodu kendin yaz.</p></div></div>' +
      '<div class="at-istat"><div><b>' + o.toplam + '</b>soru</div><div><b>' + o.bitti + '</b>tamamlanan</div><div><b>' + (o.bitti ? Math.round(o.ort * 100) + "%" : "–") + '</b>başarı</div></div>' +
      (o.bitti ? '<div class="at-bar"><i style="width:' + Math.round(o.bitti / o.toplam * 100) + '%"></i></div>' : "") + "</section>";
    h += '<div class="at-chip" role="tablist"><button data-f="0" class="' + (!filtre ? "aktif" : "") + '">Tümü</button>' +
      bolumler.map(function (u) { return '<button data-f="' + u.no + '" class="' + (filtre === u.no ? "aktif" : "") + '">Bölüm ' + u.no + "</button>"; }).join("") + "</div>";
    var gor = s.filter(function (q) { return !filtre || q.id.split(".")[0] === String(filtre); });
    var son = 0, gruplar = [];
    gor.forEach(function (q) { var b = +q.id.split(".")[0]; if (b !== son) { gruplar.push({ b: b, q: [] }); son = b; } gruplar[gruplar.length - 1].q.push(q); });
    gruplar.forEach(function (g) {
      h += '<div class="at-grup"><span>Bölüm ' + g.b + "</span> " + bolumAdi(g.b) + "</div><div class=\"at-liste\">";
      g.q.forEach(function (q) {
        var d = durum(q), tur = C.ders.atolye.turler[q.tur] || q.tur;
        h += '<a class="at-kart cam t-' + q.tur + (d.bitti ? " bitti" : "") + '" href="#atolye-' + q.id + '">' +
          '<span class="at-no">' + q.id + '</span><div class="at-kart-g"><div class="at-tur">' + tur + " " + ELMAS(q.zorluk) + "</div><h3>" + q.baslik + "</h3>" +
          '<div class="at-alt">' + (d.bitti ? '<b class="ok">✓ %' + Math.round(d.ort * 100) + "</b>" : d.basladi ? '<b class="dv">Devam ediyor · ' + d.n + "/" + q.adimlar.length + "</b>" : "<span>" + q.adimlar.length + " adım</span>") + "</div></div>" +
          '<span class="at-ok" aria-hidden="true">›</span></a>';
      });
      h += "</div>";
    });
    return h;
  }
  function listeBagla(kok, yenile) {
    kok.querySelectorAll(".at-chip [data-f]").forEach(function (b) { b.onclick = function () { filtre = +b.dataset.f; yenile(); }; });
  }

  /* ---------- soru ekranı ---------- */
  var KOK = null, ADIMLAR = null, ILERI = 0;

  function ac(id, kok) {
    var q = sorular().find(function (x) { return x.id === id; });
    if (!q) { C.git(""); return; }
    Q = q; KOK = kok;
    var kay = soruKaydi(id);
    ILERI = 0;
    while (ILERI < q.adimlar.length && kay.a[ILERI] !== undefined && kay.a[ILERI] !== null) ILERI++;
    ciz();
  }

  function ustHtml() {
    var tur = C.ders.atolye.turler[Q.tur] || Q.tur;
    var sira = sorular(), i = sira.indexOf(Q);
    return '<div class="at-ust"><a class="geri" href="#atolye">‹ Kod atölyesi</a><span class="at-ust-no">' + (i + 1) + " / " + sira.length + "</span></div>" +
      '<section class="at-baslik cam t-' + Q.tur + '"><div class="at-tur"><span class="rozet">' + tur + "</span> " + ELMAS(Q.zorluk) + '<span class="at-id">Soru ' + Q.id + "</span></div>" +
      "<h1>" + Q.baslik + "</h1><p>" + Q.giris + "</p></section>";
  }

  function ciz() {
    var h = ustHtml(), q = Q, kay = soruKaydi(q.id);
    var gorunen = (q.kodlar || []).filter(function (k) { return k.goster !== false; });
    gorunen.forEach(function (k) { h += kodBloku(k, k.b || "Kod"); });
    // ilerleme noktaları
    h += '<div class="at-noktalar" aria-label="Adımlar">' + q.adimlar.map(function (a, i) {
      var tam = kay.a[i] !== undefined && kay.a[i] !== null;
      return '<i class="' + (tam ? (kay.p[i] === null ? "tam" : kay.p[i] >= 0.999 ? "dogru" : kay.p[i] > 0 ? "kismi" : "yanlis") : i === ILERI ? "su-an" : "") + '"></i>';
    }).join("") + "</div>";
    h += '<div id="at-adimlar"></div><div id="at-son"></div>';
    KOK.innerHTML = h;
    var adimKok = KOK.querySelector("#at-adimlar");
    for (var i = 0; i <= Math.min(ILERI, q.adimlar.length - 1); i++) adimKoy(adimKok, i, false);
    if (ILERI >= q.adimlar.length) sonCiz();
  }

  function adimKoy(ana, i, kaydir) {
    var a = Q.adimlar[i], kay = soruKaydi(Q.id), kap = document.createElement("section");
    kap.className = "at-adim cam"; kap.dataset.i = i;
    ana.appendChild(kap);
    var sv = kay.a[i], kilitli = sv !== undefined && sv !== null;
    var T = TURLER_[a.t];
    var rozet = ({ satir: "Hata satırını bul", sec: "Seç", coklusec: "Eşleştir", metin: "Yaz", tablo: "Tabloyu doldur", yaz: "Kodu yaz", adim: "Adım adım izle" })[a.t];
    kap.innerHTML = '<div class="at-adim-ust"><span class="at-adim-no">' + (i + 1) + "</span><span class=\"at-adim-tur\">" + rozet + "</span></div><div class=\"at-s\">" + a.s + '</div><div class="at-govde"></div>';
    var govde = kap.querySelector(".at-govde");
    T(govde, a, i, kilitli ? { sv: sv, p: kay.p[i] } : null, function (cevap, puan) { bitirAdim(i, cevap, puan); });
    if (kaydir) setTimeout(function () { kap.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }

  function bitirAdim(i, cevap, puan) {
    var kay = soruKaydi(Q.id);
    kay.a[i] = cevap; kay.p[i] = puan;
    if (i === ILERI) ILERI++;
    var bitti = Q.adimlar.every(function (_, j) { return kay.a[j] !== undefined && kay.a[j] !== null; });
    if (bitti) kay.bitti = true;
    soruKaydet(Q.id, kay);
    // noktaları güncelle
    var nk = KOK.querySelectorAll(".at-noktalar i");
    nk.forEach(function (n, j) {
      var tam = kay.a[j] !== undefined && kay.a[j] !== null;
      n.className = tam ? (kay.p[j] === null ? "tam" : kay.p[j] >= 0.999 ? "dogru" : kay.p[j] > 0 ? "kismi" : "yanlis") : j === ILERI ? "su-an" : "";
    });
    var ana = KOK.querySelector("#at-adimlar");
    if (ILERI < Q.adimlar.length) adimKoy(ana, ILERI, true);
    else sonCiz(true);
  }

  function sonCiz(kaydir) {
    var kay = soruKaydi(Q.id), ort = ortalama(kay), sira = sorular(), i = sira.indexOf(Q), sonraki = sira[i + 1];
    var puanlar = Q.adimlar.map(function (a, j) { return kay.p[j]; });
    var kok = KOK.querySelector("#at-son");
    var dogru = puanlar.filter(function (p) { return p !== null && p >= 0.999; }).length, top = puanlar.filter(function (p) { return p !== null; }).length;
    kok.innerHTML = '<section class="at-sonuc cam ' + (ort >= 0.8 ? "iyi" : ort >= 0.5 ? "orta" : "zayif") + '"><div class="at-halka" style="--y:' + Math.round(ort * 100) + '"><b>%' + Math.round(ort * 100) + "</b></div>" +
      "<div><h2>" + (ort >= 0.999 ? "Kusursuz!" : ort >= 0.8 ? "Çok iyi" : ort >= 0.5 ? "Fena değil" : "Tekrar edelim") + "</h2><p>" + top + " adımdan " + dogru + " tanesini tam doğru yaptın.</p></div></section>" +
      (Q.ack ? '<div class="at-ack"><b>Özet</b>' + Q.ack + "</div>" : "") +
      '<div class="butonlar at-son-btn"><button class="btn" id="at-tekrar">↺ Baştan çöz</button>' + (sonraki ? '<a class="btn ana" href="#atolye-' + sonraki.id + '">Sonraki: ' + sonraki.id + " ›</a>" : '<a class="btn ana" href="#atolye">Soru listesi</a>') + "</div>";
    kok.querySelector("#at-tekrar").onclick = function () { soruKaydet(Q.id, { a: [], p: [] }); ILERI = 0; ciz(); window.scrollTo({ top: 0 }); };
    if (kaydir) setTimeout(function () { kok.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }

  /* ---------- adım türleri ---------- */
  function geriBildirim(kap, iyi, metin) {
    var d = document.createElement("div"); d.className = "at-geri " + (iyi === true ? "iyi" : iyi === "kismi" ? "kismi" : "kotu");
    d.innerHTML = metin; kap.appendChild(d); return d;
  }
  function devamDugme(kap, fn, ad) {
    var b = document.createElement("button"); b.className = "btn ana at-devam"; b.type = "button"; b.textContent = ad || "Devam ›"; b.onclick = function () { b.remove(); fn(); }; kap.appendChild(b); return b;
  }

  var TURLER_ = {};

  /* --- satir: hatalı satırları işaretle --- */
  TURLER_.satir = function (kap, a, i, kayitli, bitir) {
    var kod = Q.kodlar[a.kod], secili = new Set(kayitli ? kayitli.sv : []);
    kap.innerHTML = kodBloku(kod, kod.b || "Kod", { secilebilir: true }) + '<div class="at-ipucu">Satırlara dokunarak işaretle.</div><div class="at-alan"></div>';
    var satlar = kap.querySelectorAll(".sat"), alan = kap.querySelector(".at-alan"), btn;
    function boyaS() { satlar.forEach(function (b) { b.classList.toggle("secili", secili.has(+b.dataset.no)); }); }
    function kontrol(kalici) {
      var dogru = new Set(a.dogru), dk = 0, yk = 0;
      satlar.forEach(function (b) {
        var no = +b.dataset.no, s = secili.has(no), d = dogru.has(no);
        b.classList.remove("secili"); b.disabled = true;
        if (s && d) { b.classList.add("ok"); dk++; } else if (s && !d) { b.classList.add("kotu"); yk++; } else if (!s && d) b.classList.add("eksik");
      });
      var puan = Math.max(0, (dk - yk) / a.dogru.length), tam = dk === a.dogru.length && yk === 0;
      alan.innerHTML = "";
      geriBildirim(alan, tam ? true : dk ? "kismi" : false, tam ? "<b>Doğru!</b> Tüm hatalı satırları buldun." : "<b>" + dk + " / " + a.dogru.length + "</b> doğru satır" + (yk ? ", " + yk + " gereksiz işaret" : "") + ". Turuncu çizgili satırlar atladığın hatalardı.");
      var ol = document.createElement("div"); ol.className = "at-hatalar";
      ol.innerHTML = a.hatalar.map(function (h) { return '<div><b>Satır ' + h.satir + '</b> · <code>' + esc(h.ad) + "</code><span>" + h.neden + "</span></div>"; }).join("");
      alan.appendChild(ol);
      if (!kayitli) { bitirDugme(alan, function () { bitir(Array.from(secili).sort(function (x, y) { return x - y; }), puan); }); }
    }
    if (kayitli) { kontrol(true); return; }
    satlar.forEach(function (b) {
      b.onclick = function () { var no = +b.dataset.no; secili.has(no) ? secili.delete(no) : secili.add(no); boyaS(); btn.disabled = secili.size === 0; };
    });
    btn = document.createElement("button"); btn.className = "btn ana"; btn.type = "button"; btn.textContent = "Kontrol et"; btn.disabled = true;
    btn.onclick = function () { btn.remove(); kontrol(false); };
    alan.appendChild(btn);
  };
  function bitirDugme(kap, fn) { devamDugme(kap, fn, "Sonraki adım ›"); }

  /* --- sec: tek seçim --- */
  TURLER_.sec = function (kap, a, i, kayitli, bitir) {
    var h = '<div class="at-secenekler">' + a.o.map(function (o, j) { return '<button type="button" class="at-sik" data-j="' + j + '"><b>' + "ABCDEFG"[j] + "</b><span>" + o + "</span></button>"; }).join("") + '</div><div class="at-alan"></div>';
    kap.innerHTML = h;
    var sik = kap.querySelectorAll(".at-sik"), alan = kap.querySelector(".at-alan");
    function goster(j, kalici) {
      sik.forEach(function (b, k) { b.disabled = true; if (k === a.c) b.classList.add("ok"); else if (k === j) b.classList.add("kotu"); });
      geriBildirim(alan, j === a.c, (j === a.c ? "<b>Doğru!</b> " : "<b>Yanlış.</b> Doğru cevap " + "ABCDEFG"[a.c] + ". ") + (a.a || ""));
      if (!kalici) bitirDugme(alan, function () { bitir(j, j === a.c ? 1 : 0); });
    }
    if (kayitli) { goster(kayitli.sv, true); return; }
    sik.forEach(function (b) { b.onclick = function () { goster(+b.dataset.j, false); }; });
  };

  /* --- coklusec: satır satır eşleştirme --- */
  TURLER_.coklusec = function (kap, a, i, kayitli, bitir) {
    var secim = kayitli ? kayitli.sv.slice() : a.satirlar.map(function () { return -1; });
    var h = a.satirlar.map(function (r, ri) {
      return '<div class="at-cs" data-r="' + ri + '"><div class="at-cs-e">' + r.e + '</div><div class="at-cs-o">' + r.o.map(function (o, j) { return '<button type="button" class="at-chipsik" data-j="' + j + '">' + o + "</button>"; }).join("") + '</div><div class="at-cs-a"></div></div>';
    }).join("") + '<div class="at-alan"></div>';
    kap.innerHTML = h;
    var alan = kap.querySelector(".at-alan"), btn;
    function guncel() { kap.querySelectorAll(".at-cs").forEach(function (cs, ri) { cs.querySelectorAll(".at-chipsik").forEach(function (b, j) { b.classList.toggle("secili", secim[ri] === j); }); }); }
    function kontrol() {
      var dk = 0;
      kap.querySelectorAll(".at-cs").forEach(function (cs, ri) {
        var r = a.satirlar[ri], iyi = secim[ri] === r.c; if (iyi) dk++;
        cs.querySelectorAll(".at-chipsik").forEach(function (b, j) { b.disabled = true; b.classList.remove("secili"); if (j === r.c) b.classList.add("ok"); else if (j === secim[ri]) b.classList.add("kotu"); });
        if (r.a) cs.querySelector(".at-cs-a").innerHTML = r.a;
      });
      var puan = dk / a.satirlar.length;
      alan.innerHTML = ""; geriBildirim(alan, puan >= 0.999 ? true : puan > 0 ? "kismi" : false, "<b>" + dk + " / " + a.satirlar.length + "</b> doğru.");
      if (!kayitli) bitirDugme(alan, function () { bitir(secim, puan); });
    }
    if (kayitli) { kontrol(); return; }
    kap.querySelectorAll(".at-cs").forEach(function (cs, ri) {
      cs.querySelectorAll(".at-chipsik").forEach(function (b, j) { b.onclick = function () { secim[ri] = j; guncel(); btn.disabled = secim.some(function (x) { return x < 0; }); }; });
    });
    btn = document.createElement("button"); btn.className = "btn ana"; btn.type = "button"; btn.textContent = "Kontrol et"; btn.disabled = true;
    btn.onclick = function () { btn.remove(); kontrol(); }; alan.appendChild(btn);
  };

  /* --- metin: kısa cevap --- */
  TURLER_.metin = function (kap, a, i, kayitli, bitir) {
    kap.innerHTML = '<div class="at-satirgiris"><input type="text" class="at-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Cevabını yaz"><button class="btn ana" type="button">Kontrol et</button></div><div class="at-alan"></div>';
    var inp = kap.querySelector("input"), btn = kap.querySelector("button"), alan = kap.querySelector(".at-alan");
    function kontrol(deger, kalici) {
      var iyi = a.cevap.some(function (c) { return norm(c) === norm(deger); });
      inp.value = deger; inp.disabled = true; btn.remove(); inp.classList.add(iyi ? "ok" : "kotu");
      geriBildirim(alan, iyi, (iyi ? "<b>Doğru!</b> " : "<b>Olmadı.</b> Doğru cevap: <code>" + esc(a.cevap[0]) + "</code>. ") + (a.a || ""));
      if (!kalici) bitirDugme(alan, function () { bitir(deger, iyi ? 1 : 0); });
    }
    if (kayitli) { kontrol(kayitli.sv, true); return; }
    btn.onclick = function () { if (inp.value.trim()) kontrol(inp.value, false); };
    inp.onkeydown = function (e) { if (e.key === "Enter") btn.click(); };
  };

  /* --- tablo: hücreleri doldur --- */
  TURLER_.tablo = function (kap, a, i, kayitli, bitir) {
    var sayac = 0, girdiler = [];
    var h = '<div class="at-tablo-kap"><table class="at-tablo"><thead><tr>' + a.kolon.map(function (k) { return "<th>" + k + "</th>"; }).join("") + "</tr></thead><tbody>";
    a.satirlar.forEach(function (r, ri) {
      h += "<tr>" + r.map(function (c) {
        if (c !== null && typeof c === "object") {
          var n = sayac++; girdiler.push(c);
          if (c.o) return '<td><select class="at-input" data-n="' + n + '"><option value="">…</option>' + c.o.map(function (o) { return '<option value="' + escA(o) + '">' + esc(o) + "</option>"; }).join("") + "</select></td>";
          return '<td><input type="text" class="at-input" data-n="' + n + '" autocomplete="off" autocapitalize="off" spellcheck="false" style="min-width:' + Math.max(7, c.gen || 8) + 'ch;width:100%"></td>';
        }
        return "<td>" + c + "</td>";
      }).join("") + "</tr>";
    });
    h += '</tbody></table></div><div class="at-alan"></div>';
    kap.innerHTML = h;
    var alan = kap.querySelector(".at-alan"), alanlar = kap.querySelectorAll("[data-n]"), btn;
    function degerler() { return Array.from(alanlar).map(function (x) { return x.value; }); }
    function kontrol(deg, kalici) {
      var dk = 0;
      alanlar.forEach(function (x, n) {
        x.value = deg[n] === undefined ? "" : deg[n]; x.disabled = true;
        var iyi = girdiDogru(girdiler[n], x.value); if (iyi) dk++;
        x.classList.add(iyi ? "ok" : "kotu");
        if (!iyi) { var sp = document.createElement("span"); sp.className = "at-dogru"; sp.textContent = girdiler[n].c[0]; x.parentNode.appendChild(sp); }
      });
      var puan = girdiler.length ? dk / girdiler.length : 1;
      alan.innerHTML = ""; geriBildirim(alan, puan >= 0.999 ? true : puan > 0 ? "kismi" : false, "<b>" + dk + " / " + girdiler.length + "</b> hücre doğru." + (puan < 0.999 ? " Yanlış hücrelerin altında doğru değer yazıyor." : ""));
      var nl = (a.notlar || []).filter(function (x) { return x; });
      if (nl.length) { var d = document.createElement("div"); d.className = "at-hatalar"; d.innerHTML = (a.notlar || []).map(function (x, ri) { return x ? '<div><b>' + (a.satirlar[ri] && typeof a.satirlar[ri][0] === "string" ? a.satirlar[ri][0].replace(/<[^>]+>/g, "") : ri + 1) + ".</b> <span>" + x + "</span></div>" : ""; }).join(""); alan.appendChild(d); }
      if (!kalici) bitirDugme(alan, function () { bitir(deg, puan); });
    }
    if (kayitli) { kontrol(kayitli.sv, true); return; }
    btn = document.createElement("button"); btn.className = "btn ana"; btn.type = "button"; btn.textContent = "Kontrol et"; btn.disabled = true;
    function dolu() { btn.disabled = !Array.from(alanlar).every(function (x) { return x.value.trim() !== ""; }); }
    alanlar.forEach(function (x) { x.addEventListener("input", dolu); x.addEventListener("change", dolu); x.addEventListener("keydown", function (e) { if (e.key === "Enter" && !btn.disabled) btn.click(); }); });
    btn.onclick = function () { var d = degerler(); btn.remove(); kontrol(d, false); };
    alan.appendChild(btn);
  };

  /* --- yaz: kod yazma --- */
  TURLER_.yaz = function (kap, a, i, kayitli, bitir) {
    var tas = (soruKaydi(Q.id).taslak || {})[i];
    kap.innerHTML = '<div class="at-editor"><div class="at-kod-b"><span class="nok"><i></i><i></i><i></i></span>Kodunu buraya yaz <small>Tab = girinti</small></div><textarea class="at-yaz" spellcheck="false" autocomplete="off" autocapitalize="off" rows="8"></textarea></div><div class="at-alan"></div>';
    var ta = kap.querySelector("textarea"), alan = kap.querySelector(".at-alan");
    ta.value = kayitli ? kayitli.sv.k : (tas !== undefined ? tas : a.bas || "");
    function boyut() { ta.style.height = "auto"; ta.style.height = Math.min(520, Math.max(150, ta.scrollHeight + 4)) + "px"; }
    ta.addEventListener("input", function () {
      boyut(); var k = soruKaydi(Q.id); k.taslak = k.taslak || {}; k.taslak[i] = ta.value; soruKaydet(Q.id, k);
    });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); var s = ta.selectionStart; ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 4; }
    });
    setTimeout(boyut, 0);
    function sonucGoster(r, kod, kalici, gosterildi) {
      var gecen = r.filter(Boolean).length, puan = gosterildi ? 0 : gecen / r.length;
      alan.innerHTML = "";
      var l = document.createElement("div"); l.className = "at-kriter";
      l.innerHTML = a.kriter.map(function (k, j) { return '<div class="' + (r[j] ? "ok" : "kotu") + '"><i>' + (r[j] ? "✓" : "✗") + "</i><span>" + k.ad + "</span></div>"; }).join("");
      alan.appendChild(l);
      return { puan: puan, gecen: gecen };
    }
    function cozumGoster() {
      var d = document.createElement("div"); d.className = "at-cozum";
      d.innerHTML = '<div class="at-cozum-b">Örnek çözüm</div>' + kodBloku(a.cozum, "Örnek çözüm") + (a.a ? '<div class="at-ack"><b>Not</b>' + a.a + "</div>" : "");
      d.querySelector(".at-cozum-b").remove(); alan.appendChild(d);
    }
    if (kayitli) {
      ta.disabled = true; var r0 = yazSkor(a, ta.value); var s0 = sonucGoster(r0, ta.value, true, kayitli.sv.g);
      geriBildirim(alan, kayitli.sv.g ? false : s0.gecen === r0.length ? true : "kismi", kayitli.sv.g ? "Çözümü açtın; bu adım puan getirmedi." : "<b>" + s0.gecen + " / " + r0.length + "</b> ölçüt sağlandı.");
      cozumGoster(); return;
    }
    var bar = document.createElement("div"); bar.className = "at-yaz-btn";
    bar.innerHTML = '<button class="btn ana" type="button" data-k>Kontrol et</button><button class="btn" type="button" data-c>Çözümü göster</button>';
    kap.appendChild(bar);
    var sonuc = null;
    bar.querySelector("[data-k]").onclick = function () {
      var kod = ta.value; if (!kod.trim()) return;
      var r = yazSkor(a, kod), s = sonucGoster(r, kod, false, false);
      var tam = s.gecen === r.length;
      geriBildirim(alan, tam ? true : s.gecen ? "kismi" : false, tam ? "<b>Harika!</b> Tüm ölçütler sağlandı." : "<b>" + s.gecen + " / " + r.length + "</b> ölçüt sağlandı. Kırmızı maddeleri düzeltip tekrar deneyebilirsin.");
      if (tam) { ta.disabled = true; bar.remove(); cozumGoster(); bitirDugme(alan, function () { bitir({ k: kod, g: false }, 1); }); }
      else sonuc = { r: r, kod: kod, puan: s.puan };
    };
    bar.querySelector("[data-c]").onclick = function () {
      var kod = ta.value, r = yazSkor(a, kod); ta.disabled = true; bar.remove();
      var s = sonucGoster(r, kod, false, false);
      geriBildirim(alan, false, "Çözüm açıldı. Bu adım puan getirmedi; çözümü incele ve farkı bul.");
      cozumGoster(); bitirDugme(alan, function () { bitir({ k: kod, g: true }, 0); });
    };
  };

  /* --- adim: adım adım izleme --- */
  TURLER_.adim = function (kap, a, i, kayitli, bitir) {
    var kod = Q.kodlar[a.kod], k = 0, son = a.kareler.length - 1, goruldu = !!kayitli;
    kap.innerHTML = '<div class="at-izle"></div><div class="at-alan"></div>';
    var izle = kap.querySelector(".at-izle"), alan = kap.querySelector(".at-alan");
    function cizK() {
      var f = a.kareler[k];
      var gtab = f.g && f.g.length ? '<div class="at-degisken">' + f.g.map(function (x) { return '<div><small>' + esc(x.ad) + "</small><b>" + esc(x.d) + "</b></div>"; }).join("") + "</div>" : "";
      izle.innerHTML = kodBloku(kod, kod.b || "Kod", { vurgu: f.s }) + '<div class="at-not">' + f.n + "</div>" + gtab +
        '<div class="at-nav"><button type="button" class="btn" data-g ' + (k === 0 ? "disabled" : "") + '>‹ Geri</button><span>' + (k + 1) + " / " + (son + 1) + '</span><button type="button" class="btn ana" data-i ' + (k === son ? "disabled" : "") + ">İleri ›</button></div>";
      izle.querySelector("[data-g]").onclick = function () { k--; cizK(); };
      izle.querySelector("[data-i]").onclick = function () { k++; cizK(); };
      if (k === son && !goruldu) { goruldu = true; devamDugme(alan, function () { bitir(1, null); }, "Anladım, devam et ›"); }
    }
    cizK();
    if (kayitli) alan.innerHTML = "";
  };

  /* ---------- CSS ---------- */
  var CSS = `
.at-giris{padding:20px;margin-bottom:14px}
.at-giris-ust{display:flex;gap:14px;align-items:flex-start}
.at-logo{width:46px;height:46px;border-radius:14px;flex:none;display:grid;place-items:center;color:#fff;background:linear-gradient(140deg,#0f1630,#3b5bfd 60%,#8b5cf6);box-shadow:0 8px 18px -8px rgba(59,91,253,.7)}
.at-logo svg{width:24px;height:24px}
.at-giris h2{margin:0 0 4px;font-size:21px;letter-spacing:-.4px}
.at-giris p{margin:0;color:var(--soluk);font-size:14px;line-height:1.5}
.at-istat{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}
.at-istat div{background:rgba(255,255,255,.7);border:1px solid var(--cam-kenar);border-radius:14px;padding:11px 6px;text-align:center;font-size:12px;font-weight:700;color:var(--soluk)}
.at-istat b{display:block;font-size:22px;color:var(--yazi);letter-spacing:-.5px}
.at-bar{height:8px;border-radius:99px;background:rgba(20,27,52,.08);overflow:hidden;margin-top:12px}
.at-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--mavi),var(--mor));border-radius:99px}
.at-chip{display:flex;gap:8px;overflow-x:auto;padding:2px 0 10px;margin-bottom:4px;scrollbar-width:none}
.at-chip::-webkit-scrollbar{display:none}
.at-chip button{flex:none;border:1.5px solid var(--cizgi);background:#fff;color:var(--soluk);font:800 13px var(--font);padding:8px 14px;border-radius:99px;cursor:pointer}
.at-chip button.aktif{background:var(--mavi);border-color:var(--mavi);color:#fff}
.at-grup{margin:18px 2px 10px;font-weight:800;font-size:14px;letter-spacing:-.2px}
.at-grup span{display:inline-block;margin-right:6px;padding:3px 9px;border-radius:99px;font-size:12px;background:var(--mavi-acik);color:var(--mavi)}
.at-liste{display:grid;gap:10px}
.at-kart{display:flex;align-items:center;gap:14px;padding:14px 16px;text-decoration:none;color:inherit;transition:transform .15s,box-shadow .15s}
.at-kart:hover{transform:translateY(-1px)}
.at-no{flex:none;width:50px;height:50px;border-radius:15px;display:grid;place-items:center;font:800 15px var(--font);color:#fff;background:linear-gradient(140deg,#3b5bfd,#6a82ff)}
.at-kart.t-hata .at-no{background:linear-gradient(140deg,#f2557f,#ff8a3d)}
.at-kart.t-izleme .at-no{background:linear-gradient(140deg,#8b5cf6,#b58bff)}
.at-kart.t-cikti .at-no{background:linear-gradient(140deg,#16b67a,#4fd4a0)}
.at-kart.t-yaz .at-no{background:linear-gradient(140deg,#0f1630,#3b5bfd)}
.at-kart.t-tasarim .at-no{background:linear-gradient(140deg,#ff8a3d,#ffb347)}
.at-kart.t-senaryo .at-no{background:linear-gradient(140deg,#0ea5c6,#38c9e8)}
.at-kart.t-duzen .at-no{background:linear-gradient(140deg,#d946a8,#f472c0)}
.at-kart-g{min-width:0;flex:1}
.at-kart h3{margin:2px 0 4px;font-size:16px;letter-spacing:-.3px;line-height:1.25}
.at-tur{font-size:12px;font-weight:800;color:var(--soluk);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.at-tur .rozet{padding:3px 10px;border-radius:99px;background:var(--mavi-acik);color:var(--mavi)}
.at-id{margin-left:auto;font-weight:800}
.at-elmas{letter-spacing:1px;color:var(--turuncu);font-size:11px}
.at-elmas s{text-decoration:none;color:#d6dbec}
.at-alt{font-size:12.5px;font-weight:700;color:var(--soluk)}
.at-alt .ok{color:#0c6e4b}.at-alt .dv{color:#b65a14}
.at-kart.bitti{background:rgba(226,248,238,.8)}
.at-ok{font-size:24px;color:var(--soluk);flex:none}
.at-ust{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.at-ust-no{font-size:13px;font-weight:800;color:var(--soluk)}
.at-baslik{padding:20px;margin-bottom:14px}
.at-baslik h1{margin:10px 0 8px;font-size:25px;letter-spacing:-.6px;line-height:1.2}
.at-baslik p{margin:0;color:var(--yazi);font-size:15px;line-height:1.6}
.at-baslik code,.at-s code,.at-geri code,.at-hatalar code,.at-ack code,.at-cs code,.at-sik code,.at-chipsik code,.at-tablo code,.at-not code,.at-kriter code,.at-secenekler code{font:600 .88em ui-monospace,"SF Mono",Menlo,Consolas,monospace;background:rgba(59,91,253,.1);color:#2a3fc4;padding:1px 6px;border-radius:6px;white-space:pre-wrap;word-break:break-word}
.at-kod{background:#0f1630;border-radius:18px;margin:0 0 14px;overflow:hidden;box-shadow:0 14px 30px -16px rgba(15,22,48,.6)}
.at-kod-b{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#161f42;color:#9aa6d6;font:700 12px var(--font);letter-spacing:.2px}
.at-kod-b small{margin-left:auto;font-weight:600;opacity:.7}
.at-kod-b .nok{display:inline-flex;gap:5px}
.at-kod-b .nok i{width:9px;height:9px;border-radius:50%;background:#ff6b81}.at-kod-b .nok i:nth-child(2){background:#ffc46b}.at-kod-b .nok i:nth-child(3){background:#4fd4a0}
.at-kod pre{margin:0;padding:10px 0;overflow-x:auto;font:500 13px/1.7 ui-monospace,"SF Mono",Menlo,Consolas,monospace;color:#dfe6ff;tab-size:4}
.at-kod .sat{display:flex;align-items:baseline;gap:12px;min-width:max-content;width:100%;padding:0 14px 0 0;border:0;background:none;color:inherit;text-align:left;font:inherit;cursor:default;border-left:3px solid transparent}
.at-kod .ln{flex:none;width:34px;text-align:right;color:#56628f;font-weight:600;user-select:none}
.at-kod code{font:inherit;white-space:pre;color:inherit;background:none;padding:0}
.at-kod .an{color:#8ab4ff;font-style:normal}.at-kod .tp{color:#7fe3c4;font-style:normal}.at-kod .st{color:#ffc27a;font-style:normal}.at-kod .sy{color:#f6a1c1;font-style:normal}.at-kod .yo{color:#7c88b3;font-style:italic}
.at-kod.secilebilir .sat{cursor:pointer}
.at-kod.secilebilir .sat:hover:not(:disabled){background:rgba(138,180,255,.12)}
.at-kod .sat.secili{background:rgba(255,194,122,.22);border-left-color:#ffc27a}
.at-kod .sat.ok{background:rgba(79,212,160,.22);border-left-color:#4fd4a0}
.at-kod .sat.kotu{background:rgba(255,107,129,.25);border-left-color:#ff6b81}
.at-kod .sat.eksik{background:repeating-linear-gradient(135deg,rgba(255,196,107,.0),rgba(255,196,107,.0) 6px,rgba(255,196,107,.16) 6px,rgba(255,196,107,.16) 12px);border-left-color:#ffc46b}
.at-kod .sat.vurgu{background:rgba(138,180,255,.2);border-left-color:#8ab4ff}
.at-kod .sat:disabled{color:inherit;opacity:1}
.at-noktalar{display:flex;gap:6px;justify-content:center;margin:2px 0 14px}
.at-noktalar i{width:22px;height:6px;border-radius:99px;background:rgba(20,27,52,.12)}
.at-noktalar i.su-an{background:var(--mavi);width:34px}.at-noktalar i.dogru{background:var(--yesil)}.at-noktalar i.kismi{background:var(--turuncu)}.at-noktalar i.yanlis{background:var(--pembe)}.at-noktalar i.tam{background:#9aa6d6}
.at-adim{padding:18px;margin-bottom:14px;animation:atgir .25s ease}
@keyframes atgir{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.at-adim-ust{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.at-adim-no{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;font:800 13px var(--font);color:#fff;background:var(--mavi)}
.at-adim-tur{font-size:12px;font-weight:800;color:var(--soluk);text-transform:uppercase;letter-spacing:.6px}
.at-s{font-size:15.5px;line-height:1.6;margin-bottom:14px}
.at-ipucu{font-size:12.5px;color:var(--soluk);font-weight:600;margin:-6px 0 10px}
.at-secenekler{display:grid;gap:9px}
.at-sik{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:13px 14px;border-radius:15px;border:1.5px solid var(--cizgi);background:#fff;color:var(--yazi);font:600 14.5px/1.5 var(--font);cursor:pointer}
.at-sik b{flex:none;width:26px;height:26px;border-radius:9px;display:grid;place-items:center;background:var(--mavi-acik);color:var(--mavi);font-size:13px}
.at-sik span{min-width:0;overflow-wrap:anywhere}
.at-sik:hover:not(:disabled){border-color:var(--mavi)}
.at-sik.ok{border-color:var(--yesil);background:var(--yesil-acik)}.at-sik.ok b{background:var(--yesil);color:#fff}
.at-sik.kotu{border-color:var(--pembe);background:var(--pembe-acik)}.at-sik.kotu b{background:var(--pembe);color:#fff}
.at-sik:disabled{cursor:default;color:var(--yazi);opacity:1}
.at-cs{padding:12px 0;border-top:1px solid var(--cizgi)}.at-cs:first-child{border-top:0;padding-top:0}
.at-cs-e{font-weight:700;font-size:14.5px;margin-bottom:9px;line-height:1.55}
.at-cs-o{display:flex;flex-wrap:wrap;gap:8px}
.at-chipsik{border:1.5px solid var(--cizgi);background:#fff;color:var(--yazi);font:600 13.5px/1.45 var(--font);padding:9px 12px;border-radius:12px;cursor:pointer;text-align:left;max-width:100%;overflow-wrap:anywhere}
.at-chipsik.secili{border-color:var(--mavi);background:var(--mavi-acik);color:var(--mavi)}
.at-chipsik.ok{border-color:var(--yesil);background:var(--yesil-acik)}.at-chipsik.kotu{border-color:var(--pembe);background:var(--pembe-acik)}
.at-chipsik:disabled{cursor:default;color:var(--yazi)}
.at-cs-a{font-size:13.5px;color:var(--soluk);margin-top:7px;line-height:1.5}
.at-satirgiris{display:flex;gap:10px}
.at-satirgiris .at-input{flex:1}
.at-input{font:600 14.5px ui-monospace,"SF Mono",Menlo,Consolas,monospace;padding:11px 12px;border-radius:12px;border:1.5px solid var(--cizgi);background:#fff;color:var(--yazi);min-width:0}
.at-input:focus{outline:none;border-color:var(--mavi);box-shadow:0 0 0 3px rgba(59,91,253,.15)}
.at-input.ok{border-color:var(--yesil);background:var(--yesil-acik);color:#0c6e4b}.at-input.kotu{border-color:var(--pembe);background:var(--pembe-acik);color:#a3274a}
select.at-input{font-family:var(--font);padding:10px 2px;font-size:13px;min-width:62px;width:100%}
.at-tablo-kap{overflow-x:auto;margin:0 -4px;padding:0 4px}
.at-tablo{border-collapse:separate;border-spacing:0;width:100%;font-size:13.5px}
.at-tablo th{background:rgba(59,91,253,.08);color:var(--soluk);text-align:left;padding:9px 10px;font-size:12px;font-weight:800;white-space:nowrap}
.at-tablo th:first-child{border-radius:10px 0 0 10px}.at-tablo th:last-child{border-radius:0 10px 10px 0}
.at-tablo td{padding:7px 6px;border-bottom:1px solid var(--cizgi);vertical-align:top;line-height:1.5}
.at-tablo td:first-child{font-weight:700}
.at-tablo td .at-dogru{display:block;font-size:12px;font-weight:800;color:#0c6e4b;margin-top:3px;font-family:ui-monospace,Menlo,monospace}
.at-alan{margin-top:12px;display:grid;gap:10px}
.at-geri{padding:12px 14px;border-radius:14px;font-size:14px;line-height:1.55}
.at-geri.iyi{background:var(--yesil-acik);color:#0b5d40}.at-geri.kotu{background:var(--pembe-acik);color:#8f2140}.at-geri.kismi{background:var(--turuncu-acik);color:#8a4310}
.at-geri code{background:rgba(255,255,255,.55);color:inherit}
.at-hatalar{display:grid;gap:8px}
.at-hatalar>div{font-size:13.5px;line-height:1.55;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.7);border:1px solid var(--cizgi)}
.at-hatalar span{display:block;color:var(--soluk);margin-top:2px}
.at-devam{width:100%;padding:13px}
.at-editor{border-radius:18px;overflow:hidden;box-shadow:0 14px 30px -16px rgba(15,22,48,.6)}
.at-yaz{display:block;width:100%;border:0;resize:vertical;background:#0f1630;color:#dfe6ff;padding:14px;font:500 13px/1.7 ui-monospace,"SF Mono",Menlo,Consolas,monospace;tab-size:4;white-space:pre;overflow:auto;min-height:150px}
.at-yaz:focus{outline:none;box-shadow:inset 0 0 0 2px rgba(138,180,255,.45)}
.at-yaz-btn{display:flex;gap:10px;margin-top:12px}.at-yaz-btn .btn{flex:1}
.at-kriter{display:grid;gap:7px}
.at-kriter>div{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:12px;font-size:13.5px;line-height:1.5}
.at-kriter .ok{background:var(--yesil-acik)}.at-kriter .kotu{background:var(--pembe-acik)}
.at-kriter i{font-style:normal;font-weight:800;flex:none;width:18px}
.at-kriter .ok i{color:var(--yesil)}.at-kriter .kotu i{color:var(--pembe)}
.at-cozum{display:grid;gap:10px}
.at-ack{padding:13px 15px;border-radius:14px;background:var(--mavi-acik);color:#23358f;font-size:14px;line-height:1.6}
.at-ack b{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px}
.at-ack code{background:rgba(255,255,255,.65)}
.at-not{padding:12px 14px;border-radius:14px;background:var(--mavi-acik);color:#23358f;font-size:14.5px;line-height:1.55;margin-bottom:10px}
.at-degisken{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:10px}
.at-degisken div{background:#fff;border:1px solid var(--cizgi);border-radius:12px;padding:8px 10px;min-width:0}
.at-degisken small{display:block;font:700 11px ui-monospace,Menlo,monospace;color:var(--soluk);margin-bottom:2px}
.at-degisken b{display:block;font:700 14px ui-monospace,Menlo,monospace;overflow-wrap:anywhere}
.at-nav{display:flex;align-items:center;justify-content:space-between;gap:10px}.at-nav span{font-weight:800;color:var(--soluk);font-size:13px}.at-nav .btn{padding:10px 16px}
.at-sonuc{display:flex;align-items:center;gap:16px;padding:18px;margin-bottom:12px}
.at-sonuc h2{margin:0 0 3px;font-size:19px}.at-sonuc p{margin:0;color:var(--soluk);font-size:14px}
.at-halka{--y:0;width:74px;height:74px;border-radius:50%;flex:none;display:grid;place-items:center;background:conic-gradient(var(--yesil) calc(var(--y)*1%),rgba(20,27,52,.1) 0)}
.at-halka b{width:58px;height:58px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:17px;letter-spacing:-.5px}
.at-sonuc.orta .at-halka{background:conic-gradient(var(--turuncu) calc(var(--y)*1%),rgba(20,27,52,.1) 0)}
.at-sonuc.zayif .at-halka{background:conic-gradient(var(--pembe) calc(var(--y)*1%),rgba(20,27,52,.1) 0)}
.at-son-btn{margin-top:12px}.at-son-btn .btn{flex:1}
@media (max-width:600px){.at-baslik h1{font-size:21px}.at-kod pre{font-size:12.5px}.at-satirgiris{flex-direction:column}}
`;

  function stil() {
    if (document.getElementById("at-css")) return;
    var s = document.createElement("style"); s.id = "at-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  window.KodAtolye = {
    kur: function (ctx) { C = ctx; stil(); },
    var: function () { return !!(C && C.ders.atolye && C.ders.atolye.sorular.length); },
    sayi: function () { return C && C.ders.atolye ? C.ders.atolye.sorular.length : 0; },
    listeHtml: listeHtml, listeBagla: listeBagla, ac: ac, ozet: genelOzet,
    bolumSayisi: function (n) { return C.ders.atolye.sorular.filter(function (q) { return q.id.split(".")[0] === String(n); }).length; },
    ayarla: function (f) { filtre = f; }
  };
})();
