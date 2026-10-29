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
    if (kAlt) kAlt.textContent = ad ? "KampüsCepte üyesi" : "Adını, yurdunu ve avatarını seç";
    const et = document.getElementById("ayar-kart-etiketler");
    if (et) {
      const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
      et.innerHTML = [yurtAd && "🏠 " + yurtAd, bolum && "🎓 " + bolum, (localStorage.getItem("kc-sinif") || "") && "📚 " + localStorage.getItem("kc-sinif")].filter(Boolean).map(t => `<span>${esc(t)}</span>`).join("");
    }
    const dilAlt = document.getElementById("ayar-alt-dil");
    const dil = (window.DIL && window.DIL.aktif()) || localStorage.getItem("kc-dil") || "tr";
    if (dilAlt) dilAlt.textContent = DIL_ADLARI[dil] || "Türkçe";
  }


  /* ---- Bölüm seçici ---- */
  const BOLUMLER = {
    "Fen Fakültesi": ["Biyoloji", "Fizik", "Kimya", "Matematik", "Moleküler Biyoloji ve Genetik", "İstatistik"],
    "Mühendislik Fakültesi": ["Bilgisayar Mühendisliği", "Yazılım Mühendisliği", "Elektrik-Elektronik Mühendisliği", "Makine Mühendisliği", "İnşaat Mühendisliği", "Endüstri Mühendisliği", "Kimya Mühendisliği", "Metalurji ve Malzeme Mühendisliği", "Çevre Mühendisliği", "Jeoloji Mühendisliği", "Gıda Mühendisliği", "Biyomühendislik", "Mekatronik Mühendisliği"],
    "İktisadi ve İdari Bilimler": ["İşletme", "İktisat", "Maliye", "Çalışma Ekonomisi ve Endüstri İlişkileri", "Siyaset Bilimi ve Kamu Yönetimi", "Uluslararası İlişkiler", "Yönetim Bilişim Sistemleri", "Uluslararası Ticaret ve Lojistik", "Bankacılık ve Finans"],
    "Eğitim Fakültesi": ["Sınıf Öğretmenliği", "Okul Öncesi Öğretmenliği", "Rehberlik ve Psikolojik Danışmanlık", "Türkçe Öğretmenliği", "Matematik Öğretmenliği", "Fen Bilgisi Öğretmenliği", "İngilizce Öğretmenliği", "Sosyal Bilgiler Öğretmenliği", "Özel Eğitim Öğretmenliği", "Bilgisayar ve Öğretim Teknolojileri Öğretmenliği", "Resim-İş Öğretmenliği", "Müzik Öğretmenliği"],
    "Fen-Edebiyat Fakültesi": ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Sosyoloji", "Psikoloji", "Felsefe", "İngiliz Dili ve Edebiyatı", "Arkeoloji", "Arap Dili ve Edebiyatı"],
    "Sağlık Bilimleri": ["Hemşirelik", "Ebelik", "Fizyoterapi ve Rehabilitasyon", "Beslenme ve Diyetetik", "Sağlık Yönetimi", "Odyoloji", "Çocuk Gelişimi", "Sosyal Hizmet"],
    "Tıp / Diş / Eczacılık / Veteriner": ["Tıp", "Diş Hekimliği", "Eczacılık", "Veteriner Hekimliği"],
    "Diğer Fakülteler": ["Hukuk", "İlahiyat", "Güzel Sanatlar", "Mimarlık", "Spor Bilimleri", "Teknoloji Fakültesi", "Ziraat Fakültesi", "Su Ürünleri"],
    "Meslek Yüksekokulu": ["Bilgisayar Programcılığı", "Muhasebe ve Vergi Uygulamaları", "Büro Yönetimi ve Yönetici Asistanlığı", "Elektrik", "Makine", "İnşaat Teknolojisi", "Tıbbi Hizmetler ve Teknikler", "Turizm ve Otel İşletmeciliği", "Adalet", "Halkla İlişkiler ve Tanıtım", "Lojistik", "Ön Büro Hizmetleri"]
  };
  function sinifSecenekleri(secili) {
    const sel = document.getElementById("ayar-sinif"); if (!sel) return;
    const b = ((document.getElementById("ayar-bolum") || {}).value || "");
    let n = 4, onlisans = BOLUMLER["Meslek Yüksekokulu"].includes(b);
    if (b === "Tıp") n = 6;
    else if (b === "Diş Hekimliği" || b === "Eczacılık") n = 5;
    else if (b === "Veteriner Hekimliği") n = 5;
    else if (onlisans) n = 2;
    const secenekler = ["Sınıf seç", "Hazırlık"];
    for (let i = 1; i <= n; i++) secenekler.push(i + ". sınıf");
    secenekler.push("Yüksek lisans / Doktora");
    const cur = secili !== undefined ? secili : sel.value;
    sel.innerHTML = secenekler.map((t, i) => `<option value="${i === 0 ? "" : t}">${t}</option>`).join("");
    sel.value = secenekler.includes(cur) ? cur : "";
  }
  function bolumMetinGuncelle() {
    const v = (document.getElementById("ayar-bolum") || {}).value || "";
    const m = document.getElementById("ayar-bolum-metin"), b = document.getElementById("ayar-bolum-btn");
    if (m) m.textContent = v || "Bölüm seç";
    if (b) b.classList.toggle("bos", !v);
    sinifSecenekleri();
  }
  function bolumSheetKur() {
    const perde = document.getElementById("bolum-sheet"), liste = document.getElementById("bolum-liste"), ara = document.getElementById("bolum-ara");
    const btn = document.getElementById("ayar-bolum-btn"), kapat = document.getElementById("bolum-sheet-kapat"), hid = document.getElementById("ayar-bolum");
    if (!perde || !btn || !hid) return;
    const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
    const kucuk = t => t.toLocaleLowerCase("tr");
    function ciz() {
      const q = kucuk(ara.value.trim()), sec = hid.value;
      let h = "";
      for (const [fak, ler] of Object.entries(BOLUMLER)) {
        const f = ler.filter(x => !q || kucuk(x).includes(q) || kucuk(fak).includes(q));
        if (!f.length) continue;
        h += `<div class="sheet-fak">${esc(fak)}</div>` + f.map(x => `<button type="button" class="sheet-oge ${x === sec ? "aktif" : ""}" data-b="${esc(x)}"><span>${esc(x)}</span><b class="ayar-tik">✓</b></button>`).join("");
      }
      const ozel = ara.value.trim();
      h += `<div class="sheet-fak">Listede yok mu?</div>` + (ozel
        ? `<button type="button" class="sheet-oge" data-b="${esc(ozel)}"><span>“${esc(ozel)}” olarak ekle</span></button>`
        : `<div class="sheet-bos">Bölümünü yukarıya yazıp ekleyebilirsin.</div>`);
      if (sec) h += `<button type="button" class="sheet-oge" data-b=""><span>Seçimi temizle</span></button>`;
      liste.innerHTML = h;
    }
    const ac = () => { perde.hidden = false; ara.value = ""; ciz(); document.body.style.overflow = "hidden"; };
    const kapa = () => { perde.hidden = true; document.body.style.overflow = ""; };
    btn.onclick = ac; kapat.onclick = kapa;
    perde.addEventListener("click", e => { if (e.target === perde) kapa(); });
    ara.oninput = ciz;
    liste.onclick = e => {
      const o = e.target.closest(".sheet-oge"); if (!o) return;
      hid.value = o.dataset.b; bolumMetinGuncelle(); kapa();
    };
  }

  function baslat() {
    bolumSheetKur();
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
    sinifSecenekleri(localStorage.getItem("kc-sinif") || "");
    bolumMetinGuncelle();

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

    const yeniSinif = (document.getElementById("ayar-sinif") || {}).value || "";
    if (yeniSinif) localStorage.setItem("kc-sinif", yeniSinif); else localStorage.removeItem("kc-sinif");
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
