/* Akademik profil (Ayarlar) + haftalık ders programı kartı.
   Bölüm: YBS (genel takvim) veya Tıp (F.Ü. Tıp Fakültesi 1-3. sınıf). Seçim telefonda saklanır. */
(function () {
  var GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"], KISA = ["Pzt", "Sal", "Çar", "Per", "Cum"];
  var BOLUMLER = [
    ["Tıp Fakültesi", ["Tıp"]],
    ["Diş Hekimliği Fakültesi", ["Diş Hekimliği"]],
    ["Eczacılık Fakültesi", ["Eczacılık"]],
    ["Veteriner Fakültesi", ["Veteriner"]],
    ["İktisadi ve İdari Bilimler Fakültesi", ["Çalışma Ekonomisi ve Endüstri İlişkileri", "İktisat", "İşletme", "Maliye", "Siyaset Bilimi ve Kamu Yönetimi", "Sosyal Hizmet", "Yönetim Bilişim Sistemleri"]],
    ["Mühendislik Fakültesi", ["Bilgisayar Mühendisliği", "Elektrik-Elektronik Mühendisliği", "İnşaat Mühendisliği", "Kimya Mühendisliği", "Makine Mühendisliği", "Mekatronik Mühendisliği", "Yapay Zeka ve Veri Mühendisliği"]],
    ["Teknoloji Fakültesi", ["Adli Bilişim Mühendisliği", "Makine Mühendisliği (Teknoloji)", "Otomotiv Mühendisliği", "Yazılım Mühendisliği"]],
    ["Fen Fakültesi", ["Biyoloji", "Fizik", "İstatistik", "Kimya", "Matematik", "Moleküler Biyoloji ve Genetik"]],
    ["Sağlık Bilimleri Fakültesi", ["Beslenme ve Diyetetik", "Ebelik", "Fizyoterapi ve Rehabilitasyon", "Hemşirelik"]],
    ["Eğitim Fakültesi", ["İlköğretim Matematik Öğretmenliği", "İngilizce Öğretmenliği", "Okul Öncesi Öğretmenliği", "Rehberlik ve Psikolojik Danışmanlık", "Sınıf Öğretmenliği", "Sosyal Bilgiler Öğretmenliği", "Türkçe Öğretmenliği"]],
    ["İnsan ve Toplum Bilimleri Fakültesi", ["Alman Dili ve Edebiyatı", "Çağdaş Türk Lehçeleri ve Edebiyatları", "Coğrafya", "İngiliz Dili ve Edebiyatı", "Sanat Tarihi", "Sosyoloji", "Tarih", "Türk Dili ve Edebiyatı"]],
    ["İletişim Fakültesi", ["Gazetecilik", "Görsel İletişim Tasarımı", "Halkla İlişkiler ve Tanıtım", "Radyo, Televizyon ve Sinema"]],
    ["İlahiyat Fakültesi", ["İlahiyat"]],
    ["Spor Bilimleri Fakültesi", ["Spor Yöneticiliği"]],
    ["Su Ürünleri Fakültesi", ["Su Ürünleri Mühendisliği"]],
    ["Sivil Havacılık Yüksekokulu", ["Havacılık Elektrik ve Elektroniği", "Uçak Bakım ve Onarım"]],
    ["Sağlık Hizmetleri MYO", ["Anestezi", "Fizyoterapi (Ön Lisans)", "Odyometri", "Otopsi Yardımcılığı", "Tıbbi Dokümantasyon ve Sekreterlik", "Tıbbi Görüntüleme Teknikleri", "Tıbbi Laboratuvar Teknikleri"]],
    ["Teknik Bilimler MYO", ["Bilgisayar Programcılığı", "Biyomedikal Cihaz Teknolojisi", "Elektrik", "Elektronik Teknolojisi", "Grafik Tasarımı", "Hibrid ve Elektrikli Taşıtlar Teknolojisi", "İç Mekan Tasarımı", "İnşaat Teknolojisi", "İş Sağlığı ve Güvenliği", "Makine", "Mekatronik", "Mimari Restorasyon", "Otomotiv Teknolojisi"]],
    ["Sosyal Bilimler MYO", ["Aşçılık", "Bankacılık ve Sigortacılık", "Büro Yönetimi ve Yönetici Asistanlığı", "Dış Ticaret", "İşletme Yönetimi", "Muhasebe ve Vergi Uygulamaları", "Pazarlama", "Turizm ve Otel İşletmeciliği", "Yerel Yönetimler"]],
    ["Diğer MYO'lar", ["Alternatif Enerji Kaynakları Teknolojisi", "Bahçe Tarımı", "Organik Tarım", "Raylı Sistemler Makinistliği", "Atçılık ve Antrenörlüğü", "Harita ve Kadastro", "Laborant ve Veteriner Sağlık", "Çevre Koruma ve Kontrol", "Elektrik Enerjisi Üretim, İletim ve Dağıtımı", "Geoteknik", "Gıda Teknolojisi", "Peyzaj ve Süs Bitkileri Yetiştiriciliği", "Çocuk Gelişimi", "Tapu ve Kadastro", "Doğalgaz ve Tesisatı Teknolojisi", "Endüstri Ürünleri Tasarımı", "Giyim Üretim Teknolojisi", "Kaynak Teknolojisi", "Kimya Teknolojisi", "Yapı Denetimi", "Eczane Hizmetleri", "Evde Hasta Bakımı", "İlk ve Acil Yardım", "Optisyenlik", "Sağlık Kurumları İşletmeciliği"]]
  ];
  window.KC_BOLUM_LISTESI = BOLUMLER;
  var st = document.createElement("style");
  st.textContent =
    ".kc-prog[hidden]{display:none}.kc-prog{padding:20px 18px 12px;margin-top:14px;position:relative;overflow:hidden}.kc-prog::before{content:'';position:absolute;right:-70px;top:-90px;width:230px;height:230px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--mavi,#3b5bfd) 16%,transparent),transparent);pointer-events:none}" +
    ".kc-prog h2{margin:0;font-size:25px;line-height:1.1;letter-spacing:-.8px;font-weight:800}.kc-prog .alt{color:var(--soluk,#6b7390);font-size:13px;font-weight:600;margin-top:5px}" +
    ".kc-etiket{display:inline-flex;align-items:center;gap:6px;padding:5px 11px 5px 8px;margin-bottom:10px;border-radius:99px;background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);font-size:11.5px;font-weight:800;letter-spacing:.2px}.kc-etiket svg{width:14px;height:14px}" +
    ".kc-pust{display:flex;align-items:center;gap:8px;position:relative}.kc-pust>div{flex:1;min-width:0}" +
    ".kc-ok{all:unset;cursor:pointer;width:36px;height:36px;border-radius:12px;display:grid;place-items:center;font-size:20px;font-weight:800;background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);flex:none}" +
    ".kc-ok:disabled{opacity:.3;cursor:default}" +
    ".kc-gunler{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin:16px 0 8px;position:relative}" +
    ".kc-gun{all:unset;cursor:pointer;text-align:center;border-radius:16px;padding:9px 0 8px;font-size:11.5px;font-weight:800;letter-spacing:.3px;text-transform:uppercase;background:rgba(20,27,52,.045);color:var(--soluk,#6b7390);transition:transform .15s,background .2s;position:relative}" +
    ".kc-gun:active{transform:scale(.95)}.kc-gun b{display:block;font-size:18px;letter-spacing:-.4px;margin-top:2px;color:var(--yazi,#141b34)}" +
    ".kc-gun.bugun::after{content:'';position:absolute;bottom:5px;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--mavi,#3b5bfd)}.kc-gun.aktif.bugun::after{background:#fff}" +
    ".kc-gun.aktif{background:linear-gradient(145deg,var(--mavi,#3b5bfd),var(--mor,#8d5cf6));color:rgba(255,255,255,.85);box-shadow:0 10px 18px -10px var(--mavi,#3b5bfd)}.kc-gun.aktif b{color:#fff}" +
    ".kc-ders{display:flex;gap:14px;align-items:stretch;padding:12px 0;border-top:1px solid rgba(20,27,52,.07);position:relative}.kc-gunler+.kc-ders{border-top:0}" +
    ".kc-saat{flex:none;width:58px;padding:8px 0;border-radius:14px;text-align:center;font-size:13px;font-weight:800;color:var(--mavi,#3b5bfd);background:var(--mavi-acik,#e6ebff);line-height:1.3;display:grid;align-content:center}.kc-saat span{display:block;color:var(--soluk,#6b7390);font-weight:700;font-size:12px}" +
    ".kc-ders>div:last-child{align-self:center;min-width:0}.kc-ders b{display:block;font-size:15.5px;line-height:1.3;letter-spacing:-.2px}.kc-ders small{display:block;color:var(--soluk,#6b7390);font-size:12.5px;margin-top:3px;line-height:1.4}" +
    ".kc-bos{padding:20px 4px 10px;color:var(--soluk,#6b7390);font-size:14px;font-weight:600;text-align:center}" +
    "html[data-tema=koyu] .kc-gun{background:rgba(255,255,255,.07)}html[data-tema=koyu] .kc-gun.aktif{background:linear-gradient(145deg,var(--mavi),var(--mor))}html[data-tema=koyu] .kc-ders{border-color:rgba(255,255,255,.08)}";
  document.head.appendChild(st);

  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function pazartesiOf(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); var g = (x.getDay() + 6) % 7; x.setDate(x.getDate() - g); return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function profil() { return akademikProfil(); }

  var tipVeri = {}, adliVeri = null, hafta = null, gun = 0;      /* hafta: gösterilen haftanın pazartesisi */
  function varsayilanHafta() {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2); else if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    hafta = pazartesiOf(d); gun = (d.getDay() + 6) % 7;
  }

  function ybsProgram(sinif) {
    var liste = (typeof ybsDersleri !== "undefined" && ybsDersleri[sinif]) || [];
    var out = [[], [], [], [], []];
    liste.forEach(function (d) {
      var i = GUNLER.indexOf(d.gun); if (i < 0 || !d.saat) return;
      var m = d.saat.match(/(\d{1,2})[:.](\d{2})\s*[–-]\s*(\d{1,2})[:.](\d{2})/);
      out[i].push({ s: m ? m[1].padStart(2, "0") + "." + m[2] : d.saat, e: m ? m[3].padStart(2, "0") + "." + m[4] : "", d: d.ad, h: [d.hoca, d.yer].filter(Boolean).join(" · ") });
    });
    out.forEach(function (g) { g.sort(function (a, b) { return a.s < b.s ? -1 : 1; }); });
    return out;
  }

  function haftaBul(veri, pz) {
    var k = iso(pz);
    for (var i = 0; i < veri.haftalar.length; i++) { var w = veri.haftalar[i]; if (w.gunler[0] === k || w.gunler.indexOf(k) === 0) return w; }
    return veri.haftalar.filter(function (w) { return w.gunler.some(function (g) { return g === k; }); })[0] || null;
  }

  function ciz() {
    var kutu = document.getElementById("kc-program"); if (!kutu) return;
    var p = profil(), tip = p.bolum === "tip";
    if (p.bolum === "genel") { kutu.hidden = true; kutu.innerHTML = ""; return; }
    kutu.hidden = false;
    if (!hafta) varsayilanHafta();
    var bugunIso = iso(new Date());
    var baslik = (tip ? "Tıp " : p.bolum === "adli" ? "Adli Bilişim " : "YBS ") + p.sinif + ". sınıf";
    var rozet = '<span class="kc-etiket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M8 3v4M16 3v4M3.5 10.5h17"/></svg>Haftalık ders programı</span>';
    var gunler = [], dersler = [[], [], [], [], []], bilgi = "", sonHafta = false, ilkHafta = false;
    for (var i = 0; i < 5; i++) { var d = new Date(hafta); d.setDate(d.getDate() + i); gunler.push(d); }
    if (tip && +p.sinif > 3) {
      kutu.innerHTML = '<div class="kc-pust"><div>' + rozet + '<h2>' + esc(baslik) + '</h2></div></div><div class="kc-bos">4–6. sınıfta klinik uygulama ve staj rotasyonları olduğu için haftalık ders programı gösterilmiyor. Takvim ve sınav tarihleri aşağıda.</div>'; return;
    }
    if (tip) {
      var v = tipVeri[p.sinif];
      if (!v) { kutu.innerHTML = '<div class="kc-bos">Program yükleniyor…</div>'; fetch("/tip/sinif" + p.sinif + ".json").then(function (r) { return r.json(); }).then(function (j) { tipVeri[p.sinif] = j; ciz(); }).catch(function () { kutu.innerHTML = '<div class="kc-bos">Program şu an yüklenemedi.</div>'; }); return; }
      var w = haftaBul(v, hafta);
      if (w) { w.gunler.forEach(function (g, i) { if (i < 5) dersler[i] = w.p[i] || []; }); }
      else bilgi = "Bu hafta için ders programı yok (tatil ya da sınav haftası olabilir).";
      ilkHafta = iso(hafta) <= v.haftalar[0].gunler[0]; sonHafta = iso(hafta) >= v.haftalar[v.haftalar.length - 1].gunler[0];
      bilgi = bilgi || "";
    } else if (p.bolum === "adli") {
      if (!adliVeri) { kutu.innerHTML = '<div class="kc-bos">Program yükleniyor…</div>'; fetch("/adli/program.json").then(function (r) { return r.json(); }).then(function (j) { adliVeri = j; ciz(); }).catch(function () { kutu.innerHTML = '<div class="kc-bos">Program şu an yüklenemedi.</div>'; }); return; }
      var kayit = (adliVeri["o" + p.ogretim] || {})[p.sinif] || [];
      kayit.forEach(function (e) {
        if (p.sube !== "0" && e.sube && String(e.sube) !== p.sube) return;
        dersler[e.g].push({ s: e.s, e: e.e, d: e.d, h: [e.h, e.sube && p.sube === "0" ? "Şube " + e.sube : ""].filter(Boolean).join(" · ") });
      });
      dersler.forEach(function (g) { g.sort(function (a, b) { return a.s < b.s ? -1 : a.s > b.s ? 1 : 0; }); });
      bilgi = kayit.length ? "Bu şube için ders yok." : p.ogretim + ". öğretim için bu sınıfın programı yayımlanmamış.";
    } else { dersler = ybsProgram(p.sinif); bilgi = "Bu sınıf için gün ve saati girilmiş ders yok."; }
    var bos = dersler.every(function (x) { return !x.length; });
    var ay = gunler[0].toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " – " + gunler[4].toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    var html = '<div class="kc-pust"><div>' + rozet + '<h2>' + esc(baslik) + '</h2><div class="alt">' + (tip ? ay : p.bolum === "adli" ? "2026–2027 Güz · " + p.ogretim + ". öğretim" + (p.sube !== "0" ? " · Şube " + p.sube : "") : "Her hafta aynı") + '</div></div>' +
      (tip ? '<button class="kc-ok" data-y="-1" aria-label="Önceki hafta"' + (ilkHafta ? " disabled" : "") + '>‹</button><button class="kc-ok" data-y="1" aria-label="Sonraki hafta"' + (sonHafta ? " disabled" : "") + '>›</button>' : "") + '</div>';
    html += '<div class="kc-gunler">' + gunler.map(function (d, i) {
      return '<button class="kc-gun' + (i === gun ? " aktif" : "") + (iso(d) === bugunIso ? " bugun" : "") + '" data-g="' + i + '">' + KISA[i] + '<b>' + d.getDate() + '</b></button>';
    }).join("") + '</div>';
    var liste = dersler[gun] || [];
    if (bos && bilgi) html += '<div class="kc-bos">' + esc(bilgi) + '</div>';
    else if (!liste.length) html += '<div class="kc-bos">' + GUNLER[gun] + ' günü ders yok.</div>';
    else html += liste.map(function (x) {
      return '<div class="kc-ders"><div class="kc-saat">' + esc(x.s) + (x.e ? "<span>" + esc(x.e) + "</span>" : "") + '</div><div><b>' + esc(x.d) + '</b>' + (x.h ? "<small>" + esc(x.h) + "</small>" : "") + '</div></div>';
    }).join("");
    kutu.innerHTML = html;
    kutu.querySelectorAll(".kc-gun").forEach(function (b) { b.onclick = function () { gun = +b.dataset.g; ciz(); }; });
    kutu.querySelectorAll(".kc-ok").forEach(function (b) { b.onclick = function () { hafta = new Date(hafta.getFullYear(), hafta.getMonth(), hafta.getDate() + 7 * +b.dataset.y); ciz(); }; });
  }

  function kartEkle() {
    var ana = document.getElementById("ana-durum"); if (!ana || document.getElementById("kc-program")) return;
    var k = document.createElement("div"); k.id = "kc-program"; k.className = "kc-prog cam"; k.hidden = true; ana.insertAdjacentElement("afterend", k);
  }

  function ayarEkle() {
    var form = document.getElementById("ayar-form"); if (!form || document.getElementById("kc-akademik")) return;
    var grup = form.closest(".ayar-grup"); if (!grup) return;
    var g = document.createElement("div"); g.className = "ayar-grup"; g.id = "kc-akademik";
    var opts = '<option value="">Bölümünü seç…</option>' + BOLUMLER.map(function (f) {
      return '<optgroup label="' + esc(f[0]) + '">' + f[1].map(function (b) { return '<option value="' + esc(b) + '">' + esc(b) + '</option>'; }).join("") + '</optgroup>';
    }).join("") + '<option value="__diger">Listede yok / diğer</option>';
    g.innerHTML = '<h3 class="ayar-grup-baslik">Bölüm ve Sınıf</h3>' +
      '<p style="margin:0 0 10px;font-size:13px;color:var(--soluk,#6b7390)">Fırat Üniversitesi bölümünü seç; akademik takvim ve (varsa) haftalık ders programı ona göre görünür.</p>' +
      '<select id="kc-bolum-sel" aria-label="Bölüm" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid rgba(20,27,52,.15);font:inherit;font-weight:600;background:var(--kart,#fff);color:inherit">' + opts + '</select>' +
      '<div id="kc-sinif-blok" style="margin-top:12px"><div class="dil-sec" id="kc-sinif-sec" role="group" aria-label="Sınıf" style="grid-template-columns:repeat(3,1fr)"></div></div>' +
      '<div id="kc-adli-blok" hidden style="margin-top:12px;display:grid;gap:10px"><div><div style="font-size:12.5px;font-weight:700;color:var(--soluk,#6b7390);margin-bottom:6px">Öğretim türü</div><div class="dil-sec" id="kc-og-sec" style="grid-template-columns:repeat(2,1fr)"></div></div><div><div style="font-size:12.5px;font-weight:700;color:var(--soluk,#6b7390);margin-bottom:6px">Şube (lab ve bazı dersler şubeye göre değişir)</div><div class="dil-sec" id="kc-sube-sec" style="grid-template-columns:repeat(3,1fr)"></div></div></div>' +
      '<p id="kc-akademik-not" style="margin:10px 0 0;font-size:12.5px;color:var(--soluk,#6b7390)"></p>';
    grup.insertAdjacentElement("beforebegin", g);
    g.querySelector("#kc-bolum-sel").onchange = function () { kaydet(this.value === "__diger" ? "" : this.value, null, null, null); };
    ayarCiz();
  }
  function ayarCiz() {
    var p = profil(), sinifSec = document.getElementById("kc-sinif-sec"); if (!sinifSec) return;
    var sel = document.getElementById("kc-bolum-sel"); if (sel) sel.value = p.birim || "";
    var blok = document.getElementById("kc-sinif-blok"); blok.hidden = p.bolum === "genel";
    var n = []; for (var i = 1; i <= p.max; i++) n.push(i);
    sinifSec.innerHTML = n.map(function (i) { return '<button type="button" class="dil-chip' + (String(i) === p.sinif ? " aktif" : "") + '" data-s="' + i + '">' + i + '. sınıf</button>'; }).join("");
    sinifSec.querySelectorAll("button").forEach(function (b) { b.onclick = function () { kaydet(null, b.dataset.s, null, null); }; });
    var ab = document.getElementById("kc-adli-blok");
    if (ab) {
      ab.hidden = p.bolum !== "adli"; ab.style.display = p.bolum === "adli" ? "grid" : "none";
      var og = document.getElementById("kc-og-sec"), sb = document.getElementById("kc-sube-sec");
      og.innerHTML = [["1", "1. öğretim"], ["2", "2. öğretim"]].map(function (x) { return '<button type="button" class="dil-chip' + (x[0] === p.ogretim ? " aktif" : "") + '" data-o="' + x[0] + '">' + x[1] + '</button>'; }).join("");
      sb.innerHTML = [["0", "Tümü"], ["1", "Şube 1"], ["2", "Şube 2"]].map(function (x) { return '<button type="button" class="dil-chip' + (x[0] === p.sube ? " aktif" : "") + '" data-u="' + x[0] + '">' + x[1] + '</button>'; }).join("");
      og.querySelectorAll("button").forEach(function (b) { b.onclick = function () { kaydet(null, null, b.dataset.o, null); }; });
      sb.querySelectorAll("button").forEach(function (b) { b.onclick = function () { kaydet(null, null, null, b.dataset.u); }; });
    }
    var not = document.getElementById("kc-akademik-not"); if (!not) return;
    if (p.bolum === "tip") not.textContent = "Tıp: F.Ü. Tıp Fakültesi 2026–2027 akademik takvimi. Haftalık ders programı 1–3. sınıf için hazır; 4–6. sınıfta klinik uygulama/staj olduğu için yalnızca takvim tarihleri gösterilir.";
    else if (p.bolum === "adli") not.textContent = "Adli Bilişim Mühendisliği 2026–2027 güz haftalık ders programı (Teknoloji Fakültesi). 2. öğretimde yalnızca 3. ve 4. sınıf programı yayımlanmış. Genel akademik takvim gösterilir.";
    else if (p.bolum === "ybs") not.textContent = "Genel akademik takvim gösterilir; haftalık ders programı seçtiğin sınıfa göre ana sayfada görünür.";
    else if (p.birim === "Diş Hekimliği") not.textContent = "Diş Hekimliği'nin kendi takvimi ve ders programı henüz eklenmedi; şimdilik genel akademik takvim gösteriliyor.";
    else if (p.birim) not.textContent = "Bu bölüm için genel akademik takvim gösterilir. Ders programı henüz eklenmedi.";
    else not.textContent = "";
  }
  function kaydet(birim, sinif, og, sube) {
    try {
      if (birim !== null) { localStorage.setItem("kc-birim", birim); localStorage.removeItem("kc-bolum"); localStorage.setItem("kc-sinif", "1"); localStorage.setItem("kc-ogretim", "1"); localStorage.setItem("kc-sube", "0"); }
      if (sinif) localStorage.setItem("kc-sinif", sinif);
      if (og) localStorage.setItem("kc-ogretim", og);
      if (sube) localStorage.setItem("kc-sube", sube);
    } catch (e) {}
    yenile();
  }
  function not() {
    var el = document.querySelector("#takvim .not, #takvim p.aciklama, #takvim-not");
    if (!el) { var ps = document.querySelectorAll("#takvim p"); for (var i = 0; i < ps.length; i++) if (/Güz dönemi vizeleri/.test(ps[i].textContent)) { el = ps[i]; break; } }
    if (!el) return; if (el.dataset.ilk === undefined) el.dataset.ilk = el.innerHTML;
    el.innerHTML = profil().bolum === "tip" ? "Tarihler F.Ü. Tıp Fakültesi 2026–2027 akademik takvimi ve eğitim rehberlerine göredir. Değişiklik olursa fakülte duyurusu esastır." : el.dataset.ilk;
  }
  function yenile() {
    akademikUygula(); hafta = null; ayarCiz();
    if (typeof durumCiz === "function") { durumCiz("ana-durum", true); durumCiz("takvim-durum", false); sayaclarCiz(); tatillerCiz(); zamanCiz(); }
    not(); ciz();
  }
  function basla() { kartEkle(); ayarEkle(); not(); ciz(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
  if (document.getElementById("ayar-form") === null) setTimeout(ayarEkle, 800);
  window.kcProgramYenile = yenile;
})();
