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
.degerlendir{margin-top:14px;border-top:1px solid var(--cizgi,#e6e9f2);padding-top:14px}
.degerlendir[data-menu=""]{display:none}
.dg-bar{display:flex;gap:10px 12px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.dg-sol{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.dg-puan-alani{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.9);padding:5px 12px;border-radius:999px;border:1px solid var(--cizgi,#e3e7f3)}
.dg-yildizlar{display:inline-flex;align-items:center;gap:2px}
.dg-star{background:none;border:0;padding:0 1px;font-size:22px;line-height:1;color:#c9d0e2;cursor:pointer;transition:transform .12s,color .12s;user-select:none}
.dg-star:hover,.dg-star.aktif{color:#f59e0b;transform:scale(1.22)}
.dg-star.secili{color:#f59e0b}
.dg-puan-bilgi{font-size:12.5px;font-weight:700;color:var(--soluk,#6b7390);display:inline-flex;align-items:baseline;gap:4px}
.dg-puan-bilgi b{color:#d97706;font-size:13.5px;font-weight:800}
.dg-puan-bilgi small{font-size:11.5px;font-weight:600;color:var(--soluk,#8a90a8)}
.dg-reaksiyonlar{display:inline-flex;gap:6px;align-items:center}
.dg-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--cizgi,#e3e7f3);background:#fff;color:var(--soluk,#6b7390);
  font:700 12.5px var(--font,inherit);padding:6px 11px;border-radius:99px;cursor:pointer;transition:transform .15s,background .15s,color .15s}
.dg-btn svg{width:15px;height:15px}
.dg-btn:active{transform:scale(.94)}
.dg-btn.secili.iyi{background:#e7f8ee;color:#1a9d55;border-color:#bfe9d1}
.dg-btn.secili.kotu{background:#fdebec;color:#d23b4b;border-color:#f5c6cc}
.dg-btn.yorum{margin-left:auto}
.dg-btn.yorum.acik{background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);border-color:transparent}
.dg-panel{margin-top:14px}
.dg-ad{display:block;width:100%;margin-bottom:8px;border:1px solid var(--cizgi,#e3e7f3);border-radius:12px;padding:9px 12px;font:600 14px var(--font,inherit);color:var(--yazi,#141b34);background:#fff;box-sizing:border-box}
.dg-form{display:flex;gap:8px;align-items:flex-end}
.dg-form textarea{flex:1;min-height:42px;max-height:140px;resize:vertical;border:1px solid var(--cizgi,#e3e7f3);border-radius:14px;padding:10px 12px;font:500 14px var(--font,inherit);color:var(--yazi,#141b34);background:#fff}
.dg-form button{border:0;border-radius:14px;padding:11px 14px;background:var(--mavi,#3b5bfd);color:#fff;font:700 13px var(--font,inherit);cursor:pointer}
.dg-liste{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:12px}
.dg-y{background:#fff;border:1px solid var(--cizgi,#e6e9f2);border-radius:14px;padding:10px 12px}
.dg-y-ust{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px}
.dg-y b{font-size:13.5px;color:var(--yazi,#141b34)}
.dg-y time{font-size:11.5px;color:var(--soluk,#8a90a8);font-weight:600}
.dg-y p{margin:4px 0 6px;font-size:14px;line-height:1.5;color:var(--yazi,#141b34);white-space:pre-wrap;word-break:break-word}
.dg-y .eylem{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.dg-y .eylem button{border:0;background:none;padding:0;font:700 12px var(--font,inherit);color:var(--soluk,#8a90a8);cursor:pointer}
.dg-y .eylem button.yanitla{color:var(--mavi,#3b5bfd)}
.dg-y-begen{display:inline-flex;align-items:center;gap:4px;background:rgba(20,27,52,.04);color:var(--soluk,#6b7390);
  border:0;border-radius:99px;padding:3px 9px;font:700 11.5px var(--font,inherit);cursor:pointer;transition:all .15s}
.dg-y-begen.secili{background:#ffebee;color:#e11d48}
.dg-yanitlar{list-style:none;margin:8px 0 0 14px;padding:0 0 0 10px;border-left:2px solid var(--mavi-acik,#e6ebff);display:grid;gap:8px}
.dg-yanit-form{margin-top:8px}
.dg-bos{font-size:13px;color:var(--soluk,#8a90a8);font-weight:600;margin:10px 2px 0}

/* Admin Stilleri */
.dg-admin-serit{display:flex;align-items:center;justify-content:space-between;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:8px 12px;font-size:12.5px;color:#92400e;font-weight:700;margin-bottom:10px}
.dg-admin-giris-serit{text-align:right;margin-bottom:8px}
.dg-giris-link{border:0;background:none;color:var(--soluk,#8a90a8);font:600 11.5px var(--font,inherit);cursor:pointer;text-decoration:underline}
.dg-giris-link:hover{color:var(--mavi,#3b5bfd)}
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
    const s = await getDoc(doc(db, "engelliler", uid));
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
      const p = typeof data.puan === "number" ? data.puan : (typeof data.d === "number" && data.d >= 1 && data.d <= 5 ? data.d : 0);
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
        else if (typeof myData.d === "number" && myData.d >= 1 && myData.d <= 5) d.benimPuan = myData.d;
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
    await setDoc(ref, { d: yeni, puan: yeni, zaman: serverTimestamp() }, { merge: true });
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
    await setDoc(ref, { d: yeni, reaksiyon: yeni, zaman: serverTimestamp() }, { merge: true });
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
  return `<div class="dg-form${yanit ? " dg-yanit-form" : ""}"><textarea maxlength="500" rows="1" placeholder="${yanit ? "Yanıtını yaz…" : "Bu menü hakkında ne düşünüyorsun?"}"></textarea><button>Gönder</button></div>`;
}

function panelCiz(el) {
  const d = kutular.get(el); if (!d) return;
  const p = el.querySelector(".dg-panel");
  const adminSerit = isAdmin()
    ? `<div class="dg-admin-serit">
        <span>👑 Yönetici Modu: <b>${esc(ADMIN_EMAIL)}</b></span>
        <button type="button" class="dg-cikis-btn" id="dg-admin-cikis">Çıkış</button>
       </div>`
    : `<div class="dg-admin-giris-serit">
        <button type="button" class="dg-giris-link" id="dg-admin-giris">🔑 Yönetici Girişi</button>
       </div>`;

  p.innerHTML = adminSerit +
    `<input class="dg-ad" maxlength="40" placeholder="İsmin (isteğe bağlı, boş bırakırsan Anonim)" value="${esc(adOku())}">
     <div id="dg-ana-form-kutu">${formHtml(false)}</div>
     <ul class="dg-liste"></ul>`;

  const btnGiris = p.querySelector("#dg-admin-giris");
  if (btnGiris) btnGiris.onclick = adminGirisYap;
  const btnCikis = p.querySelector("#dg-admin-cikis");
  if (btnCikis) btnCikis.onclick = adminCikisYap;

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
  if (!d.yorumlar.length) { ul.innerHTML = '<li class="dg-bos">Henüz yorum yok. İlk yorumu sen yap!</li>'; return; }

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
      <div class="dg-y-ust"><b>${esc(y.ad)}</b><time>${zamanFarki(y.zaman)}</time></div>
      <p>${esc(y.metin)}</p>
      <div class="eylem">
        <button class="dg-y-begen${benBegendim ? " secili" : ""}" data-yorum-begen="${esc(y.id)}" aria-label="Yorumu beğen">❤️ <span>${begeniSayi}</span></button>
        <button class="yanitla" data-yanit="${esc(y.id)}">Yanıtla</button>
        ${silBtn}
        ${banBtn}
        <button data-bildir="${esc(y.id)}">Bildir</button>
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
      const banRef = doc(db, "engelliler", hedefUid);
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

async function yukleYemekFoto(yemekAdi, base64Data) {
  if (!isAdmin()) {
    alert("Yalnızca yönetici (yunusemredemir051@gmail.com) fotoğraf yükleyebilir. Lütfen önce yorumlar altından yönetici girişi yapın.");
    return false;
  }
  const slug = asciiYapici(yemekAdi);
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
      foto: base64Data,
      ekleyen: ADMIN_EMAIL,
      zaman: serverTimestamp()
    });
    toast(`📸 "${yemekAdi}" fotoğrafı kaydedildi ve yayında!`);
    return true;
  } catch (err) {
    console.error("Fotoğraf yükleme hatası:", err);
    if (err.code === "permission-denied" || String(err).includes("permission")) {
      alert(
        "⚠️ Firebase Kural İzni Gerekli!\n\n" +
        "Fotoğraf cihazınızda yerel olarak görüntülendi, ancak herkese açık olarak sunucuda yayınlanabilmesi için:\n\n" +
        "Firebase Console -> Firestore Database -> Kurallar (Rules) sekmesinde yemekFotolari kuralını yayınlamanız gerekmektedir."
      );
    } else {
      toast("Fotoğraf yüklenemedi: " + (err.message || err));
    }
    return false;
  }
}

/* ---------- global admin köprüsü ---------- */
window.KC_ADMIN = {
  isAdmin,
  adminGirisYap,
  adminCikisYap,
  yukleYemekFoto,
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
  window.dispatchEvent(new CustomEvent("kc-auth-degisti", { detail: { user: u, admin: isAdmin() } }));
  kutular.forEach((d, el) => {
    oyDinleVeSay(el);
    if (d.acik) panelCiz(el);
  });
});

tara();
