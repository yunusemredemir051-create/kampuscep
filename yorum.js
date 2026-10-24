/* KampüsCepte — yemek menüsü değerlendirme: 5 yıldızlı puanlama, beğen / beğenme, yorumlar ve yorum beğenisi.
   MENU_ID: "kyk_<YYYY-AA-GG>_<kahvalti|aksam>" ya da "unievi_<YYYY-AA-GG>". */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, addDoc, onSnapshot, query, where,
         getCountFromServer, getDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

if (!window.FIREBASE_AYAR) throw new Error("firebase-ayar.js yok");
const app = getApps()[0] || initializeApp(window.FIREBASE_AYAR);
const auth = getAuth(app); auth.languageCode = "tr";
const db = getFirestore(app);
let ben = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MENU_RE = /^[a-z0-9-]+_\d{4}-\d{2}-\d{2}(_(kahvalti|aksam))?$/;

/* ---------- kimlik: hesap gerekmez; arka planda anonim oturum açılır ---------- */
async function kimlik() {
  if (auth.currentUser) return true;
  try { await signInAnonymously(auth); return true; }
  catch (e) { console.error(e); toast("Bağlantı kurulamadı, tekrar dener misin?"); return false; }
}
const adOku = () => { try { return localStorage.getItem("kc-ad") || ""; } catch (e) { return ""; } };
const adYaz = a => { try { localStorage.setItem("kc-ad", a); } catch (e) {} };
function toast(m) {
  let t = document.getElementById("dg-toast");
  if (!t) { t = document.createElement("div"); t.id = "dg-toast"; document.body.appendChild(t); }
  t.textContent = m; t.classList.add("goster"); clearTimeout(toast.z); toast.z = setTimeout(() => t.classList.remove("goster"), 2800);
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
.dg-form button:disabled{opacity:.5}
.dg-liste{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:10px}
.dg-y{background:rgba(255,255,255,.8);border:1px solid var(--cizgi,#eef0f6);border-radius:14px;padding:10px 12px}
.dg-y .ust{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.dg-y b{font-size:13.5px;color:var(--yazi,#141b34)}
.dg-y time{font-size:11.5px;color:var(--soluk,#8a90a8);font-weight:600}
.dg-y p{margin:4px 0 6px;font-size:14px;line-height:1.5;color:var(--yazi,#141b34);white-space:pre-wrap;word-break:break-word}
.dg-y .eylem{display:flex;gap:12px;align-items:center}
.dg-y .eylem button{border:0;background:none;padding:0;font:700 12px var(--font,inherit);color:var(--soluk,#8a90a8);cursor:pointer}
.dg-y .eylem button.yanitla{color:var(--mavi,#3b5bfd)}
.dg-y-begen{display:inline-flex;align-items:center;gap:4px;background:rgba(20,27,52,.04);color:var(--soluk,#6b7390);
  border:0;padding:3px 9px;border-radius:99px;font:700 11.5px var(--font,inherit);cursor:pointer;transition:all .15s}
.dg-y-begen:hover{background:#ffe4e6;color:#e11d48}
.dg-y-begen.begenildi{background:#ffe4e6;color:#e11d48;font-weight:800}
.dg-yanitlar{list-style:none;margin:8px 0 0 14px;padding:0 0 0 10px;border-left:2px solid var(--mavi-acik,#e6ebff);display:grid;gap:8px}
.dg-yanit-form{margin-top:8px}
.dg-bos{font-size:13px;color:var(--soluk,#8a90a8);font-weight:600;margin:10px 2px 0}
#dg-toast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,20px);opacity:0;z-index:9999;background:#141b34;color:#fff;
  font:600 13px/1.4 var(--font,system-ui);padding:10px 14px;border-radius:14px;max-width:88vw;text-align:center;transition:.25s;pointer-events:none}
#dg-toast.goster{opacity:1;transform:translate(-50%,0)}

[data-tema="koyu"] .dg-puan-alani{background:#1f263d;border-color:#2e3758}
[data-tema="koyu"] .dg-star{color:#444d6e}
[data-tema="koyu"] .dg-star:hover,[data-tema="koyu"] .dg-star.aktif,[data-tema="koyu"] .dg-star.secili{color:#fbbf24}
[data-tema="koyu"] .dg-puan-bilgi b{color:#fbbf24}
[data-tema="koyu"] .dg-btn{background:#1a2035;border-color:#2e3758;color:#a0aec0}
[data-tema="koyu"] .dg-y{background:#1a2035;border-color:#2e3758}
[data-tema="koyu"] .dg-y-begen{background:rgba(255,255,255,.08);color:#a0aec0}
[data-tema="koyu"] .dg-y-begen.begenildi{background:#3b1e2b;color:#fb7185}
`;
document.head.appendChild(css);

const IKON = {
  iyi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3zm0 0 4-7a2.5 2.5 0 0 1 3 2.6L13.4 9H19a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 17.7 21H7"/></svg>',
  kotu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3zm0 0-4 7a2.5 2.5 0 0 1-3-2.6l.6-3.4H5a2 2 0 0 1-2-2.3l1.3-8A2 2 0 0 1 6.3 3H17"/></svg>',
  yorum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>'
};

function zamanYaz(ts) {
  if (!ts || !ts.toDate) return "az önce";
  const d = ts.toDate(), s = (Date.now() - d) / 1000;
  if (s < 60) return "az önce";
  if (s < 3600) return Math.floor(s / 60) + " dk önce";
  if (s < 86400) return Math.floor(s / 3600) + " sa önce";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

/* ---------- her menü kutusu ---------- */
const kutular = new Map();

function kur(el) {
  const id = el.dataset.menu || "";
  const eski = kutular.get(el);
  if (eski && eski.id === id) return;
  if (eski && eski.dinle) eski.dinle();
  if (!MENU_RE.test(id)) { el.innerHTML = ""; kutular.delete(el); return; }

  const d = {
    id,
    benimPuan: 0,
    benimReaksiyon: 0,
    sayi: { starToplam: 0, starAdet: 0, starOrt: 0, iyi: 0, kotu: 0, yorum: 0 },
    acik: false,
    yorumlar: [],
    yanit: null,
    dinle: null
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

  // Yıldız olayları
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

  // Beğen / Beğenme olayları
  el.querySelectorAll("[data-reak]").forEach(b => b.onclick = () => reaksiyonVer(el, +b.dataset.reak));

  // Yorumlar aç/kapa
  el.querySelector(".dg-btn.yorum").onclick = () => panelAc(el, !d.acik);

  sayilariGetir(el);
}

async function sayilariGetir(el) {
  const d = kutular.get(el); if (!d) return;
  const oylarRef = collection(db, "menuler", d.id, "oylar");
  try {
    const [snapOylar, c] = await Promise.all([
      getDocs(oylarRef),
      d.acik ? Promise.resolve(null) : getCountFromServer(collection(db, "menuler", d.id, "yorumlar"))
    ]);
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
    if (c) d.sayi.yorum = c.data().count;

    // Kendi oyumuzu bul (Local + Firebase)
    let localPuan = 0, localReak = 0;
    try {
      localPuan = parseInt(localStorage.getItem("kc-puan-" + d.id)) || 0;
      localReak = parseInt(localStorage.getItem("kc-reak-" + d.id)) || 0;
    } catch (e) {}

    if (ben) {
      const s = await getDoc(doc(oylarRef, ben.uid));
      if (s.exists()) {
        const myData = s.data();
        if (typeof myData.puan === "number") localPuan = myData.puan;
        else if (typeof myData.d === "number" && myData.d >= 1 && myData.d <= 5) localPuan = myData.d;
        if (typeof myData.reaksiyon === "number") localReak = myData.reaksiyon;
        else if (myData.d === 1 || myData.d === -1) localReak = myData.d;
      }
    }
    d.benimPuan = localPuan;
    d.benimReaksiyon = localReak;
  } catch (e) {
    console.warn("değerlendirme okunamadı", e);
    try {
      d.benimPuan = parseInt(localStorage.getItem("kc-puan-" + d.id)) || 0;
      d.benimReaksiyon = parseInt(localStorage.getItem("kc-reak-" + d.id)) || 0;
    } catch (err) {}
  }
  barCiz(el);
}

function barCiz(el) {
  const d = kutular.get(el); if (!d) return;

  // Yıldızlar
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

  // Beğen / Beğenme
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

  // Yorumlar
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
  try { localStorage.setItem("kc-puan-" + d.id, yeni); } catch (e) {}

  if (onceki > 0 && yeni === 0) {
    d.sayi.starToplam -= onceki;
    d.sayi.starAdet--;
  } else if (onceki > 0 && yeni > 0) {
    d.sayi.starToplam += (yeni - onceki);
  } else if (onceki === 0 && yeni > 0) {
    d.sayi.starToplam += yeni;
    d.sayi.starAdet++;
  }
  d.sayi.starOrt = d.sayi.starAdet > 0 ? (d.sayi.starToplam / d.sayi.starAdet).toFixed(1) : 0;
  barCiz(el);

  if (yeni > 0) toast(`${yeni} yıldız verdin! ⭐`);

  if (!(await kimlik())) return;
  const ref = doc(db, "menuler", d.id, "oylar", auth.currentUser.uid);
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

  if (onceki === 1) d.sayi.iyi--;
  if (onceki === -1) d.sayi.kotu--;
  if (yeni === 1) d.sayi.iyi++;
  if (yeni === -1) d.sayi.kotu++;

  d.benimReaksiyon = yeni;
  try { localStorage.setItem("kc-reak-" + d.id, yeni); } catch (e) {}
  barCiz(el);

  if (!(await kimlik())) return;
  const ref = doc(db, "menuler", d.id, "oylar", auth.currentUser.uid);
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
  d.dinle = onSnapshot(collection(db, "menuler", d.id, "yorumlar"), s => {
    d.yorumlar = s.docs.map(x => ({ id: x.id, ...x.data() }));
    d.sayi.yorum = d.yorumlar.length; barCiz(el);
    listeCiz(el);
  }, e => { console.error(e); p.querySelector(".dg-liste").innerHTML = '<li class="dg-bos">Yorumlar yüklenemedi.</li>'; });
}

function formHtml(yanit) {
  return `<div class="dg-form${yanit ? " dg-yanit-form" : ""}"><textarea maxlength="500" rows="1" placeholder="${yanit ? "Yanıtını yaz…" : "Bu menü hakkında ne düşünüyorsun?"}"></textarea><button>Gönder</button></div>`;
}

function panelCiz(el) {
  const p = el.querySelector(".dg-panel");
  p.innerHTML = `<input class="dg-ad" maxlength="40" placeholder="Adın soyadın" autocomplete="name" value="${esc(adOku())}">${formHtml(false)}`
    + `<ul class="dg-liste"><li class="dg-bos">Yükleniyor…</li></ul>`;
  const f = p.querySelector(":scope > .dg-form"); if (f) formBagla(el, f, "");
  listeCiz(el);
}

function formBagla(el, f, ust) {
  const ta = f.querySelector("textarea"), b = f.querySelector("button");
  ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = Math.min(140, ta.scrollHeight) + "px"; });
  b.onclick = async () => {
    const metin = ta.value.trim();
    if (!metin) return;
    const adKutu = el.querySelector(".dg-ad"), ad = (adKutu ? adKutu.value : adOku()).trim().replace(/\s+/g, " ");
    if (ad.length < 2) { toast("Önce adını yaz."); if (adKutu) adKutu.focus(); return; }
    adYaz(ad);
    if (!(await kimlik())) return;
    const d = kutular.get(el); b.disabled = true;
    try {
      await addDoc(collection(db, "menuler", d.id, "yorumlar"), { uid: auth.currentUser.uid, ad, metin: metin.slice(0, 500), ust, zaman: serverTimestamp(), begeni: 0 });
      ta.value = ""; ta.style.height = "";
      if (ust) { d.yanit = null; listeCiz(el); }
    } catch (e) { console.error(e); toast("Yorum gönderilemedi, tekrar dener misin?"); }
    b.disabled = false;
  };
}

function listeCiz(el) {
  const d = kutular.get(el); if (!d || !d.acik) return;
  const ul = el.querySelector(".dg-liste"); if (!ul) return;
  const ms = y => (y.zaman && y.zaman.toMillis) ? y.zaman.toMillis() : Date.now();
  const ana = d.yorumlar.filter(y => !y.ust).sort((a, b) => ms(b) - ms(a));
  if (!ana.length) { ul.innerHTML = '<li class="dg-bos">Henüz yorum yok. İlk yorumu sen yaz!</li>'; return; }

  const tek = y => {
    const benBegenmismiyim = localStorage.getItem("kc-yb-" + y.id) === "1";
    return `<div class="ust"><b>${esc(y.ad)}</b><time>${zamanYaz(y.zaman)}</time></div><p>${esc(y.metin)}</p>
      <div class="eylem">
        <button class="dg-y-begen ${benBegenmismiyim ? "begenildi" : ""}" data-yorum-begen="${y.id}" title="Yorumu beğen">
          ❤️ <span>${y.begeni || 0}</span>
        </button>
        ${y.ust ? "" : `<button class="yanitla" data-yanit="${y.id}">Yanıtla</button>`}
        ${ben && ben.uid === y.uid ? `<button data-sil="${y.id}">Sil</button>` : `<button data-bildir="${y.id}">Bildir</button>`}
      </div>`;
  };

  ul.innerHTML = ana.map(y => {
    const yanitlar = d.yorumlar.filter(x => x.ust === y.id).sort((a, b) => ms(a) - ms(b));
    return `<li class="dg-y">${tek(y)}
      ${yanitlar.length ? `<ul class="dg-yanitlar">${yanitlar.map(x => `<li class="dg-y">${tek(x)}</li>`).join("")}</ul>` : ""}
      ${d.yanit === y.id ? formHtml(true) : ""}</li>`;
  }).join("");

  // Yorum beğen butonu (Yalnızca beğenme, beğenmeme yok)
  ul.querySelectorAll("[data-yorum-begen]").forEach(btn => btn.onclick = async () => {
    const yid = btn.dataset.yorumBegen;
    const key = "kc-yb-" + yid;
    let begenildi = false;
    try { begenildi = localStorage.getItem(key) === "1"; } catch (e) {}

    const yorum = d.yorumlar.find(x => x.id === yid);
    if (!yorum) return;

    const yeniSayi = begenildi ? Math.max(0, (yorum.begeni || 0) - 1) : (yorum.begeni || 0) + 1;
    yorum.begeni = yeniSayi;
    try { localStorage.setItem(key, begenildi ? "0" : "1"); } catch (e) {}
    listeCiz(el);

    if (!(await kimlik())) return;
    try {
      const yRef = doc(db, "menuler", d.id, "yorumlar", yid);
      await setDoc(yRef, { begeni: yeniSayi }, { merge: true });
    } catch (e) {
      console.warn("Yorum beğeni Firestore hatası:", e);
    }
  });

  ul.querySelectorAll("[data-yanit]").forEach(b => b.onclick = async () => {
    d.yanit = d.yanit === b.dataset.yanit ? null : b.dataset.yanit; listeCiz(el);
    const ta = ul.querySelector(".dg-yanit-form textarea"); if (ta) ta.focus();
  });
  const yf = ul.querySelector(".dg-yanit-form"); if (yf) formBagla(el, yf, d.yanit);
  ul.querySelectorAll("[data-sil]").forEach(b => b.onclick = async () => {
    if (!confirm("Yorumun silinsin mi?")) return;
    try {
      for (const x of d.yorumlar.filter(x => x.ust === b.dataset.sil && x.uid === auth.currentUser.uid)) await deleteDoc(doc(db, "menuler", d.id, "yorumlar", x.id));
      await deleteDoc(doc(db, "menuler", d.id, "yorumlar", b.dataset.sil));
    } catch (e) { console.error(e); toast("Silinemedi, tekrar dener misin?"); }
  });
  ul.querySelectorAll("[data-bildir]").forEach(b => b.onclick = async () => {
    if (!(await kimlik())) return;
    const neden = prompt("Bu yorumu neden bildiriyorsun? (kısaca)");
    if (!neden) return;
    try { await addDoc(collection(db, "sikayetler"), { ilan: "yorum:" + d.id + "/" + b.dataset.bildir, neden: neden.slice(0, 300), uid: auth.currentUser.uid, zaman: serverTimestamp() }); toast("Teşekkürler, inceleyeceğiz."); }
    catch (e) { console.error(e); toast("Gönderilemedi, tekrar dener misin?"); }
  });
}

/* ---------- başlat ---------- */
function tara() { document.querySelectorAll(".degerlendir").forEach(kur); }
new MutationObserver(ml => {
  for (const m of ml) {
    if (m.type === "attributes" && m.target.classList && m.target.classList.contains("degerlendir")) kur(m.target);
    else if (m.type === "childList") m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.classList.contains("degerlendir")) kur(n); else n.querySelectorAll && n.querySelectorAll(".degerlendir").forEach(kur); } });
  }
}).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-menu"] });
onAuthStateChanged(auth, u => {
  ben = u;
  kutular.forEach((d, el) => { sayilariGetir(el); if (d.acik) listeCiz(el); });
});
tara();
