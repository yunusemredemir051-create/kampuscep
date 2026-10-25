/* KampüsCepte — Ayarlar ve Profil Yönetimi */

(function () {
  const AVATARLAR = ["🎓", "⚡", "🚀", "💻", "🩺", "⚖️", "🎨", "🌟", "📚", "🦁"];

  function baslat() {
    yukleProfil();
    baglaOlaylar();
  }

  function yukleProfil() {
    const adInput = document.getElementById("ayar-ad");
    const yurtSelect = document.getElementById("ayar-yurt");
    const bolumInput = document.getElementById("ayar-bolum");
    const avatarGrid = document.getElementById("ayar-avatar-secici");
    const adminRozet = document.getElementById("ayar-admin-rozet");

    const kayitliAd = localStorage.getItem("kc-ad") || "";
    const kayitliYurt = localStorage.getItem("kc-yurt") || "";
    const kayitliBolum = localStorage.getItem("kc-bolum") || "";
    const kayitliAvatar = localStorage.getItem("kc-avatar") || "🎓";

    if (adInput) adInput.value = kayitliAd;
    if (yurtSelect) yurtSelect.value = kayitliYurt;
    if (bolumInput) bolumInput.value = kayitliBolum;

    // Avatar listesi
    if (avatarGrid) {
      avatarGrid.innerHTML = AVATARLAR.map(a => `
        <button type="button" class="ayar-avatar-btn ${a === kayitliAvatar ? 'secili' : ''}" data-avatar="${a}">${a}</button>
      `).join("");

      avatarGrid.querySelectorAll(".ayar-avatar-btn").forEach(btn => {
        btn.onclick = () => {
          avatarGrid.querySelectorAll(".ayar-avatar-btn").forEach(b => b.classList.remove("secili"));
          btn.classList.add("secili");
        };
      });
    }

    // Aktif dil butonunu vurgula
    const aktifDil = (window.DIL && window.DIL.aktif()) || localStorage.getItem("kc-dil") || "tr";
    document.querySelectorAll(".dil-chip").forEach(k => {
      k.classList.toggle("aktif", k.getAttribute("data-dil") === aktifDil);
    });
    yoneticiGoster();
  }

  /* Yönetici bölümü ve rozeti yalnızca yönetici hesabıyla girilmişse görünür */
  function yoneticiGoster() {
    const yonetici = !!(window.KC_ADMIN && window.KC_ADMIN.isAdmin && window.KC_ADMIN.isAdmin());
    const g = document.getElementById("ayar-yonetici");
    if (g) g.style.display = yonetici ? "" : "none";
    const r = document.getElementById("ayar-admin-rozet");
    if (r) r.style.display = yonetici ? "inline-flex" : "none";
  }

  function kaydetProfil() {
    const adInput = document.getElementById("ayar-ad");
    const yurtSelect = document.getElementById("ayar-yurt");
    const bolumInput = document.getElementById("ayar-bolum");
    const seciliAvatarBtn = document.querySelector(".ayar-avatar-btn.secili");

    const yeniAd = (adInput ? adInput.value : "").trim();
    const yeniYurt = yurtSelect ? yurtSelect.value : "";
    const yeniBolum = (bolumInput ? bolumInput.value : "").trim();
    const yeniAvatar = seciliAvatarBtn ? seciliAvatarBtn.getAttribute("data-avatar") : "🎓";

    if (yeniAd) localStorage.setItem("kc-ad", yeniAd);
    else localStorage.removeItem("kc-ad");

    if (yeniYurt) {
      localStorage.setItem("kc-yurt", yeniYurt);
      // Ana sayfadaki yurt seçicisini de güncelle
      const anaYurtSecici = document.getElementById("yurt-sec");
      if (anaYurtSecici && anaYurtSecici.value !== yeniYurt) {
        anaYurtSecici.value = yeniYurt;
        anaYurtSecici.dispatchEvent(new Event("change"));
      }
    } else {
      localStorage.removeItem("kc-yurt");
    }

    if (yeniBolum) localStorage.setItem("kc-bolum", yeniBolum);
    else localStorage.removeItem("kc-bolum");

    localStorage.setItem("kc-avatar", yeniAvatar);

    // Bildirim göster
    bildirimGoster("Profil bilgileriniz kaydedildi! ✅");
  }

  function bildirimGoster(mesaj) {
    let toast = document.getElementById("kc-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "kc-toast";
      toast.className = "kc-toast cam";
      document.body.appendChild(toast);
    }
    toast.textContent = mesaj;
    toast.classList.add("goster");
    setTimeout(() => {
      toast.classList.remove("goster");
    }, 3000);
  }

  function baglaOlaylar() {
    const form = document.getElementById("ayar-form");
    if (form) {
      form.onsubmit = e => {
        e.preventDefault();
        kaydetProfil();
      };
    }

    // Dil seçimi butonları
    document.querySelectorAll(".dil-chip").forEach(kart => {
      kart.onclick = () => {
        const dil = kart.getAttribute("data-dil");
        if (window.DIL && dil) {
          window.DIL.degistir(dil);
          document.querySelectorAll(".dil-chip").forEach(k => k.classList.toggle("aktif", k === kart));
        }
      };
    });
    const tum = document.getElementById("ayar-tum-yemekler");
    if (tum) tum.onclick = () => window.KC_YEMEK_PANEL && window.KC_YEMEK_PANEL.ac();
    window.addEventListener("kc-auth-degisti", yoneticiGoster);
  }

  window.AYARLAR = {
    yukle: yukleProfil,
    kaydet: kaydetProfil,
    bildirim: bildirimGoster
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})();
