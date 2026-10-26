/* Akademik profil (Ayarlar) + haftalık ders programı kartı.
   Bölüm: YBS (genel takvim) veya Tıp (F.Ü. Tıp Fakültesi 1-3. sınıf). Seçim telefonda saklanır. */
(function () {
  var GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"], KISA = ["Pzt", "Sal", "Çar", "Per", "Cum"];
  var st = document.createElement("style");
  st.textContent =
    ".kc-prog{padding:18px;margin-top:14px}.kc-prog h2{margin:0;font-size:19px}.kc-prog .alt{color:var(--soluk,#6b7390);font-size:13px;font-weight:600;margin-top:2px}" +
    ".kc-pust{display:flex;align-items:center;gap:8px}.kc-pust>div{flex:1;min-width:0}" +
    ".kc-ok{all:unset;cursor:pointer;width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:20px;font-weight:800;background:rgba(91,75,255,.1);color:var(--mavi,#3b5bfd);flex:none}" +
    ".kc-ok:disabled{opacity:.3;cursor:default}" +
    ".kc-gunler{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:14px 0 10px}" +
    ".kc-gun{all:unset;cursor:pointer;text-align:center;border-radius:12px;padding:7px 0;font-size:12px;font-weight:700;background:rgba(20,27,52,.05);color:var(--soluk,#6b7390)}" +
    ".kc-gun b{display:block;font-size:15px;color:var(--yazi,#141b34)}.kc-gun.bugun{outline:2px solid rgba(91,75,255,.35)}" +
    ".kc-gun.aktif{background:var(--mavi,#3b5bfd);color:#fff}.kc-gun.aktif b{color:#fff}" +
    ".kc-ders{display:flex;gap:12px;padding:10px 0;border-top:1px solid rgba(20,27,52,.07)}.kc-ders:first-child{border-top:0}" +
    ".kc-saat{flex:none;width:52px;font-size:12px;font-weight:800;color:var(--mavi,#3b5bfd);line-height:1.35}.kc-saat span{display:block;color:var(--soluk,#6b7390);font-weight:600}" +
    ".kc-ders b{display:block;font-size:14.5px;line-height:1.3}.kc-ders small{display:block;color:var(--soluk,#6b7390);font-size:12.5px;margin-top:1px}" +
    ".kc-bos{padding:18px 4px 6px;color:var(--soluk,#6b7390);font-size:14px;font-weight:600;text-align:center}" +
    "html[data-tema=koyu] .kc-gun{background:rgba(255,255,255,.07)}html[data-tema=koyu] .kc-ders{border-color:rgba(255,255,255,.08)}";
  document.head.appendChild(st);

  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function pazartesiOf(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); var g = (x.getDay() + 6) % 7; x.setDate(x.getDate() - g); return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function profil() { return akademikProfil(); }

  var tipVeri = {}, hafta = null, gun = 0;      /* hafta: gösterilen haftanın pazartesisi */
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
    if (!hafta) varsayilanHafta();
    var bugunIso = iso(new Date());
    var baslik = (tip ? "Tıp " : "YBS ") + p.sinif + ". sınıf · haftalık ders programı";
    var gunler = [], dersler = [[], [], [], [], []], bilgi = "", sonHafta = false, ilkHafta = false;
    for (var i = 0; i < 5; i++) { var d = new Date(hafta); d.setDate(d.getDate() + i); gunler.push(d); }
    if (tip) {
      var v = tipVeri[p.sinif];
      if (!v) { kutu.innerHTML = '<div class="kc-bos">Program yükleniyor…</div>'; fetch("/tip/sinif" + p.sinif + ".json").then(function (r) { return r.json(); }).then(function (j) { tipVeri[p.sinif] = j; ciz(); }).catch(function () { kutu.innerHTML = '<div class="kc-bos">Program şu an yüklenemedi.</div>'; }); return; }
      var w = haftaBul(v, hafta);
      if (w) { w.gunler.forEach(function (g, i) { if (i < 5) dersler[i] = w.p[i] || []; }); }
      else bilgi = "Bu hafta için ders programı yok (tatil ya da sınav haftası olabilir).";
      ilkHafta = iso(hafta) <= v.haftalar[0].gunler[0]; sonHafta = iso(hafta) >= v.haftalar[v.haftalar.length - 1].gunler[0];
      bilgi = bilgi || "";
    } else { dersler = ybsProgram(p.sinif); bilgi = "Bu sınıf için gün ve saati girilmiş ders yok."; }
    var bos = dersler.every(function (x) { return !x.length; });
    var ay = gunler[0].toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " – " + gunler[4].toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    var html = '<div class="kc-pust"><div><h2>' + esc(baslik) + '</h2><div class="alt">' + (tip ? ay : "Her hafta aynı") + '</div></div>' +
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
    var k = document.createElement("div"); k.id = "kc-program"; k.className = "kc-prog cam"; ana.insertAdjacentElement("afterend", k);
  }

  function ayarEkle() {
    var form = document.getElementById("ayar-form"); if (!form || document.getElementById("kc-akademik")) return;
    var grup = form.closest(".ayar-grup"); if (!grup) return;
    var g = document.createElement("div"); g.className = "ayar-grup"; g.id = "kc-akademik";
    g.innerHTML = '<h3 class="ayar-grup-baslik">Bölüm ve Sınıf</h3>' +
      '<p style="margin:0 0 10px;font-size:13px;color:var(--soluk,#6b7390)">Akademik takvim ve haftalık ders programı seçtiğine göre değişir.</p>' +
      '<div class="dil-sec" id="kc-bolum-sec" role="group" aria-label="Bölüm"><button type="button" class="dil-chip" data-b="ybs">YBS / Diğer</button><button type="button" class="dil-chip" data-b="tip">Tıp Fakültesi</button></div>' +
      '<h4 class="ayar-alt-baslik">Sınıf</h4><div class="dil-sec" id="kc-sinif-sec" role="group" aria-label="Sınıf"></div>' +
      '<p id="kc-akademik-not" style="margin:10px 0 0;font-size:12.5px;color:var(--soluk,#6b7390)"></p>';
    grup.insertAdjacentElement("beforebegin", g);
    g.querySelectorAll("#kc-bolum-sec button").forEach(function (b) { b.onclick = function () { kaydet(b.dataset.b, null); }; });
    ayarCiz();
  }
  function ayarCiz() {
    var p = profil(), sinifSec = document.getElementById("kc-sinif-sec"); if (!sinifSec) return;
    document.querySelectorAll("#kc-bolum-sec button").forEach(function (b) { b.classList.toggle("aktif", b.dataset.b === p.bolum); });
    var n = p.bolum === "tip" ? [1, 2, 3] : [1, 2, 3, 4];
    sinifSec.innerHTML = n.map(function (i) { return '<button type="button" class="dil-chip' + (String(i) === p.sinif ? " aktif" : "") + '" data-s="' + i + '">' + i + '. sınıf</button>'; }).join("");
    sinifSec.querySelectorAll("button").forEach(function (b) { b.onclick = function () { kaydet(null, b.dataset.s); }; });
    var not = document.getElementById("kc-akademik-not");
    if (not) not.textContent = p.bolum === "tip" ? "Tıp: F.Ü. Tıp Fakültesi 2026–2027 eğitim rehberine göre ders kurulları ve sınavlar. 4–6. sınıf yakında." : "Diğer bölümler için genel akademik takvim gösterilir. Haftalık program şu an YBS için hazır.";
  }
  function kaydet(b, s) {
    var p = profil();
    try { localStorage.setItem("kc-bolum", b || p.bolum); localStorage.setItem("kc-sinif", s || (b && b !== p.bolum ? "1" : p.sinif)); } catch (e) {}
    yenile();
  }
  function not() {
    var el = document.querySelector("#takvim .not, #takvim p.aciklama, #takvim-not");
    if (!el) { var ps = document.querySelectorAll("#takvim p"); for (var i = 0; i < ps.length; i++) if (/Güz dönemi vizeleri/.test(ps[i].textContent)) { el = ps[i]; break; } }
    if (!el) return; if (el.dataset.ilk === undefined) el.dataset.ilk = el.innerHTML;
    el.innerHTML = profil().bolum === "tip" ? "Tarihler F.Ü. Tıp Fakültesi 2026–2027 eğitim rehberindeki ders kurulu takvimine göredir. Kurul sınav tarihleri ve final/bütünleme için fakülte duyurularını da kontrol et." : el.dataset.ilk;
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
