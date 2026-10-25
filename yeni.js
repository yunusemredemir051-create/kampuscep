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
