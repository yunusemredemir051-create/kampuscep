/* KampüsCepte — menüdeki yemeklerin gerçek fotoğrafları ve yönetici fotoğraf yükleme desteği. */
(function () {
  "use strict";

  const FOTOLAR = {
    "unievi": {
      "rosto köfte": "unievi-rosto-kofte",
      "makarna": "unievi-makarna",
      "domates çorbası": "unievi-domates-corbasi",
      "fırında tavuk": "unievi-firinda-tavuk",
      "bulgur pilavı": "unievi-bulgur-pilavi",
      "mercimek çorbası": "unievi-mercimek-corbasi",
      "yoğurt": "unievi-yogurt"
    },
    "unievi_2026-10-21": { "tatlı": "unievi-baklava" },
    /* KYK yurtları */
    "yurt": {
      "mercimek çorbası": "yurt-mercimek-corbasi",
      "sebze çorbası": "yurt-sebze-corbasi",
      "karışık salata": "yurt-karisik-salata",
      "fırında sebzeli tavuk ızgara": "yurt-firinda-sebzeli-tavuk",
      "etli dolma": "yurt-etli-dolma",
      "mevsim türlü": "yurt-mevsim-turlu",
      "soslu makarna": "yurt-soslu-makarna",
      "sade omlet": "yurt-sade-omlet",
      "patates salatası": "yurt-patates-salatasi",
      "çikolatalı kek": "yurt-cikolatali-kek",
      "beyaz peynir": "yurt-beyaz-peynir",
      "siyah / yeşil zeytin": "yurt-zeytin",
      "çay": "yurt-cay",
      "şehriye çorbası": "yurt-sehriye-corbasi",
      "tavuk çöp şiş": "yurt-tavuk-cop-sis",
      "bulgur pilavı": "yurt-bulgur-pilavi",
      "haydari": "yurt-haydari",
      "tulumba": "yurt-tulumba"
    }
  };

  const YANINDA = {
    "unievi": [["Ekmek", "ekmek"], ["Su", "su-unievi"]],
    "yurt": [["Ekmek", "ekmek"], ["Su", "su-yurt"]]
  };

  const Y = "/gorseller/yemek/";
  const css = document.createElement("style");
  css.textContent = `
  .yemekler li.fotolu::before{display:none}
  .yemekler li.fotolu{gap:12px}
  .yf{flex:none;width:52px;height:52px;border-radius:14px;overflow:hidden;background:#fff;cursor:zoom-in;padding:0;border:0;
      box-shadow:0 0 0 2px #fff,0 4px 12px -4px rgba(40,60,140,.35)}
  .yf-grup{display:flex;flex:none;gap:4px}
  .yf-grup .yf+.yf{margin-left:-14px}
  .yf img{width:100%;height:100%;object-fit:cover;display:block}
  .yf-ek{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:4px 0 2px;font-size:12.5px;font-weight:700;color:var(--soluk,#6b7390)}
  .yf-ek button{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--cizgi,#e6e9f2);background:#fff;border-radius:99px;
      padding:3px 10px 3px 3px;font:700 12.5px var(--font,inherit);color:var(--yazi,#141b34);cursor:zoom-in}
  .yf-ek img{width:28px;height:28px;border-radius:50%;object-fit:cover}
  .yf-buyuk{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:rgba(14,18,40,.6);padding:20px;cursor:zoom-out}
  .yf-buyuk figure{margin:0;background:#fff;border-radius:24px;padding:12px 12px 10px;text-align:center;width:min(420px,100%);box-shadow:0 30px 60px -20px rgba(0,0,0,.45)}
  .yf-buyuk img{width:100%;height:auto;display:block;border-radius:16px}
  .yf-buyuk figcaption{font:800 15px var(--font,system-ui);color:#141b34;margin-top:8px}
  .yf-admin-btn{margin-left:auto;border:1px dashed #3b5bfd;background:rgba(59,91,253,.07);color:#3b5bfd;font:700 11.5px var(--font,inherit);padding:3px 8px;border-radius:8px;cursor:pointer;transition:all .15s;flex:none}
  .yf-admin-btn:hover{background:#3b5bfd;color:#fff}
  `;
  document.head.appendChild(css);

  const kucuk = s => s.toLocaleLowerCase("tr-TR").trim();
  const slugYap = s => kucuk(s).replace(/[^a-z0-9çğıöşü]+/gi, "-").replace(/^-+|-+$/g, "");

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

  /* Görsel sıkıştırma yardımcısı */
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

  /* Gizli dosya seçici */
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

      const yazi = li.childNodes[li.childNodes.length - 1].textContent ? li.textContent.replace(/📷 Fotoğraf.*$/i, "").trim() : li.textContent.trim();
      const anahtar = kucuk(yazi);
      const slug = slugYap(yazi);

      // Fotoğraf bul: önce bulut (yönetici yüklemesi), sonra yerel FOTOLAR
      const fotoBul = ad => {
        const k = kucuk(ad), sl = slugYap(ad);
        if (bulut[sl]) return bulut[sl];
        if (bulut[k]) return bulut[k];
        if (tablo[k]) return tablo[k];
        return null;
      };

      const secenekler = fotoBul(yazi) ? [[yazi, fotoBul(yazi)]]
        : yazi.split("/").map(p => p.trim()).filter(p => fotoBul(p)).map(p => [p, fotoBul(p)]);

      // Mevcut yf-grup varsa kaldırıp tazeleyelim
      const eskiGrup = li.querySelector(".yf-grup");
      if (eskiGrup) eskiGrup.remove();

      if (secenekler.length) {
        const kutu = document.createElement("span"); kutu.className = "yf-grup";
        secenekler.slice(0, 3).forEach(([ad, g]) => {
          const b = document.createElement("button"); b.className = "yf"; b.type = "button"; b.setAttribute("aria-label", ad + " fotoğrafı");
          b.innerHTML = `<img src="${resimSrc(g)}" alt="" loading="lazy">`;
          b.onclick = () => buyut(g, ad);
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
          fotoSeciciAc(yazi);
        };
        li.appendChild(btn);
      }
    });

    const ek = YANINDA[yer === "unievi" ? "unievi" : "yurt"];
    if (ek && ul.querySelector("li:not(.bos-menu):not(.bos)")) {
      const d = document.createElement("div"); d.className = "yf-ek";
      d.innerHTML = "Yanında:";
      ek.forEach(([yazi, ad]) => {
        const b = document.createElement("button"); b.type = "button";
        b.innerHTML = `<img src="${Y}k/${ad}.webp" alt="">${yazi}`;
        b.onclick = () => buyut(ad, yazi);
        d.appendChild(b);
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
