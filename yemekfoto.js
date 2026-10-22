/* KampüsCepte — menüdeki yemeklerin gerçek fotoğrafları.
   Fotoğraflar her gün yemekhanede çekilen gerçek tabaklardan hazırlanır.

   FOTOLAR: "yer" (unievi ya da yurt id'si) altında yemek adı → görsel adı (gorseller/yemek/<ad>.webp).
     Aynı yemek o yerde tekrar çıktığında aynı fotoğraf kullanılır.
     "Tatlı" gibi genel adlar için o güne özel kayıt: "unievi_2026-10-21": { "Tatlı": "..." }
   YANINDA: her öğünde verilen sabit şeyler (ekmek, su). */
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
    /* KYK yurtları (Elazığ'daki KYK yurtlarında menü ortak) */
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
  .yf-buyuk figcaption{font:800 15px var(--font,system-ui);color:#141b34;margin-top:8px}`;
  document.head.appendChild(css);

  const kucuk = s => s.toLocaleLowerCase("tr-TR").trim();
  function buyut(ad, yazi) {
    const d = document.createElement("div"); d.className = "yf-buyuk";
    d.innerHTML = `<figure><img src="${Y + ad}.webp" alt=""><figcaption></figcaption></figure>`;
    d.querySelector("figcaption").textContent = yazi;
    d.onclick = () => d.remove();
    document.body.appendChild(d);
  }

  /* menünün kimliği, yanındaki değerlendirme kutusundan okunur: "unievi_2026-10-21" ya da "ahmet-kabakli_2026-10-21_aksam" */
  function menuKimligi(ul) {
    const dg = ul.parentNode.querySelector(".degerlendir");
    return dg ? dg.dataset.menu || "" : "";
  }

  function guncelle(ul) {
    const kimlik = menuKimligi(ul);
    const eskiEk = ul.parentNode.querySelector(".yf-ek"); if (eskiEk) eskiEk.remove();
    if (!kimlik) return;
    const [yer, tarih] = kimlik.split("_");
    const genel = yer === "unievi" ? "unievi" : "yurt";
    const tablo = Object.assign({}, FOTOLAR[genel] || {}, FOTOLAR[yer] || {}, FOTOLAR[yer + "_" + tarih] || {}, FOTOLAR[genel + "_" + tarih] || {});
    ul.querySelectorAll("li").forEach(li => {
      if (li.querySelector(".yf-grup") || li.classList.contains("bos-menu") || li.classList.contains("not") || li.classList.contains("bos")) return;
      const yazi = li.textContent.trim();
      /* "A / B" gibi seçenekli satırlarda fotoğrafı olan her seçenek yan yana gösterilir */
      const secenekler = tablo[kucuk(yazi)] ? [[yazi, tablo[kucuk(yazi)]]]
        : yazi.split("/").map(p => p.trim()).filter(p => tablo[kucuk(p)]).map(p => [p, tablo[kucuk(p)]]);
      if (!secenekler.length) return;
      const kutu = document.createElement("span"); kutu.className = "yf-grup";
      secenekler.slice(0, 3).forEach(([ad, g]) => {
        const b = document.createElement("button"); b.className = "yf"; b.type = "button"; b.setAttribute("aria-label", ad + " fotoğrafı");
        b.innerHTML = `<img src="${Y}k/${g}.webp" alt="" loading="lazy">`;
        b.onclick = () => buyut(g, ad);
        kutu.appendChild(b);
      });
      li.prepend(kutu); li.classList.add("fotolu");
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
  function baslat() {
    document.querySelectorAll("ul.yemekler").forEach(ul => {
      guncelle(ul);
      new MutationObserver(() => guncelle(ul)).observe(ul, { childList: true });
      const dg = ul.parentNode.querySelector(".degerlendir");
      if (dg) new MutationObserver(() => guncelle(ul)).observe(dg, { attributes: true, attributeFilter: ["data-menu"] });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
