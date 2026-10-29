/* KampüsCepte — Ayarlar ve Profil Yönetimi */

(function () {
  /* Avatar görselleri: /gorseller/avatar/ klasörüne konan dosya adları (uzantısız) buraya eklenir.
     Liste boşken geçici olarak emoji avatarlar kullanılır. */
  const AVATAR_DOSYALAR = [];
  const AVATARLAR = AVATAR_DOSYALAR.length ? AVATAR_DOSYALAR.map(d => "img:" + d) : ["🎓", "⚡", "🚀", "💻", "🩺", "⚖️", "🎨", "🌟", "📚", "🦁"];
  const avatarHtml = a => String(a).startsWith("img:") ? `<img src="/gorseller/avatar/${String(a).slice(4)}.webp" alt="" loading="lazy">` : a;
  const DIL_ADLARI = { tr: "Türkçe", en: "English", ku: "Kurdî", ar: "العربية" };
  const GORUNUMLER = { profil: "Profil", gorunum: "Görünüm", dil: "Dil", sss: "Sıkça Sorulan Sorular", iletisim: "İletişim" };

  function anaGoster() {
    const ana = document.getElementById("ayar-ana"), alt = document.getElementById("ayar-alt");
    if (ana) ana.hidden = false;
    if (alt) alt.hidden = true;
  }
  function altGoster(ad) {
    const ana = document.getElementById("ayar-ana"), alt = document.getElementById("ayar-alt");
    if (!alt || !GORUNUMLER[ad]) return;
    document.querySelectorAll("[data-ayar-gorunum]").forEach(g => { g.hidden = g.dataset.ayarGorunum !== ad; });
    const b = document.getElementById("ayar-alt-baslik"); if (b) b.textContent = GORUNUMLER[ad];
    if (ana) ana.hidden = true;
    alt.hidden = false;
    window.scrollTo({ top: 0 });
  }
  function kartGuncelle() {
    const ad = localStorage.getItem("kc-ad") || "";
    const yurtDeger = localStorage.getItem("kc-yurt") || "";
    const bolum = localStorage.getItem("kc-bolum") || "";
    const av = localStorage.getItem("kc-avatar") || "🎓";
    const yurtSel = document.getElementById("ayar-yurt");
    let yurtAd = "";
    if (yurtDeger && yurtSel) { const o = [...yurtSel.options].find(x => x.value === yurtDeger); yurtAd = o ? o.textContent : ""; }
    const parca = [yurtAd, bolum].filter(Boolean).join(" · ");
    const kAv = document.getElementById("ayar-kart-avatar"), kAd = document.getElementById("ayar-kart-ad"), kAlt = document.getElementById("ayar-kart-alt");
    if (kAv) kAv.innerHTML = avatarHtml(av);
    if (kAd) kAd.textContent = ad || "Profilini oluştur";
    if (kAlt) kAlt.textContent = parca || "Adını, yurdunu ve avatarını seç";
    const dilAlt = document.getElementById("ayar-alt-dil");
    const dil = (window.DIL && window.DIL.aktif()) || localStorage.getItem("kc-dil") || "tr";
    if (dilAlt) dilAlt.textContent = DIL_ADLARI[dil] || "Türkçe";
  }

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
        <button type="button" class="ayar-avatar-btn ${a === kayitliAvatar ? 'secili' : ''}" data-avatar="${a}">${avatarHtml(a)}</button>
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
    kartGuncelle();
    anaGoster();
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
    kartGuncelle();
    anaGoster();
    window.scrollTo({ top: 0 });
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
          kartGuncelle();
        }
      };
    });
    document.querySelectorAll("[data-ayar-ac]").forEach(b => { b.onclick = () => altGoster(b.dataset.ayarAc); });
    const geri = document.getElementById("ayar-geri");
    if (geri) geri.onclick = () => { anaGoster(); window.scrollTo({ top: 0 }); };
    const kop = document.getElementById("iletisim-kopyala");
    if (kop) kop.onclick = async () => {
      const adres = "iletisim@kampuscepte.com.tr";
      try { await navigator.clipboard.writeText(adres); bildirimGoster("E-posta adresi kopyalandı ✅"); }
      catch (e) {
        const r = document.createRange(); r.selectNodeContents(document.getElementById("iletisim-adres"));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        bildirimGoster("Adresi seçtim, kopyalayabilirsin");
      }
    };
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
