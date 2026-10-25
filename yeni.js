/* Karşılama kartındaki sayaç etiketleri (Sınava X gün · Tatile Y gün) */
(function () {
  "use strict";
  function kur() {
    try {
      var kutu = document.querySelector("#ana .afis .ust-bilgi");
      if (!kutu || typeof siradaki !== "function" || typeof kalanYazi !== "function") return;
      var eski = kutu.querySelector(".afis-chips"); if (eski) eski.remove();
      var s = siradaki("sinav"), t = siradaki("tatil"), h = [];
      if (s) { var a = kalanYazi(s); h.push("Sınava " + a.sayi + " " + a.ek); }
      if (t) { var b = kalanYazi(t); h.push("Tatile " + b.sayi + " " + b.ek); }
      if (!h.length) return;
      var d = document.createElement("div"); d.className = "afis-chips";
      d.innerHTML = h.map(function (x) { return "<span>" + x + "</span>"; }).join("");
      kutu.appendChild(d);
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
})();

/* Alt menü: 5 sekme + ortada yükselen "Menü" düğmesi (Takvim, Yolculuk, Araçlar burada) */
(function () {
  function kur() {
    var yan = document.querySelector("nav.yan");
    if (!yan || document.getElementById("kc-orta")) return;
    var ic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/></svg>';
    var orta = document.createElement("button");
    orta.id = "kc-orta"; orta.type = "button"; orta.className = "kc-orta"; orta.setAttribute("aria-label", "Menü");
    orta.innerHTML = ic;
    yan.appendChild(orta);

    var perde = document.createElement("div");
    perde.className = "kc-sheet-perde"; perde.hidden = true;
    perde.innerHTML = '<div class="kc-sheet" role="dialog" aria-label="Menü"><div class="kc-sheet-tut"></div><div class="kc-sheet-izgara">' +
      '<button type="button" data-git="takvim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Takvim</button>' +
      '<button type="button" data-yol="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6 17l1.5-6h9L18 17M8 11l1-4h6l1 4"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/></svg>Yol arkadaşı</button>' +
      '<button type="button" data-git="araclar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>Araçlar</button>' +
      '</div></div>';
    document.body.appendChild(perde);
    function ac() { perde.hidden = false; requestAnimationFrame(function () { perde.classList.add("acik"); }); }
    function kapat() { perde.classList.remove("acik"); setTimeout(function () { perde.hidden = true; }, 200); }
    orta.addEventListener("click", ac);
    perde.addEventListener("click", function (e) {
      if (e.target === perde) return kapat();
      var b = e.target.closest("button"); if (!b) return;
      kapat();
      if (b.dataset.yol) location.href = "yol-arkadasi/";
      else if (window.sayfaAc) sayfaAc(b.dataset.git);
    });
    function isaret(id) { orta.classList.toggle("aktif", id === "takvim" || id === "araclar"); }
    if (window.sayfaAc) {
      var eski = window.sayfaAc;
      window.sayfaAc = function (id) { var r = eski.apply(this, arguments); isaret(id || "ana"); return r; };
      window.sayfaAc.ilk = eski.ilk;
      var ilk = document.querySelector(".sayfa.aktif"); if (ilk) isaret(ilk.id);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
})();
