/* KampüsCepte — canlı skor bandı + tebrik kartı.
   Veri: Cloudflare Worker (_kaynak/skor-worker.js). SKOR_URL boşsa hiçbir şey yapmaz.
   Tebrik yalnızca: yabancı rakibe karşı kazanılan, Süper Lig dışındaki (Avrupa) maçlarda ve Türkiye Milli Takımı maçlarında çıkar. */
(function () {
  "use strict";
  var SKOR_URL = "https://kc-skor.yunusemredemir051.workers.dev";
  if (!SKOR_URL) return;
  var SUPER_LIG = 203, TR_MILLI = 777;
  var RENK = { 645: ["#a90432", "#fdb913"], 611: ["#00205b", "#ffed00"], 549: ["#111111", "#9aa0aa"], 998: ["#7b0f2e", "#2a8fd6"], 777: ["#e30a17", "#ffffff"] };
  var CANLI = { "1H": 1, "HT": 1, "2H": 1, "ET": 1, "BT": 1, "P": 1, "LIVE": 1, "INT": 1 }, BITTI = { FT: 1, AET: 1, PEN: 1 };
  function oku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function yaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ad(t) { return t.id === TR_MILLI ? "Türkiye" : t.ad; }
  var TURK = { 645: 1, 611: 1, 549: 1, 998: 1, 777: 1 };

  var st = document.createElement("style");
  st.textContent = ".kc-skor{margin:10px 0 0;width:0;min-width:100%;box-sizing:border-box;display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x proximity;padding:2px 1px 4px;-webkit-overflow-scrolling:touch;scrollbar-width:none}.kc-skor::-webkit-scrollbar{display:none}" +
    ".kc-mac{flex:0 0 auto;width:152px;scroll-snap-align:start;padding:7px 10px 6px;border-radius:12px;background:var(--kart,rgba(255,255,255,.82));border:1px solid var(--cizgi,rgba(120,130,170,.22));font:700 12px/1.2 var(--font,system-ui,sans-serif);color:var(--yazi,#141b34);box-sizing:border-box}" +
    ".kc-mac .r{display:flex;align-items:center;gap:6px;min-height:21px}.kc-mac .r img{width:16px;height:16px;object-fit:contain;flex:0 0 auto}.kc-mac .r b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}.kc-mac .r em{font-style:normal;font-weight:800;font-size:13px;min-width:12px;text-align:right}" +
    ".kc-mac .a{margin-top:3px;font-size:10px;font-weight:600;color:var(--soluk,#6b7390);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".kc-mac.canli .a{color:#e5253d}.kc-mac.canli .a::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:#e5253d;margin-right:4px;animation:kcnb 1.2s infinite}" +
    "@keyframes kcnb{50%{opacity:.25}}.kc-skor:empty{display:none}" +
    ".kc-tebrik{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;background:rgba(10,14,28,.62);padding:20px}" +
    ".kc-tebrik .k{position:relative;overflow:hidden;width:min(340px,100%);border-radius:24px;padding:30px 22px 22px;text-align:center;color:#fff;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}" +
    ".kc-tebrik .e{font-size:46px}.kc-tebrik h3{margin:6px 0 4px;font-size:21px}.kc-tebrik p{margin:0 0 14px;font-size:14px;opacity:.92}" +
    ".kc-tebrik button{all:unset;cursor:pointer;padding:10px 22px;border-radius:99px;background:rgba(255,255,255,.2);font-weight:800;font-size:14px}" +
    ".kc-tebrik .k i{position:absolute;top:-12px;width:8px;height:14px;border-radius:2px;animation:kcdus linear infinite}" +
    "@keyframes kcdus{to{transform:translateY(420px) rotate(540deg)}}";
  document.head.appendChild(st);

  function logo(t) { return '<img src="https://media.api-sports.io/football/teams/' + t.id + '.png" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">'; }
  function bantYap(maclar) {
    var kutu = document.getElementById("kc-skor");
    if (!kutu) {
      var yer = document.querySelector("#ana .afis") || document.querySelector("main > .ust");
      if (!yer) return;
      kutu = document.createElement("div"); kutu.id = "kc-skor"; kutu.className = "kc-skor"; kutu.setAttribute("translate", "no"); kutu.setAttribute("data-ceviri-yok", "");
      yer.insertAdjacentElement("afterend", kutu);
    }
    kutu.innerHTML = maclar.map(function (m) {
      var canli = CANLI[m.durum], bitti = BITTI[m.durum], basladi = canli || bitti;
      var saat = new Date(m.zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
      var g1 = basladi ? (m.ev.gol == null ? 0 : m.ev.gol) : "", g2 = basladi ? (m.dep.gol == null ? 0 : m.dep.gol) : "";
      var lig = m.lig.replace("UEFA ", "").replace("Şampiyonlar Ligi", "Şampiyonlar L.");
      var alt = canli ? (m.durum === "HT" ? "Devre arası" : (m.dk || "") + "'") + " · " + lig : bitti ? "MS · " + lig : saat + " · " + lig;
      return '<div class="kc-mac' + (canli ? " canli" : "") + '"><div class="r">' + logo(m.ev) + "<b>" + ad(m.ev) + "</b><em>" + g1 + '</em></div><div class="r">' + logo(m.dep) + "<b>" + ad(m.dep) + "</b><em>" + g2 + '</em></div><div class="a">' + alt + "</div></div>";
    }).join("");
  }

  function tebrikGoster(takim, rakip) {
    var r = RENK[takim.id] || ["#3765fe", "#5b61fc"], d = document.createElement("div"); d.className = "kc-tebrik"; d.setAttribute("translate", "no"); d.setAttribute("data-ceviri-yok", "");
    var konfeti = ""; for (var i = 0; i < 26; i++) konfeti += '<i style="left:' + (Math.random() * 100) + '%;background:' + (i % 2 ? r[1] : "#fff") + ";animation-duration:" + (2.2 + Math.random() * 2) + "s;animation-delay:-" + (Math.random() * 3) + 's"></i>';
    d.innerHTML = '<div class="k" style="background:linear-gradient(160deg,' + r[0] + "," + r[0] + ' 55%,' + r[1] + '55)">' + konfeti + '<div class="e">🏆</div><h3>' + ad(takim) + " kazandı!</h3><p>" + ad(rakip) + " karşısındaki galibiyetin için tebrikler! 🎉</p><button>Teşekkürler</button></div>";
    d.addEventListener("click", function (e) { if (e.target === d || e.target.tagName === "BUTTON") d.remove(); });
    document.body.appendChild(d);
  }
  function tebrikKontrol(maclar) {
    maclar.forEach(function (m) {
      if (!BITTI[m.durum] || m.ligId === SUPER_LIG || oku("kc-tebrik-" + m.id)) return;
      var biz = TURK[m.ev.id] && m.ev.kazandi ? m.ev : TURK[m.dep.id] && m.dep.kazandi ? m.dep : null;
      var rk = biz === m.ev ? m.dep : m.ev;
      if (!biz || TURK[rk.id]) return; /* rakip yabancı olmalı */
      /* sayfa açılmadan çok önce bitmiş maçı yeniden gösterme: son 6 saat */
      if (Date.now() - new Date(m.zaman).getTime() > 8 * 3600e3) return;
      yaz("kc-tebrik-" + m.id, "1"); tebrikGoster(biz, rk);
    });
  }

  /* ÖNİZLEME: ?skor=onizleme eklenirse örnek maçlar gösterilir (sadece o sayfada, gerçek veri çekilmez) */
  var ONIZLEME = /[?&]skor=onizleme/.test(location.search);
  function ornek() {
    var n = Date.now(), z = function (dk) { return new Date(n + dk * 60000).toISOString(); };
    return [
      { id: 9001, lig: "Süper Lig", ligId: SUPER_LIG, zaman: z(-60), durum: "2H", dk: 63, ev: { id: 645, ad: "Galatasaray", gol: 2 }, dep: { id: 611, ad: "Fenerbahçe", gol: 1 } },
      { id: 9002, lig: "UEFA Avrupa Ligi", ligId: 3, zaman: z(-130), durum: "FT", ev: { id: 549, ad: "Beşiktaş", gol: 3, kazandi: true }, dep: { id: 900, ad: "Ajax", gol: 1, kazandi: false } },
      { id: 9003, lig: "UEFA Şampiyonlar Ligi", ligId: 2, zaman: z(200), durum: "NS", ev: { id: 2000, ad: "Real Madrid" }, dep: { id: 611, ad: "Fenerbahçe" } }
    ];
  }
  var zamanlayici;
  function cek() {
    if (ONIZLEME) { var o = ornek(); bantYap(o); if (!document.querySelector(".kc-tebrik") && !window.__tbk) { window.__tbk = 1; tebrikGoster(o[1].ev, o[1].dep); } return; }
    clearTimeout(zamanlayici);
    var sonraki = 600000;
    if (document.hidden) { zamanlayici = setTimeout(cek, 120000); return; }
    fetch(SKOR_URL, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (v) {
      var m = v.maclar || [];
      if (v.hata) { try { console.warn("[skor] Worker hata verdi:", v.hata); } catch (e) {} }
      if (!m.length && v.hata) { try { var eski = JSON.parse(localStorage.getItem("kc-skor-son") || "null"); if (eski && Date.now() - eski.t < 6 * 3600e3) m = eski.m; } catch (e) {} }
      else if (m.length) { try { localStorage.setItem("kc-skor-son", JSON.stringify({ t: Date.now(), m: m })); } catch (e) {} }
      bantYap(m); tebrikKontrol(m);
      if (m.some(function (x) { return CANLI[x.durum]; })) sonraki = 60000; else if (m.some(function (x) { return x.durum === "NS"; })) sonraki = 300000;
    }).catch(function () {}).then(function () { zamanlayici = setTimeout(cek, sonraki); });
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) cek(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cek); else cek();
})();
