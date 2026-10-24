/* KampüsCepte — menüdeki yemeklerin gerçek fotoğrafları ve yönetici fotoğraf yükleme desteği. */
(function () {
  "use strict";

  const Y = "/gorseller/yemek/";
  const FOTOLAR = {
    "unievi": {
      "mercimek çorbası": "unievi-mercimek-corbasi",
      "ezogelin çorbası": "unievi-ezogelin-corbasi",
      "tavuk sote": "unievi-tavuk-sote",
      "kuru fasulye": "unievi-kuru-fasulye",
      "pirinç pilavı": "unievi-pirinc-pilavi",
      "bulgur pilavı": "unievi-bulgur-pilavi",
      "makarna": "unievi-makarna",
      "yoğurt": "unievi-yogurt"
    },
    "unievi_2026-10-21": { "tatlı": "unievi-baklava" },
    "yurt": {
      "mercimek çorbası": "yurt-mercimek-corbasi",
      "sebze çorbası": "yurt-sebze-corbasi",
      "ezogelin çorbası": "yurt-ezogelin-corbasi",
      "tavuk döner": "yurt-tavuk-doner",
      "ormancı kebabı": "yurt-ormanci-kebabi",
      "izmir köfte": "yurt-izmir-kofte",
      "nohut": "yurt-nohut",
      "kuru fasulye": "yurt-kuru-fasulye",
      "türlü": "yurt-turlu",
      "pirinç pilavı": "yurt-pirinc-pilavi",
      "bulgur pilavı": "yurt-bulgur-pilavi",
      "makarna": "yurt-makarna",
      "meyve": "yurt-elma",
      "elma": "yurt-elma",
      "mandalina": "yurt-mandalina",
      "yoğurt": "yurt-yogurt",
      "ayran": "yurt-ayran",
      "cacık": "yurt-cacik",
      "tulumba": "yurt-tulumba"
    }
  };

  const YANINDA = {
    "unievi": [["Ekmek", "ekmek"], ["Su", "su-unievi"]],
    "yurt": [["Ekmek", "ekmek"], ["Su", "su-yurt"]]
  };

  const css = document.createElement("style");
  css.textContent = `
  .fotolu{display:flex;align-items:center;gap:10px}
  .yf-grup{display:inline-flex;align-items:center;gap:4px;flex:none}
  .yf{width:36px;height:36px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.9);box-shadow:0 2px 6px -1px rgba(20,27,52,.15);flex:none;cursor:zoom-in;padding:0;background:#fff;transition:transform .12s}
  .yf:hover{transform:scale(1.08)}
  .yf img{width:100%;height:100%;object-fit:cover;display:block}
  .yf-ek{margin-top:10px;padding-top:10px;border-top:1px dashed var(--cizgi,#e3e7f3);display:flex;gap:12px;align-items:center;font-size:12px;font-weight:700;color:var(--soluk,#6b7390)}
  .yf-ek .yf-grup{display:inline-flex;gap:6px}
  .yf-ek span.ad{font-size:11.5px;color:var(--soluk,#8a90a8);margin-left:2px}
  .yf-buyuk{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:rgba(14,18,40,.65);padding:20px;cursor:zoom-out;animation:gir .2s ease}
  .yf-buyuk figure{margin:0;background:#fff;border-radius:24px;padding:12px 12px 10px;text-align:center;width:min(420px,100%);box-shadow:0 30px 60px -20px rgba(0,0,0,.45)}
  .yf-buyuk img{width:100%;height:auto;display:block;border-radius:16px}
  .yf-buyuk figcaption{font:800 15px var(--font,system-ui);color:#141b34;margin-top:8px}

  /* Admin Fotoğraf Butonları */
  .yf-admin-btn{margin-left:auto;border:1px dashed #3b5bfd;background:rgba(59,91,253,.08);color:#3b5bfd;font:700 11.5px var(--font,inherit);padding:3px 9px;border-radius:8px;cursor:pointer;transition:all .15s;flex:none}
  .yf-admin-btn:hover{background:#3b5bfd;color:#fff}

  /* Seçenek Modal (Şinitzel / Rosto köfte / Sulu patates gibi satırlar için) */
  .yf-modal-perde{position:fixed;inset:0;z-index:10005;display:grid;place-items:center;background:rgba(14,18,40,.68);padding:18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:gir .2s ease}
  .yf-modal-kutu{background:#fff;border-radius:22px;padding:22px 20px 18px;width:min(420px,100%);box-shadow:0 25px 60px -15px rgba(0,0,0,.35);font-family:var(--font,system-ui)}
  .yf-modal-kutu h3{margin:0 0 6px;font-size:16.5px;font-weight:800;color:#141b34}
  .yf-modal-kutu p{margin:0 0 16px;font-size:13px;color:#6b7390;line-height:1.45}
  .yf-secenekler-liste{display:grid;gap:8px;margin-bottom:14px}
  .yf-secim-btn{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:#f8faff;border:1.5px solid #e2e8f0;padding:12px 14px;border-radius:14px;cursor:pointer;font-size:14px;font-family:inherit;color:#1e293b;transition:all .15s}
  .yf-secim-btn:hover{background:#eef3ff;border-color:#3b5bfd;color:#3b5bfd;transform:translateY(-1px)}
  .yf-secim-btn b{display:flex;align-items:center;gap:8px}
  .yf-secim-btn .rozet{font-size:11px;font-weight:700;color:#16a34a;background:#dcfce7;padding:2px 8px;border-radius:6px}
  .yf-modal-kapat-btn{width:100%;border:0;background:#f1f5f9;color:#64748b;font:700 13px var(--font,inherit);padding:11px;border-radius:12px;cursor:pointer;transition:background .15s}
  .yf-modal-kapat-btn:hover{background:#e2e8f0;color:#334155}
  `;
  document.head.appendChild(css);

  const kucuk = s => String(s || "").toLocaleLowerCase("tr-TR").trim();
  const slugYap = s => kucuk(s).replace(/[^a-z0-9çğıöşü]+/gi, "-").replace(/^-+|-+$/g, "");
  const asciiYap = s => kucuk(s)
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // Yerel önbellekten yükle
  if (!window.KC_BULUT_FOTOLAR) {
    try {
      window.KC_BULUT_FOTOLAR = JSON.parse(localStorage.getItem("kc-bulut-fotolar") || "{}");
    } catch (e) {
      window.KC_BULUT_FOTOLAR = {};
    }
  }

  function resimSrc(g) {
    if (!g) return "";
    if (g.startsWith("data:") || g.startsWith("http://") || g.startsWith("https://")) return g;
    return Y + "k/" + g + ".webp";
  }

  function buyukSrc(g) {
    if (!g) return "";
    if (g.startsWith("data:") || g.startsWith("http://") || g.startsWith("https://")) return g;
    return Y + g + ".webp";
  }

  function buyut(gorsel, yazi) {
    const d = document.createElement("div"); d.className = "yf-buyuk";
    d.innerHTML = `<figure><img src="${buyukSrc(gorsel)}" alt=""><figcaption></figcaption></figure>`;
    d.querySelector("figcaption").textContent = yazi;
    d.onclick = () => d.remove();
    document.body.appendChild(d);
  }

  function menuKimligi(ul) {
    const dg = ul.parentNode.querySelector(".degerlendir");
    return dg ? dg.dataset.menu || "" : "";
  }

  function resimSikistir(file, maxBoyut, kalite, cb) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxBoyut || h > maxBoyut) {
          if (w > h) { h = Math.round((h * maxBoyut) / w); w = maxBoyut; }
          else { w = Math.round((w * maxBoyut) / h); h = maxBoyut; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let res = canvas.toDataURL("image/webp", kalite);
        if (!res.startsWith("data:image/webp")) res = canvas.toDataURL("image/jpeg", kalite);
        cb(res);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  let seciciInput = null;
  function fotoSeciciAc(yemekAdi) {
    if (!seciciInput) {
      seciciInput = document.createElement("input");
      seciciInput.type = "file";
      seciciInput.accept = "image/*";
      seciciInput.style.display = "none";
      document.body.appendChild(seciciInput);
    }
    seciciInput.onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      resimSikistir(file, 650, 0.82, base64 => {
        if (window.KC_ADMIN && window.KC_ADMIN.yukleYemekFoto) {
          window.KC_ADMIN.yukleYemekFoto(yemekAdi, base64);
        }
      });
      seciciInput.value = "";
    };
    seciciInput.click();
  }

  /* Seçenekli yemek modalı */
  function secimDialogGoster(parcalar, fotoBulFn, secildiCallback) {
    const d = document.createElement("div");
    d.className = "yf-modal-perde";
    d.innerHTML = `
      <div class="yf-modal-kutu">
        <h3>📷 Hangi yemek için fotoğraf yüklenecek?</h3>
        <p>Bu satırda <b>${parcalar.length} farklı seçenek</b> bulunuyor. Fotoğrafını yüklemek veya güncellemek istediğiniz yemeği seçin:</p>
        <div class="yf-secenekler-liste">
          ${parcalar.map((p, idx) => {
            const varMi = !!fotoBulFn(p);
            return `<button type="button" class="yf-secim-btn" data-idx="${idx}">
              <b>🍽️ ${p}</b>
              ${varMi ? '<span class="rozet">✓ Fotoğraf var</span>' : ''}
            </button>`;
          }).join("")}
        </div>
        <button type="button" class="yf-modal-kapat-btn">Vazgeç</button>
      </div>
    `;
    d.querySelectorAll(".yf-secim-btn").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        d.remove();
        secildiCallback(parcalar[idx]);
      };
    });
    d.querySelector(".yf-modal-kapat-btn").onclick = () => d.remove();
    d.onclick = e => { if (e.target === d) d.remove(); };
    document.body.appendChild(d);
  }

  function guncelle(ul) {
    const kimlik = menuKimligi(ul);
    const eskiEk = ul.parentNode.querySelector(".yf-ek"); if (eskiEk) eskiEk.remove();
    if (!kimlik) return;
    const [yer, tarih] = kimlik.split("_");
    const genel = yer === "unievi" ? "unievi" : "yurt";
    const bulut = window.KC_BULUT_FOTOLAR || {};

    const tablo = Object.assign(
      {},
      FOTOLAR[genel] || {},
      FOTOLAR[yer] || {},
      FOTOLAR[yer + "_" + tarih] || {},
      FOTOLAR[genel + "_" + tarih] || {}
    );

    const yoneticiMi = window.KC_ADMIN && window.KC_ADMIN.isAdmin && window.KC_ADMIN.isAdmin();

    ul.querySelectorAll("li").forEach(li => {
      if (li.classList.contains("bos-menu") || li.classList.contains("not") || li.classList.contains("bos")) return;

      if (!li.dataset.yemek) {
        li.dataset.yemek = li.textContent.replace(/📷 Fotoğraf.*$/i, "").trim();
      }
      const yazi = li.dataset.yemek;
      if (!yazi) return;

      const fotoBul = ad => {
        const k = kucuk(ad), sl = slugYap(ad), asc = asciiYap(ad);
        if (bulut[asc]) return bulut[asc];
        if (bulut[sl]) return bulut[sl];
        if (bulut[k]) return bulut[k];
        if (tablo[k]) return tablo[k];
        if (tablo[asc]) return tablo[asc];
        return null;
      };

      const parcalar = yazi.includes("/") ? yazi.split("/").map(p => p.trim()).filter(Boolean) : [yazi];
      const secenekler = parcalar.map(p => [p, fotoBul(p)]).filter(([_, f]) => !!f);

      // Mevcut yf-grup varsa kaldırıp tazeleyelim
      const eskiGrup = li.querySelector(".yf-grup");
      if (eskiGrup) eskiGrup.remove();

      if (secenekler.length) {
        const kutu = document.createElement("span"); kutu.className = "yf-grup";
        secenekler.slice(0, 4).forEach(([ad, g]) => {
          const b = document.createElement("button"); b.className = "yf"; b.type = "button"; b.setAttribute("aria-label", ad + " fotoğrafı");
          b.title = ad;
          b.innerHTML = `<img src="${resimSrc(g)}" alt="${ad}" loading="lazy">`;
          b.onclick = (e) => {
            e.stopPropagation();
            buyut(g, ad);
          };
          kutu.appendChild(b);
        });
        li.prepend(kutu); li.classList.add("fotolu");
      }

      // Yönetici fotoğraf yükleme butonu
      const eskiAdminBtn = li.querySelector(".yf-admin-btn");
      if (eskiAdminBtn) eskiAdminBtn.remove();
      if (yoneticiMi) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "yf-admin-btn";
        btn.innerHTML = "📷 Fotoğraf";
        btn.title = `"${yazi}" için fotoğraf yükle`;
        btn.onclick = (e) => {
          e.stopPropagation();
          if (parcalar.length > 1) {
            secimDialogGoster(parcalar, fotoBul, secilen => {
              fotoSeciciAc(secilen);
            });
          } else {
            fotoSeciciAc(yazi);
          }
        };
        li.appendChild(btn);
      }
    });

    const ek = YANINDA[yer === "unievi" ? "unievi" : "yurt"];
    if (ek && ul.querySelector("li:not(.bos-menu):not(.bos)")) {
      const d = document.createElement("div"); d.className = "yf-ek";
      d.innerHTML = `<span>Menüyle verilir:</span><div class="yf-grup"></div>`;
      const grup = d.querySelector(".yf-grup");
      ek.forEach(([ad, g]) => {
        const b = document.createElement("button"); b.className = "yf"; b.type = "button"; b.setAttribute("aria-label", ad + " fotoğrafı");
        b.innerHTML = `<img src="${Y}k/${g}.webp" alt="" loading="lazy">`;
        b.onclick = () => buyut(g, ad);
        grup.appendChild(b);
      });
      ul.after(d);
    }
  }

  function hepsiniGuncelle() {
    document.querySelectorAll("ul.yemekler").forEach(guncelle);
  }

  function baslat() {
    hepsiniGuncelle();
    document.querySelectorAll("ul.yemekler").forEach(ul => {
      new MutationObserver(() => guncelle(ul)).observe(ul, { childList: true });
      const dg = ul.parentNode.querySelector(".degerlendir");
      if (dg) new MutationObserver(() => guncelle(ul)).observe(dg, { attributes: true, attributeFilter: ["data-menu"] });
    });
    window.addEventListener("kc-fotolar-guncellendi", hepsiniGuncelle);
    window.addEventListener("kc-auth-degisti", hepsiniGuncelle);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
