/* KampüsCepte ana sayfa betiği (önceden index.html içindeydi; ayrı dosya olunca tarayıcı önbelleğe alır).
   Değiştirince index.html'deki ana.js?v= numarasını artır. */
/* =====================================================================
   TARİH YARDIMCILARI
   ===================================================================== */
const GUN = 86400000;
function T(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function ekle(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fark(a, b) { return Math.round((b - a) / GUN); }
function haftaSonu(d) { const g = d.getDay(); return g === 0 || g === 6; }
function gunAdi(d) { return d.toLocaleDateString("tr-TR", { weekday: "long" }); }
function kisa(d) { return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }); }
function aralik(o) {
  const b = T(o.bas), e = T(o.bit || o.bas);
  if (+b === +e) return kisa(b) + ", " + gunAdi(b);
  if (b.getMonth() === e.getMonth()) return b.getDate() + " – " + kisa(e);
  return kisa(b) + " – " + kisa(e);
}
function sayiYaz(n) { return n.toLocaleString("tr-TR"); }
function donemIcinde(d) { return donemler.some(p => d >= T(p.bas) && d <= T(p.bit)); }

const bugun = new Date(); bugun.setHours(0, 0, 0, 0);

/* =====================================================================
   SAYFA GEÇİŞLERİ
   ===================================================================== */
function sayfaAc(id) {
  if (!id) id = "ana";
  document.querySelectorAll(".sayfa").forEach(s => s.classList.toggle("aktif", s.id === id));
  document.querySelectorAll(".sekme").forEach(b => b.classList.toggle("aktif", b.dataset.sayfa === id));
  if (id === "yurtlar") yurtListeyeDon();
  if (id === "notlar") bolumKapat();
  if (id === "ayarlar" && window.AYARLAR) window.AYARLAR.yukle();
  window.scrollTo({ top: 0 });

  hafizaYaz("kc-aktif-sayfa", id);
  try {
    if (id === "ana") {
      if (location.hash && location.hash !== "#admin") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    } else {
      history.replaceState(null, "", "#" + id);
    }
  } catch (e) {}

  /* Ziyaret istatistiği: sekme değişimini ayrı sayfa görüntüleme olarak say */
  if (sayfaAc.ilk && window.gtag) gtag("event", "page_view", { page_title: "KampüsCepte – " + id, page_location: location.origin + "/#" + id });
}
addEventListener("load", () => { sayfaAc.ilk = true; });
document.querySelectorAll("button.sekme").forEach(b => b.onclick = () => sayfaAc(b.dataset.sayfa));
document.querySelectorAll("[data-git]").forEach(b => b.onclick = () => sayfaAc(b.dataset.git));

function hafizaOku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function hafizaYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

/* =====================================================================
   TARİH VE SELAM
   ===================================================================== */
const saat = new Date().getHours();
const tarihYazi = bugun.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
document.getElementById("tarih").textContent = tarihYazi;
const dtEl = document.getElementById("detay-tarih"); if (dtEl) dtEl.textContent = tarihYazi;
document.getElementById("selam").textContent =
  saat < 6 ? "İyi geceler" : saat < 12 ? "Günaydın" : saat < 18 ? "İyi günler" : "İyi akşamlar";
/* Öğün saatleri: yurt kahvaltısı 06.30–12.00 (hafta sonu 12.30'a kadar), akşam 16.00–22.00;
   Üniversite Evi 11.00–13.30 ve 15.00–16.30. Kahvaltı saati bitince akşam yemeği öne gelir. */
const kahvaltiBitis = d => haftaSonu(d) ? "12.30" : "12.00";
const OGUN_SAAT = { kahvalti: d => "06.30–" + kahvaltiBitis(d), aksam: () => "16.00–22.00" };
const dakika = new Date().getHours() * 60 + new Date().getMinutes();
const varsayilanOgun = dakika < (haftaSonu(new Date()) ? 750 : 720) ? "kahvalti" : "aksam";

/* =====================================================================
   AKADEMİK TAKVİM
   ===================================================================== */
function olayBitis(o) { return T(o.bit || o.bas); }
function siradaki(tur) {
  return takvim.find(o => o.tur === tur && olayBitis(o) >= bugun);
}
function kalanYazi(o) {
  const b = T(o.bas), e = olayBitis(o);
  if (bugun >= b && bugun <= e) return { sayi: "Şu an", ek: "" };
  const g = fark(bugun, b);
  return g === 1 ? { sayi: "Yarın", ek: "" } : { sayi: g, ek: "gün" };
}

/* Bugün hangi dönemdeyiz, kaçıncı hafta? */
function durumHesapla() {
  for (const p of donemler) {
    const b = T(p.bas), e = T(p.bit);
    if (bugun >= b && bugun <= e) {
      const hafta = Math.floor(fark(b, bugun) / 7) + 1;
      const toplam = Math.ceil((fark(b, e) + 1) / 7);
      const yuzde = Math.min(100, Math.round(fark(b, bugun) / fark(b, e) * 100));
      return { baslik: `${p.ad} · ${hafta}. hafta`, alt: `Derslerin bitmesine ${fark(bugun, e)} gün var`, yuzde, sol: `1. hafta`, sag: `${toplam}. hafta`, etiket: "Ders dönemi" };
    }
  }
  const sinavda = takvim.find(o => o.tur === "sinav" && bugun >= T(o.bas) && bugun <= olayBitis(o));
  if (sinavda) return { baslik: sinavda.ad, alt: `${kisa(olayBitis(sinavda))} tarihine kadar sürüyor, başarılar`, etiket: "Sınav dönemi" };
  const sonraki = donemler.find(p => T(p.bas) > bugun);
  if (sonraki) return { baslik: "Tatildesin", alt: `${sonraki.ad} ${kisa(T(sonraki.bas))} tarihinde başlıyor (${fark(bugun, T(sonraki.bas))} gün)`, etiket: "Tatil" };
  return { baslik: "Yaz tatili", alt: "2026–2027 akademik yılı tamamlandı", etiket: "Tatil" };
}

function durumCiz(elId, kisaltilmis) {
  const d = durumHesapla();
  const tatil = siradaki("tatil"), sinav = siradaki("sinav");
  let html = `
    <div class="durum-ust">
      <div><h2>${d.baslik}</h2><p>${d.alt}</p></div>
      <span class="etiket mor">${d.etiket}</span>
    </div>`;
  if (d.yuzde !== undefined) html += `
    <div class="cubuk"><div style="width:${d.yuzde}%"></div></div>
    <div class="cubuk-alt"><span>${d.sol}</span><span>%${d.yuzde}</span><span>${d.sag}</span></div>`;
  if (kisaltilmis) {
    const s = sinav ? kalanYazi(sinav) : null, t = tatil ? kalanYazi(tatil) : null;
    html += `<div class="sayaclar" style="margin-top:16px">
      ${sinav ? `<div class="sayac cam" style="box-shadow:none"><small>Sıradaki sınav</small><div class="sayi pembe">${s.sayi}<span>${s.ek}</span></div><b>${sinav.ad}</b><span class="tarih">${aralik(sinav)}</span></div>` : ""}
      ${tatil ? `<div class="sayac cam" style="box-shadow:none"><small>Sıradaki tatil</small><div class="sayi yesil">${t.sayi}<span>${t.ek}</span></div><b>${tatil.ad}</b><span class="tarih">${aralik(tatil)}</span></div>` : ""}
      <button class="sayac cam" style="box-shadow:none;cursor:pointer;font:inherit;color:inherit;text-align:left;border:1px solid var(--cam-kenar)" onclick="sayfaAc('takvim')"><small>Akademik takvim</small><div class="sayi mavi" style="font-size:30px">Aç<span>›</span></div><b>Tüm tarihler</b><span class="tarih">Sınav, tatil, kayıt</span></button>
    </div>`;
  }
  document.getElementById(elId).innerHTML = html;
}

/* Sayaç kartları (takvim sayfası) */
function sayaclarCiz() {
  const sinav = siradaki("sinav"), tatil = siradaki("tatil");
  const final = takvim.find(o => o.ad === "Final sınavları" && olayBitis(o) >= bugun);
  const kart = (baslik, o, renk) => {
    if (!o) return "";
    const k = kalanYazi(o);
    return `<div class="sayac cam"><small>${baslik}</small><div class="sayi ${renk}">${k.sayi}<span>${k.ek}</span></div><b>${o.ad}${o.tahmini ? '<span class="tahmini">tahmini</span>' : ""}</b><span class="tarih">${aralik(o)}</span></div>`;
  };
  document.getElementById("sayaclar").innerHTML =
    kart("Sıradaki sınav", sinav, "pembe") + kart("Sıradaki tatil", tatil, "yesil") + kart("Finallere", final, "mavi");
}

/* Tatil analizi: kaç gün, kaç ders günü, köprü */
function tatilAnaliz(o) {
  const s = T(o.bas), e = olayBitis(o);
  const resmi = fark(s, e) + 1 - (o.yarim ? 0.5 : 0);
  // Arife hafta içine denk geliyorsa yarım gün düşülür
  const kesinti = (o.yarim && !haftaSonu(s)) ? 0.5 : 0;

  let dersKaybi = 0;
  for (let d = new Date(s); d <= e; d = ekle(d, 1))
    if (!haftaSonu(d) && donemIcinde(d)) dersKaybi += (o.yarim && +d === +s) ? 0.5 : 1;

  // Hafta sonlarıyla birleşince
  let bas = new Date(s), bit = new Date(e);
  while (haftaSonu(ekle(bas, -1))) bas = ekle(bas, -1);
  while (haftaSonu(ekle(bit, 1))) bit = ekle(bit, 1);
  const birlesik = fark(bas, bit) + 1 - kesinti;

  // Köprü: hafta sonuna en fazla 2 iş günü kalıyorsa
  let kopru = null;
  if (dersKaybi > 0) {
    const say = (yon) => {
      let n = 0, d = ekle(yon > 0 ? bit : bas, yon);
      while (!haftaSonu(d) && n < 3) { n++; d = ekle(d, yon); }
      return n;
    };
    const sonra = say(1), once = say(-1);
    const n = Math.min(sonra, once);
    if (n > 0 && n <= 2) {
      const yon = sonra <= once ? 1 : -1;
      let kb = new Date(bas), ke = new Date(bit), gunler = [];
      for (let i = 1; i <= n; i++) {
        const d = ekle(yon > 0 ? bit : bas, yon * i);
        gunler.push(gunAdi(d));
      }
      if (yon > 0) { ke = ekle(bit, n); while (haftaSonu(ekle(ke, 1))) ke = ekle(ke, 1); }
      else { kb = ekle(bas, -n); while (haftaSonu(ekle(kb, -1))) kb = ekle(kb, -1); }
      const toplam = fark(kb, ke) + 1 - kesinti;
      if (yon < 0) gunler.reverse();
      kopru = { gunler: gunler.join(" ve "), toplam };
    }
  }
  return { resmi, dersKaybi, birlesik, kopru, donemDisi: dersKaybi === 0 };
}

function tatillerCiz() {
  document.getElementById("tatiller").innerHTML = takvim.filter(o => o.tur === "tatil").map(o => {
    const a = tatilAnaliz(o);
    const gecti = olayBitis(o) < bugun;
    const k = kalanYazi(o);
    let alt;
    if (a.kopru) alt = `<div class="kopru">Araya kalan ${a.kopru.gunler} ${a.kopru.gunler.includes(" ve ") ? "günlerini" : "gününü"} de tatil yaparsan, hafta sonuyla birlikte toplam ${sayiYaz(a.kopru.toplam)} gün tatil olur.</div>`;
    else if (a.donemDisi) alt = `<div class="kopru notr">${haftaSonu(T(o.bas)) && !o.bit ? "Hafta sonuna denk geliyor; derslere etkisi yok." : "Dersler yokken geliyor; derslere etkisi yok."}</div>`;
    else alt = `<div class="kopru notr">Hafta sonuyla birleşince toplam ${sayiYaz(a.birlesik)} gün tatil olur.</div>`;
    return `
      <div class="tatil cam ${gecti ? "gecti" : ""}">
        <div class="tatil-ust">
          <div><h3>${o.ad}</h3><div class="tarih">${aralik(o)}</div></div>
          <span class="etiket yesil">${gecti ? "Geçti" : (typeof k.sayi === "number" ? k.sayi + " gün" : k.sayi)}</span>
        </div>
        <div class="tatil-bilgi">
          <div><small>Resmi tatil</small><b>${sayiYaz(a.resmi)} gün</b>${o.yarim ? '<small>arife günü öğleden sonra başlar</small>' : ""}</div>
          <div><small>Ders yapılmayan gün</small><b>${sayiYaz(a.dersKaybi)}</b></div>
        </div>
        ${alt}
      </div>`;
  }).join("");
}

/* Zaman çizelgesi */
const turAdi = { sinav: "Sınav", tatil: "Tatil", kayit: "Kayıt", donem: "Dönem" };
let takvimFiltre = "hepsi";
function zamanCiz() {
  const liste = takvim.filter(o =>
    takvimFiltre === "hepsi" ? true :
    takvimFiltre === "gelecek" ? olayBitis(o) >= bugun :
    o.tur === takvimFiltre);
  let html = "", sonAy = "";
  for (const o of liste) {
    const b = T(o.bas), e = olayBitis(o);
    const ay = b.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    if (ay !== sonAy) { html += `<div class="ay">${ay}</div>`; sonAy = ay; }
    const durum = e < bugun ? "gecti" : (bugun >= b ? "simdi" : "");
    const ne = durum === "gecti" ? "Geçti" : durum === "simdi" ? "Şu an" :
      (fark(bugun, b) === 1 ? "Yarın" : fark(bugun, b) + " gün sonra");
    html += `
      <div class="olay ${durum}">
        <span class="nokta ${o.tur}"></span>
        <div><b>${o.ad}${o.tahmini ? '<span class="tahmini">tahmini</span>' : ""}</b><small>${aralik(o)} · ${turAdi[o.tur]}</small></div>
        <span class="ne-zaman">${ne}</span>
      </div>`;
  }
  document.getElementById("zaman").innerHTML = html || `<div class="bos-kutu">Bu filtrede tarih yok.</div>`;
}
document.querySelectorAll("#takvim-filtre button").forEach(b => b.onclick = () => {
  takvimFiltre = b.dataset.tur;
  document.querySelectorAll("#takvim-filtre button").forEach(x => x.classList.toggle("aktif", x === b));
  zamanCiz();
});

/* Telefon takvimine ekle (.ics dosyası) */
function takvimIndir() {
  const f = d => d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//KampusCep//Akademik Takvim//TR\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:Fırat Üni Akademik Takvim\r\n";
  takvim.forEach((o, i) => {
    ics += "BEGIN:VEVENT\r\n" +
      `UID:kampuscep-${i}-${o.bas}@kampuscep\r\n` +
      `DTSTAMP:${f(new Date())}T000000Z\r\n` +
      `DTSTART;VALUE=DATE:${f(T(o.bas))}\r\n` +
      `DTEND;VALUE=DATE:${f(ekle(olayBitis(o), 1))}\r\n` +
      `SUMMARY:${o.ad}${o.tahmini ? " (tahmini)" : ""}\r\n` +
      "END:VEVENT\r\n";
  });
  ics += "END:VCALENDAR\r\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  a.download = "firat-akademik-takvim-2026-2027.ics";
  document.body.appendChild(a); a.click(); a.remove();
}

durumCiz("ana-durum", true);
durumCiz("takvim-durum", false);
sayaclarCiz();
tatillerCiz();
zamanCiz();

/* =====================================================================
   YURT MENÜLERİ
   ===================================================================== */
function listeYaz(elId, liste) {
  document.getElementById(elId).innerHTML = liste.map(y => `<li>${y}</li>`).join("");
}
/* Yurt menüsü: veri.js'de tarihli ("2026-10-20": {...}) ya da sabit ({kahvalti, aksam}) olabilir */
function yurtMenusu(id, d = bugun) {
  const m = yurtMenuleri[id];
  if (!m) return null;
  if (m.kahvalti || m.aksam) return m;
  return m[tarihAnahtar(d)] || null;
}
function yurtMenuYaz(elId, id, ogun, d = bugun) {
  const m = yurtMenusu(id, d), el = document.getElementById(elId);
  const notEl = document.getElementById(elId === "ana-yemekler" ? "ana-menu-not" : "detay-menu-not");
  const dg = document.getElementById(elId === "ana-yemekler" ? "dg-ana" : "dg-detay");
  if (dg) dg.dataset.menu = m && m[ogun] && m[ogun].length ? `${id}_${tarihAnahtar(d)}_${ogun}` : "";
  if (m && m[ogun] && m[ogun].length) {
    listeYaz(elId, m[ogun]);
  } else {
    el.innerHTML = `<li class="bos-menu" style="list-style:none">${yurtMenuleri[id] ? "Bu günün menüsü henüz eklenmedi." : "Bu yurdun menüsü henüz eklenmedi."}</li>`;
  }
  if (notEl) {
    const ym = yurtMenuleri[id];
    const notMetni = ogun === "kahvalti" ? (ym && ym.kahvaltiNotu) : (m && m.aksamNotu);
    if (notMetni) {
      notEl.innerHTML = `📌 <b>Not:</b> ${notMetni.replace(/^Not:\s*/i, "")}`;
      notEl.classList.add("aktif");
    } else {
      notEl.classList.remove("aktif");
    }
  }
}

let anaYurt = hafizaOku("secilenYurt") || yurtlar[0].id;
let anaOgun = varsayilanOgun;
const anaSec = document.getElementById("ana-yurt");
anaSec.innerHTML =
  `<optgroup label="Kız yurtları">${yurtlar.filter(y => y.tur === "kiz").map(y => `<option value="${y.id}">${y.ad}</option>`).join("")}</optgroup>` +
  `<optgroup label="Erkek yurtları">${yurtlar.filter(y => y.tur === "erkek").map(y => `<option value="${y.id}">${y.ad}</option>`).join("")}</optgroup>`;
anaSec.value = anaYurt;
anaSec.onchange = () => { anaYurt = anaSec.value; hafizaYaz("secilenYurt", anaYurt); anaMenuGuncelle(); };

function anaMenuGuncelle() {
  document.querySelectorAll("#ana-secici button").forEach(b => b.classList.toggle("aktif", b.dataset.ogun === anaOgun));
  yurtMenuYaz("ana-yemekler", anaYurt, anaOgun, bugun);
  document.getElementById("ana-saat").textContent = (anaOgun === "kahvalti" ? "Kahvaltı " : "Akşam yemeği ") + OGUN_SAAT[anaOgun](bugun);
}
document.querySelectorAll("#ana-secici button").forEach(b => b.onclick = () => { anaOgun = b.dataset.ogun; anaMenuGuncelle(); });
anaMenuGuncelle();
/* Üniversite Evi: tarihe göre menü */
function tarihAnahtar(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
const uniGunler = Object.keys(uniEviMenuleri).sort().filter(k => T(k) >= ekle(bugun, -1) || k === tarihAnahtar(bugun));
function uniEviGoster(anahtar) {
  document.querySelectorAll("#unievi-gunler button").forEach(b => b.classList.toggle("aktif", b.dataset.gun === anahtar));
  const d = T(anahtar), g = fark(bugun, d);
  document.getElementById("unievi-bilgi").textContent =
    (g === 0 ? "Bugün" : g === 1 ? "Yarın" : gunAdi(d)) + " · " + kisa(d) + " öğle menüsü";
  const liste = uniEviMenuleri[anahtar];
  if (liste) listeYaz("unievi-yemekler", liste);
  else document.getElementById("unievi-yemekler").innerHTML = '<li class="bos-menu" style="list-style:none">Bu gün için menü yayımlanmadı.</li>';
}
/* Üniversite Evi: yalnızca bugünün menüsü gösterilir */
(function () {
  const d = bugun, hs = d.getDay() === 0 || d.getDay() === 6;
  document.getElementById("unievi-gunler").style.display = "none";
  document.getElementById("unievi-bilgi").textContent = "Bugün · " + kisa(d) + " · 11.00–13.30 ve 15.00–16.30";
  const liste = uniEviMenuleri[tarihAnahtar(d)];
  document.getElementById("dg-unievi").dataset.menu = liste ? "unievi_" + tarihAnahtar(d) : "";
  const kapali = typeof uniEviKapali !== "undefined" ? uniEviKapali[tarihAnahtar(d)] : null;
  if (liste) listeYaz("unievi-yemekler", liste);
  else document.getElementById("unievi-yemekler").innerHTML =
    `<li class="bos-menu" style="list-style:none">${kapali ? "Yemekhane kapalı · " + kapali : hs ? "Üniversite Evi hafta sonu yemek vermiyor." : "Bugünün menüsü henüz eklenmedi."}</li>`;
})();

/* =====================================================================
   YURTLAR SAYFASI
   ===================================================================== */
let filtreTur = "hepsi";
function yurtListesiCiz() {
  const liste = yurtlar.filter(y => filtreTur === "hepsi" || y.tur === filtreTur);
  document.getElementById("yurt-liste").innerHTML = liste.map(y => `
    <button class="satir-kart cam" onclick="yurtAc('${y.id}')">
      <img class="yurt-k" src="gorseller/yurtlar/k/${y.id}.webp" alt="" width="84" height="56" loading="lazy">
      <div class="orta"><b>${y.ad}</b><small>${y.tur === "kiz" ? "Kız" : "Erkek"} yurdu · ${yurtMenuleri[y.id] ? "Menü var" : "Menü yakında"}</small></div>
      <span class="ok">›</span>
    </button>`).join("");
}
document.querySelectorAll("#yurt-filtre button").forEach(b => b.onclick = () => {
  filtreTur = b.dataset.tur;
  document.querySelectorAll("#yurt-filtre button").forEach(x => x.classList.toggle("aktif", x === b));
  yurtListesiCiz();
});
yurtListesiCiz();

let detayYurt = null, detayOgun = varsayilanOgun;
function yurtAc(id) {
  detayYurt = yurtlar.find(y => y.id === id);
  detayOgun = varsayilanOgun;
  document.getElementById("yurt-liste-gorunum").style.display = "none";
  document.getElementById("yurt-detay").style.display = "block";
  document.getElementById("detay-ad").textContent = detayYurt.ad;
  document.getElementById("detay-gorsel").src = "gorseller/yurtlar/" + detayYurt.id + ".webp";
  document.getElementById("detay-tur").textContent = (detayYurt.tur === "kiz" ? "Kız" : "Erkek") + " yurdu · KYK";
  detayMenuGuncelle();
  window.scrollTo({ top: 0 });
}
function detayMenuGuncelle() {
  document.querySelectorAll("#detay-secici button").forEach(b => b.classList.toggle("aktif", b.dataset.ogun === detayOgun));
  yurtMenuYaz("detay-yemekler", detayYurt.id, detayOgun, bugun);
  document.getElementById("detay-saat").textContent = (detayOgun === "kahvalti" ? "Kahvaltı " : "Akşam yemeği ") + OGUN_SAAT[detayOgun](bugun);
}
document.querySelectorAll("#detay-secici button").forEach(b => b.onclick = () => { detayOgun = b.dataset.ogun; detayMenuGuncelle(); });

/* ================= AYLIK MENÜ MODAL MANTIĞI ================= */
/* Kitap sayfası gibi ilerleyen menü görünümü */
function sayfaBaslik(d, rozet) {
  const ay = d.toLocaleDateString("tr-TR", { month: "long" });
  const gun = d.toLocaleDateString("tr-TR", { weekday: "long" });
  return `<div class="kb-baslik"><div class="kb-no">${d.getDate()}</div><div class="kb-tarih"><b>${ay}</b><span>${gun}</span></div>${rozet || ""}</div>`;
}
function kitapKur(el, sayfalar, ilk, sekme) {
  const n = sayfalar.length;
  if (!n) { el.classList.remove("kitap"); el.innerHTML = ""; return; }
  el.classList.add("kitap");
  const sekmeHtml = sekme ? `<div class="kb-sekme">${sekme.liste.map(x => `<button type="button" data-k="${x[0]}" class="${x[0] === sekme.aktif ? "aktif" : ""}">${x[1]}</button>`).join("")}</div>` : "";
  el.innerHTML = sekmeHtml + `<div class="kb-ust"><button type="button" class="kb-ok" data-y="-1" aria-label="Önceki gün">‹</button><div class="kb-say"><b class="kb-n">1</b> / ${n}</div><button type="button" class="kb-ok" data-y="1" aria-label="Sonraki gün">›</button></div>
    <div class="kb-iz">${sayfalar.map((h, i) => `<section class="kb-sayfa" aria-label="Gün ${i + 1}"><div class="kb-kart">${h}</div></section>`).join("")}</div>
    <div class="kb-noktalar">${sayfalar.map((_, i) => `<i data-i="${i}"></i>`).join("")}</div>`;
  el.querySelectorAll(".kb-sekme button").forEach(b => b.onclick = () => sekme.sec(b.dataset.k, akt));
  const iz = el.querySelector(".kb-iz"), sayac = el.querySelector(".kb-n");
  const noktalar = [...el.querySelectorAll(".kb-noktalar i")], oklar = [...el.querySelectorAll(".kb-ok")];
  let akt = -1;
  const guncelle = () => {
    const i = Math.max(0, Math.min(n - 1, Math.round(iz.scrollLeft / iz.clientWidth)));
    if (i === akt) return; akt = i;
    sayac.textContent = i + 1;
    noktalar.forEach((x, j) => x.classList.toggle("aktif", j === i));
    oklar[0].disabled = i === 0; oklar[1].disabled = i === n - 1;
  };
  const git = (i, yumusak) => iz.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * iz.clientWidth, behavior: yumusak ? "smooth" : "auto" });
  oklar.forEach(b => b.onclick = () => git(akt + +b.dataset.y, true));
  noktalar.forEach(x => x.onclick = () => git(+x.dataset.i, true));
  iz.addEventListener("scroll", guncelle, { passive: true });
  iz.tabIndex = 0;
  iz.onkeydown = e => { if (e.key === "ArrowRight") git(akt + 1, true); if (e.key === "ArrowLeft") git(akt - 1, true); };
  requestAnimationFrame(() => { git(ilk || 0, false); guncelle(); });
}

function aylikMenuAc(yurtId, secOgun) {
  if (window.KC_SES) KC_SES.cal("menu");
  const sabitOgun = secOgun === "kahvalti" ? "kahvalti" : "aksam";
  const y = yurtlar.find(x => x.id === yurtId);
  const ym = yurtMenuleri[yurtId];
  const baslikEl = document.getElementById("aylik-modal-baslik");
  const icerikEl = document.getElementById("aylik-modal-icerik");
  baslikEl.textContent = (y ? y.ad : "Yurt") + (sabitOgun === "kahvalti" ? " – Gelecek Kahvaltılar" : " – Gelecek Akşam Yemekleri");
  const altEl0 = document.getElementById("aylik-modal-alt"); if (altEl0) altEl0.textContent = "Sayfaları kaydırarak günleri gez";

  if (!ym) {
    icerikEl.innerHTML = '<div class="bos-menu">Bu yurdun menüsü henüz eklenmedi.</div>';
  } else {
    const bugunStr = tarihAnahtar(bugun);
    // Geçen günleri ve bugünü koyma: yalnızca bugünden sonraki (yarın ve sonrası) günleri al
    const tarihler = Object.keys(ym).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && k > bugunStr).sort();
    if (!tarihler.length) {
      icerikEl.innerHTML = '<div class="bos-menu">Bu ay için kalan başka menü bulunmuyor.</div>';
    } else {
      const ilkIdx = Math.max(0, tarihler.findIndex(k => k > bugunStr));
      const ciz = (ogunKey, ilk) => kitapKur(icerikEl, tarihler.map(k => {
        const d = T(k);
        const bugunMu = +d === +bugun;
        const yarinMu = +d === +ekle(bugun, 1);
        const rozet = bugunMu ? '<span class="etiket mavi">Bugün</span>' : yarinMu ? '<span class="etiket yesil">Yarın</span>' : '';
        const sinif = bugunMu ? ' bugun' : yarinMu ? ' yarin' : '';
        const idAttr = bugunMu ? ' id="aylik-bugun"' : (yarinMu ? ' id="aylik-yarin"' : '');
        const gun = ym[k];
        const tarihBaslik = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
        const ogun = (liste) => {
          if (!liste || !liste.length) return '<div class="aylik-bos">Menü yok</div>';
          return liste.map(y => {
            const parcalar = (window.KC_FOTO ? KC_FOTO.ayir(y) : [y]);
            const resimler = window.KC_FOTO ? parcalar.flatMap(p => (KC_FOTO.hepsi(p, "yurt") || []).map(f => [p, f])) : [];
            const kucukler = resimler.slice(0, 3).map(x => `<img loading="lazy" src="${KC_FOTO.src(x[1])}" alt=""${KC_FOTO.gercekMi(x[1]) ? ` data-buyut="${x[1]}" data-ad="${String(x[0]).replace(/"/g, "&quot;")}"` : ""}>`).join("");
            return `<div class="aylik-yemek">${kucukler ? `<span class="aylik-resim n${Math.min(resimler.length,3)}">${kucukler}</span>` : '<span class="aylik-nokta"></span>'}<span class="aylik-ad">${parcalar.join("<br>")}</span></div>`;
          }).join("");
        };

        return `<div class="kb-ic${sinif}">
          ${sayfaBaslik(d, rozet)}
          <div class="aylik-ogun-bloku">
            <b>${ogunKey === "kahvalti" ? "Kahvaltı" : "Akşam yemeği"}</b>
            ${ogun(gun[ogunKey])}
          </div>
          ${ogunKey === "aksam" && gun.aksamNotu ? `<div class="menu-not-kutu aktif" style="margin-top:8px">📌 ${gun.aksamNotu}</div>` : ""}
        </div>`;
      }), ilk);
      ciz(sabitOgun, ilkIdx);
    }
  }

  document.getElementById("aylik-modal").classList.add("aktif");
  document.body.style.overflow = "hidden";
}

function uniEviHaftaAc() {
  const baslikEl = document.getElementById("aylik-modal-baslik");
  const altEl = document.getElementById("aylik-modal-alt");
  const icerikEl = document.getElementById("aylik-modal-icerik");
  baslikEl.textContent = "Üniversite Evi – Haftalık Menü";
  if (altEl) altEl.textContent = "Bugünden itibaren öğle menüsü";
  const bugunStr = tarihAnahtar(bugun);
  const kapali = typeof uniEviKapali !== "undefined" ? uniEviKapali : {};
  const gunler = [...new Set([...Object.keys(uniEviMenuleri), ...Object.keys(kapali)])].filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && k >= bugunStr).sort();
  if (!gunler.length) {
    icerikEl.innerHTML = '<div class="bos-menu">Bu hafta için menü henüz yayımlanmadı.</div>';
  } else {
    kitapKur(icerikEl, gunler.map(k => {
      const d = T(k);
      const bugunMu = k === bugunStr, yarinMu = +d === +ekle(bugun, 1);
      const rozet = bugunMu ? '<span class="etiket mavi">Bugün</span>' : yarinMu ? '<span class="etiket yesil">Yarın</span>' : '';
      const sinif = bugunMu ? " bugun" : yarinMu ? " yarin" : "";
      const baslik = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
      let govde;
      if (uniEviMenuleri[k]) {
        govde = uniEviMenuleri[k].map(y => {
          const parcalar = window.KC_FOTO ? KC_FOTO.ayir(y) : [y];
          const resimler = window.KC_FOTO ? parcalar.flatMap(p => (KC_FOTO.hepsi(p, "unievi") || []).map(f => [p, f])) : [];
          const kucukler = resimler.slice(0, 3).map(x => `<img loading="lazy" src="${KC_FOTO.src(x[1])}" alt=""${KC_FOTO.gercekMi(x[1]) ? ` data-buyut="${x[1]}" data-ad="${String(x[0]).replace(/"/g, "&quot;")}"` : ""}>`).join("");
          return `<div class="aylik-yemek">${kucukler ? `<span class="aylik-resim n${Math.min(resimler.length,3)}">${kucukler}</span>` : '<span class="aylik-nokta"></span>'}<span class="aylik-ad">${parcalar.join("<br>")}</span></div>`;
        }).join("");
      } else {
        govde = `<div class="aylik-bos">Yemekhane kapalı${kapali[k] ? " · " + kapali[k] : ""}</div>`;
      }
      return `<div class="kb-ic${sinif}">${sayfaBaslik(d, rozet)}<div class="aylik-ogun-bloku"><b>Öğle yemeği</b>${govde}</div></div>`;
    }), 0);
  }
  document.getElementById("aylik-modal").classList.add("aktif");
  document.body.style.overflow = "hidden";
}

/* Menü sayfalarındaki gerçek yemek fotoğrafına dokununca büyüt */
document.addEventListener("click", e => {
  const img = e.target.closest && e.target.closest("img[data-buyut]");
  if (!img || !window.KC_FOTO) return;
  e.stopPropagation();
  KC_FOTO.buyut(img.dataset.buyut, img.dataset.ad || "");
}, true);
function aylikMenuKapat() {
  if (window.KC_SES && document.getElementById("aylik-modal").classList.contains("aktif")) KC_SES.cal("kapat");
  document.getElementById("aylik-modal").classList.remove("aktif");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", e => { if (e.key === "Escape") aylikMenuKapat(); });
function yurtListeyeDon() {
  document.getElementById("yurt-liste-gorunum").style.display = "block";
  document.getElementById("yurt-detay").style.display = "none";
}

/* =====================================================================
   DERS NOTLARI
   ===================================================================== */
function ortakAc() {
  document.getElementById("bolum-gorunum").style.display = "none";
  document.getElementById("ortak-gorunum").style.display = "block";
  window.scrollTo({ top: 0 });
}
function bolumAc() {
  document.getElementById("ortak-gorunum").style.display = "none";
  document.getElementById("bolum-gorunum").style.display = "none";
  document.getElementById("sinif-gorunum").style.display = "block";
  sinifSec(hafizaOku("secilenSinif") || "1");
  window.scrollTo({ top: 0 });
}
function bolumKapat() {
  document.getElementById("bolum-gorunum").style.display = "block";
  document.getElementById("sinif-gorunum").style.display = "none";
  document.getElementById("ortak-gorunum").style.display = "none";
}
function sinifSec(s) {
  hafizaYaz("secilenSinif", s);
  const donem = hafizaOku("secilenDonem") || "1";
  document.querySelectorAll("#donem-sekme button").forEach(b => b.classList.toggle("aktif", b.dataset.donem === donem));
  document.querySelectorAll("#sinif-sekme button").forEach(b => b.classList.toggle("aktif", b.dataset.sinif === s));
  const dersler = ybsDersleri[s].filter(d => String(d.donem || 1) === donem);
  const renkler = ["m", "t", "y", "p", "r"];
  document.getElementById("ders-liste").innerHTML = dersler.length
    ? dersler.map((d, i) => {
      const program = [d.gun && d.saat ? `${d.gun} ${d.saat}` : "", d.hoca].filter(Boolean).join(" · ");
      return `
      <a class="satir-kart cam ${d.link ? "" : "soluk-kart"}" ${d.link ? `href="${d.link}"${/\.pdf$/i.test(d.link) ? ' target="_blank" rel="noopener"' : ""}` : ""}>
        <span class="ik ${renkler[i % renkler.length]}">${d.ad.charAt(0)}</span>
        <div class="orta"><b>${d.ad}</b><small>${program || (d.kod ? d.kod : s + ". sınıf")}</small></div>
        <span class="rozet ${d.link ? "acik" : "yakinda"}">${d.link ? "Notlar" : "Yakında"}</span>
      </a>`; }).join("")
    : `<div class="cam bos-kutu">${s}. sınıf ${donem}. dönem dersleri yakında eklenecek.</div>`;
}
document.querySelectorAll("#sinif-sekme button").forEach(b => b.onclick = () => sinifSec(b.dataset.sinif));
document.querySelectorAll("#donem-sekme button").forEach(b => b.onclick = () => { hafizaYaz("secilenDonem", b.dataset.donem); sinifSec(hafizaOku("secilenSinif") || "1"); });

/* Adres çubuğundan doğrudan açma ve yenilemede son bulunulan ekranda kalma */
function adresiAc() {
  const h = location.hash.slice(1);
  if (h === "admin") return; // Yönetici girişi kontrolü, sekmeyi değiştirme

  if (h === "ortak") { sayfaAc("notlar"); ortakAc(); return; }
  const m = h.match(/^ybs-([1-4])$/);
  if (m) {
    sayfaAc("notlar");
    bolumAc();
    sinifSec(m[1]);
    return;
  }

  if (["ana", "yurtlar", "notlar", "takvim", "araclar"].includes(h)) {
    sayfaAc(h);
    return;
  }

  // Hash yoksa veya geçersizse son kalınan sayfada kal
  const son = hafizaOku("kc-aktif-sayfa");
  if (son && ["ana", "yurtlar", "notlar", "takvim", "araclar"].includes(son)) {
    sayfaAc(son);
  } else {
    sayfaAc("ana");
  }
}
adresiAc();
window.addEventListener("hashchange", adresiAc);

/* =====================================================================
   ORTALAMA
   ===================================================================== */
/* Fırat Üniversitesi Önlisans ve Lisans Eğitim-Öğretim Yönetmeliği, Madde 31 */
const harfler = { AA: 4, BA: 3.5, BB: 3, CB: 2.5, CC: 2, DC: 1.5, DD: 1, FF: 0 };
function dersEkle() {
  const s = document.createElement("div");
  s.className = "ders-satir";
  const secenek = Object.entries(harfler).map(([h, p]) => `<option value="${p}">${h}</option>`).join("");
  s.innerHTML = `
    <input placeholder="Ders adı" aria-label="Ders adı">
    <input type="number" min="1" value="5" class="kredi" aria-label="AKTS kredisi" title="AKTS kredisi">
    <select class="harf" aria-label="Harf notu">${secenek}</select>
    <button class="sil" aria-label="Dersi sil" onclick="this.parentElement.remove()">×</button>`;
  document.getElementById("dersler").appendChild(s);
}
function hesapla() {
  let kredi = 0, puan = 0;
  document.querySelectorAll("#dersler .ders-satir").forEach(s => {
    const k = parseFloat(s.querySelector(".kredi").value) || 0;
    kredi += k; puan += k * parseFloat(s.querySelector(".harf").value);
  });
  if (!kredi) { document.getElementById("ort-yazi").textContent = "Önce en az bir ders ekle"; return; }
  const ort = puan / kredi;
  document.getElementById("ort").textContent = ort.toFixed(2).replace(".", ",");
  document.getElementById("ort-yazi").textContent =
    ort >= 2 ? "2,00 ve üstü: DC ve DD notların da başarılı sayılır" : "2,00'ın altında: DC ve DD notların koşullu kalır";
}
dersEkle(); dersEkle(); dersEkle();

function geriSay() {
  const d = document.getElementById("sinav").value;
  if (!d) return;
  const gun = fark(bugun, T(d));
  document.getElementById("kalan").textContent = gun >= 0 ? gun : "–";
  document.getElementById("kalan-yazi").textContent =
    gun > 0 ? "gün kaldı" : gun === 0 ? "Sınav bugün, başarılar" : "Bu tarih geçmiş";
}
