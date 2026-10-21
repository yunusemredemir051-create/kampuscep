/* KampüsCepte — menüdeki her yemeğin yanında küçük yuvarlak fotoğrafı.
   ÖNİZLEME: yalnızca ?onizleme=yemek ile açılınca görünür (?onizleme=kapat ile kapanır). */
(function () {
  "use strict";
  let acik = false;
  try {
    const q = new URLSearchParams(location.search).get("onizleme");
    if (q === "yemek") sessionStorage.setItem("kc-tepsi", "1");
    if (q === "kapat") sessionStorage.removeItem("kc-tepsi");
    acik = sessionStorage.getItem("kc-tepsi") === "1";
  } catch (e) {}
  if (!acik) return;

  const Y = "/gorseller/yemek/";
  /* [desen, görsel] — sıra önemli: özel olanlar önce */
  const KURAL = [
    [/mercimek/, "mercimek"], [/ezogelin/, "ezogelin"], [/sebze çorba/, "sebze-corba"], [/yayla/, "yayla"],
    [/domates çorba/, "domates-corba"], [/tarhana/, "tarhana"], [/ayran aşı/, "ayran-asi"], [/şehriye çorba/, "sehriye"],
    [/düğün/, "dugun"], [/çorba/, "mercimek"],
    [/makarna salata/, "makarna-salata"], [/salçalı mantı/, "manti-salcali"], [/mantı/, "manti-yogurtlu"],
    [/sebzeli bulgur/, "bulgur-sebzeli"], [/bulgur/, "bulgur"], [/nohutlu/, "nohutlu-pilav"], [/erişte/, "eriste"],
    [/makarna/, "makarna"], [/pirinç|pilav/, "pirinc"],
    [/etsiz kuru|^kuru fasulye/, "kuru-etsiz"], [/kuru fasulye/, "kuru-etli"], [/taze fasulye/, "taze-fasulye"],
    [/türlü/, "turlu"], [/musakka/, "musakka"], [/bezelye/, "bezelye"], [/kıymalı ıspanak/, "ispanak-kiymali"],
    [/ıspanaklı börek/, null], [/ıspanak/, "ispanak"], [/graten/, "graten"],
    [/hamburger/, "hamburger"], [/ekmek arası/, "ekmek-arasi"], [/parmak/, "parmak-kebap"], [/kuşbaşı/, "kusbasi-patlican"],
    [/orman/, "orman"], [/dolma/, "dolma"], [/tavuk sote/, "tavuk-sote"],
    [/çöp şiş/, "cop-sis"], [/nugget/, "nugget"], [/tavuk burger/, "tavuk-burger"], [/sebzeli tavuk/, "sebzeli-tavuk"],
    [/fırında tavuk/, "firin-tavuk"], [/şinitzel/, "sinitzel"], [/baget/, "baget"], [/döner/, "tavuk-doner"],
    [/tavuk kavurma/, "tavuk-kavurma"], [/tantuni/, "tantuni"], [/köfte/, "rosto"], [/tavuk/, "firin-tavuk"],
    [/yoğurtlu kabak/, "yogurtlu-kabak"], [/mücver/, "mucver"], [/soslu patates/, "soslu-patates"],
    [/haşlanmış yumurta/, "yumurta"], [/sucuklu yumurta/, "sucuklu-yumurta"], [/sucuklu omlet/, "sucuklu-omlet"],
    [/kaşarlı omlet/, "kasarli-omlet"], [/peynirli omlet/, "peynirli-omlet"], [/omlet/, "omlet"], [/menemen/, "menemen"],
    [/patates kızartma/, "patates"], [/sosis/, "sosis"], [/patates salata/, "patates-salata"], [/patates kavurma/, "patates-kavurma"],
    [/kızartma/, "kizartma"],
    [/karışık salata/, "karisik-salata"], [/çoban/, "coban"], [/salata/, "mevsim-salata"], [/haydari/, "haydari"],
    [/beyaz peynir/, "beyaz-peynir"], [/labne/, "labne"], [/krem peynir/, "krem-peynir"], [/kaşar/, "kasar"],
    [/zeytin(?!li)/, "zeytin"], [/bitki çayı|^çay/, "cay"],
    [/yoğurt/, "yogurt"], [/ayran/, "ayran"],
    [/tulumba/, "tulumba"], [/şekerpare/, "sekerpare"], [/sütlaç/, "sutlac"], [/brownie/, "brownie"], [/helva/, "helva"],
    [/revani/, "revani"], [/elma/, "elma"], [/meyve/, "meyve"], [/tatlı/, "sekerpare"]
  ];
  const CORBA = /mercimek|ezogelin|corba|yayla|tarhana|ayran-asi|sehriye|dugun/;
  const PILAV = /pirinc|bulgur|pilav|eriste|makarna|manti/;
  const KUCUK = /salata|coban|yogurt|haydari|ayran|cay|tulumba|sekerpare|sutlac|brownie|helva|revani|elma|meyve|zeytin|peynir|labne|kasar$/;

  function eslestir(yazi) {
    const kucuk = yazi.toLocaleLowerCase("tr-TR");
    for (const parca of kucuk.split(/\s*[\/+]\s*/)) {
      for (const [d, g] of KURAL) if (d.test(parca.trim())) { if (g) return g; break; }
    }
    return null;
  }

  const css = document.createElement("style");
  css.textContent = `
  .yemekler li.fotolu::before{display:none}
  .yemekler li.fotolu{gap:12px}
  .yf{flex:none;width:46px;height:46px;border-radius:50%;overflow:hidden;background:#fff;cursor:zoom-in;
      box-shadow:0 0 0 2px #fff,0 4px 10px -4px rgba(40,60,140,.35)}
  .yf img{width:100%;height:100%;object-fit:cover;transform:scale(1.55) translateY(-4%);display:block}
  .yf-buyuk{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:rgba(14,18,40,.55);padding:24px;cursor:zoom-out}
  .yf-buyuk figure{margin:0;background:#fff;border-radius:24px;padding:14px 14px 12px;text-align:center;max-width:320px;width:100%;box-shadow:0 30px 60px -20px rgba(0,0,0,.4)}
  .yf-buyuk img{width:100%;height:auto;display:block}
  .yf-buyuk figcaption{font:800 15px var(--font,system-ui);color:#141b34;margin-top:6px}`;
  document.head.appendChild(css);

  function guncelle(ul) {
    ul.querySelectorAll("li").forEach(li => {
      if (li.classList.contains("bos-menu") || li.classList.contains("not") || li.classList.contains("bos") || li.querySelector(".yf")) return;
      const g = eslestir(li.textContent);
      if (!g) return;
      const kap = document.createElement("span"); kap.className = "yf";
      kap.innerHTML = `<img src="${Y + g}.webp" alt="" loading="lazy">`;
      kap.onclick = () => buyut(Y + g + ".webp", li.textContent.trim());
      li.prepend(kap); li.classList.add("fotolu");
    });
  }
  function buyut(src, ad) {
    const d = document.createElement("div"); d.className = "yf-buyuk";
    d.innerHTML = `<figure><img src="${src}" alt=""><figcaption></figcaption></figure>`;
    d.querySelector("figcaption").textContent = ad;
    d.onclick = () => d.remove();
    document.body.appendChild(d);
  }
  function baslat() {
    document.querySelectorAll("ul.yemekler").forEach(ul => {
      guncelle(ul);
      new MutationObserver(() => guncelle(ul)).observe(ul, { childList: true });
    });
    const n = document.createElement("div");
    n.style.cssText = "position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9999;background:#141b34;color:#fff;font:700 12px/1.2 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.9;white-space:nowrap";
    n.innerHTML = 'Yemek fotoğrafı önizlemesi <a href="?onizleme=kapat" style="color:#9fb3ff;margin-left:6px">kapat</a>';
    document.body.appendChild(n);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
