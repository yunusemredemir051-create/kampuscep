/* Sponsorlu alan.
   CADDE_KATIK_AKTIF = true yapılınca Cadde Katık menü reklamları döner;
   false iken "Bu alana reklam verebilirsiniz" kartı görünür. */
(function () {
  const CADDE_KATIK_AKTIF = true;

  const TEL = "+904245022323";
  const R = "/gorseller/vitrin/";
  const reklamlar = [
    { baslik: "Menü 1", icerik: "Tavuk dürüm · patates · ayran", fiyat: "200 TL", resim: "caddekatik-menu1.webp" },
    { baslik: "Menü 1 Plus", icerik: "Tavuk dürüm · patates · kola", fiyat: "220 TL", resim: "caddekatik-menu1plus.webp" },
    { baslik: "Aile Menüsü 1", icerik: "3 tavuk dürüm · patates · 1 L içecek", fiyat: "550 TL", resim: "caddekatik-aile1.webp" },
    { baslik: "Aile Menüsü 2", icerik: "4 tavuk dürüm · patates · 1 L içecek", fiyat: "650 TL", resim: "caddekatik-aile2.webp" },
    { baslik: "Aile Menüsü 3", icerik: "5 tavuk dürüm · patates · 1 L içecek", fiyat: "750 TL", resim: "caddekatik-aile3.webp" }
  ];
  const yurtKarsisi = location.pathname.includes("ahmet-kabakli");
  const yedek = `<svg viewBox="0 0 80 80"><rect width="80" height="80" fill="#3a1d17"/><g transform="rotate(-20 40 40)"><rect x="10" y="30" width="60" height="22" rx="11" fill="#e3b778"/><circle cx="18" cy="38" r="3.5" fill="#b5652c"/><circle cx="21" cy="45" r="3" fill="#6fbf4a"/><rect x="54" y="28" width="16" height="26" rx="4" fill="#fff"/><path d="M56 33h12M56 38h12M56 43h12M56 48h12" stroke="#e53935" stroke-width="2"/></g></svg>`;

  const css = `
  .vitrin.ck-var{display:block!important;contain:inline-size;border:0;background:none;min-height:0;padding:0;margin-top:18px}
  .ck{width:100%;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:10px;border-radius:18px;text-decoration:none;color:inherit;
      background:rgba(255,255,255,.78);border:1px solid rgba(20,27,52,.07);box-shadow:0 8px 24px -16px rgba(40,60,140,.35)}
  .ck-resim{width:84px;height:84px;flex:none;border-radius:14px;overflow:hidden;background:#3a1d17}
  .ck-resim img,.ck-resim svg{width:100%;height:100%;object-fit:cover;display:block}
  .ck-orta{flex:1;min-width:0;overflow:hidden}
  .ck-ust{font-size:11px;font-weight:700;color:#8a90a8;display:flex;gap:6px;align-items:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ck-ust b{color:#c62828;font-weight:800}
  .ck-baslik{font-weight:800;font-size:15px;color:#141b34;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ck-icerik{font-size:12px;color:#6b7390;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ck-alt{display:flex;align-items:center;gap:8px;margin-top:4px;min-width:0}
  .ck-yer{font-size:11px;font-weight:700;color:#8a90a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ck-fiyat{flex:none;display:inline-block;font-size:12.5px;font-weight:800;color:#fff;background:#e53935;border-radius:8px;padding:2px 8px}
  .ck-resim.rv{background:none;overflow:visible}
  .ck-rv{position:relative;overflow:hidden}
  .ck-rv::before{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;transform:skewX(-20deg);
    background:linear-gradient(90deg,transparent,rgba(139,92,246,.18),transparent);animation:ck-parilti 3.6s ease-in-out infinite}
  .ck-rv .ck-resim img{animation:ck-zipla 2.4s ease-in-out infinite;transform-origin:50% 90%}
  .ck-rv .ck-fiyat{animation:ck-nabiz 1.8s ease-in-out infinite}
  @keyframes ck-zipla{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-4px) rotate(-4deg)}50%{transform:translateY(0) rotate(0)}75%{transform:translateY(-2px) rotate(3deg)}}
  @keyframes ck-parilti{0%{left:-60%}55%,100%{left:130%}}
  @keyframes ck-nabiz{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.5)}50%{box-shadow:0 0 0 6px rgba(37,211,102,0)}}
  @media (prefers-reduced-motion:reduce){.ck-rv::before,.ck-rv .ck-resim img,.ck-rv .ck-fiyat{animation:none}}
  .ck-ara{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#e53935;color:#fff;box-shadow:0 8px 16px -8px #e53935}
  .ck-ara svg{width:20px;height:20px}

  .vitrin.ck-var{align-self:stretch;width:100%}
  .ckb{display:block;width:100%;box-sizing:border-box;position:relative;height:170px;border-radius:20px;overflow:hidden;text-decoration:none;color:#fff;background:#3a1d17;box-shadow:0 10px 26px -16px rgba(40,60,140,.5)}
  .ckb img{width:100%;height:100%;object-fit:cover;display:block}
  .ckb-yazi{position:absolute;left:0;right:0;bottom:0;padding:34px 14px 12px;background:linear-gradient(transparent,rgba(0,0,0,.82))}
  .ckb-ust{font-size:11px;font-weight:700;opacity:.85}
  .ckb-baslik{font-size:18px;font-weight:800;margin-top:2px}
  .ckb-alt{display:flex;align-items:center;gap:8px;font-size:12px;margin-top:2px}
  .ckb-alt .ck-fiyat{margin-left:auto}
  .ckb-ara{position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#e53935;color:#fff}
  .ckb-ara svg{width:18px;height:18px}
  .ckd{height:auto;aspect-ratio:4/5;max-width:340px;margin-inline:auto}
  .ckd .ckb-baslik{font-size:22px}
  .ckd .ckb-yazi{padding-top:70px}
  .ckd .ckb-btn{display:block;margin-top:10px;background:#e53935;color:#fff;text-align:center;border-radius:12px;padding:10px;font-weight:800;font-size:14px}
  .ckm{display:flex;width:100%;box-sizing:border-box;align-items:center;gap:10px;padding:7px 12px;border-radius:99px;background:rgba(255,255,255,.78);border:1px solid rgba(20,27,52,.07);text-decoration:none;color:#141b34}
  .ckm img{width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none}
  .ckm b{flex:1;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ckm i{font-style:normal;font-size:11px;font-weight:800;color:#c62828}
  .ck-onizleme{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:999;background:#141b34;color:#fff;font:700 12px/1 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.85}
  .ck-onizleme a{color:#9fb3ff;margin-left:8px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const ara = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`;
  if (!CADDE_KATIK_AKTIF) {
    const mesaj = encodeURIComponent("Merhaba, KampüsCepte'de sponsorluk / reklam vermek istiyorum.");
    document.querySelectorAll(".vitrin").forEach(kutu => {
      kutu.classList.add("ck-var");
      kutu.innerHTML = `<a class="ck ck-rv" href="https://wa.me/905437813895?text=${mesaj}">
        <div class="ck-resim rv"><img src="${R}reklam-ver.webp" alt="" onerror="this.remove()"></div>
        <div class="ck-orta">
          <div class="ck-ust"><b style="color:#3b5bfd">Sponsorlu alan</b></div>
          <div class="ck-baslik">Bu alana reklam verebilirsiniz</div>
          <div class="ck-icerik">İşletmenizi Elazığ'daki öğrencilere tanıtın</div>
          <div class="ck-alt"><span class="ck-fiyat" style="background:#25d366">WhatsApp'tan yaz</span><span class="ck-yer">0543 781 38 95</span></div>
        </div>
      </a>`;
    });
    return;
  }
  /* Üst reklamlar: ara ara (her açılışta ~%50) sayfaların üstünde de küçük bir reklam çıkar */
  if (document.getElementById("ana") && Math.random() < 0.5) {
    const ust = (sayfa, ilkEl) => {
      const el = document.createElement("div");
      el.className = "vitrin"; el.dataset.boyut = Math.random() < 0.5 ? "mini" : "serit"; el.style.order = "0";
      if (ilkEl) ilkEl.insertAdjacentElement("afterend", el); else sayfa.insertBefore(el, sayfa.firstElementChild);
    };
    const ana = document.getElementById("ana");
    ust(ana, ana.querySelector(".afis"));
    ["yurtlar", "notlar", "takvim"].forEach(id => { const k = document.getElementById(id); if (k && Math.random() < 0.6) ust(k); });
  }
  let sira = Math.floor(Math.random() * reklamlar.length);
  document.querySelectorAll(".vitrin").forEach(kutu => {
    const r = reklamlar[sira++ % reklamlar.length];
    kutu.classList.add("ck-var");
    const boyut = kutu.dataset.boyut || "serit";
    const img = `<img src="${R + r.resim}" alt="" onerror="this.style.display='none'">`;
    if (boyut === "banner" || boyut === "dikey") {
      kutu.innerHTML = `<a class="ckb ${boyut === "dikey" ? "ckd" : ""}" href="tel:${TEL}" aria-label="Cadde Katık'ı ara: ${r.baslik} ${r.fiyat}">${img}
        <span class="ckb-ara">${ara}</span>
        <div class="ckb-yazi"><div class="ckb-ust">Sponsorlu · Cadde Katık</div><div class="ckb-baslik">${r.baslik}</div>
          <div class="ckb-alt"><span>${r.icerik}</span><span class="ck-fiyat">${r.fiyat}</span></div>
          ${boyut === "dikey" ? '<span class="ckb-btn">Hemen ara</span>' : ""}</div></a>`;
      return;
    }
    if (boyut === "mini") {
      kutu.innerHTML = `<a class="ckm" href="tel:${TEL}">${img}<b>Cadde Katık · ${r.baslik}</b><i>${r.fiyat}</i></a>`;
      return;
    }
    kutu.innerHTML = `<a class="ck" href="tel:${TEL}" aria-label="Cadde Katık'ı ara: ${r.baslik} ${r.fiyat}">
      <div class="ck-resim"><img src="${R + r.resim}" alt="" onerror="this.outerHTML=this.parentNode.dataset.y"></div>
      <div class="ck-orta">
        <div class="ck-ust"><b>Cadde Katık</b>· Sponsorlu</div>
        <div class="ck-baslik">${r.baslik}</div>
        <div class="ck-icerik">${r.icerik}</div>
        <div class="ck-alt"><span class="ck-fiyat">${r.fiyat}</span><span class="ck-yer">${yurtKarsisi ? "Yurdunun karşısında" : "Ahmet Kabaklı karşısı"}</span></div>
      </div>
      <span class="ck-ara">${ara}</span>
    </a>`;
    kutu.querySelector(".ck-resim").dataset.y = yedek;
  });
})();
