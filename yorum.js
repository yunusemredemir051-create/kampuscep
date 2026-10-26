/* KampüsCepte — yemek menüsü değerlendirme, puanlama, yorumlar, admin paneli ve yemek fotoğrafları.
   Puanlama & Yıldızlar: Tüm KYK yurtları için tek ortak havuzda toplanır.
   Yorumlar: Her yurda özel olarak ayrılır.
   Yönetici: yunusemredemir051@gmail.com */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, addDoc, onSnapshot, query, where,
         getCountFromServer, getDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
const auth = getAuth(app); auth.languageCode = "tr";
const db = getFirestore(app);
let ben = null;

const ADMIN_EMAIL = "yunusemredemir051@gmail.com";
const isAdmin = () => ben && ben.email === ADMIN_EMAIL;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MENU_RE = /^[a-z0-9-]+_\d{4}-\d{2}-\d{2}(_(kahvalti|aksam))?$/;

// KYK yurtları için ortak oy/puanlama havuzu (tüm 7 yurt birleşik oy verir)
function oyHavuzId(menuId) {
  const m = String(menuId || "").match(/^([a-z0-9-]+)_(\d{4}-\d{2}-\d{2})(?:_(kahvalti|aksam))?$/);
  if (!m) return menuId;
  const [_, yer, tarih, ogun] = m;
  const kykYurtlari = [
    "ahmet-kabakli", "sare-ana", "harput", "izzetpasa",
    "omer-bilginoglu", "fethi-sekin", "firat", "kyk"
  ];
  if (kykYurtlari.includes(yer)) {
    return `kyk_${tarih}${ogun ? "_" + ogun : ""}`;
  }
  return menuId;
}

// Yorumlar ise her yurdun kendi özel menüsünde kalır (birbirine karışmaz)
function yorumHavuzId(menuId) {
  return menuId;
}

async function kimlik() {
  if (auth.currentUser) return true;
  try { await signInAnonymously(auth); return true; }
  catch (e) { console.error(e); toast("Bağlantı kurulamadı, tekrar dener misin?"); return false; }
}

async function adminGirisYap() {
  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user && res.user.email === ADMIN_EMAIL) {
      toast("👑 Yönetici girişi başarılı!");
    } else {
      toast("Giriş yapıldı: " + (res.user ? res.user.email : ""));
    }
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user") {
      console.error(e); toast("Giriş yapılamadı: " + (e.message || e));
    }
  }
}

async function adminCikisYap() {
  try {
    await signOut(auth);
    await signInAnonymously(auth);
    toast("Yönetici oturumu kapatıldı.");
  } catch (e) {
    console.error(e);
  }
}

const adOku = () => { try { return localStorage.getItem("kc-ad") || ""; } catch (e) { return ""; } };
const adYaz = a => { try { localStorage.setItem("kc-ad", a); } catch (e) {} };
function toast(m) {
  let t = document.getElementById("dg-toast");
  if (!t) { t = document.createElement("div"); t.id = "dg-toast"; document.body.appendChild(t); }
  t.textContent = m; t.classList.add("goster"); clearTimeout(toast.z); toast.z = setTimeout(() => t.classList.remove("goster"), 3200);
}

/* ---------- görünüm ---------- */
const css = document.createElement("style");
css.textContent = `
.degerlendir{--dg-yuzey:#fff;--dg-yuzey2:#f5f7fd;--dg-cizgi:#e4e8f4;--dg-yazi:#141b34;--dg-soluk:#6b7390;--dg-vurgu:var(--mavi,#3b5bfd);--dg-vurgu-acik:rgba(59,91,253,.1);
  margin-top:14px;border-top:1px solid var(--dg-cizgi);padding-top:14px}
html[data-tema="koyu"] .degerlendir{--dg-yuzey:#1c2338;--dg-yuzey2:#232b45;--dg-cizgi:rgba(255,255,255,.1);--dg-yazi:#eef1ff;--dg-soluk:#9aa5c8;--dg-vurgu-acik:rgba(120,140,255,.16)}
.degerlendir[data-menu=""]{display:none}
.dg-bar{display:flex;gap:10px 12px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.dg-sol{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.dg-puan-alani{display:inline-flex;align-items:center;gap:8px;background:var(--dg-yuzey);padding:5px 13px;border-radius:999px;border:1px solid var(--dg-cizgi)}
.dg-yildizlar{display:inline-flex;align-items:center;gap:1px}
.dg-star{background:none;border:0;padding:0 1px;font-size:21px;line-height:1;color:#c9d0e2;cursor:pointer;transition:transform .12s,color .12s;user-select:none}
html[data-tema="koyu"] .dg-star{color:#47507a}
.dg-star:hover,.dg-star.aktif{color:#f59e0b;transform:scale(1.18)}
.dg-star.secili{color:#f59e0b}
.dg-puan-bilgi{font-size:12.5px;font-weight:700;color:var(--dg-soluk);display:inline-flex;align-items:baseline;gap:4px}
.dg-puan-bilgi b{color:#d97706;font-size:13.5px;font-weight:800}
.dg-puan-bilgi small{font-size:11.5px;font-weight:600;color:var(--dg-soluk)}
.dg-reaksiyonlar{display:inline-flex;gap:6px;align-items:center}
.dg-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dg-cizgi);background:var(--dg-yuzey);color:var(--dg-soluk);
  font:700 12.5px var(--font,inherit);padding:6px 12px;border-radius:99px;cursor:pointer;transition:transform .15s,background .15s,color .15s}
.dg-btn svg{width:15px;height:15px}
.dg-btn:active{transform:scale(.95)}
.dg-btn.secili.iyi{background:#e7f8ee;color:#1a9d55;border-color:#bfe9d1}
.dg-btn.secili.kotu{background:#fdebec;color:#d23b4b;border-color:#f5c6cc}
.dg-btn.yorum{margin-left:auto}
.dg-btn.yorum.acik{background:var(--dg-vurgu-acik);color:var(--dg-vurgu);border-color:transparent}

.dg-panel{margin-top:14px;padding:14px;border-radius:20px;background:var(--dg-yuzey2);border:1px solid var(--dg-cizgi)}
.dg-yazar{display:flex;align-items:center;gap:8px;margin:0 0 10px}
.dg-yazar .dg-av{width:30px;height:30px;font-size:13px}
.dg-ad{flex:1;min-width:0;display:block;border:0;border-bottom:1.5px solid var(--dg-cizgi);border-radius:0;padding:6px 2px;font:600 13.5px var(--font,inherit);
  color:var(--dg-yazi);background:transparent;box-sizing:border-box;outline:none;transition:border-color .15s}
.dg-ad::placeholder{color:var(--dg-soluk);font-weight:500}
.dg-ad:focus{border-color:var(--dg-vurgu)}
.dg-form{display:flex;gap:8px;align-items:flex-end;background:var(--dg-yuzey);border:1.5px solid var(--dg-cizgi);border-radius:20px;padding:6px 6px 6px 14px;transition:border-color .15s,box-shadow .15s}
.dg-form:focus-within{border-color:var(--dg-vurgu);box-shadow:0 0 0 4px var(--dg-vurgu-acik)}
.dg-form textarea{flex:1;min-width:0;min-height:36px;max-height:140px;resize:none;border:0;outline:none;background:transparent;padding:8px 0;
  font:500 14.5px/1.4 var(--font,inherit);color:var(--dg-yazi)}
.dg-form textarea::placeholder{color:var(--dg-soluk)}
.dg-form button{flex:none;width:38px;height:38px;border:0;border-radius:50%;padding:0;display:grid;place-items:center;cursor:pointer;color:#fff;
  background:linear-gradient(135deg,var(--dg-vurgu),#7b5cff);box-shadow:0 6px 14px -6px rgba(91,75,255,.7);transition:transform .15s,opacity .15s}
.dg-form button svg{width:18px;height:18px}
.dg-form button:active{transform:scale(.92)}
.dg-form button:disabled{opacity:.5}
.dg-liste{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.dg-y{background:var(--dg-yuzey);border:1px solid var(--dg-cizgi);border-radius:18px;padding:12px 14px;display:grid;grid-template-columns:34px 1fr;column-gap:10px}
.dg-av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font:800 14px var(--font,inherit);flex:none;text-transform:uppercase}
.dg-y-govde{min-width:0}
.dg-y-ust{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.dg-y b{font-size:13.5px;color:var(--dg-yazi);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dg-y time{font-size:11.5px;color:var(--dg-soluk);font-weight:600;flex:none}
.dg-y p{margin:3px 0 8px;font-size:14px;line-height:1.5;color:var(--dg-yazi);white-space:pre-wrap;word-break:break-word}
.dg-y .eylem{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dg-y .eylem button{border:0;background:none;padding:2px 0;font:700 12px var(--font,inherit);color:var(--dg-soluk);cursor:pointer}
.dg-y .eylem button.yanitla{color:var(--dg-vurgu)}
.dg-y-begen{display:inline-flex;align-items:center;gap:4px;background:var(--dg-yuzey2)!important;color:var(--dg-soluk);
  border:0;border-radius:99px!important;padding:4px 10px!important;font:700 11.5px var(--font,inherit);cursor:pointer;transition:all .15s}
.dg-y-begen.secili{background:#ffebee!important;color:#e11d48}
.dg-yanitlar{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:8px;grid-column:1/-1}
.dg-yanitlar .dg-y{background:var(--dg-yuzey2);border-radius:14px;padding:10px 12px;grid-template-columns:28px 1fr}
.dg-yanitlar .dg-av{width:28px;height:28px;font-size:12px}
.dg-yanit-form-alani{margin-top:8px}
.dg-yanit-form{margin-top:4px}
.dg-bos{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:13.5px;color:var(--dg-soluk);font-weight:600;padding:18px 8px 8px}
.dg-bos svg{width:30px;height:30px;opacity:.55}
.dg-y-govde,.dg-y>.dg-y-ust{grid-column:2}
.dg-y>.dg-yanit-form-alani{grid-column:1/-1}

/* Admin Stilleri */
.dg-admin-serit{display:flex;align-items:center;justify-content:space-between;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:8px 12px;font-size:12.5px;color:#92400e;font-weight:700;margin-bottom:10px}
.dg-admin-giris-serit{text-align:right;margin-bottom:8px}
.dg-giris-link{border:0;background:none;color:var(--soluk,#8a90a8);font:600 11.5px var(--font,inherit);cursor:pointer;text-decoration:underline}
.dg-giris-link:hover{color:var(--mavi,#3b5bfd)}
.dg-tum-btn{border:0;background:#3b5bfd;color:#fff;border-radius:8px;padding:4px 10px;font:700 11.5px var(--font,inherit);cursor:pointer;margin-right:6px}
.dg-tum-btn:hover{background:#2546e5}
.dg-cikis-btn{border:0;background:rgba(0,0,0,.08);color:#78350f;border-radius:8px;padding:4px 8px;font:700 11.5px var(--font,inherit);cursor:pointer}
.dg-cikis-btn:hover{background:rgba(0,0,0,.15)}
.dg-sil-btn{border:0;background:rgba(220,38,38,.08);color:#dc2626;border-radius:99px;padding:3px 8px;font:700 11px var(--font,inherit);cursor:pointer;transition:background .15s}
.dg-sil-btn:hover{background:#dc2626;color:#fff}
.dg-ban-btn{border:0;background:rgba(124,58,237,.08);color:#7c3aed;border-radius:99px;padding:3px 8px;font:700 11px var(--font,inherit);cursor:pointer;transition:background .15s}
.dg-ban-btn:hover{background:#7c3aed;color:#fff}
.dg-cezali-kutu{background:#fee2e2;border:1px solid #fecaca;border-radius:12px;padding:12px;color:#991b1b;font-size:13px;font-weight:700;text-align:center;margin-top:8px}

#dg-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;pointer-events:none;
  background:#141b34;color:#fff;font:700 13px var(--font,inherit);padding:9px 18px;border-radius:99px;
  box-shadow:0 8px 24px rgba(0,0,0,.25);transition:opacity .2s,transform .2s;z-index:9999}
#dg-toast.goster{opacity:1;transform:translateX(-50%) translateY(0)}
`;
document.head.appendChild(css);

const IKON = {
  iyi: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.72a2 2 0 001.97-1.637l1.3-6.5A2 2 0 0015.03 7.5H12V4a2 2 0 00-2-2l-3.333 6.667A2 2 0 006 10.333z"/></svg>',
  kotu: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.28a2 2 0 00-1.97 1.637L3.01 10.137A2 2 0 005 12.5H8v3.5a2 2 0 002 2l3.333-6.667A2 2 0 0014 9.667z"/></svg>',
  yorum: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>'
};

function avatar(ad) {
  const t = String(ad || "Anonim").trim() || "Anonim";
  let h = 0; for (const c of t) h = (h * 31 + c.codePointAt(0)) % 360;
  const bas = [...t][0] || "A";
  return `<span class="dg-av" style="background:linear-gradient(135deg,hsl(${h},72%,56%),hsl(${(h + 40) % 360},70%,48%))">${esc(bas)}</span>`;
}
const GONDER_IKON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const BOS_IKON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/></svg>';

function zamanFarki(ts) {
  if (!ts) return "şimdi";
  const d = ts.toDate(), s = (Date.now() - d) / 1000;
  if (s < 60) return "az önce";
  if (s < 3600) return Math.floor(s / 60) + " dk önce";
  if (s < 86400) return Math.floor(s / 3600) + " sa önce";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

/* ---------- ban kontrolü ---------- */
async function cezaKontrol(uid) {
  if (!uid || isAdmin()) return { cezali: false };
  try {
    const s = await getDoc(doc(db, "yorumCezalari", uid));
    if (s.exists()) {
      const data = s.data();
      const bitis = data.bitisMs || 0;
      if (Date.now() < bitis) {
        const kalanGun = Math.ceil((bitis - Date.now()) / (86400000));
        const bitisStr = new Date(bitis).toLocaleDateString("tr-TR");
        return { cezali: true, kalanGun, bitisStr };
      }
    }
  } catch (e) {
    console.warn("Ceza kontrol hatası:", e);
  }
  return { cezali: false };
}

/* ---------- her menü kutusu ---------- */
const kutular = new Map();

function kur(el) {
  const id = el.dataset.menu || "";
  const eski = kutular.get(el);
  if (eski && eski.id === id) return;
  if (eski && eski.dinle) eski.dinle();
  if (eski && eski.dinleOy) eski.dinleOy();
  if (!MENU_RE.test(id)) { el.innerHTML = ""; kutular.delete(el); return; }

  const oyId = oyHavuzId(id);
  const yorumId = yorumHavuzId(id);

  const d = {
    id,
    oyId,
    yorumId,
    benimPuan: 0,
    benimReaksiyon: 0,
    sayi: { starToplam: 0, starAdet: 0, starOrt: 0, iyi: 0, kotu: 0, yorum: 0 },
    acik: false,
    yorumlar: [],
    yanit: null,
    dinle: null,
    dinleOy: null
  };
  kutular.set(el, d);

  el.innerHTML = `<div class="dg-bar">
      <div class="dg-sol">
        <div class="dg-puan-alani">
          <div class="dg-yildizlar" role="radiogroup" aria-label="5 yıldız üzerinden puanla">
            <button type="button" class="dg-star" data-puan="1" aria-label="1 yıldız">★</button>
            <button type="button" class="dg-star" data-puan="2" aria-label="2 yıldız">★</button>
            <button type="button" class="dg-star" data-puan="3" aria-label="3 yıldız">★</button>
            <button type="button" class="dg-star" data-puan="4" aria-label="4 yıldız">★</button>
            <button type="button" class="dg-star" data-puan="5" aria-label="5 yıldız">★</button>
          </div>
          <span class="dg-puan-bilgi"><small>Puan ver</small></span>
        </div>
        <div class="dg-reaksiyonlar">
          <button type="button" class="dg-btn iyi" data-reak="1" aria-label="Beğendim">${IKON.iyi}<span>0</span></button>
          <button type="button" class="dg-btn kotu" data-reak="-1" aria-label="Beğenmedim">${IKON.kotu}<span>0</span></button>
        </div>
      </div>
      <button class="dg-btn yorum" aria-expanded="false">${IKON.yorum}Yorumlar <span>0</span></button>
    </div><div class="dg-panel" hidden></div>`;

  // Yıldız tıklamaları
  const stars = el.querySelectorAll(".dg-star");
  stars.forEach(btn => {
    btn.onclick = () => starPuanVer(el, +btn.dataset.puan);
    btn.onmouseenter = () => {
      const p = +btn.dataset.puan;
      stars.forEach(s => s.classList.toggle("aktif", +s.dataset.puan <= p));
    };
  });
  const yildizKutu = el.querySelector(".dg-yildizlar");
  if (yildizKutu) {
    yildizKutu.onmouseleave = () => {
      stars.forEach(s => s.classList.remove("aktif"));
    };
  }

  // Beğen / Beğenme
  el.querySelectorAll("[data-reak]").forEach(b => b.onclick = () => reaksiyonVer(el, +b.dataset.reak));

  // Yorumlar paneli
  el.querySelector(".dg-btn.yorum").onclick = () => panelAc(el, !d.acik);

  // Oyları ve yorum sayısını getir & gerçek zamanlı dinle
  oyDinleVeSay(el);
}

function oyDinleVeSay(el) {
  const d = kutular.get(el); if (!d) return;
  if (d.dinleOy) { d.dinleOy(); d.dinleOy = null; }

  // Yorum sayısını al
  getCountFromServer(collection(db, "menuler", d.yorumId, "yorumlar")).then(c => {
    if (kutular.get(el) === d) {
      d.sayi.yorum = c.data().count;
      barCiz(el);
    }
  }).catch(() => {});

  // Yerel oy bilgilerini oku
  try {
    d.benimPuan = parseInt(localStorage.getItem("kc-puan-" + d.oyId)) || 0;
    d.benimReaksiyon = parseInt(localStorage.getItem("kc-reak-" + d.oyId)) || 0;
  } catch (e) {}

  // Firestore'daki ortak havuz oylarını gerçek zamanlı dinle
  const oylarRef = collection(db, "menuler", d.oyId, "oylar");
  d.dinleOy = onSnapshot(oylarRef, snapOylar => {
    if (kutular.get(el) !== d) return;
    let starTop = 0, starSay = 0, iyiSay = 0, kotuSay = 0;
    snapOylar.forEach(docSnap => {
      const data = docSnap.data();
      const p = typeof data.puan === "number" ? data.puan : 0;
      if (p >= 1 && p <= 5) {
        starTop += p;
        starSay++;
      }
      const r = typeof data.reaksiyon === "number" ? data.reaksiyon : (data.d === 1 || data.d === -1 ? data.d : 0);
      if (r === 1) iyiSay++;
      else if (r === -1) kotuSay++;
    });

    d.sayi.starToplam = starTop;
    d.sayi.starAdet = starSay;
    d.sayi.starOrt = starSay > 0 ? (starTop / starSay).toFixed(1) : 0;
    d.sayi.iyi = iyiSay;
    d.sayi.kotu = kotuSay;

    if (ben) {
      const myDoc = snapOylar.docs.find(x => x.id === ben.uid);
      if (myDoc) {
        const myData = myDoc.data();
        if (typeof myData.puan === "number") d.benimPuan = myData.puan;
        if (typeof myData.reaksiyon === "number") d.benimReaksiyon = myData.reaksiyon;
        else if (myData.d === 1 || myData.d === -1) d.benimReaksiyon = myData.d;
      }
    }
    barCiz(el);
  }, err => {
    console.warn("Ortak oy havuzu dinleme hatası:", err);
  });
}

function barCiz(el) {
  const d = kutular.get(el); if (!d) return;

  const stars = el.querySelectorAll(".dg-star");
  stars.forEach(s => {
    s.classList.toggle("secili", +s.dataset.puan <= d.benimPuan);
  });
  const puanYazi = el.querySelector(".dg-puan-bilgi");
  if (puanYazi) {
    if (d.sayi.starAdet > 0) {
      puanYazi.innerHTML = `<b>★ ${d.sayi.starOrt}</b> <small>(${d.sayi.starAdet} oy)</small>`;
    } else if (d.benimPuan > 0) {
      puanYazi.innerHTML = `<b>★ ${d.benimPuan}.0</b> <small>(Senin oyun)</small>`;
    } else {
      puanYazi.innerHTML = `<small>Puan ver</small>`;
    }
  }

  const btnIyi = el.querySelector(".dg-btn.iyi");
  const btnKotu = el.querySelector(".dg-btn.kotu");
  if (btnIyi && btnKotu) {
    btnIyi.querySelector("span").textContent = d.sayi.iyi;
    btnKotu.querySelector("span").textContent = d.sayi.kotu;
    btnIyi.classList.toggle("secili", d.benimReaksiyon === 1);
    btnKotu.classList.toggle("secili", d.benimReaksiyon === -1);
    btnIyi.setAttribute("aria-pressed", d.benimReaksiyon === 1);
    btnKotu.setAttribute("aria-pressed", d.benimReaksiyon === -1);
  }

  const yorum = el.querySelector(".dg-btn.yorum");
  if (yorum) {
    const span = yorum.querySelector("span");
    if (span) span.textContent = d.sayi.yorum;
    yorum.classList.toggle("acik", d.acik);
    yorum.setAttribute("aria-expanded", d.acik);
  }
}

async function starPuanVer(el, p) {
  const d = kutular.get(el); if (!d) return;
  const onceki = d.benimPuan;
  const yeni = onceki === p ? 0 : p;

  d.benimPuan = yeni;
  try { localStorage.setItem("kc-puan-" + d.oyId, yeni); } catch (e) {}
  barCiz(el);

  if (yeni > 0) toast(`${yeni} yıldız verdin! ⭐`);

  if (!(await kimlik())) return;
  const ref = doc(db, "menuler", d.oyId, "oylar", auth.currentUser.uid);
  try {
    await setDoc(ref, { puan: yeni, zaman: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error("Firestore puan hatası:", e);
  }
}

async function reaksiyonVer(el, r) {
  const d = kutular.get(el); if (!d) return;
  const onceki = d.benimReaksiyon;
  const yeni = onceki === r ? 0 : r;

  d.benimReaksiyon = yeni;
  try { localStorage.setItem("kc-reak-" + d.oyId, yeni); } catch (e) {}
  barCiz(el);

  if (!(await kimlik())) return;
  const ref = doc(db, "menuler", d.oyId, "oylar", auth.currentUser.uid);
  try {
    await setDoc(ref, { reaksiyon: yeni, zaman: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error("Firestore reaksiyon hatası:", e);
  }
}

function panelAc(el, ac) {
  const d = kutular.get(el); if (!d) return;
  d.acik = ac;
  const p = el.querySelector(".dg-panel");
  p.hidden = !ac;
  barCiz(el);
  if (!ac) { if (d.dinle) { d.dinle(); d.dinle = null; } return; }
  panelCiz(el);
  d.dinle = onSnapshot(collection(db, "menuler", d.yorumId, "yorumlar"), s => {
    d.yorumlar = s.docs.map(x => ({ id: x.id, ...x.data() }));
    d.sayi.yorum = d.yorumlar.length; barCiz(el);
    listeCiz(el);
  }, e => { console.error(e); p.querySelector(".dg-liste").innerHTML = '<li class="dg-bos">Yorumlar yüklenemedi.</li>'; });
}

function formHtml(yanit) {
  return `<div class="dg-form${yanit ? " dg-yanit-form" : ""}"><textarea maxlength="500" rows="1" placeholder="${yanit ? "Yanıtını yaz…" : "Bu menü hakkında ne düşünüyorsun?"}"></textarea><button type="button" aria-label="Gönder" title="Gönder">${GONDER_IKON}</button></div>`;
}

function panelCiz(el) {
  const d = kutular.get(el); if (!d) return;
  const p = el.querySelector(".dg-panel");
  const adminSerit = isAdmin()
    ? `<div class="dg-admin-serit">
        <span>👑 Yönetici: <b>${esc(ADMIN_EMAIL)}</b></span>
        <div style="display:flex;align-items:center">
          <button type="button" class="dg-tum-btn" id="dg-tum-yemekler-btn">🍽️ Tüm Yemekler</button>
          <button type="button" class="dg-cikis-btn" id="dg-admin-cikis">Çıkış</button>
        </div>
       </div>`
    : "";

  p.innerHTML = adminSerit +
    `<div class="dg-yazar">${avatar(adOku() || "Anonim")}<input class="dg-ad" maxlength="40" placeholder="Adın (isteğe bağlı)" value="${esc(adOku())}" aria-label="Adın, isteğe bağlı"></div>
     <div id="dg-ana-form-kutu">${formHtml(false)}</div>
     <ul class="dg-liste"></ul>`;

  const btnGiris = p.querySelector("#dg-admin-giris");
  if (btnGiris) btnGiris.onclick = adminGirisYap;
  const btnCikis = p.querySelector("#dg-admin-cikis");
  if (btnCikis) btnCikis.onclick = adminCikisYap;
  const btnTum = p.querySelector("#dg-tum-yemekler-btn");
  if (btnTum) btnTum.onclick = () => window.KC_YEMEK_PANEL && window.KC_YEMEK_PANEL.ac();

  p.querySelector(".dg-ad").oninput = e => adYaz(e.target.value.trim());
  formBagla(el, p.querySelector(".dg-form"), null);
  listeCiz(el);
}

function formBagla(el, f, ustId) {
  const d = kutular.get(el);
  const ta = f.querySelector("textarea"), btn = f.querySelector("button");
  ta.oninput = () => { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; };
  btn.onclick = async () => {
    const metin = ta.value.trim();
    if (!metin) { ta.focus(); return; }
    if (!(await kimlik())) return;

    // Ban kontrolü
    const ceza = await cezaKontrol(auth.currentUser.uid);
    if (ceza.cezali) {
      alert(`⛔ Yorum yapma cezanız bulunmaktadır!\nKalan süre: Yaklaşık ${ceza.kalanGun} gün (Bitiş: ${ceza.bitisStr})\nBu süre zarfında yorum veya yanıt yazamazsınız.`);
      return;
    }

    const adInp = el.querySelector(".dg-ad");
    const ad = (adInp ? adInp.value.trim() : "") || adOku() || "Anonim";
    adYaz(ad === "Anonim" ? "" : ad);
    btn.disabled = true;
    try {
      await addDoc(collection(db, "menuler", d.yorumId, "yorumlar"), {
        uid: auth.currentUser.uid,
        ad, metin,
        ust: ustId || "",
        zaman: serverTimestamp(),
        begeniler: []
      });
      ta.value = ""; ta.style.height = "auto";
      if (ustId) { d.yanit = null; listeCiz(el); }
    } catch (e) {
      console.error(e); toast("Gönderilemedi, tekrar dener misin?");
    } finally { btn.disabled = false; }
  };
}

function listeCiz(el) {
  const d = kutular.get(el); if (!d) return;
  const ul = el.querySelector(".dg-liste"); if (!ul) return;
  if (!d.yorumlar.length) { ul.innerHTML = `<li class="dg-bos">${BOS_IKON}<span>Henüz yorum yok.<br>İlk yorumu sen yaz.</span></li>`; return; }

  const kokler = d.yorumlar.filter(y => !y.ust).sort((a, b) => (b.zaman?.seconds || 0) - (a.zaman?.seconds || 0));
  const yanitlar = new Map();
  d.yorumlar.filter(y => y.ust).sort((a, b) => (a.zaman?.seconds || 0) - (b.zaman?.seconds || 0))
    .forEach(y => { const l = yanitlar.get(y.ust) || []; l.push(y); yanitlar.set(y.ust, l); });

  const benUid = auth.currentUser ? auth.currentUser.uid : "";
  const yoneticiMi = isAdmin();

  const kart = y => {
    const benim = y.uid && benUid && y.uid === benUid;
    const begeniListesi = Array.isArray(y.begeniler) ? y.begeniler : [];
    const benBegendim = benUid && begeniListesi.includes(benUid);
    const begeniSayi = begeniListesi.length;

    const silBtn = (benim || yoneticiMi) ? `<button class="dg-sil-btn" data-sil="${esc(y.id)}">🗑️ Sil</button>` : "";
    const banBtn = (yoneticiMi && y.uid && y.uid !== benUid)
      ? `<button class="dg-ban-btn" data-ban-uid="${esc(y.uid)}" data-ban-ad="${esc(y.ad)}">🚫 Ceza Ver</button>`
      : "";

    return `<li class="dg-y" data-id="${esc(y.id)}">
      ${avatar(y.ad)}
      <div class="dg-y-govde">
      <div class="dg-y-ust"><b>${esc(y.ad)}</b><time>${zamanFarki(y.zaman)}</time></div>
      <p>${esc(y.metin)}</p>
      <div class="eylem">
        <button class="dg-y-begen${benBegendim ? " secili" : ""}" data-yorum-begen="${esc(y.id)}" aria-label="Yorumu beğen">❤️ <span>${begeniSayi}</span></button>
        <button class="yanitla" data-yanit="${esc(y.id)}">Yanıtla</button>
        ${silBtn}
        ${banBtn}
        <button data-bildir="${esc(y.id)}">Bildir</button>
      </div>
      </div>
      ${d.yanit === y.id ? `<div class="dg-yanit-form-alani">${formHtml(true)}</div>` : ""}
      ${(yanitlar.get(y.id) || []).length ? `<ul class="dg-yanitlar">${(yanitlar.get(y.id) || []).map(kart).join("")}</ul>` : ""}
    </li>`;
  };

  ul.innerHTML = kokler.map(kart).join("");

  // Yanıt butonu
  ul.querySelectorAll("[data-yanit]").forEach(b => b.onclick = () => {
    d.yanit = d.yanit === b.dataset.yanit ? null : b.dataset.yanit;
    listeCiz(el);
    if (d.yanit) {
      const f = ul.querySelector(`.dg-y[data-id="${d.yanit}"] .dg-yanit-form`);
      if (f) { formBagla(el, f, d.yanit); f.querySelector("textarea").focus(); }
    }
  });

  // Yorum Beğeni
  ul.querySelectorAll("[data-yorum-begen]").forEach(b => b.onclick = async () => {
    if (!(await kimlik())) return;
    const yorumId = b.dataset.yorumBegen;
    const hedef = d.yorumlar.find(x => x.id === yorumId);
    if (!hedef) return;

    const uId = auth.currentUser.uid;
    let liste = Array.isArray(hedef.begeniler) ? [...hedef.begeniler] : [];
    if (liste.includes(uId)) {
      liste = liste.filter(x => x !== uId);
    } else {
      liste.push(uId);
    }
    hedef.begeniler = liste;
    listeCiz(el);

    try {
      const ref = doc(db, "menuler", d.yorumId, "yorumlar", yorumId);
      await setDoc(ref, { begeniler: liste }, { merge: true });
    } catch (e) {
      console.error("Yorum beğenilemedi:", e);
    }
  });

  // Sil (Kullanıcının kendi yorumu veya Yönetici)
  ul.querySelectorAll("[data-sil]").forEach(b => b.onclick = async () => {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;
    try {
      await deleteDoc(doc(db, "menuler", d.yorumId, "yorumlar", b.dataset.sil));
      toast("Yorum silindi.");
    } catch (e) {
      console.error(e); toast("Silinemedi: " + (e.message || e));
    }
  });

  // Ceza Ver / Ban (3 gün, 7 gün, 30 gün)
  ul.querySelectorAll("[data-ban-uid]").forEach(b => b.onclick = async () => {
    if (!isAdmin()) return;
    const hedefUid = b.dataset.banUid;
    const hedefAd = b.dataset.banAd;

    const secim = prompt(
      `🚫 [YÖNETİCİ CEZA PANELİ]\n` +
      `Kullanıcı: ${hedefAd}\n\n` +
      `Ceza süresini seçin:\n` +
      `1) 3 Gün Yorum Cezası\n` +
      `2) 7 Gün Yorum Cezası\n` +
      `3) 30 Gün Yorum Cezası\n` +
      `4) Cezayı Kaldır (Affet)\n\n` +
      `Seçiminiz (1, 2, 3 veya 4 yazın):`
    );

    if (!secim) return;

    let gun = 0;
    if (secim === "1") gun = 3;
    else if (secim === "2") gun = 7;
    else if (secim === "3") gun = 30;
    else if (secim === "4") gun = -1;
    else { alert("Geçersiz seçim yapıldı."); return; }

    try {
      const banRef = doc(db, "yorumCezalari", hedefUid);
      if (gun === -1) {
        await deleteDoc(banRef);
        toast(`✅ ${hedefAd} kullanıcısının cezası kaldırıldı.`);
      } else {
        const bitisMs = Date.now() + (gun * 86400000);
        await setDoc(banRef, {
          uid: hedefUid,
          ad: hedefAd,
          gun: gun,
          bitisMs: bitisMs,
          tarih: serverTimestamp(),
          admin: ADMIN_EMAIL
        });
        toast(`⛔ ${hedefAd} kullanıcısına ${gun} gün yorum yapma cezası verildi.`);
      }
    } catch (err) {
      console.error("Ceza işlemi hatası:", err);
      toast("Ceza işlemi başarısız oldu: " + err.message);
    }
  });

  // Bildir
  ul.querySelectorAll("[data-bildir]").forEach(b => b.onclick = async () => {
    if (!(await kimlik())) return;
    const neden = prompt("Bu yorumu neden bildiriyorsun? (kısaca)");
    if (!neden) return;
    try {
      await addDoc(collection(db, "sikayetler"), {
        ilan: "yorum:" + d.yorumId + "/" + b.dataset.bildir,
        neden: neden.slice(0, 300),
        uid: auth.currentUser.uid,
        zaman: serverTimestamp()
      });
      toast("Teşekkürler, inceleyeceğiz.");
    } catch (e) { console.error(e); toast("Gönderilemedi, tekrar dener misin?"); }
  });
}

/* ---------- yemek fotoğrafları bulut senkronizasyonu ---------- */
try {
  onSnapshot(collection(db, "yemekFotolari"), s => {
    s.docs.forEach(d => {
      const data = d.data();
      if (data && data.foto) {
        window.KC_BULUT_FOTOLAR[d.id] = data.foto;
      }
    });
    try {
      localStorage.setItem("kc-bulut-fotolar", JSON.stringify(window.KC_BULUT_FOTOLAR));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("kc-fotolar-guncellendi"));
  });
} catch (e) {
  console.warn("yemekFotolari dinleme hatası:", e);
}

const asciiYapici = s => String(s || "").toLocaleLowerCase("tr-TR").trim()
  .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
  .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ç/g, "c")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function yukleYemekFoto(yemekAdi, base64Data, yer = "yurt") {
  if (!isAdmin()) {
    alert("Yalnızca yönetici (yunusemredemir051@gmail.com) fotoğraf yükleyebilir.");
    return false;
  }
  const yerPrefix = yer === "unievi" ? "unievi" : "yurt";
  const slug = yerPrefix + "_" + asciiYapici(yemekAdi);
  if (!slug) return false;

  // Hemen yerelde göster
  window.KC_BULUT_FOTOLAR[slug] = base64Data;
  try {
    localStorage.setItem("kc-bulut-fotolar", JSON.stringify(window.KC_BULUT_FOTOLAR));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent("kc-fotolar-guncellendi"));

  try {
    const ref = doc(db, "yemekFotolari", slug);
    await setDoc(ref, {
      ad: yemekAdi,
      yer: yerPrefix,
      foto: base64Data,
      ekleyen: ADMIN_EMAIL,
      zaman: serverTimestamp()
    });
    const yerBaslik = yerPrefix === "unievi" ? "Üniversite Evi" : "KYK Yurdu";
    toast(`📸 "${yemekAdi}" (${yerBaslik}) fotoğrafı kaydedildi!`);
    return true;
  } catch (err) {
    console.error("Fotoğraf yükleme hatası:", err);
    if (err.code === "permission-denied" || String(err).includes("permission")) {
      alert(
        "⚠️ Firebase Kural İzni Gerekli!\n\n" +
        "Fotoğraf cihazınızda yerel olarak görüntülendi, ancak sunucuda yayınlanabilmesi için:\n\n" +
        "Firebase Console -> Firestore Database -> Kurallar (Rules) sekmesinde yemekFotolari kuralını yayınlamanız gerekmektedir."
      );
    } else {
      toast("Fotoğraf yüklenemedi: " + (err.message || err));
    }
    return false;
  }
}

async function silYemekFoto(yemekAdi, yer = "yurt") {
  if (!isAdmin()) return false;
  const yerPrefix = yer === "unievi" ? "unievi" : "yurt";
  const slug = yerPrefix + "_" + asciiYapici(yemekAdi);
  if (!slug) return false;

  delete window.KC_BULUT_FOTOLAR[slug];
  delete window.KC_BULUT_FOTOLAR[asciiYapici(yemekAdi)];
  try {
    localStorage.setItem("kc-bulut-fotolar", JSON.stringify(window.KC_BULUT_FOTOLAR));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent("kc-fotolar-guncellendi"));

  try {
    const ref = doc(db, "yemekFotolari", slug);
    await deleteDoc(ref);
    const yerBaslik = yerPrefix === "unievi" ? "Üniversite Evi" : "KYK Yurdu";
    toast(`🗑️ "${yemekAdi}" (${yerBaslik}) fotoğrafı kaldırıldı.`);
    return true;
  } catch (err) {
    console.error("Fotoğraf silme hatası:", err);
    toast("Silinemedi: " + (err.message || err));
    return false;
  }
}

/* ---------- global admin köprüsü ---------- */
window.KC_ADMIN = {
  isAdmin,
  adminGirisYap,
  adminCikisYap,
  yukleYemekFoto,
  silYemekFoto,
  getDb: () => db,
  getAuth: () => auth,
  ADMIN_EMAIL
};

/* ---------- başlat ---------- */
function tara() { document.querySelectorAll(".degerlendir").forEach(kur); }
new MutationObserver(ml => {
  for (const m of ml) {
    if (m.type === "attributes" && m.target.classList.contains("degerlendir")) kur(m.target);
    else if (m.type === "childList") m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.classList.contains("degerlendir")) kur(n); else n.querySelectorAll && n.querySelectorAll(".degerlendir").forEach(kur); } });
  }
}).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-menu"] });

onAuthStateChanged(auth, u => {
  ben = u;
  try { if (u && u.email) localStorage.setItem("kc-eposta", u.email); } catch (e) {}
  window.dispatchEvent(new CustomEvent("kc-auth-degisti", { detail: { user: u, admin: isAdmin() } }));
  kutular.forEach((d, el) => {
    oyDinleVeSay(el);
    if (d.acik) panelCiz(el);
  });
});

tara();

/* ---------- gizli yönetici erişimi (#admin, logoya 4 tık veya Ctrl+Shift+A) ---------- */
function gizliAdminKontrol() {
  const h = location.hash, q = location.search;
  if (h === "#admin" || q.includes("admin=1") || q.includes("admin")) {
    if (!isAdmin()) {
      adminGirisYap();
    }
    if (h === "#admin") {
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    }
  }
}
window.addEventListener("hashchange", gizliAdminKontrol);
setTimeout(gizliAdminKontrol, 300);

window.addEventListener("keydown", e => {
  if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
    e.preventDefault();
    if (!isAdmin()) adminGirisYap();
    else toast("Zaten yönetici girişi yapılmış durumda.");
  }
});

let logoTikSayi = 0, logoZaman = 0;
document.addEventListener("click", e => {
  if (e.target && e.target.closest && e.target.closest(".logo, .logo-ikon, .logo-metin")) {
    const simdi = Date.now();
    if (simdi - logoZaman > 2500) logoTikSayi = 0;
    logoZaman = simdi;
    logoTikSayi++;
    if (logoTikSayi >= 4) {
      logoTikSayi = 0;
      if (!isAdmin()) adminGirisYap();
    }
  }
});

