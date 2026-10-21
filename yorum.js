/* KampüsCepte — yemek menüsü değerlendirme: beğen / beğenme, yorum ve yanıt.
   Sayfa, menü listesinin hemen altına <div class="degerlendir" data-menu="MENU_ID"></div> koyar
   (data-menu boşsa bölüm gizlenir). Bu dosya o kutuları bulup doldurur; data-menu değişince yeniler.
   MENU_ID: "<yurt>_<YYYY-AA-GG>_<kahvalti|aksam>" ya da "unievi_<YYYY-AA-GG>". */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, addDoc, onSnapshot, query, where,
         getCountFromServer, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

if (!window.FIREBASE_AYAR) throw new Error("firebase-ayar.js yok");
const app = getApps()[0] || initializeApp(window.FIREBASE_AYAR);
const auth = getAuth(app); auth.languageCode = "tr";
const db = getFirestore(app);
let ben = null;

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MENU_RE = /^[a-z0-9-]+_\d{4}-\d{2}-\d{2}(_(kahvalti|aksam))?$/;

/* ---------- kimlik: hesap gerekmez; arka planda anonim oturum açılır (kendi yorumunu silebilmek, cihaz başına bir oy için) ---------- */
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
.degerlendir{margin-top:12px;border-top:1px solid var(--cizgi,#e6e9f2);padding-top:12px}
.degerlendir[data-menu=""]{display:none}
.dg-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.dg-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--cizgi,#e3e7f3);background:#fff;color:var(--soluk,#6b7390);
  font:700 13px var(--font,inherit);padding:7px 12px;border-radius:99px;cursor:pointer;transition:transform .15s,background .15s,color .15s}
.dg-btn svg{width:16px;height:16px}
.dg-btn:active{transform:scale(.94)}
.dg-btn.secili.iyi{background:#e7f8ee;color:#1a9d55;border-color:#bfe9d1}
.dg-btn.secili.kotu{background:#fdebec;color:#d23b4b;border-color:#f5c6cc}
.dg-btn.yorum{margin-left:auto}
.dg-btn.yorum.acik{background:var(--mavi-acik,#e6ebff);color:var(--mavi,#3b5bfd);border-color:transparent}
.dg-panel{margin-top:12px}
.dg-ad{display:block;width:100%;margin-bottom:8px;border:1px solid var(--cizgi,#e3e7f3);border-radius:12px;padding:9px 12px;font:600 14px var(--font,inherit);color:var(--yazi,#141b34);background:#fff;box-sizing:border-box}
.dg-giris{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12.5px;color:var(--soluk,#6b7390);font-weight:600;margin-bottom:8px}
.dg-giris button{border:0;background:none;color:var(--mavi,#3b5bfd);font:700 12.5px var(--font,inherit);cursor:pointer;padding:2px}
.dg-form{display:flex;gap:8px;align-items:flex-end}
.dg-form textarea{flex:1;min-height:42px;max-height:140px;resize:vertical;border:1px solid var(--cizgi,#e3e7f3);border-radius:14px;padding:10px 12px;font:500 14px var(--font,inherit);color:var(--yazi,#141b34);background:#fff}
.dg-form button{border:0;border-radius:14px;padding:11px 14px;background:var(--mavi,#3b5bfd);color:#fff;font:700 13px var(--font,inherit);cursor:pointer}
.dg-form button:disabled{opacity:.5}
.dg-gir-btn{width:100%;border:0;border-radius:14px;padding:12px;background:var(--mavi,#3b5bfd);color:#fff;font:700 14px var(--font,inherit);cursor:pointer}
.dg-liste{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:10px}
.dg-y{background:rgba(255,255,255,.75);border:1px solid var(--cizgi,#eef0f6);border-radius:14px;padding:10px 12px}
.dg-y .ust{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.dg-y b{font-size:13.5px;color:var(--yazi,#141b34)}
.dg-y time{font-size:11.5px;color:var(--soluk,#8a90a8);font-weight:600}
.dg-y p{margin:4px 0 6px;font-size:14px;line-height:1.5;color:var(--yazi,#141b34);white-space:pre-wrap;word-break:break-word}
.dg-y .eylem{display:flex;gap:12px}
.dg-y .eylem button{border:0;background:none;padding:0;font:700 12px var(--font,inherit);color:var(--soluk,#8a90a8);cursor:pointer}
.dg-y .eylem button.yanitla{color:var(--mavi,#3b5bfd)}
.dg-yanitlar{list-style:none;margin:8px 0 0 14px;padding:0 0 0 10px;border-left:2px solid var(--mavi-acik,#e6ebff);display:grid;gap:8px}
.dg-yanit-form{margin-top:8px}
.dg-bos{font-size:13px;color:var(--soluk,#8a90a8);font-weight:600;margin:10px 2px 0}
#dg-toast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,20px);opacity:0;z-index:9999;background:#141b34;color:#fff;
  font:600 13px/1.4 var(--font,system-ui);padding:10px 14px;border-radius:14px;max-width:88vw;text-align:center;transition:.25s;pointer-events:none}
#dg-toast.goster{opacity:1;transform:translate(-50%,0)}`;
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
const kutular = new Map();   // element -> durum

function kur(el) {
  const id = el.dataset.menu || "";
  const eski = kutular.get(el);
  if (eski && eski.id === id) return;
  if (eski && eski.dinle) eski.dinle();
  if (!MENU_RE.test(id)) { el.innerHTML = ""; kutular.delete(el); return; }
  const d = { id, benimOy: 0, sayi: { iyi: 0, kotu: 0, yorum: 0 }, acik: false, yorumlar: [], yanit: null, dinle: null };
  kutular.set(el, d);
  el.innerHTML = `<div class="dg-bar">
      <button class="dg-btn iyi" data-oy="1" aria-label="Beğendim">${IKON.iyi}<span>0</span></button>
      <button class="dg-btn kotu" data-oy="-1" aria-label="Beğenmedim">${IKON.kotu}<span>0</span></button>
      <button class="dg-btn yorum" aria-expanded="false">${IKON.yorum}Yorumlar <span>0</span></button>
    </div><div class="dg-panel" hidden></div>`;
  el.querySelectorAll("[data-oy]").forEach(b => b.onclick = () => oyVer(el, +b.dataset.oy));
  el.querySelector(".dg-btn.yorum").onclick = () => panelAc(el, !d.acik);
  sayilariGetir(el);
}

async function sayilariGetir(el) {
  const d = kutular.get(el); if (!d) return;
  const oylar = collection(db, "menuler", d.id, "oylar");
  try {
    const [a, b, c] = await Promise.all([
      getCountFromServer(query(oylar, where("d", "==", 1))),
      getCountFromServer(query(oylar, where("d", "==", -1))),
      d.acik ? Promise.resolve(null) : getCountFromServer(collection(db, "menuler", d.id, "yorumlar"))
    ]);
    if (kutular.get(el) !== d) return;
    d.sayi.iyi = a.data().count; d.sayi.kotu = b.data().count;
    if (c) d.sayi.yorum = c.data().count;
    if (ben) { const s = await getDoc(doc(oylar, ben.uid)); d.benimOy = s.exists() ? s.data().d : 0; } else d.benimOy = 0;
  } catch (e) { console.warn("değerlendirme okunamadı", e); }
  barCiz(el);
}
function barCiz(el) {
  const d = kutular.get(el); if (!d) return;
  const [iyi, kotu, yorum] = el.querySelectorAll(".dg-bar button");
  iyi.querySelector("span").textContent = d.sayi.iyi;
  kotu.querySelector("span").textContent = d.sayi.kotu;
  yorum.querySelector("span").textContent = d.sayi.yorum;
  iyi.classList.toggle("secili", d.benimOy === 1); kotu.classList.toggle("secili", d.benimOy === -1);
  iyi.setAttribute("aria-pressed", d.benimOy === 1); kotu.setAttribute("aria-pressed", d.benimOy === -1);
  yorum.classList.toggle("acik", d.acik); yorum.setAttribute("aria-expanded", d.acik);
}

async function oyVer(el, deger) {
  const d = kutular.get(el); if (!d) return;
  if (!(await kimlik())) return;
  const ref = doc(db, "menuler", d.id, "oylar", auth.currentUser.uid);
  const onceki = d.benimOy, yeni = onceki === deger ? 0 : deger;
  // anında göster, sonra kaydet
  if (onceki === 1) d.sayi.iyi--; if (onceki === -1) d.sayi.kotu--;
  if (yeni === 1) d.sayi.iyi++; if (yeni === -1) d.sayi.kotu++;
  d.benimOy = yeni; barCiz(el);
  try { yeni ? await setDoc(ref, { d: yeni }) : await deleteDoc(ref); }
  catch (e) { console.error(e); toast("Oyun kaydedilemedi, tekrar dener misin?"); sayilariGetir(el); }
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
      await addDoc(collection(db, "menuler", d.id, "yorumlar"), { uid: auth.currentUser.uid, ad, metin: metin.slice(0, 500), ust, zaman: serverTimestamp() });
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
  const tek = y => `<div class="ust"><b>${esc(y.ad)}</b><time>${zamanYaz(y.zaman)}</time></div><p>${esc(y.metin)}</p>
      <div class="eylem">${y.ust ? "" : `<button class="yanitla" data-yanit="${y.id}">Yanıtla</button>`}
      ${ben && ben.uid === y.uid ? `<button data-sil="${y.id}">Sil</button>` : `<button data-bildir="${y.id}">Bildir</button>`}</div>`;
  ul.innerHTML = ana.map(y => {
    const yanitlar = d.yorumlar.filter(x => x.ust === y.id).sort((a, b) => ms(a) - ms(b));
    return `<li class="dg-y">${tek(y)}
      ${yanitlar.length ? `<ul class="dg-yanitlar">${yanitlar.map(x => `<li class="dg-y">${tek(x)}</li>`).join("")}</ul>` : ""}
      ${d.yanit === y.id ? formHtml(true) : ""}</li>`;
  }).join("");
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
