/* KampüsCepte Haberler — "En çok okunanlar" (haberler ana sayfası).
   Okunma sayıları haber-sayac.js'in yazdığı Firestore haberOkunma koleksiyonundan YALNIZCA OKUNUR (yazma yok, kural değişikliği yok).
   Sayaç kurulmadan önceki görüntülemeler haberler/veri.js'teki "onceki" alanıyla eklenir.
   Son 30 günde yayımlanan haberlerden en çok okunan 5 haber gösterilir; veri gelmezse alan gizli kalır. */
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const kutu = document.getElementById("hb-populer");
const H = window.HABERLER || [];
if (kutu && H.length && window.FIREBASE_AYAR) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sinir = Date.now() - 30 * 864e5;
  const yeni = H.filter(n => new Date(n.iso + "T12:00:00+03:00").getTime() >= sinir);
  const aday = yeni.length >= 5 ? yeni : H;
  (async () => {
    const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
    if (!window.__kcAppCheck && window.KC_RECAPTCHA) { try { window.__kcAppCheck = initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(window.KC_RECAPTCHA), isTokenAutoRefreshEnabled: true }); } catch (e) {} }
    const sayi = {};
    try {
      const s = await getDocs(query(collection(getFirestore(app), "haberOkunma"), orderBy("okunma", "desc"), limit(60)));
      s.forEach(d => { sayi[d.id] = d.data().okunma || 0; });
    } catch (e) { return; } /* sayaç okunamazsa alan gizli kalır */
    const liste = aday.map(n => ({ n, t: (sayi[n.slug] || 0) + (n.onceki || 0) }))
      .filter(x => x.t > 0).sort((a, b) => b.t - a.t).slice(0, 5);
    if (liste.length < 3) return;
    kutu.querySelector("ol").innerHTML = liste.map(({ n }) =>
      '<li><div><a class="hb-etiket" href="/haberler/?kategori=' + esc(n.kod) + '">' + esc(n.kategori) + '</a>' +
      '<h3 class="hb-baslik"><a href="/haberler/' + esc(n.slug) + '.html">' + esc(n.baslik) + "</a></h3></div></li>").join("");
    kutu.hidden = false;
  })();
}
