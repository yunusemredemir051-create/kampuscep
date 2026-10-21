/* KampüsCepte — günün menüsünü görsel olarak gösterir:
   yurt menüleri plastik tepside kaseler, Üniversite Evi çelik tabldotta.
   ÖNİZLEME: yalnızca ?onizleme=tepsi ile açılınca görünür (?onizleme=kapat ile kapanır). */
(function () {
  "use strict";
  let acik = false;
  try {
    const q = new URLSearchParams(location.search).get("onizleme");
    if (q === "tepsi") sessionStorage.setItem("kc-tepsi", "1");
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
  .tp{position:relative;width:100%;margin:4px 0 12px;aspect-ratio:1100/706;background:url(${Y}tepsi.webp) center/contain no-repeat}
  .tp.tb{aspect-ratio:1100/735;background-image:url(${Y}tabldot.webp)}
  .tp img{position:absolute;display:block;filter:drop-shadow(0 4px 6px rgba(0,0,0,.18));animation:tp-gir .5s ease both}
  .tp .goz{position:absolute;overflow:hidden;animation:tp-gir .5s ease both}
  .tp .goz img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 42%;transform:scale(1.4);filter:none;animation:none}
  @keyframes tp-gir{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1}}
  @media (prefers-reduced-motion:reduce){.tp img,.tp .goz{animation:none}}`;
  document.head.appendChild(css);

  function tepsiCiz(kutu, gorseller) {
    const n = gorseller.length;
    const [sut, sat] = n <= 3 ? [n, 1] : n === 4 ? [2, 2] : n <= 6 ? [3, 2] : n <= 8 ? [4, 2] : [4, 3];
    const X0 = 6, X1 = 94, Y0 = 8, Y1 = 92;            // tepsinin iç alanı (%)
    const gw = (X1 - X0) / sut, gh = (Y1 - Y0) / sat;
    const oran = 1100 / 706;                             // genişlik / yükseklik
    const boy = Math.min(gw * 1.12, gh * 1.12 / oran);  // kase genişliği (% genişlik)
    kutu.innerHTML = gorseller.slice(0, sut * sat).map((g, i) => {
      const r = Math.floor(i / sut), c = i % sut;
      const satirdaki = Math.min(sut, n - r * sut), kayma = (sut - satirdaki) * gw / 2;
      const cx = X0 + kayma + gw * (c + .5), cy = Y0 + gh * (r + .5);
      return `<img src="${Y + g}.webp" alt="" style="width:${boy}%;left:${cx - boy / 2}%;top:${cy - boy * oran / 2}%;animation-delay:${i * .06}s">`;
    }).join("");
  }

  /* tabldot gözleri: [sol, üst, genişlik, yükseklik, yarıçap] (%) */
  const GOZ = { corba: [7.5, 7, 25, 37, "50%"], ust: [37.5, 8, 33, 34, "9%"], sag: [74, 8, 18.5, 83, "9%"], alt: [6, 49, 66, 41, "7%"] };
  function tabldotCiz(kutu, gorseller) {
    const yer = {};
    const koy = (g, sira) => { for (const s of sira) if (!yer[s]) { yer[s] = g; return; } };
    for (const g of gorseller) {
      if (CORBA.test(g)) koy(g, ["corba", "ust", "sag"]);
      else if (PILAV.test(g)) koy(g, ["ust", "alt", "sag"]);
      else if (KUCUK.test(g)) koy(g, ["sag", "ust"]);
      else koy(g, ["alt", "ust", "sag"]);
    }
    kutu.innerHTML = Object.entries(yer).map(([s, g], i) => {
      const [l, t, w, h, r] = GOZ[s];
      return `<div class="goz" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%;border-radius:${r};animation-delay:${i * .08}s"><img src="${Y + g}.webp" alt=""></div>`;
    }).join("");
  }

  function guncelle(ul) {
    let kutu = ul.previousElementSibling;
    if (!kutu || !kutu.classList.contains("tp")) { kutu = document.createElement("div"); kutu.className = "tp"; kutu.setAttribute("aria-hidden", "true"); ul.parentNode.insertBefore(kutu, ul); }
    const yazilar = [...ul.querySelectorAll("li")].filter(li => !li.classList.contains("bos-menu") && !li.classList.contains("not") && !li.classList.contains("bos")).map(li => li.textContent);
    const gorseller = [...new Set(yazilar.map(eslestir).filter(Boolean))];
    const tabldot = /unievi/.test(ul.id);
    kutu.classList.toggle("tb", tabldot);
    kutu.style.display = gorseller.length ? "" : "none";
    if (!gorseller.length) return;
    tabldot ? tabldotCiz(kutu, gorseller) : tepsiCiz(kutu, gorseller);
  }
  function baslat() {
    document.querySelectorAll("ul.yemekler").forEach(ul => {
      guncelle(ul);
      new MutationObserver(() => guncelle(ul)).observe(ul, { childList: true });
    });
    const n = document.createElement("div");
    n.style.cssText = "position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9999;background:#141b34;color:#fff;font:700 12px/1.2 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.9;white-space:nowrap";
    n.innerHTML = 'Tepsi önizlemesi <a href="?onizleme=kapat" style="color:#9fb3ff;margin-left:6px">kapat</a>';
    document.body.appendChild(n);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
