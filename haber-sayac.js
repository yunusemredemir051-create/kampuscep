/* KampüsCepte Haberler — haber tıklanma sayacı (Firestore: haberOkunma).
   Sayaç kurulmadan önceki görüntülemeler (Google Analytics'ten) haberler.json'daki onceki_okunma alanıyla eklenir.
   Sayfa her açıldığında +1 sayılır (aynı kişi 5 kez açarsa 5). Sunucu kişi başına 10 saniyede en fazla 1 sayıma izin verir. */
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, increment, serverTimestamp, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const kutu = document.getElementById("hb-okunma");
const slug = kutu && kutu.dataset.haber;
if (slug && window.FIREBASE_AYAR) {
  const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
  if (!window.__kcAppCheck && window.KC_RECAPTCHA) { try { window.__kcAppCheck = initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(window.KC_RECAPTCHA), isTokenAutoRefreshEnabled: true }); } catch (e) {} }
  const auth = getAuth(app), db = getFirestore(app), ref = doc(db, "haberOkunma", slug);
  const onceki = parseInt(kutu.dataset.onceki, 10) || 0;
  const goster = n => { n += onceki; if (n > 0) { kutu.querySelector("b").textContent = n.toLocaleString("tr-TR"); kutu.hidden = false; } };
  (async () => {
    let n = 0;
    try { const s = await getDoc(ref); n = (s.exists() && s.data().okunma) || 0; } catch (e) {}
    try {
      if (!auth.currentUser) await signInAnonymously(auth);
      const b = writeBatch(db);
      b.set(ref, { okunma: increment(1) }, { merge: true });
      b.set(doc(db, "haberOkunma", slug, "okuyanlar", auth.currentUser.uid), { son: serverTimestamp() });
      await b.commit();
      n += 1;
    } catch (e) {}
    goster(n);
  })();
}
