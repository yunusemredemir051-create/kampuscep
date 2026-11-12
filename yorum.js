/* KampüsCepte — yemek menüsü değerlendirme, puanlama ve yorumlar.
   Puanlama & Yıldızlar: Tüm KYK yurtları için tek ortak havuzda toplanır.
   Yorumlar: Her yurda özel olarak ayrılır.
   Sitede yönetici paneli yoktur; moderasyon Firebase konsolundan yapılır. */
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithCredential,
         linkWithPopup, linkWithCredential } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, addDoc, onSnapshot, query, where,
         getCountFromServer, getDoc, getDocs, serverTimestamp, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
/* App Check: istekler yalnızca sitenin kendisinden (reCAPTCHA doğrulamalı gerçek tarayıcıdan) kabul edilir. */
if (!window.__kcAppCheck && window.KC_RECAPTCHA) { try { window.__kcAppCheck = initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(window.KC_RECAPTCHA), isTokenAutoRefreshEnabled: true }); } catch (e) { console.warn("App Check", e); } }
const auth = getAuth(app); auth.languageCode = "tr";
const db = getFirestore(app);
let ben = null;

/* Sitede yönetici paneli yoktur. Yorum silme ve ceza işlemleri yalnızca Firebase konsolundan yapılır. */

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MENU_RE = /^[a-z0-9-]+_\d{4}-\d{2}-\d{2}(_(kahvalti|aksam))?$/;

/* 2 Kasım 2026 spam saldırısı sonrası: yorum yazmak için Google hesabı şart; sunucu her hesaba 30 saniyede 1, günde en çok 20 yorum izni verir.
   Saldırı aralığındaki ve bilinen spam kalıplı yorumlar gösterilmez. */
const YORUM_KAPALI = false;
const YORUM_ARA_SN = 30, YORUM_GUNLUK = 20;
const SPAM_BAS = Date.UTC(2026, 10, 2, 16, 0), SPAM_BIT = Date.UTC(2026, 10, 2, 18, 0);
const SPAM_RE = /bubiryorum|amc[ıi]k|orospu|porno|\bohhh\b|sik(ik|iş|tir)|piç|yarrak|göt(ü|veren)/i;
function spamMi(y) {
  const ms = y && y.zaman && y.zaman.toMillis ? y.zaman.toMillis() : 0;
  if (ms >= SPAM_BAS && ms <= SPAM_BIT) return true;
  return SPAM_RE.test(String((y && y.ad) || "") + " " + String((y && y.metin) || ""));
}

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

/* Aynı menü (aynı yemek listesi) başka günlerde de çıktıysa, o günlerin puan ve beğenileri de bu menüye eklenir.
   Oylar her zaman o günün kaydına yazılır; gösterilirken aynı menünün tüm günleri toplanır. */
function menuImza(liste) {
  return (Array.isArray(liste) ? liste : []).map(s => String(s).toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim()).filter(Boolean).sort().join("|");
}
function menuListesi(oyId) {
  const m = String(oyId || "").match(/^(kyk|unievi)_(\d{4}-\d{2}-\d{2})(?:_(kahvalti|aksam))?$/);
  if (!m) return null;
  try {
    if (m[1] === "kyk" && typeof kykAnaMenu !== "undefined") { const g = kykAnaMenu[m[2]]; return g ? g[m[3] === "kahvalti" ? "kahvalti" : "aksam"] : null; }
    if (m[1] === "unievi" && typeof uniEviMenuleri !== "undefined") return uniEviMenuleri[m[2]] || null;
  } catch (e) {}
  return null;
}
function ayniMenuGunleri(oyId) {
  const m = String(oyId || "").match(/^(kyk|unievi)_(\d{4}-\d{2}-\d{2})(?:_(kahvalti|aksam))?$/);
  const imza = menuImza(menuListesi(oyId));
  if (!m || !imza) return [];
  let tarihler = [];
  try {
    if (m[1] === "kyk" && typeof kykAnaMenu !== "undefined") tarihler = Object.keys(kykAnaMenu);
    if (m[1] === "unievi" && typeof uniEviMenuleri !== "undefined") tarihler = Object.keys(uniEviMenuleri);
  } catch (e) {}
  const bugun = new Date().toISOString().slice(0, 10);
  return tarihler.filter(t => /^\d{4}-\d{2}-\d{2}$/.test(t) && t !== m[2] && t <= bugun)
    .map(t => m[1] + "_" + t + (m[3] ? "_" + m[3] : ""))
    .filter(id => menuImza(menuListesi(id)) === imza);
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

/* Google girişi: anonim oturum varsa Google hesabına bağlanır (puan ve beğeniler korunur).
   Android uygulamasında telefonun kendi hesap seçicisi, tarayıcıda Google penceresi kullanılır. */
const googleMu = () => !!(auth.currentUser && !auth.currentUser.isAnonymous);
const yerelUygulama = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication);
async function googleGiris() {
  if (googleMu()) return true;
  try {
    let kimlikBelgesi = null;
    if (yerelUygulama()) {
      const r = await window.Capacitor.Plugins.FirebaseAuthentication.signInWithGoogle({ skipNativeAuth: true });
      const t = r && r.credential && r.credential.idToken;
      if (!t) throw { code: "auth/no-token" };
      kimlikBelgesi = GoogleAuthProvider.credential(t);
    }
    const u = auth.currentUser;
    try {
      if (u && u.isAnonymous) { kimlikBelgesi ? await linkWithCredential(u, kimlikBelgesi) : await linkWithPopup(u, new GoogleAuthProvider()); }
      else { kimlikBelgesi ? await signInWithCredential(auth, kimlikBelgesi) : await signInWithPopup(auth, new GoogleAuthProvider()); }
    } catch (e) {
      // Bu Google hesabı daha önce kullanıldıysa doğrudan o hesapla giriş yapılır
      const c = (e && e.code === "auth/credential-already-in-use") ? (kimlikBelgesi || GoogleAuthProvider.credentialFromError(e)) : null;
      if (!c) throw e;
      await signInWithCredential(auth, c);
    }
    return googleMu();
  } catch (e) {
    const kod = (e && (e.code || e.message)) || "";
    if (/popup-closed-by-user|cancelled-popup-request|cancel/i.test(kod)) return false;
    if (/Instagram|FBAN|FBAV/i.test(navigator.userAgent || "") || /popup-blocked|operation-not-supported/.test(kod))
      toast("Bu tarayıcı Google girişine izin vermiyor. Sayfayı Chrome veya Safari'de açıp tekrar dene.");
    else { console.error(e); toast("Google ile giriş yapılamadı, tekrar dener misin?"); }
    return false;
  }
}
/* Sunucudaki sınır kaydı: { son: zaman, adet: o günkü yorum sayısı } */
async function sinirOku(uid) {
  try { const s = await getDoc(doc(db, "yorumSinir", uid)); return s.exists() ? s.data() : null; } catch (e) { return null; }
}
/* Takma ad: her Google hesabının tek, benzersiz ve sabit bir adı var (yorumcular/{uid} + takmaAdlar/{küçük harf ad}).
   Sunucu, yorumdaki adın hesabın kayıtlı adıyla aynı olmasını zorunlu tutar; ad 7 günde bir değiştirilebilir. */
let takmaAd = null, takmaAdZaman = null, takmaAdUid = null;
const AD_RE = /^[\p{L}0-9][\p{L}0-9 ._-]{0,22}[\p{L}0-9.]$/u;
const AD_YASAK = ["anonim", "admin", "yönetici", "yonetici", "kampuscepte", "kampüscepte", "moderatör", "moderator"];
const AD_DEGISIM_GUN = 7;
const adAnahtar = a => a.toLowerCase();   // sunucudaki lower() ile aynı sonucu vermeli
async function takmaAdYukle() {
  const u = auth.currentUser;
  if (!u || u.isAnonymous) { takmaAd = null; takmaAdZaman = null; takmaAdUid = null; return; }
  if (takmaAdUid === u.uid) return;
  try {
    const s = await getDoc(doc(db, "yorumcular", u.uid));
    takmaAd = s.exists() ? s.data().ad : null;
    takmaAdZaman = s.exists() && s.data().zaman && s.data().zaman.toDate ? s.data().zaman.toDate() : null;
    takmaAdUid = u.uid;
  } catch (e) { console.error(e); }
}
const adDegisebilir = () => !takmaAdZaman || Date.now() - takmaAdZaman.getTime() > AD_DEGISIM_GUN * 864e5;
function adHata(a) {
  if (a.length < 2) return "Ad en az 2 karakter olmalı.";
  if (a.length > 24) return "Ad en fazla 24 karakter olabilir.";
  if (!AD_RE.test(a)) return "Adda yalnızca harf, rakam, boşluk, nokta, - ve _ olabilir.";
  if (AD_YASAK.includes(adAnahtar(a)) || SPAM_RE.test(a)) return "Bu adı kullanamazsın, başka bir ad seç.";
  return "";
}
async function takmaAdKaydet(yeni) {
  const uid = auth.currentUser.uid, an = adAnahtar(yeni);
  const var_ = await getDoc(doc(db, "takmaAdlar", an));
  if (var_.exists() && var_.data().uid !== uid) throw { kod: "alinmis" };
  const b = writeBatch(db);
  if (!var_.exists()) b.set(doc(db, "takmaAdlar", an), { uid });
  b.set(doc(db, "yorumcular", uid), { ad: yeni, zaman: serverTimestamp() });
  if (takmaAd && adAnahtar(takmaAd) !== an) b.delete(doc(db, "takmaAdlar", adAnahtar(takmaAd)));
  await b.commit();
  takmaAd = yeni; takmaAdZaman = new Date(); takmaAdUid = uid;
  adYaz(yeni);
}

const ayniGun = (a, b) => a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();

const adOku = () => { try { return localStorage.getItem("kc-ad") || ""; } catch (e) { return ""; } };
const adYaz = a => { try { localStorage.setItem("kc-ad", a); } catch (e) {} };
function toast(m) {
  if (window.kcBildirim) return window.kcBildirim(m);
  let t = document.getElementById("dg-toast");
  if (!t) { t = document.createElement("div"); t.id = "dg-toast"; document.body.appendChild(t); }
  t.textContent = m; t.classList.add("goster"); clearTimeout(toast.z); toast.z = setTimeout(() => t.classList.remove("goster"), 3200);
}

/* ---------- görünüm ---------- */
const css = document.createElement("style");
css.textContent = `
.degerlendir{--dg-yuzey:var(--kart);--dg-yuzey2:var(--kart-2);--dg-cizgi:var(--cam-kenar);--dg-yazi:var(--yazi);--dg-soluk:var(--soluk);--dg-vurgu:var(--mavi);--dg-vurgu-acik:color-mix(in srgb,var(--mavi) 10%,transparent);
  margin-top:14px;border-top:1px solid var(--dg-cizgi);padding-top:14px}
html[data-tema="koyu"] .degerlendir{--dg-vurgu-acik:rgba(120,140,255,.16)}
.degerlendir{min-width:0;max-width:100%;overflow-x:clip}
.degerlendir *{min-width:0;box-sizing:border-box}
.degerlendir[data-menu=""]{display:none}
.dg-gor{display:flex;align-items:center;gap:6px;margin:8px 2px 0;font:600 12px var(--font);color:var(--dg-soluk)}
.dg-gor b{color:var(--dg-yazi,inherit);font-weight:700}
.dg-gor-ik{font-size:13px;line-height:1}
.dg-bar{display:flex;gap:10px 12px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.dg-sol{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.dg-puan-alani{display:inline-flex;align-items:center;gap:8px;background:var(--dg-yuzey);padding:5px 13px;border-radius:var(--r-hap);border:1px solid var(--dg-cizgi)}
.dg-yildizlar{display:inline-flex;align-items:center;gap:1px}
.dg-star{background:none;border:0;padding:0 1px;font-size:21px;line-height:1;color:#c9d0e2;cursor:pointer;transition:transform .12s,color .12s;user-select:none}
html[data-tema="koyu"] .dg-star{color:#47507a}
.dg-star:hover,.dg-star.aktif{color:#f59e0b;transform:scale(1.18)}
.dg-star.secili{color:#f59e0b}
.dg-puan-bilgi{font-size:12.5px;font-weight:700;color:var(--dg-soluk);display:inline-flex;align-items:baseline;gap:4px}
.dg-puan-bilgi b{color:#d97706;font-size:13.5px;font-weight:700}
.dg-puan-bilgi small{font-size:11.5px;font-weight:600;color:var(--dg-soluk)}
.dg-reaksiyonlar{display:inline-flex;gap:6px;align-items:center}
.dg-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dg-cizgi);background:var(--dg-yuzey);color:var(--dg-soluk);
  font:700 12.5px var(--font);padding:6px 12px;border-radius:var(--r-hap);cursor:pointer;transition:transform .15s,background .15s,color .15s}
.dg-btn svg{width:15px;height:15px}
.dg-btn:active{transform:scale(.95)}
.dg-btn.secili.iyi{background:#e7f8ee;color:#1a9d55;border-color:#bfe9d1}
.dg-btn.secili.kotu{background:#fdebec;color:#d23b4b;border-color:#f5c6cc}
.dg-btn.yorum{margin-left:auto}
.dg-btn.yorum.acik{background:var(--dg-vurgu-acik);color:var(--dg-vurgu);border-color:transparent}

.dg-panel{margin-top:14px;padding:14px;border-radius:var(--r-3);background:var(--dg-yuzey);border:1px solid var(--dg-cizgi);
  box-shadow:var(--golge);animation:dg-ac .28s ease both}
@keyframes dg-ac{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.dg-baslik{display:flex;align-items:center;gap:8px;margin:0 0 12px;font-size:15px;font-weight:700;color:var(--dg-yazi);letter-spacing:-.2px}
.dg-say{font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:var(--r-hap);background:var(--dg-vurgu-acik);color:var(--dg-vurgu)}
.dg-av{box-shadow:0 0 0 2px var(--dg-yuzey), var(--golge)}
.dg-av-img{background:var(--dg-yuzey2,#f5f7fd)!important;overflow:hidden}.dg-av-img img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%}
.dg-y{box-shadow:var(--golge)}
.dg-yazar{display:flex;align-items:center;gap:8px;margin:0 0 10px}
.dg-ad-sabit{flex:1;min-width:0;font:700 13.5px var(--font);color:var(--dg-yazi);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dg-ad-degistir,.dg-ad-vazgec{flex:none;border:0;background:none;padding:4px 6px;font:600 12px var(--font);color:var(--dg-vurgu);cursor:pointer;border-radius:var(--r-1)}
.dg-ad-vazgec{color:var(--dg-soluk)}
.dg-ad-sec{margin:0 0 12px;padding:12px;border-radius:var(--r-2);background:var(--dg-yuzey2);border:1px solid var(--dg-cizgi)}
.dg-ad-sec label{display:block;font:700 13px var(--font);color:var(--dg-yazi);margin:0 0 8px}
.dg-ad-satir{display:flex;gap:8px;align-items:center}
.dg-ad-satir .dg-ad{flex:1;min-width:0;border:1.5px solid var(--dg-cizgi);border-radius:var(--r-2);padding:9px 12px;background:var(--dg-yuzey);font:600 14px var(--font);color:var(--dg-yazi);outline:none}
.dg-ad-satir .dg-ad:focus{border-color:var(--dg-vurgu);box-shadow:0 0 0 4px var(--dg-vurgu-acik)}
.dg-ad-kaydet{flex:none;border:0;border-radius:var(--r-2);padding:10px 16px;cursor:pointer;color:#fff;font:700 13.5px var(--font);background:var(--dg-vurgu)}
.dg-ad-kaydet:disabled{opacity:.6}
.dg-ad-sec small{display:block;margin-top:8px;font:500 11.5px/1.4 var(--font);color:var(--dg-soluk)}
.dg-yazar .dg-av{width:30px;height:30px;font-size:13px}
.dg-ad{flex:1;min-width:0;display:block;border:0;border-bottom:1.5px solid var(--dg-cizgi);border-radius:0;padding:6px 2px;font:600 13.5px var(--font);
  color:var(--dg-yazi);background:transparent;box-sizing:border-box;outline:none;transition:border-color .15s}
.dg-ad::placeholder{color:var(--dg-soluk);font-weight:500}
.dg-ad:focus{border-color:var(--dg-vurgu)}
.dg-form button{transition:transform .15s,opacity .2s,background .2s}
.dg-form:not(.dg-hazir):not(.dg-bekle) button{opacity:.55}
.dg-form.dg-gonderiliyor button svg{animation:dgDon .8s linear infinite}
@keyframes dgDon{to{transform:rotate(360deg)}}
.dg-form.dg-bekle button{background:var(--dg-yuzey2)!important;color:var(--dg-vurgu);box-shadow:none!important;position:relative;opacity:1}
.dg-form.dg-bekle button b{position:relative;font:700 12px/1 var(--font);font-variant-numeric:tabular-nums}
.dg-halka{position:absolute;inset:2px;width:34px!important;height:34px!important;transform:rotate(-90deg)}
.dg-halka circle{fill:none;stroke:var(--dg-cizgi);stroke-width:3}
.dg-halka .dg-halka-dolu{stroke:var(--dg-vurgu);stroke-linecap:round;transition:stroke-dashoffset .2s linear}
.dg-salla{animation:dgSalla .38s cubic-bezier(.36,.07,.19,.97)}
@keyframes dgSalla{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
.dg-ipucu{display:flex;align-items:center;gap:7px;max-height:0;opacity:0;overflow:hidden;margin:0 6px;font:600 12.5px/1.35 var(--font);color:var(--dg-soluk);
  transform:translateY(-4px);transition:max-height .25s ease,opacity .2s ease,transform .25s ease,margin .25s ease}
.dg-ipucu.acik{max-height:60px;opacity:1;transform:none;margin:8px 6px 2px}
.dg-ipucu svg{flex:none;width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.dg-ipucu.uyari{color:#e11d48}.dg-ipucu.ok{color:#059669}.dg-ipucu.saat{color:var(--dg-vurgu)}
.dg-ipucu.saat span{font-variant-numeric:tabular-nums}
html[data-tema="koyu"] .dg-ipucu.uyari{color:#fb7185}html[data-tema="koyu"] .dg-ipucu.ok{color:#34d399}
@media (prefers-reduced-motion:reduce){.dg-salla{animation:none}.dg-ipucu{transition:none}}
.dg-google{margin-top:8px;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:11px 14px;border-radius:var(--r-2);cursor:pointer;
  border:1.5px solid var(--dg-cizgi);background:var(--dg-yuzey);color:var(--dg-yazi);font:700 13.5px var(--font);transition:transform .15s,border-color .15s,box-shadow .15s}
.dg-google:hover{border-color:var(--dg-vurgu);box-shadow:0 0 0 4px var(--dg-vurgu-acik)}.dg-google:active{transform:scale(.98)}.dg-google:disabled{opacity:.6}
.dg-google svg{width:18px;height:18px;flex:none}
.dg-form{display:flex;gap:8px;align-items:flex-end;background:var(--dg-yuzey);border:1.5px solid var(--dg-cizgi);border-radius:var(--r-3);padding:6px 6px 6px 14px;transition:border-color .15s,box-shadow .15s}
.dg-form:focus-within{border-color:var(--dg-vurgu);box-shadow:0 0 0 4px var(--dg-vurgu-acik)}
.dg-form textarea{overflow-y:hidden;scrollbar-width:thin;flex:1;min-width:0;min-height:36px;max-height:140px;resize:none;border:0;outline:none;background:transparent;padding:8px 0;
  font:500 14.5px/1.4 var(--font);color:var(--dg-yazi)}
.dg-form textarea::placeholder{color:var(--dg-soluk)}
.dg-form button{flex:none;width:38px;height:38px;border:0;border-radius:50%;padding:0;display:grid;place-items:center;cursor:pointer;color:#fff;
  background:var(--dg-vurgu);box-shadow:var(--golge);transition:transform .15s,opacity .15s}
.dg-form button svg{width:18px;height:18px}
.dg-form button:active{transform:scale(.92)}
.dg-form button:disabled{opacity:.5}
.dg-liste{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.dg-y{background:var(--dg-yuzey);border:1px solid var(--dg-cizgi);border-radius:var(--r-3);padding:12px 14px;display:grid;grid-template-columns:34px 1fr;column-gap:10px}
.dg-av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font:700 14px var(--font);flex:none;}
.dg-y-govde{min-width:0}
.dg-y-ust{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.dg-y b{font-size:13.5px;color:var(--dg-yazi);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dg-y time{font-size:11.5px;color:var(--dg-soluk);font-weight:600;flex:none}
.dg-y p{overflow-wrap:anywhere;margin:3px 0 8px;font-size:14px;line-height:1.5;color:var(--dg-yazi);white-space:pre-wrap;word-break:break-word}
.dg-y .eylem{display:flex;gap:4px 10px;align-items:center;flex-wrap:wrap}
.dg-y .eylem button{border:0;background:none;padding:2px 0;font:700 12px var(--font);color:var(--dg-soluk);cursor:pointer}
.dg-y .eylem button.yanitla{color:var(--dg-vurgu)}
.dg-y-begen{display:inline-flex;align-items:center;gap:4px;background:var(--dg-yuzey2)!important;color:var(--dg-soluk);
  border:0;border-radius:var(--r-hap)!important;padding:4px 10px!important;font:700 11.5px var(--font);cursor:pointer;transition:all .15s}
.dg-y-begen.secili{background:#ffebee!important;color:#e11d48}
.dg-yanitlar{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:8px;grid-column:1/-1}
.dg-yanitlar .dg-y{background:var(--dg-yuzey2);border-radius:var(--r-2);padding:10px 12px;grid-template-columns:28px minmax(0,1fr)}
.dg-yanitlar .dg-av{width:28px;height:28px;font-size:12px}
.dg-yanit-form-alani{margin-top:8px}
.dg-yanit-form{margin-top:4px}
.dg-bos{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:13.5px;color:var(--dg-soluk);font-weight:600;padding:18px 8px 8px}
.dg-bos svg{width:30px;height:30px;opacity:.55}
.dg-y-govde,.dg-y>.dg-y-ust{grid-column:2}
.dg-y>.dg-yanit-form-alani{grid-column:1/-1}

/* Admin Stilleri */
.dg-giris-link{border:0;background:none;color:var(--soluk);font:600 11.5px var(--font);cursor:pointer;text-decoration:underline}
.dg-giris-link:hover{color:var(--mavi)}
.dg-tum-btn{border:0;background:var(--mavi);color:#fff;border-radius:var(--r-1);padding:4px 10px;font:700 11.5px var(--font);cursor:pointer;margin-right:6px}
.dg-tum-btn:hover{background:#2546e5}
.dg-cikis-btn{border:0;background:rgba(0,0,0,.08);color:#78350f;border-radius:var(--r-1);padding:4px 8px;font:700 11.5px var(--font);cursor:pointer}
.dg-cikis-btn:hover{background:rgba(0,0,0,.15)}
.dg-sil-btn{border:0;background:rgba(220,38,38,.08);color:#dc2626;border-radius:var(--r-hap);padding:3px 8px;font:700 11px var(--font);cursor:pointer;transition:background .15s}
.dg-sil-btn:hover{background:#dc2626;color:#fff}
.dg-ban-btn{border:0;background:rgba(124,58,237,.08);color:#7c3aed;border-radius:var(--r-hap);padding:3px 8px;font:700 11px var(--font);cursor:pointer;transition:background .15s}
.dg-ban-btn:hover{background:#7c3aed;color:#fff}
.dg-cezali-kutu{background:#fee2e2;border:1px solid #fecaca;border-radius:var(--r-2);padding:12px;color:#991b1b;font-size:13px;font-weight:700;text-align:center;margin-top:8px}

#dg-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;pointer-events:none;
  background:var(--yazi);color:#fff;font:700 13px var(--font);padding:9px 18px;border-radius:var(--r-hap);
  box-shadow:var(--golge);transition:opacity .2s,transform .2s;z-index:9999}
#dg-toast.goster{opacity:1;transform:translateX(-50%) translateY(0)}
`;
document.head.appendChild(css);

const IKON = {
  iyi: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.72a2 2 0 001.97-1.637l1.3-6.5A2 2 0 0015.03 7.5H12V4a2 2 0 00-2-2l-3.333 6.667A2 2 0 006 10.333z"/></svg>',
  kotu: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.28a2 2 0 00-1.97 1.637L3.01 10.137A2 2 0 005 12.5H8v3.5a2 2 0 002 2l3.333-6.667A2 2 0 0014 9.667z"/></svg>',
  yorum: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>'
};

function benimAvatar() {
  try { const a = localStorage.getItem("kc-avatar") || ""; return /^img:[a-z0-9]+$/.test(a) ? a : ""; } catch (e) { return ""; }
}
function avatar(ad, av) {
  if (av && /^img:[a-z0-9]+$/.test(av)) return `<span class="dg-av dg-av-img"><img src="gorseller/avatar/${av.slice(4)}.webp" alt="" loading="lazy"></span>`;
  const t = String(ad || "Anonim").trim() || "Anonim";
  let h = 0; for (const c of t) h = (h * 31 + c.codePointAt(0)) % 360;
  const bas = [...t][0] || "A";
  return `<span class="dg-av" style="background:hsl(${h},42%,44%)">${esc(bas)}</span>`;
}
const GOOGLE_IKON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
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
  if (!uid) return { cezali: false };
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
  if (eski && eski.gorGoz) eski.gorGoz.disconnect();
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
    goren: 0, gorGoz: null, gorZaman: 0,
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
    </div><div class="dg-gor" hidden></div><div class="dg-panel" hidden></div>`;

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
  gorunumBaslat(el);
}

/* ---------- günlük görüntüleyen kişi sayısı ----------
   Her cihaz (anonim Firebase kimliği) bir menüyü yalnızca bir kez sayılır: menuler/{menu}/gorenler/{uid}.
   KYK yurtlarının menüsü aynı olduğu için sayım oy havuzu gibi ortaktır (kyk_{tarih}_{öğün}); hangi yurttan bakılırsa bakılsın tek menü sayılır.
   Menü kutusu ekranda en az yarım görünüp 1,5 sn kalınca kayıt atılır; sayı Firestore'dan kesin sayılır. */
function gorYaz(el) {
  const d = kutular.get(el); if (!d) return;
  const k = el.querySelector(".dg-gor"); if (!k) return;
  if (d.goren > 0) {
    k.hidden = false;
    k.innerHTML = `<span class="dg-gor-ik" aria-hidden="true">👁</span><b>${d.goren}</b> kişi bu menüye baktı`;
    k.title = "Her cihaz bir menüyü bir kez sayılır";
  } else k.hidden = true;
}

function gorSay(el) {
  const d = kutular.get(el); if (!d) return;
  getCountFromServer(collection(db, "menuler", d.oyId, "gorenler")).then(c => {
    if (kutular.get(el) !== d) return;
    d.goren = c.data().count; gorYaz(el);
  }).catch(() => {});
}

async function gorKaydet(el) {
  const d = kutular.get(el); if (!d) return;
  const anahtar = "kc-gor-" + d.oyId;
  try { if (localStorage.getItem(anahtar)) return; } catch (e) {}
  if (!(await kimlik())) return;
  const u = auth.currentUser; if (!u) return;
  try {
    await setDoc(doc(db, "menuler", d.oyId, "gorenler", u.uid), { zaman: serverTimestamp() });
  } catch (e) {
    // Bu kimlik bu menüyü zaten saymış olabilir (yerel kayıt silinmişse); yine de sayacı yenile
  }
  try { localStorage.setItem(anahtar, "1"); } catch (e) {}
  if (kutular.get(el) === d) gorSay(el);
}

function gorunumBaslat(el) {
  const d = kutular.get(el); if (!d) return;
  if (d.gorGoz) { d.gorGoz.disconnect(); d.gorGoz = null; }
  gorSay(el);
  if (!("IntersectionObserver" in window)) return;
  d.gorGoz = new IntersectionObserver(es => {
    es.forEach(e => {
      clearTimeout(d.gorZaman);
      if (e.isIntersecting && document.visibilityState === "visible") {
        d.gorZaman = setTimeout(() => {
          if (kutular.get(el) === d && document.visibilityState === "visible") {
            gorKaydet(el); if (d.gorGoz) { d.gorGoz.disconnect(); d.gorGoz = null; }
          }
        }, 1500);
      }
    });
  }, { threshold: 0.5 });
  d.gorGoz.observe(el);
}

/* Geçmiş günlerin oy toplamları: aynı sayfada bir kez, telefonda 6 saat saklanır (her açılışta tekrar tekrar okunmaz) */
const GECMIS_SURE = 6 * 3600 * 1000;
const gecmisBellek = new Map();
function gecmisGunOy(id) {
  if (gecmisBellek.has(id)) return gecmisBellek.get(id);
  const anahtar = "kc-gecmis-" + id;
  try {
    const k = JSON.parse(localStorage.getItem(anahtar) || "null");
    if (k && k.t && Date.now() - k.t < GECMIS_SURE && k.g) { const p = Promise.resolve(k.g); gecmisBellek.set(id, p); return p; }
  } catch (e) {}
  const p = getDocs(collection(db, "menuler", id, "oylar")).then(s => {
    const g = { starTop: 0, starSay: 0, iyi: 0, kotu: 0 };
    s.forEach(x => {
      const v = x.data(), pu = typeof v.puan === "number" ? v.puan : 0;
      if (pu >= 1 && pu <= 5) { g.starTop += pu; g.starSay++; }
      const r = typeof v.reaksiyon === "number" ? v.reaksiyon : (v.d === 1 || v.d === -1 ? v.d : 0);
      if (r === 1) g.iyi++; else if (r === -1) g.kotu++;
    });
    try { localStorage.setItem(anahtar, JSON.stringify({ t: Date.now(), g })); } catch (e) {}
    return g;
  }).catch(() => { gecmisBellek.delete(id); return null; });
  gecmisBellek.set(id, p);
  return p;
}

function oyDinleVeSay(el) {
  const d = kutular.get(el); if (!d) return;
  if (d.dinleOy) { d.dinleOy(); d.dinleOy = null; }

  // Yorum sayısını al
  // Sayım sunucuda yapılır (1000 yoruma 1 okuma); saldırı aralığındaki spam yorumlar sayılmaz
  const yRef = collection(db, "menuler", d.yorumId, "yorumlar");
  Promise.all([
    getCountFromServer(query(yRef, where("zaman", "<", new Date(SPAM_BAS)))),
    getCountFromServer(query(yRef, where("zaman", ">", new Date(SPAM_BIT))))
  ]).then(([a, b]) => {
    if (kutular.get(el) === d) {
      d.sayi.yorum = a.data().count + b.data().count;
      barCiz(el);
    }
  }).catch(() => {});

  // Yerel oy bilgilerini oku
  try {
    d.benimPuan = parseInt(localStorage.getItem("kc-puan-" + d.oyId)) || 0;
    d.benimReaksiyon = parseInt(localStorage.getItem("kc-reak-" + d.oyId)) || 0;
  } catch (e) {}

  // Firestore'daki ortak havuz oylarını gerçek zamanlı dinle
  // Aynı menünün geçmiş günlerdeki oyları (bir kez okunur, bugünkülerin üstüne eklenir)
  d.gecmis = { starTop: 0, starSay: 0, iyi: 0, kotu: 0 };
  const gecmisGunler = ayniMenuGunleri(d.oyId);
  let sonSnap = null;
  if (gecmisGunler.length) {
    Promise.all(gecmisGunler.map(gecmisGunOy)).then(liste => {
      if (kutular.get(el) !== d) return;
      const g = { starTop: 0, starSay: 0, iyi: 0, kotu: 0 };
      liste.forEach(t => { if (t) { g.starTop += t.starTop; g.starSay += t.starSay; g.iyi += t.iyi; g.kotu += t.kotu; } });
      d.gecmis = g;
      if (sonSnap) sonSnap();
    });
  }

  d.isleSon = () => { if (sonSnap) sonSnap(); };
  const oylarRef = collection(db, "menuler", d.oyId, "oylar");
  d.dinleOy = onSnapshot(oylarRef, snapOylar => {
    if (kutular.get(el) !== d) return;
    d.oyHata = false;
    sonSnap = () => isle(snapOylar);
    isle(snapOylar);
  }, err => {
    d.oyHata = true;
    console.warn("Ortak oy havuzu dinleme hatası:", err);
  });

  function isle(snapOylar) {
    let starTop = d.gecmis.starTop, starSay = d.gecmis.starSay, iyiSay = d.gecmis.iyi, kotuSay = d.gecmis.kotu;
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
  }
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
    const sy = el.querySelector(".dg-say"); if (sy) sy.textContent = d.sayi.yorum;
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
  // Yorumlar kapalıyken saldırı öncesi yorumlar okunur; spam belgeleri hiç indirilmez (okuma kotası korunur)
  const yKol = collection(db, "menuler", d.yorumId, "yorumlar");
  d.dinle = onSnapshot(YORUM_KAPALI ? query(yKol, where("zaman", "<", new Date(SPAM_BAS))) : yKol, s => {
    d.yorumlar = s.docs.map(x => ({ id: x.id, ...x.data() })).filter(y => !spamMi(y));
    d.sayi.yorum = d.yorumlar.length; barCiz(el);
    listeCiz(el);
  }, e => { console.error(e); p.querySelector(".dg-liste").innerHTML = '<li class="dg-bos">Yorumlar yüklenemedi.</li>'; });
}

function formHtml(yanit) {
  return `<div class="dg-form${yanit ? " dg-yanit-form" : ""}"><textarea maxlength="500" rows="1" placeholder="${yanit ? "Yanıtını yaz…" : "Bu menü hakkında ne düşünüyorsun?"}"></textarea><button type="button" aria-label="Gönder" title="Gönder">${GONDER_IKON}</button></div><div class="dg-ipucu" role="status" aria-live="polite"></div>`;
}

function yazarHtml() {
  if (YORUM_KAPALI || !googleMu()) return "";
  if (takmaAd && !yazarHtml.duzenle)
    return `<div class="dg-yazar">${avatar(takmaAd, benimAvatar())}<b class="dg-ad-sabit">${esc(takmaAd)}</b>${adDegisebilir() ? '<button type="button" class="dg-ad-degistir">Adı değiştir</button>' : ""}</div>`;
  return `<div class="dg-ad-sec"><label>${takmaAd ? "Yeni adını yaz" : "Yorumlarda görünecek adını seç"}</label>
    <div class="dg-ad-satir"><input class="dg-ad" maxlength="24" placeholder="Örn. Elif K. veya kykli_ahmet" value="${esc(takmaAd || adOku())}" aria-label="Yorumlarda görünecek ad"><button type="button" class="dg-ad-kaydet">Kaydet</button>${takmaAd ? '<button type="button" class="dg-ad-vazgec">Vazgeç</button>' : ""}</div><div class="dg-ipucu" role="status" aria-live="polite"></div>
    <small>Her hesabın tek bir adı olur, başkası aynı adı alamaz. Adını ${AD_DEGISIM_GUN} günde bir değiştirebilirsin.</small></div>`;
}
function yazarBagla(el, p) {
  const dg = p.querySelector(".dg-ad-degistir");
  if (dg) dg.onclick = () => { yazarHtml.duzenle = true; panelCiz(el); const i = el.querySelector(".dg-ad"); if (i) i.focus(); };
  const vz = p.querySelector(".dg-ad-vazgec");
  if (vz) vz.onclick = () => { yazarHtml.duzenle = false; panelCiz(el); };
  const kb = p.querySelector(".dg-ad-kaydet"); if (!kb) return;
  const inp = p.querySelector(".dg-ad"), satir = p.querySelector(".dg-ad-satir");
  const kaydet = async () => {
    const yeni = inp.value.trim().replace(/\s+/g, " ");
    const h = adHata(yeni);
    if (h) { ipucu(satir, h, "uyari"); salla(satir); inp.focus(); return; }
    if (takmaAd === yeni) { yazarHtml.duzenle = false; panelCiz(el); return; }
    kb.disabled = true;
    try {
      await takmaAdKaydet(yeni);
      yazarHtml.duzenle = false;
      kutular.forEach((d2, el2) => { if (d2.acik) panelCiz(el2); });
      const nf = el.querySelector(".dg-panel .dg-form"); if (nf) { ipucu(nf, `Adın kaydedildi: ${yeni}`, "ok"); nf.querySelector("textarea").focus(); }
    } catch (e) {
      console.error(e);
      ipucu(satir, e && e.kod === "alinmis" ? "Bu ad başka biri tarafından alınmış, başka bir ad dene." : "Ad kaydedilemedi, biraz sonra tekrar dener misin?", "uyari");
      salla(satir); kb.disabled = false;
    }
  };
  kb.onclick = kaydet;
  inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); kaydet(); } };
}

function panelCiz(el) {
  const d = kutular.get(el); if (!d) return;
  const p = el.querySelector(".dg-panel");
  p.innerHTML =
    `<div class="dg-baslik">Yorumlar <span class="dg-say">${d.sayi.yorum}</span></div>${yazarHtml()}
     <div id="dg-ana-form-kutu">${YORUM_KAPALI ? '<div class="dg-bos" style="padding:12px 4px;font-size:13px;opacity:.8">Yorum yazma geçici olarak kapalı.</div>' : formHtml(false) + (googleMu() ? "" : `<button type="button" class="dg-google">${GOOGLE_IKON}<span>Yorum yazmak için Google ile giriş yap</span></button>`)}</div>
     <ul class="dg-liste"></ul>`;

  const btnTum = p.querySelector("#dg-tum-yemekler-btn");
  if (btnTum) btnTum.onclick = () => window.KC_YEMEK_PANEL && window.KC_YEMEK_PANEL.ac();

  yazarBagla(el, p);
  if (!YORUM_KAPALI) formBagla(el, p.querySelector(".dg-form"), null);
  const gBtn = p.querySelector(".dg-google");
  if (gBtn) gBtn.onclick = async () => { gBtn.disabled = true; if (await googleGiris()) { await takmaAdYukle(); panelCiz(el); const nf = el.querySelector(".dg-panel .dg-form"); if (nf) { ipucu(nf, "Giriş yapıldı, artık yorum yazabilirsin", "ok"); nf.querySelector("textarea").focus(); } } else gBtn.disabled = false; };
  listeCiz(el);
}

/* ---------- yorum kutusu içi durum satırı (toast yerine, kutunun hemen altında) ---------- */
let beklemeBitis = 0;            // bu cihazda bir sonraki yorumun yazılabileceği an (ms)
const IP_IKON = {
  bilgi: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  uyari: '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/></svg>',
  saat: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/></svg>'
};
function ipucu(f, metin, tur) {
  const k = f.nextElementSibling && f.nextElementSibling.classList.contains("dg-ipucu") ? f.nextElementSibling : null;
  if (!k) return;
  clearTimeout(k._z);
  if (!metin) { k.classList.remove("acik"); return; }
  k.className = "dg-ipucu " + (tur || "bilgi");
  k.innerHTML = IP_IKON[tur || "bilgi"] + "<span></span>";
  k.querySelector("span").textContent = metin;
  void k.offsetWidth; k.classList.add("acik");
  if (tur !== "saat") k._z = setTimeout(() => k.classList.remove("acik"), tur === "ok" ? 2600 : 4200);
}
function salla(f) { f.classList.remove("dg-salla"); void f.offsetWidth; f.classList.add("dg-salla"); }
const HALKA = 2 * Math.PI * 16;
/* Bekleme süresi: gönder düğmesi geri sayan bir halkaya dönüşür, altında kalan süre yazar */
function beklemeGoster(f) {
  const btn = f.querySelector("button");
  clearInterval(f._sayac);
  const tik = () => {
    const kalan = beklemeBitis - Date.now();
    if (kalan <= 0) {
      clearInterval(f._sayac); f.classList.remove("dg-bekle");
      btn.innerHTML = GONDER_IKON; btn.setAttribute("aria-label", "Gönder"); btn.disabled = false;
      ipucu(f, "");
      return;
    }
    const sn = Math.ceil(kalan / 1000);
    if (!f.classList.contains("dg-bekle")) {
      f.classList.add("dg-bekle"); btn.disabled = true;
      btn.innerHTML = `<svg class="dg-halka" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16"/><circle class="dg-halka-dolu" cx="18" cy="18" r="16" stroke-dasharray="${HALKA}"/></svg><b></b>`;
    }
    btn.querySelector("b").textContent = sn;
    btn.querySelector(".dg-halka-dolu").style.strokeDashoffset = HALKA * (1 - kalan / (YORUM_ARA_SN * 1000));
    btn.setAttribute("aria-label", sn + " saniye bekle");
    const k = f.nextElementSibling;
    if (k && k.classList.contains("dg-ipucu") && k.classList.contains("saat") && k.classList.contains("acik")) k.querySelector("span").textContent = `Yeni yorum için ${sn} sn`;
    else ipucu(f, `Yeni yorum için ${sn} sn`, "saat");
  };
  tik(); f._sayac = setInterval(tik, 200);
}

function formBagla(el, f, ustId) {
  const d = kutular.get(el);
  const ta = f.querySelector("textarea"), btn = f.querySelector("button");
  ta.oninput = () => {
    ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    ta.style.overflowY = ta.scrollHeight > 140 ? "auto" : "hidden";
    f.classList.toggle("dg-hazir", ta.value.trim().length >= 3);
    const k = f.nextElementSibling;
    if (k && k.classList.contains("uyari") && ta.value.trim().length >= 3) ipucu(f, "");
  };
  if (beklemeBitis > Date.now()) beklemeGoster(f);
  btn.onclick = async () => {
    if (beklemeBitis > Date.now()) { beklemeGoster(f); salla(f); return; }
    const metin = ta.value.trim();
    if (!metin) { ta.focus(); return; }
    if (metin.length < 3) { ipucu(f, "Biraz daha yaz, en az 3 karakter.", "uyari"); salla(f); ta.focus(); return; }
    if (SPAM_RE.test(metin)) { ipucu(f, "Yorumunda uygunsuz bir ifade var, düzeltip tekrar dene.", "uyari"); salla(f); return; }
    if (!googleMu() && !(await googleGiris())) return;
    const uid = auth.currentUser.uid;

    const ceza = await cezaKontrol(uid);
    if (ceza.cezali) { ipucu(f, `Yorum yazma cezan var. Yaklaşık ${ceza.kalanGun} gün sonra (${ceza.bitisStr}) tekrar yazabilirsin.`, "uyari"); return; }

    await takmaAdYukle();
    if (!takmaAd || yazarHtml.duzenle) {
      yazarHtml.duzenle = !takmaAd ? false : yazarHtml.duzenle;
      if (!el.querySelector(".dg-ad-sec")) panelCiz(el);
      const satir = el.querySelector(".dg-ad-satir");
      if (satir) { ipucu(satir, "Önce yorumlarda görünecek adını seç.", "bilgi"); salla(satir); satir.querySelector("input").focus(); }
      return;
    }
    const ad = takmaAd;
    btn.disabled = true; f.classList.add("dg-gonderiliyor");
    try {
      // Hız sınırı: yorum ve sınır kaydı birlikte yazılır; sunucu 30 sn / günlük 20 sınırını denetler
      const sinir = await sinirOku(uid), simdi = new Date();
      const onceki = sinir && sinir.son && sinir.son.toDate ? sinir.son.toDate() : null;
      if (onceki && simdi - onceki < YORUM_ARA_SN * 1000) { beklemeBitis = onceki.getTime() + YORUM_ARA_SN * 1000; f.classList.remove("dg-gonderiliyor"); beklemeGoster(f); return; }
      const adet = onceki && ayniGun(onceki, simdi) ? (sinir.adet || 0) + 1 : 1;
      if (adet > YORUM_GUNLUK) { ipucu(f, `Bugünlük ${YORUM_GUNLUK} yorum hakkını kullandın. Yarın yine yazabilirsin.`, "bilgi"); return; }
      const b = writeBatch(db);
      const gunBasi = Date.UTC(simdi.getUTCFullYear(), simdi.getUTCMonth(), simdi.getUTCDate());
      b.set(doc(db, "menuler", d.yorumId, "yorumlar", `${uid}_${gunBasi}_${adet}`), {
        uid, ad, metin,
        ust: ustId || "",
        zaman: serverTimestamp(),
        begeniler: []
      });
      b.set(doc(db, "yorumSinir", uid), { son: serverTimestamp(), adet });
      await b.commit();
      ta.value = ""; ta.style.height = "auto"; f.classList.remove("dg-hazir");
      beklemeBitis = Date.now() + YORUM_ARA_SN * 1000;
      const kalanHak = YORUM_GUNLUK - adet;
      if (ustId) { d.yanit = null; listeCiz(el); }
      else {
        ipucu(f, kalanHak <= 3 ? `Yorumun paylaşıldı · bugün ${kalanHak} hakkın kaldı` : "Yorumun paylaşıldı", "ok");
        setTimeout(() => { if (f.isConnected) beklemeGoster(f); }, 2200);
      }
    } catch (e) {
      console.error(e);
      ipucu(f, e && e.code === "permission-denied" ? "Gönderilemedi. Biraz bekleyip tekrar dener misin?" : "Bağlantı sorunu oldu, tekrar dener misin?", "uyari");
    } finally { f.classList.remove("dg-gonderiliyor"); if (!(beklemeBitis > Date.now())) btn.disabled = false; }
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

  const kart = y => {
    const benim = y.uid && benUid && y.uid === benUid;
    const begeniListesi = Array.isArray(y.begeniler) ? y.begeniler : [];
    const benBegendim = benUid && begeniListesi.includes(benUid);
    const begeniSayi = begeniListesi.length;

    const silBtn = benim ? `<button class="dg-sil-btn" data-sil="${esc(y.id)}">🗑️ Sil</button>` : "";
    return `<li class="dg-y" data-id="${esc(y.id)}">
      ${avatar(y.ad, benim ? benimAvatar() : "")}
      <div class="dg-y-govde">
      <div class="dg-y-ust"><b>${esc(y.ad)}</b><time>${zamanFarki(y.zaman)}</time></div>
      <p>${esc(y.metin)}</p>
      <div class="eylem">
        <button class="dg-y-begen${benBegendim ? " secili" : ""}" data-yorum-begen="${esc(y.id)}" aria-label="Yorumu beğen">❤️ <span>${begeniSayi}</span></button>
        ${YORUM_KAPALI ? "" : `<button class="yanitla" data-yanit="${esc(y.id)}">Yanıtla</button>`}
        ${silBtn}
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
      console.error(e); toast("Yorum silinemedi, tekrar dener misin?");
    }
  });

  // Bildir
  ul.querySelectorAll("[data-bildir]").forEach(b => b.onclick = async () => {
    // Bildirim yalnızca Google hesabıyla; her kişi bir yorumu bir kez bildirebilir (sunucu denetler)
    if (!googleMu() && !(await googleGiris())) return;
    const neden = (prompt("Bu yorumu neden bildiriyorsun? (kısaca)") || "").trim();
    if (neden.length < 2) return;
    const ilan = "yorum:" + d.yorumId + "/" + b.dataset.bildir, uid = auth.currentUser.uid;
    try {
      await setDoc(doc(db, "sikayetler", uid + "_" + ilan.replace(/[:/]/g, "_")), { ilan, neden: neden.slice(0, 300), uid, zaman: serverTimestamp() });
      toast("Teşekkürler, inceleyeceğiz.");
    } catch (e) { console.error(e); toast(e && e.code === "permission-denied" ? "Bu yorumu zaten bildirmiştin, teşekkürler." : "Gönderilemedi, tekrar dener misin?"); }
  });
}

/* ---------- yemek fotoğrafları bulut senkronizasyonu ---------- */
/* Elle yüklenen bulut fotoğrafları kaldırıldı; fotoğraflar yalnızca sitenin kendi dosyalarından gelir. */

/* ---------- başlat ---------- */
/* Kutular ekrana yaklaşınca kurulur: açılmamış sekmelerdeki menüler için boşuna sorgu atılmaz */
const kurGoz = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { kurGoz.unobserve(e.target); kur(e.target); }
}), { rootMargin: "1200px 0px" }) : null;
function kurGec(el) {
  if (!kurGoz || kutular.has(el)) { kur(el); return; }
  kurGoz.unobserve(el); kurGoz.observe(el);
}
function tara() { document.querySelectorAll(".degerlendir").forEach(kurGec); }
new MutationObserver(ml => {
  for (const m of ml) {
    if (m.type === "attributes" && m.target.classList.contains("degerlendir")) kurGec(m.target);
    else if (m.type === "childList") m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.classList.contains("degerlendir")) kurGec(n); else n.querySelectorAll && n.querySelectorAll(".degerlendir").forEach(kurGec); } });
  }
}).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-menu"] });

let ilkAuth = true;
onAuthStateChanged(auth, async u => {
  const ilk = ilkAuth; ilkAuth = false;
  ben = u;
  await takmaAdYukle();
  try { if (u && u.email) localStorage.setItem("kc-eposta", u.email); } catch (e) {}
  window.dispatchEvent(new CustomEvent("kc-auth-degisti", { detail: { user: u, admin: false } }));
  kutular.forEach((d, el) => {
    if (ilk && !d.oyHata && d.isleSon) d.isleSon();
    else oyDinleVeSay(el);
    if (d.acik) panelCiz(el);
  });
});

tara();
