/* Uygulama içi bildirimler (toast): üstten kayan, ikonlu, tek tip. window.kcBildirim(mesaj, tur?) — tur: ok | hata | bilgi (verilmezse mesajdan çıkarılır) */
(function () {
  var st = document.createElement("style");
  st.textContent =
    "#kc-bildirim{position:fixed;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:10001;display:flex;justify-content:center;padding:0 14px;pointer-events:none}" +
    ".kcb{display:flex;align-items:center;gap:11px;max-width:420px;width:auto;padding:11px 16px 11px 12px;border-radius:var(--r-3);background:var(--kart);color:var(--yazi);border:1px solid var(--cam-kenar);box-shadow:var(--golge-ust);font:700 14px/1.3 var(--font);opacity:0;transform:translateY(-22px) scale(.96);transition:opacity .22s ease,transform .32s cubic-bezier(.16,1,.3,1)}" +
    ".kcb.goster{opacity:1;transform:none}" +
    ".kcb i{flex:none;width:30px;height:30px;border-radius:var(--r-1);display:grid;place-items:center;color:#fff;background:var(--kcb,var(--mavi))}" +
    ".kcb i svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}" +
    ".kcb.ok{--kcb:var(--yesil)}.kcb.hata{--kcb:var(--pembe)}.kcb.bilgi{--kcb:var(--mavi)}" +
    ".kcb span{min-width:0;overflow-wrap:anywhere}" +
    "" +
    "#dg-toast,.kc-toast{display:none!important}";
  document.head.appendChild(st);
  var IK = {
    ok: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    hata: '<svg viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>',
    bilgi: '<svg viewBox="0 0 24 24"><path d="M12 11v6M12 7.5h.01"/></svg>'
  };
  var zaman;
  function temizle(m) {
    return String(m).replace(/^[\s✅⛔❌⭐\uD83C-􏰀-\uDFFF️‍]+/, "").replace(/[\s✅⛔❌⭐\uD83C-􏰀-\uDFFF️‍!]+$/, "").trim();
  }
  function turBul(m) {
    if (/(✅|⭐)/.test(m) && !/(⛔|❌)/.test(m)) return "ok";
    if (/(yapılamadı|gönderilemedi|silinemedi|yüklenemedi|kurulamadı|başarısız|olmadı|hata)/i.test(m)) return "hata";
    if (/(kaydedildi|kopyalandı|başarılı|yapıldı|kaldırıldı|silindi|teşekkür|verdin|eklendi|gönderildi)/i.test(m)) return "ok";
    return "bilgi";
  }
  window.kcBildirim = function (mesaj, tur) {
    var m = String(mesaj || ""); if (!m) return;
    tur = tur || turBul(m);
    var kap = document.getElementById("kc-bildirim");
    if (!kap) { kap = document.createElement("div"); kap.id = "kc-bildirim"; kap.setAttribute("role", "status"); kap.setAttribute("aria-live", "polite"); document.body.appendChild(kap); }
    kap.innerHTML = '<div class="kcb ' + tur + '"><i>' + IK[tur] + '</i><span></span></div>';
    kap.querySelector("span").textContent = temizle(m) || m;
    var k = kap.firstChild; void k.offsetWidth; k.classList.add("goster");
    if (window.KC_SES) try { window.KC_SES.cal(tur === "hata" ? "hata" : tur === "ok" ? "basari" : "bilgi"); } catch (e) {}
    clearTimeout(zaman);
    zaman = setTimeout(function () { k.classList.remove("goster"); }, 2800);
  };
})();
