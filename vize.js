/* =====================================================================
   KampüsCepte · VİZE PROGRAMI (YBS 2026–2027 güz)
   Kaynak: İİBF YBS Bölümü 2026-2027 Güz Yarıyılı Vize Programı (son hâl)

   Güncellemek için yalnızca VIZE listesini değiştir:
   { t: "GG.AA", s: "SS:DD–SS:DD", kod: "", ad: "", hoca: "", link: "ders.html?d=..." }
   link: o dersin not sayfası varsa yaz, yoksa "" bırak.

   Ana sayfada, Ayarlar'daki bölüm ve sınıfa göre gösterilir (program.js).
   Yeni bölüm: VIZE'ye { anahtar: { 1: [...], 2: [...] } } ekle (anahtar = profil bölüm kodu, ör. "adli").
   Bölüm/sınıf için program yoksa ana sayfada hiçbir şey görünmez.
   ===================================================================== */
(function () {
  var YIL = 2026;
  var SALON = "Çevre Derslik 3 / Sosyal Hizmetler Amfi 2";
  var BITIS = "2026-11-30";                    /* bu tarihten sonra kart gizlenir */
  var VIZE = {
   ybs: {
    1: [
      { t: "14.11", s: "10:00–11:00", kod: "YBS1107", ad: "Algoritma ve Programlamaya Giriş", hoca: "Doç. Dr. Mesut Toğaçar", link: "ders.html?d=ybs/1/algoritma" },
      { t: "15.11", s: "14:15–15:15", kod: "YBS1111", ad: "Muhasebe I", hoca: "Doç. Dr. Meltem Gül", link: "" },
      { t: "16.11", s: "17:15–18:15", kod: "İKT1101", ad: "Mikro İktisat", hoca: "Doç. Dr. Yunus Gülcü", link: "" },
      { t: "17.11", s: "12:00–12:30", kod: "YDİ107", ad: "İngilizce I", hoca: "", link: "ders.html?d=ortak/ingilizce-1" },
      { t: "18.11", s: "16:00–16:30", kod: "YBS1109", ad: "İşletme Matematiği", hoca: "Öğr. Gör. Tuba Şekerci", link: "" },
      { t: "19.11", s: "16:00–16:45", kod: "YBS1105", ad: "Bilişim Sistemleri ve Teknolojilerine Giriş", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", link: "ders.html?d=ybs/1/bilisim-sistemleri" },
      { t: "20.11", s: "16:00–17:00", kod: "YBS1103", ad: "İşletme Yönetimi", hoca: "Doç. Dr. Cem Ayden", link: "" },
      { t: "24.11", s: "12:00–12:30", kod: "TRD109", ad: "Türk Dili I", hoca: "", link: "ders.html?d=ortak/turk-dili-1" }
    ],
    2: [
      { t: "14.11", s: "09:15–09:45", kod: "YBS2111", ad: "Bilgisayar Donanımı ve Sistem Yazılımı", hoca: "Doç. Dr. Mesut Toğaçar", link: "", not: "YBS207 / YBS2111" },
      { t: "14.11", s: "11:15–12:15", kod: "YBS2105", ad: "Web Tabanlı Uygulama Geliştirme", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", link: "ders.html?d=ybs/2/web-tabanli-uygulamalar" },
      { t: "15.11", s: "13:00–14:00", kod: "YBS2109", ad: "Nesne Tabanlı Programlama II", hoca: "Doç. Dr. Mesut Toğaçar", link: "ders.html?d=ybs/2/nesne-tabanli-programlama-2" },
      { t: "17.11", s: "18:15–19:00", kod: "YBS2115", ad: "Grafik Tasarımı ve Animasyon", hoca: "Dr. Öğr. Üyesi Abdullah Şener", link: "" },
      { t: "18.11", s: "17:00–18:00", kod: "SSD2101", ad: "Fotoğrafçılık", hoca: "Doç. Dr. Cem Ayden", link: "", not: "Seçmeli" },
      { t: "20.11", s: "17:15–18:15", kod: "YBS2101", ad: "Finansal Yönetim I", hoca: "Dr. Öğr. Üyesi Emre Bulut", link: "ders.html?d=ybs/2/finansal-yonetim" },
      { t: "23.11", s: "17:00–17:30", kod: "YBS2113", ad: "Sosyal Medya Analizi", hoca: "Doç. Dr. Seda Özer Şanal", link: "" },
      { t: "24.11", s: "12:40–13:10", kod: "AİT101", ad: "Atatürk İlkeleri ve İnkılap Tarihi I", hoca: "", link: "ders.html?d=ortak/inkilap-tarihi-1" },
      { t: "25.11", s: "17:00–18:00", kod: "YBS2103", ad: "İstatistik", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", link: "ders.html?d=ybs/2/istatistik" },
      { t: "26.11", s: "18:00–18:30", kod: "YBS2107", ad: "Pazarlama İlkeleri", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", link: "ders.html?d=ybs/2/pazarlama-ilkeleri" }
    ],
    3: [
      { t: "14.11", s: "13:00–14:00", kod: "YBS309", ad: "Yöneylem Araştırması", hoca: "Doç. Dr. Ahmed İhsan Şimşek", link: "" },
      { t: "15.11", s: "11:15–12:00", kod: "YBS301", ad: "Sistem Analizi ve Tasarımı", hoca: "Dr. Öğr. Üyesi Abdullah Şener", link: "" },
      { t: "17.11", s: "16:00–16:45", kod: "YBS307", ad: "Bilişim Hukuku", hoca: "Öğr. Gör. Murat Bal", link: "" },
      { t: "19.11", s: "17:00–18:00", kod: "YBS305", ad: "Veri Tabanı Sistemleri", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", link: "ders.html?d=ybs/3/veri-tabani-sistemleri" },
      { t: "23.11", s: "18:00–19:00", kod: "YBS303", ad: "Veri Madenciliği", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", link: "" },
      { t: "26.11", s: "17:00–17:45", kod: "YBS311", ad: "Proje Yönetimi", hoca: "Doç. Dr. Seda Özer Şanal", link: "" }
    ],
    4: [
      { t: "14.11", s: "14:30–15:00", kod: "YBS409", ad: "Stratejik Yönetim", hoca: "Doç. Dr. Cem Ayden", link: "" },
      { t: "15.11", s: "10:00–11:00", kod: "YBS419", ad: "Teknolojik Liderlik ve Motivasyon", hoca: "Dr. Öğr. Üyesi Hatice Gökçe Demirel", link: "" },
      { t: "16.11", s: "16:00–17:00", kod: "YBS405", ad: "İşletmeler için Karar Destek Sistemleri", hoca: "Doç. Dr. Ahmed İhsan Şimşek", link: "" },
      { t: "17.11", s: "17:00–18:00", kod: "YBS421", ad: "Yapay Zekâ", hoca: "Dr. Öğr. Üyesi Abdullah Şener", link: "" },
      { t: "19.11", s: "18:15–19:00", kod: "YBS411", ad: "Girişimcilik", hoca: "Öğr. Gör. Naim Aslanmirza", link: "" },
      { t: "23.11", s: "17:30–18:00", kod: "YBS417", ad: "Bilişim Toplumu ve E-Devlet", hoca: "Doç. Dr. Seda Özer Şanal", link: "" },
      { t: "24.11", s: "16:00–17:00", kod: "YBS415", ad: "Bilgi Sistemleri Güvenliği ve Risk Yönetimi", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", link: "" },
      { t: "25.11", s: "16:00–17:00", kod: "YBS403", ad: "Müşteri İlişkileri Yönetimi", hoca: "Prof. Dr. Atilla Yücel", link: "" }
    ]
   }
  };

  var AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  var AY_UZUN = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var GUN_K = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function zaman(v, hangi) {
    var g = v.t.split("."), m = v.s.split("–")[hangi === "bit" ? 1 : 0].split(":");
    return new Date(YIL, +g[1] - 1, +g[0], +m[0], +m[1]);
  }
  /* Her kaydı zenginleştir: başlangıç/bitiş tarihleri, sınıf */
  Object.keys(VIZE).forEach(function (b) {
    Object.keys(VIZE[b]).forEach(function (s) {
      VIZE[b][s].forEach(function (v) { v.sinif = +s; v.bas = zaman(v, "bas"); v.bit = zaman(v, "bit"); });
    });
  });

  function gunFarki(a, b) {
    var x = new Date(a); x.setHours(0, 0, 0, 0); var y = new Date(b); y.setHours(0, 0, 0, 0);
    return Math.round((y - x) / 864e5);
  }
  function durum(v, simdi) {
    simdi = simdi || new Date();
    if (simdi >= v.bit) return { k: "bitti", y: "Tamamlandı" };
    if (simdi >= v.bas) return { k: "simdi", y: "Şu an sürüyor" };
    var f = gunFarki(simdi, v.bas);
    if (f === 0) {
      var dk = Math.round((v.bas - simdi) / 6e4);
      return { k: "bugun", y: dk < 60 ? dk + " dk sonra" : "Bugün " + v.s.split("–")[0] };
    }
    if (f === 1) return { k: "yarin", y: "Yarın " + v.s.split("–")[0] };
    return { k: "ileri", y: f + " gün kaldı" };
  }
  function tarihYazi(v, uzun) {
    return v.bas.getDate() + " " + (uzun ? AY_UZUN : AY)[v.bas.getMonth()] + " " + (uzun ? GUN : GUN_K)[v.bas.getDay()];
  }
  function gorunsunMu() {
    var b = BITIS.split("-"); return new Date() < new Date(+b[0], +b[1] - 1, +b[2]);
  }

  /* ---------------------------- Görünüm ---------------------------- */
  var st = document.createElement("style");
  st.textContent =
    ".vz{position:relative;overflow:hidden;border-radius:26px;padding:20px 18px 14px;margin:14px 0 0;isolation:isolate}" +
    ".vz::before{content:'';position:absolute;right:-80px;top:-100px;width:260px;height:260px;border-radius:50%;background:radial-gradient(closest-side,rgba(242,85,127,.16),transparent);z-index:-1;pointer-events:none}" +
    ".vz::after{content:'';position:absolute;left:-60px;bottom:-110px;width:240px;height:240px;border-radius:50%;background:radial-gradient(closest-side,rgba(139,92,246,.12),transparent);z-index:-1;pointer-events:none}" +
    ".vz-et{display:inline-flex;align-items:center;gap:6px;padding:5px 11px 5px 8px;border-radius:99px;background:var(--pembe-acik,#ffe8ee);color:var(--pembe,#f2557f);font-size:11.5px;font-weight:800;letter-spacing:.2px}.vz-et svg{width:14px;height:14px}" +
    ".vz h2{margin:10px 0 2px;font-size:24px;line-height:1.12;letter-spacing:-.8px;font-weight:800}.vz .vz-alt{color:var(--soluk,#6b7390);font-size:13px;font-weight:600;line-height:1.45}" +
    ".vz-sira{display:flex;align-items:center;gap:14px;margin:16px 0 6px;padding:14px 16px;border-radius:20px;color:#fff;background:linear-gradient(135deg,var(--pembe,#f2557f),var(--mor,#8b5cf6));box-shadow:0 18px 30px -18px var(--pembe,#f2557f);text-decoration:none}" +
    ".vz-sira .vz-say{flex:none;text-align:center;min-width:56px;padding:6px 4px;border-radius:14px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.26)}" +
    ".vz-sira .vz-say b{display:block;font-size:24px;line-height:1.05;letter-spacing:-.8px}.vz-sira .vz-say small{font-size:10.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;opacity:.9}" +
    ".vz-sira>div:last-child{min-width:0}.vz-sira small.u{display:block;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;opacity:.85}.vz-sira strong{display:block;font-size:16px;line-height:1.25;letter-spacing:-.3px;margin:2px 0}.vz-sira span.z{font-size:12.5px;font-weight:600;opacity:.9}" +
    ".vz-satir{display:flex;gap:13px;align-items:center;padding:12px 2px;border-top:1px solid rgba(20,27,52,.07);color:inherit;text-decoration:none;position:relative}" +
    ".vz-sira+.vz-satir,.vz-liste>.vz-satir:first-child{border-top:0}" +
    ".vz-tarih{flex:none;width:54px;padding:7px 0 6px;border-radius:15px;text-align:center;background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);line-height:1.1}" +
    ".vz-tarih b{display:block;font-size:20px;letter-spacing:-.6px}.vz-tarih small{display:block;font-size:10.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;margin-top:2px}" +
    ".vz-orta{flex:1;min-width:0}.vz-orta b{display:block;font-size:15px;line-height:1.3;letter-spacing:-.2px}.vz-orta small{display:block;color:var(--soluk,#6b7390);font-size:12.5px;margin-top:3px;line-height:1.4}" +
    ".vz-orta .vz-saat{font-weight:800;color:var(--yazi,#141b34)}" +
    ".vz-cip{flex:none;font-size:11px;font-weight:800;padding:5px 9px;border-radius:99px;background:rgba(20,27,52,.055);color:var(--soluk,#6b7390);white-space:nowrap}" +
    ".vz-cip.bugun,.vz-cip.simdi{background:var(--pembe,#f2557f);color:#fff;box-shadow:0 8px 14px -8px var(--pembe,#f2557f)}.vz-cip.yarin{background:var(--pembe-acik,#ffe8ee);color:var(--pembe,#f2557f)}" +
    ".vz-cip.not{background:var(--yesil-acik,#e2f8ee);color:#0c6e4b}" +
    ".vz-satir.bitti{opacity:.5}.vz-satir.bitti .vz-tarih{background:rgba(20,27,52,.06);color:var(--soluk,#6b7390)}.vz-satir.bitti .vz-orta b{text-decoration:line-through;text-decoration-thickness:1.5px}" +
    ".vz-satir.bugun .vz-tarih,.vz-satir.simdi .vz-tarih{background:linear-gradient(145deg,var(--pembe,#f2557f),var(--mor,#8b5cf6));color:#fff}" +
    "a.vz-satir:active{transform:scale(.99)}" +
    ".vz-salon{display:flex;gap:9px;align-items:flex-start;margin-top:8px;padding:11px 13px;border-radius:16px;background:rgba(20,27,52,.04);font-size:12.5px;font-weight:600;color:var(--soluk,#6b7390);line-height:1.45}.vz-salon svg{flex:none;width:16px;height:16px;margin-top:1px;color:var(--mavi,#3b5bfd)}.vz-salon b{color:var(--yazi,#141b34)}" +
    "html[data-tema=koyu] .vz-satir{border-color:rgba(255,255,255,.08)}html[data-tema=koyu] .vz-cip{background:rgba(255,255,255,.08)}html[data-tema=koyu] .vz-salon{background:rgba(255,255,255,.06)}html[data-tema=koyu] .vz-satir.bitti .vz-tarih{background:rgba(255,255,255,.07)}";
  document.head.appendChild(st);

  var IK_TAKVIM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8.5 14l2 2 4-4"/></svg>';
  var IK_KONUM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  function satir(v, simdi) {
    var d = durum(v, simdi);
    var cip = d.k === "ileri" ? (v.link ? ["not", "Notlar ›"] : ["", d.y]) : d.k === "bitti" ? ["", "Bitti"] : [d.k, d.y];
    var alt = '<span class="vz-saat">' + v.s + "</span>" + (v.hoca ? " · " + esc(v.hoca) : "") + (v.not ? " · " + esc(v.not) : "") +
      (d.k === "ileri" && v.link ? " · " + d.y : "");
    var ic = '<div class="vz-tarih"><b>' + v.bas.getDate() + "</b><small>" + GUN_K[v.bas.getDay()] + "</small></div>" +
      '<div class="vz-orta"><b>' + esc(v.ad) + "</b><small>" + alt + "</small></div>" +
      '<span class="vz-cip ' + cip[0] + '">' + cip[1] + "</span>";
    return v.link ? '<a class="vz-satir ' + d.k + '" href="' + v.link + '">' + ic + "</a>" : '<div class="vz-satir ' + d.k + '">' + ic + "</div>";
  }

  function govde(liste) {
    var simdi = new Date();
    var sira = liste.filter(function (v) { return simdi < v.bit; })[0];
    var h = "";
    if (sira) {
      var d = durum(sira, simdi), f = gunFarki(simdi, sira.bas);
      var say = d.k === "simdi" ? "<b>●</b><small>Şimdi</small>" : f <= 0 ? ((sira.bas - simdi) < 36e5 ? "<b>" + Math.max(1, Math.round((sira.bas - simdi) / 6e4)) + "</b><small>dk</small>" : "<b>" + Math.round((sira.bas - simdi) / 36e5) + "</b><small>saat</small>") : "<b>" + f + "</b><small>gün</small>";
      var ic = '<div class="vz-say">' + say + "</div><div><small class=\"u\">" + (d.k === "simdi" ? "Sınav sürüyor" : "Sıradaki vize") + "</small><strong>" + esc(sira.ad) + '</strong><span class="z">' + tarihYazi(sira, true) + " · " + sira.s + "</span></div>";
      h += sira.link ? '<a class="vz-sira" href="' + sira.link + '">' + ic + "</a>" : '<div class="vz-sira">' + ic + "</div>";
    }
    h += '<div class="vz-liste">' + liste.map(function (v) { return satir(v, simdi); }).join("") + "</div>";
    h += '<div class="vz-salon">' + IK_KONUM + "<div>Tüm sınavlar <b>" + SALON + "</b> salonlarında. Gözetmen ve salon değişikliklerini bölüm panosundan da kontrol et.</div></div>";
    return h;
  }
  function baslik(liste, ad) {
    var kalan = liste.filter(function (v) { return new Date() < v.bit; }).length;
    return '<span class="vz-et">' + IK_TAKVIM + "Güz 2026 · Vize programı</span>" +
      "<h2>" + ad + " vizeleri</h2>" +
      '<div class="vz-alt">' + (kalan ? liste.length + " sınav · " + (kalan === liste.length ? liste[0].bas.getDate() + "–" + liste[liste.length - 1].bas.getDate() + " Kasım" : kalan + " sınav kaldı") : "Bu sınıfın tüm vizeleri tamamlandı, kolay gelsin") + "</div>";
  }

  /* Bölüm ve sınıfa göre liste; eklenmemişse null */
  function listeBul(p) {
    if (!p || !VIZE[p.bolum]) return null;
    var l = VIZE[p.bolum][String(p.sinif)];
    return l && l.length ? l : null;
  }
  var BOLUM_AD = { ybs: "YBS" };

  window.KC_VIZE = {
    veri: VIZE,
    /* p: akademikProfil() → { bolum: "ybs", sinif: "2" }. Program yoksa "" döner, hiçbir şey görünmez. */
    kart: function (p) {
      var liste = listeBul(p);
      if (!liste || !gorunsunMu()) return "";
      return '<section class="vz cam">' + baslik(liste, (BOLUM_AD[p.bolum] || "") + " " + p.sinif + ". sınıf") + govde(liste) + "</section>";
    }
  };
})();
