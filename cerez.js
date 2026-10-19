/* Çerez bilgilendirmesi: bir kez "Tamam" denince bir daha gösterilmez. */
(function () {
  try { if (localStorage.getItem("kc-cerez") === "1") return; } catch (e) {}
  var kok = (document.currentScript && document.currentScript.getAttribute("src") || "").replace(/cerez\.js.*$/, "");
  var kutu = document.createElement("div");
  kutu.setAttribute("role", "region");
  kutu.setAttribute("aria-label", "Çerez bilgilendirmesi");
  kutu.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(var(--cerez-alt,16px) + env(safe-area-inset-bottom,0px));z-index:100;" +
    "max-width:560px;margin:0 auto;display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;" +
    "background:rgba(20,27,52,.94);color:#fff;font:500 13px/1.5 'Plus Jakarta Sans','Segoe UI',sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,.4)";
  kutu.innerHTML = '<span style="flex:1">Tercihlerini hatırlamak için cihazında küçük kayıtlar tutuyoruz; ileride reklam ortaklarımız çerez kullanabilir. ' +
    '<a href="' + kok + 'gizlilik.html" style="color:#b9c6ff;font-weight:700">Ayrıntılar</a></span>' +
    '<button type="button" style="border:0;border-radius:10px;padding:9px 14px;background:#3b5bfd;color:#fff;font:700 13px inherit;cursor:pointer">Tamam</button>';
  kutu.querySelector("button").onclick = function () {
    try { localStorage.setItem("kc-cerez", "1"); } catch (e) {}
    kutu.remove();
  };
  document.body.appendChild(kutu);
})();
