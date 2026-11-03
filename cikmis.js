/* KampüsCepte — Çıkmış sorular: indirme sayacı ve 5 yıldızlı puanlama (Firestore: cikmisSorular).
   Her indirme ayrı sayılır (aynı kişi 5 kez indirirse 5); sunucu kişi başına 10 saniyede en fazla 1 sayıma izin verir. Puanda her kişinin tek oyu vardır, değiştirebilir. */
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, onSnapshot, increment, serverTimestamp, writeBatch }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
/* App Check: istekler yalnızca sitenin kendisinden (reCAPTCHA doğrulamalı gerçek tarayıcıdan) kabul edilir. */
if (!window.__kcAppCheck && window.KC_RECAPTCHA) { try { window.__kcAppCheck = initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(window.KC_RECAPTCHA), isTokenAutoRefreshEnabled: true }); } catch (e) { console.warn("App Check", e); } }
const auth = getAuth(app), db = getFirestore(app);
const giris = async () => { if (!auth.currentUser) await signInAnonymously(auth); return auth.currentUser.uid; };
const dinleyiciler = [];

async function puanOku(id) {
  const s = await getDocs(collection(db, "cikmisSorular", id, "puanlar"));
  let t = 0, n = 0, benim = 0; const uid = auth.currentUser && auth.currentUser.uid;
  s.forEach(d => { const p = d.data().puan; if (p >= 1 && p <= 5) { t += p; n++; if (d.id === uid) benim = p; } });
  return { ort: n ? t / n : 0, n, benim };
}
function yildizCiz(kart, r) {
  kart.querySelector(".ck-ort").textContent = r.n ? r.ort.toFixed(1).replace(".", ",") : "–";
  kart.querySelector(".ck-oy").textContent = r.n ? r.n + " oy" : "Henüz oy yok";
  kart.querySelectorAll(".ck-yildiz button").forEach((b, i) => {
    b.classList.toggle("dolu", i < (r.benim || Math.round(r.ort)));
    b.classList.toggle("benim", !!r.benim && i < r.benim);
  });
}

window.Cikmis = {
  bagla(kok) {
    dinleyiciler.splice(0).forEach(f => f());
    kok.querySelectorAll("[data-ck]").forEach(async kart => {
      const id = kart.dataset.ck, say = kart.querySelector(".ck-say");
      dinleyiciler.push(onSnapshot(doc(db, "cikmisSorular", id),
        s => { say.textContent = ((s.exists() && s.data().indirme) || 0).toLocaleString("tr-TR"); },
        () => { say.textContent = "–"; }));
      kart.querySelector(".ck-indir").addEventListener("click", () => {
        giris().then(uid => {
          const b = writeBatch(db);
          b.set(doc(db, "cikmisSorular", id), { indirme: increment(1) }, { merge: true });
          b.set(doc(db, "cikmisSorular", id, "indirenler", uid), { son: serverTimestamp() });
          return b.commit();
        }).catch(() => {});
      });
      kart.querySelectorAll(".ck-yildiz button").forEach((b, i) => b.addEventListener("click", async () => {
        try {
          const uid = await giris();
          yildizCiz(kart, { ...(await puanOku(id)), benim: i + 1 });
          await setDoc(doc(db, "cikmisSorular", id, "puanlar", uid), { puan: i + 1, zaman: serverTimestamp() });
          yildizCiz(kart, await puanOku(id));
          kart.querySelector(".ck-oy").textContent += " · teşekkürler";
        } catch (e) { kart.querySelector(".ck-oy").textContent = "Oy kaydedilemedi"; }
      }));
      try { await giris(); } catch (e) {}
      puanOku(id).then(r => yildizCiz(kart, r)).catch(() => {});
    });
  }
};
document.dispatchEvent(new Event("cikmis-hazir"));
