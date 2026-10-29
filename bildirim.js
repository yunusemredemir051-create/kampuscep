/* Uygulama içi bildirimler (toast): üstten kayan, ikonlu, tek tip. window.kcBildirim(mesaj, tur?) — tur: ok | hata | bilgi (verilmezse mesajdan çıkarılır) */
(function () {
  var st = document.createElement("style");
  st.textContent =
    "#kc-bildirim{position:fixed;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:10001;display:flex;justify-content:center;padding:0 14px;pointer-events:none}" +
    ".kcb{display:flex;align-items:center;gap:11px;max-width:420px;width:auto;padding:11px 16px 11px 12px;border-radius:18px;background:rgba(255,255,255,.92);color:#141b34;-webkit-backdrop-filter:blur(18px) saturate(1.6);backdrop-filter:blur(18px) saturate(1.6);border:1px solid rgba(20,27,52,.08);box-shadow:0 18px 40px -14px rgba(20,27,52,.45),0 2px 6px rgba(20,27,52,.08);font:700 14px/1.3 var(--font,system-ui,sans-serif);opacity:0;transform:translateY(-22px) scale(.96);transition:opacity .22s ease,transform .32s cubic-bezier(.16,1,.3,1)}" +
    ".kcb.goster{opacity:1;transform:none}" +
    ".kcb i{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;color:#fff;background:var(--kcb,#3b5bfd)}" +
    ".kcb i svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}" +
    ".kcb.ok{--kcb:linear-gradient(145deg,#34d399,#10b981)}.kcb.hata{--kcb:linear-gradient(145deg,#fb7185,#e11d48)}.kcb.bilgi{--kcb:linear-gradient(145deg,#60a5fa,#3b5bfd)}" +
    ".kcb span{min-width:0;overflow-wrap:anywhere}" +
    "html[data-tema=koyu] .kcb{background:rgba(30,36,58,.92);color:#f0f3fe;border-color:rgba(255,255,255,.1)}" +
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
