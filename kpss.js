/* KampüsCepte — KPSS Sınav Arkadaşı (25 - 26 Ekim 2026)
   26 Ekim 2026 23:59:59 (+03:00) sonrasında otomatik olarak gizlenir. */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const BITIS_ZAMANI = new Date("2026-10-26T23:59:59+03:00").getTime();

// 26 Ekim sonrası kontrolü
function aktifMi() {
  return Date.now() <= BITIS_ZAMANI;
}

if (!aktifMi()) {
  // Süre dolduysa alanı DOM'dan tamamen kaldır
  const alan = document.getElementById("kpss-alani");
  if (alan) alan.remove();
} else {
  baslat();
}

function baslat() {
  const alan = document.getElementById("kpss-alani");
  if (!alan) return;
  alan.style.display = "block";

  const app = getApps().length ? getApps()[0] : initializeApp(window.FIREBASE_AYAR);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let aktifKullanici = null;
  onAuthStateChanged(auth, user => {
    if (!user) {
      signInAnonymously(auth).catch(() => {});
    } else {
      aktifKullanici = user;
    }
  });

  // Kullanıcının kendi ilan kimlikleri (silme yetkisi için)
  function benimIlanlarim() {
    try {
      return JSON.parse(localStorage.getItem("kc-kpss-ilanlar") || "[]");
    } catch {
      return [];
    }
  }

  function ilaniKaydet(id) {
    const list = benimIlanlarim();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem("kc-kpss-ilanlar", JSON.stringify(list));
    }
  }

  function ilaniSilLocaldan(id) {
    const list = benimIlanlarim().filter(x => x !== id);
    localStorage.setItem("kc-kpss-ilanlar", JSON.stringify(list));
  }

  // DOM Öğeleri
  const listeEl = document.getElementById("kpss-liste");
  const aramaInput = document.getElementById("kpss-arama");
  const modal = document.getElementById("kpss-modal");
  const btnYeni = document.getElementById("kpss-btn-yeni");
  const btnKapat = document.getElementById("kpss-modal-kapat");
  const form = document.getElementById("kpss-form");

  let tumIlanlar = [];

  // Firestore dinle
  const colRef = collection(db, "kpss2026");
  const q = query(colRef, orderBy("zaman", "desc"));

  onSnapshot(q, snap => {
    tumIlanlar = [];
    snap.forEach(d => {
      tumIlanlar.push({ id: d.id, ...d.data() });
    });
    renderIlanlar();
  }, err => {
    console.warn("KPSS ilanları yüklenemedi:", err);
  });

  function renderIlanlar() {
    if (!listeEl) return;
    const ara = (aramaInput ? aramaInput.value : "").trim().toLowerCase();
    
    let filtreli = tumIlanlar;
    if (ara) {
      filtreli = tumIlanlar.filter(i => 
        (i.okul && i.okul.toLowerCase().includes(ara)) ||
        (i.cikis && i.cikis.toLowerCase().includes(ara)) ||
        (i.ad && i.ad.toLowerCase().includes(ara))
      );
    }

    if (filtreli.length === 0) {
      listeEl.innerHTML = `
        <div class="kpss-bos">
          <p>${ara ? 'Aramanıza uygun sınav ilanı bulunamadı.' : 'Henüz sınav ilanı bulunmuyor. İlk ilanı sen ekle, sınav yolunu kolaylaştır!'}</p>
        </div>
      `;
      return;
    }

    const benimkiler = benimIlanlarim();

    listeEl.innerHTML = filtreli.map(i => {
      const benimMi = benimkiler.includes(i.id) || (aktifKullanici && i.uid === aktifKullanici.uid);
      
      // WhatsApp linki
      let telTemiz = (i.tel || "").replace(/[^0-9]/g, "");
      if (telTemiz.startsWith("0")) telTemiz = "9" + telTemiz;
      else if (!telTemiz.startsWith("90") && telTemiz.length === 10) telTemiz = "90" + telTemiz;
      
      const wpMesaj = encodeURIComponent(`Merhaba ${i.ad || ''}, KampüsCepte'den KPSS sınav arkadaşı ilanını gördüm (${i.okul}). Birlikte gitmek için yazıyorum.`);
      const wpLink = `https://wa.me/${telTemiz}?text=${wpMesaj}`;

      let vasitaIkon = "🚖";
      let vasitaMetin = "Taksi Paylaşımı";
      if (i.vasita === "araba") {
        vasitaIkon = "🚗";
        vasitaMetin = "Özel Araç (Yer Var)";
      } else if (i.vasita === "otobus") {
        vasitaIkon = "🚌";
        vasitaMetin = "Birlikte Gidelim";
      }

      return `
        <div class="kpss-kart-item cam" data-id="${i.id}">
          <div class="kpss-item-ust">
            <span class="kpss-okul-rozet">📍 ${escapeHtml(i.okul || '')}</span>
            <span class="kpss-vasita-rozet">${vasitaIkon} ${vasitaMetin}</span>
          </div>
          
          <div class="kpss-item-orta">
            <div class="kpss-cikis-bilgi">
              <span class="etiket">Kalkış:</span> <b>${escapeHtml(i.cikis || '')}</b>
            </div>
            ${i.not ? `<div class="kpss-not-bilgi">"${escapeHtml(i.not)}"</div>` : ''}
          </div>

          <div class="kpss-item-alt">
            <div class="kpss-kullanici-bilgi">
              <span class="kpss-kullanici-avatar">👤</span>
              <span class="kpss-kullanici-ad">${escapeHtml(i.ad || 'Öğrenci')}</span>
            </div>
            
            <div class="kpss-item-eylemler">
              ${telTemiz ? `
                <a href="${wpLink}" target="_blank" rel="noopener" class="kpss-btn-wp">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.508-.678-.517-.176-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512s1.08 2.913 1.23 3.114c.15.2 2.126 3.246 5.15 4.553.719.311 1.281.497 1.719.636.723.23 1.381.198 1.901.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.2-.577-.35z"/></svg>
                  WhatsApp
                </a>
              ` : ''}
              ${benimMi ? `
                <button type="button" class="kpss-btn-sil" data-sil="${i.id}" title="İlanı Sil">🗑️</button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Sil butonlarını bağla
    listeEl.querySelectorAll("[data-sil]").forEach(b => {
      b.onclick = async () => {
        const id = b.getAttribute("data-sil");
        if (confirm("Bu sınav ilanınızı kaldırmak istiyor musunuz?")) {
          try {
            await deleteDoc(doc(db, "kpss2026", id));
            ilaniSilLocaldan(id);
          } catch (e) {
            alert("İlan silinirken bir hata oluştu: " + e.message);
          }
        }
      };
    });
  }

  // Arama filtresi
  if (aramaInput) {
    aramaInput.oninput = renderIlanlar;
  }

  // Modal Aç / Kapat
  if (btnYeni && modal) {
    btnYeni.onclick = () => {
      // Profil adını otomatik doldur
      const adInput = document.getElementById("kpss-form-ad");
      if (adInput && !adInput.value) {
        adInput.value = localStorage.getItem("kc-ad") || "";
      }
      const cikisInput = document.getElementById("kpss-form-cikis");
      if (cikisInput && !cikisInput.value) {
        const yurt = localStorage.getItem("kc-yurt");
        if (yurt) cikisInput.value = yurt;
      }
      modal.classList.add("acik");
    };
  }

  if (btnKapat && modal) {
    btnKapat.onclick = () => modal.classList.remove("acik");
  }

  if (modal) {
    modal.onclick = e => {
      if (e.target === modal) modal.classList.remove("acik");
    };
  }

  // Form gönderme
  if (form) {
    form.onsubmit = async e => {
      e.preventDefault();
      const okul = (document.getElementById("kpss-form-okul")?.value || "").trim();
      const cikis = (document.getElementById("kpss-form-cikis")?.value || "").trim();
      const vasita = document.getElementById("kpss-form-vasita")?.value || "taksi";
      const ad = (document.getElementById("kpss-form-ad")?.value || "").trim();
      const tel = (document.getElementById("kpss-form-tel")?.value || "").trim();
      const not = (document.getElementById("kpss-form-not")?.value || "").trim();

      if (!okul || !cikis || !ad || !tel) {
        alert("Lütfen okul, çıkış yeri, ad ve telefon alanlarını doldurunuz.");
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Kaydediliyor...";
      }

      try {
        const docRef = await addDoc(colRef, {
          okul,
          cikis,
          vasita,
          ad,
          tel,
          not,
          uid: aktifKullanici ? aktifKullanici.uid : "anon",
          zaman: serverTimestamp()
        });

        ilaniKaydet(docRef.id);
        form.reset();
        modal.classList.remove("acik");
      } catch (err) {
        alert("İlan eklenirken bir hata oluştu: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "İlanı Paylaş";
        }
      }
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
