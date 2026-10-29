/* KampüsCepte — Ayarlar ve Profil Yönetimi */

(function () {
  /* Avatar görselleri: /gorseller/avatar/ klasörüne konan dosya adları (uzantısız) buraya eklenir.
     Liste boşken geçici olarak emoji avatarlar kullanılır. */
  const AVATAR_BILGI = {
    a01:["Başörtülü Öğrenci","k"],a02:["Başörtülü Doktor","k"],a03:["Kulaklıklı Genç","e"],a04:["Takkeli Genç","e"],a05:["Gözlüklü Öğrenci","e"],a06:["Mezun Kız","k"],a07:["Sırt Çantalı Genç","e"],a08:["Sarıklı Genç","e"],a09:["Hintli Öğrenci","k"],a10:["Keşiş","e"],a11:["Kapüşonlu Kız","k"],a12:["Kıvırcık Saçlı Kız","k"],a13:["Baretli Usta","e"],a14:["Uzun Saçlı Kız","k"],a15:["Ressam Kız","k"],a16:["Laboratuvarcı","e"],a17:["Kitap Kurdu","k"],a18:["Profesör","e"],a19:["Mimar Adayı","e"],a20:["Renkli Saçlı Kız","k"],a21:["Yayıncı","e"],a22:["Gözlüklü Abi","e"],a23:["Siyah Başörtülü","k"],a24:["Doktor Kız","k"],a25:["Mavi Sarıklı","e"],a26:["Bilge Hanım","k"],
    b01:["Yöresel Kız","k"],b02:["Zeybek","e"],b03:["Kot Ceketli Genç","e"],b04:["Kemençeci","e"],b05:["Kemençeci Kız","k"],b06:["Mezun","e"],b07:["Laborant","e"],b08:["Örgülü Kız","k"],b09:["Öğretmen Kız","k"],b10:["Hemşire (Erkek)","e"],b11:["Hemşire","k"],b12:["Öğretmen","e"],b13:["Pilot Kız","k"],b14:["Pilot","e"],b15:["Mühendis Kız","k"],b16:["Avukat","e"],b17:["Baklavacı Kız","k"],b18:["Aşçı","e"],b19:["Yazılımcı","e"],b20:["Avukat Kız","k"],b21:["Mimar Kız","k"],b22:["Bağlamacı","e"],b23:["Veteriner Kız","k"],b24:["Altınlı Yöresel Kız","k"],b25:["Yöresel Genç","e"],b26:["İtfaiyeci","e"],b27:["Kasketli Genç","e"],b28:["Çiftçi","e"],b29:["Bağlamacı Kız","k"],b30:["Antrenör Kız","k"],
    a27:["Gülümseyen Kız","k"],a28:["Neşeli Genç","e"],a29:["Cihazlı Genç","e"],a30:["Tekerlekli Sandalyeli Kız","k"]
  };
  const AVATAR_DOSYALAR = Object.keys(AVATAR_BILGI);
  const avatarAd = a => (AVATAR_BILGI[String(a).slice(4)] || ["Avatar"])[0];
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
    const bolum = localStorage.getItem("kc-birim") || "";
    const av = localStorage.getItem("kc-avatar") || AVATARLAR[0];
    const yurtSel = document.getElementById("ayar-yurt");
    let yurtAd = "";
    if (yurtDeger && yurtSel) { const o = [...yurtSel.options].find(x => x.value === yurtDeger); yurtAd = o ? o.textContent : ""; }
    const parca = [yurtAd, bolum].filter(Boolean).join(" · ");
    const kAv = document.getElementById("ayar-kart-avatar"), kAd = document.getElementById("ayar-kart-ad"), kAlt = document.getElementById("ayar-kart-alt");
    if (kAv) kAv.innerHTML = String(av).startsWith("img:") ? avatarHtml(av) : `<span class="av-harf">${(ad || "K").trim().charAt(0).toLocaleUpperCase("tr")}</span>`;
    if (kAd) kAd.textContent = ad || "Profilini oluştur";
    if (kAlt) kAlt.textContent = ad ? (yurtAd || "Yurt seçilmedi") : "Adını, yurdunu ve avatarını seç";
    const et = document.getElementById("ayar-kart-etiketler");
    if (et) et.textContent = ad ? [bolum, bolum && localStorage.getItem("kc-sinif") ? localStorage.getItem("kc-sinif") + ". sınıf" : ""].filter(Boolean).join(" · ") : "";
    if (false) {
      const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
      et.innerHTML = [yurtAd && "🏠 " + yurtAd, bolum && "🎓 " + bolum, (bolum && localStorage.getItem("kc-sinif")) && "📚 " + localStorage.getItem("kc-sinif") + ". sınıf"].filter(Boolean).map(t => `<span>${esc(t)}</span>`).join("");
    }
    const dilAlt = document.getElementById("ayar-alt-dil");
    const dil = (window.DIL && window.DIL.aktif()) || localStorage.getItem("kc-dil") || "tr";
    if (dilAlt) dilAlt.textContent = DIL_ADLARI[dil] || "Türkçe";
  }


  /* ---- Bölüm seçici ---- */
  const bolumListesi = () => window.KC_BOLUM_LISTESI || [];
  const kisaAd = f => f;
  function sinifSecenekleri(secili) {
    const sel = document.getElementById("ayar-sinif"); if (!sel) return;
    const b = ((document.getElementById("ayar-bolum") || {}).value || "");
    const fak = (bolumListesi().find(f => f[1].includes(b)) || [""])[0];
    let n = 4;
    if (b === "Tıp") n = 6;
    else if (b === "Diş Hekimliği" || b === "Eczacılık" || b === "Veteriner") n = 5;
    else if (/MYO/.test(fak)) n = 2;
    const cur = secili !== undefined ? String(secili) : sel.value;
    let h = '<option value="">Sınıf seç</option>';
    for (let i = 1; i <= n; i++) h += `<option value="${i}">${i}. sınıf</option>`;
    sel.innerHTML = h;
    sel.value = +cur >= 1 && +cur <= n ? cur : "";
    const ad = b === "Adli Bilişim Mühendisliği";
    const blok = document.getElementById("ayar-adli-blok"); if (blok) blok.hidden = !ad;
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
      for (const [fak, ler] of bolumListesi()) {
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
    const kayitliBolum = localStorage.getItem("kc-birim") || (localStorage.getItem("kc-bolum") === "tip" ? "Tıp" : "");
    const kayitliAvatar = localStorage.getItem("kc-avatar") || AVATARLAR[0];

    if (adInput) adInput.value = kayitliAd;
    if (yurtSelect) yurtSelect.value = kayitliYurt;
    if (bolumInput) bolumInput.value = kayitliBolum;
    sinifSecenekleri(localStorage.getItem("kc-sinif") || "");
    const ogS = document.getElementById("ayar-ogretim"), sbS = document.getElementById("ayar-sube");
    if (ogS) ogS.value = localStorage.getItem("kc-ogretim") === "2" ? "2" : "1";
    if (sbS) sbS.value = ["1", "2"].includes(localStorage.getItem("kc-sube")) ? localStorage.getItem("kc-sube") : "0";
    bolumMetinGuncelle();

    // Avatar listesi (cinsiyete göre gruplu)
    if (avatarGrid) {
      const GRUP = { k: "Kadın", e: "Erkek" };
      const grupOf = a => (AVATAR_BILGI[String(a).slice(4)] || ["", "e"])[1];
      let secili = AVATARLAR.includes(kayitliAvatar) ? kayitliAvatar : AVATARLAR[0];
      let grup = grupOf(secili);
      avatarGrid.dataset.secili = secili;
      avatarGrid.className = "av-kutu";
      avatarGrid.innerHTML = `
        <div class="av-onizleme"><button type="button" class="av-buyuk" id="av-buyuk" aria-label="Büyüt"></button>
          <div class="av-yazi"><b id="av-ad"></b><small>Seçtiğin avatar · büyütmek için dokun</small></div></div>
        <div class="av-segment" role="tablist"></div><div class="av-izgara"></div>`;
      const seg = avatarGrid.querySelector(".av-segment"), izg = avatarGrid.querySelector(".av-izgara"), buy = avatarGrid.querySelector("#av-buyuk");
      const ciz = () => {
        buy.innerHTML = avatarHtml(secili); avatarGrid.querySelector("#av-ad").textContent = avatarAd(secili);
        seg.innerHTML = Object.keys(GRUP).filter(g => AVATARLAR.some(a => grupOf(a) === g)).map(g => `<button type="button" data-g="${g}" class="${g === grup ? "aktif" : ""}">${GRUP[g]}</button>`).join("");
        izg.innerHTML = AVATARLAR.filter(a => grupOf(a) === grup).map(a => `<button type="button" class="ayar-avatar-btn ${a === secili ? "secili" : ""}" data-avatar="${a}" aria-label="${avatarAd(a)}"><span class="av-daire">${avatarHtml(a)}</span><span class="av-ad">${avatarAd(a)}</span></button>`).join("");
      };
      seg.onclick = ev => { const b = ev.target.closest("button[data-g]"); if (b) { grup = b.dataset.g; ciz(); } };
      izg.onclick = ev => { const b = ev.target.closest(".ayar-avatar-btn"); if (!b) return; secili = b.dataset.avatar; avatarGrid.dataset.secili = secili; ciz(); try { navigator.vibrate && navigator.vibrate(8); } catch (x) {} };
      buy.onclick = () => {
        const o = document.createElement("div");
        o.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(10,14,30,.82);display:grid;place-items:center;backdrop-filter:blur(6px)";
        o.innerHTML = `<div style="width:min(78vw,320px);aspect-ratio:1;border-radius:50%;overflow:hidden;background:#eef1fb;box-shadow:0 0 0 6px #fff,0 30px 60px -10px rgba(0,0,0,.6)">${avatarHtml(secili).replace("<img ", '<img style="width:100%;height:100%;object-fit:cover" ')}</div>`;
        o.onclick = () => o.remove();
        document.body.appendChild(o);
      };
      ciz();
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
    const seciliAvatarBtn = null; const seciliAv = (document.getElementById("ayar-avatar-secici") || {}).dataset;

    const yeniAd = (adInput ? adInput.value : "").trim();
    const yeniYurt = yurtSelect ? yurtSelect.value : "";
    const yeniBolum = (bolumInput ? bolumInput.value : "").trim();
    const yeniAvatar = (seciliAv && seciliAv.secili) || AVATARLAR[0];

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

    try { localStorage.removeItem("kc-bolum"); } catch (e) {}
    if (yeniBolum) localStorage.setItem("kc-birim", yeniBolum); else localStorage.removeItem("kc-birim");

    const yeniSinif = (document.getElementById("ayar-sinif") || {}).value || "";
    localStorage.setItem("kc-sinif", yeniSinif || "1");
    const og = (document.getElementById("ayar-ogretim") || {}).value, sb = (document.getElementById("ayar-sube") || {}).value;
    localStorage.setItem("kc-ogretim", og === "2" ? "2" : "1"); localStorage.setItem("kc-sube", sb === "1" || sb === "2" ? sb : "0");
    localStorage.setItem("kc-avatar", yeniAvatar);

    // Bildirim göster
    if (window.kcProgramYenile) window.kcProgramYenile();
    bildirimGoster("Profil bilgileriniz kaydedildi! ✅");
    kartGuncelle();
    anaGoster();
    window.scrollTo({ top: 0 });
  }

  function bildirimGoster(mesaj) { if (window.kcBildirim) window.kcBildirim(mesaj); }

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
