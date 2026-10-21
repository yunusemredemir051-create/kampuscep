/* Sponsorlu alan — ÖNİZLEME. Yalnızca ?onizleme=reklam ile açılınca görünür; diğer ziyaretçiler hiçbir şey görmez. */
(function () {
  let acik = false;
  try {
    const q = new URLSearchParams(location.search).get("onizleme");
    if (q === "reklam") sessionStorage.setItem("kc-reklam-onizleme", "1");
    if (q === "kapat") sessionStorage.removeItem("kc-reklam-onizleme");
    acik = sessionStorage.getItem("kc-reklam-onizleme") === "1";
  } catch (e) {}
  if (!acik) return;

  const TEL = "+904245022323";
  const R = "/gorseller/reklam/";
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
  .reklam.ck-var{display:block!important;contain:inline-size;border:0;background:none;min-height:0;padding:0;margin-top:18px}
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
  .ck-ara{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#e53935;color:#fff;box-shadow:0 8px 16px -8px #e53935}
  .ck-ara svg{width:20px;height:20px}
  .ck-onizleme{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:999;background:#141b34;color:#fff;font:700 12px/1 system-ui,sans-serif;padding:8px 12px;border-radius:99px;opacity:.85}
  .ck-onizleme a{color:#9fb3ff;margin-left:8px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const ara = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`;
  let sira = Math.floor(Math.random() * reklamlar.length);
  document.querySelectorAll(".reklam").forEach(kutu => {
    const r = reklamlar[sira++ % reklamlar.length];
    kutu.classList.add("ck-var");
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
  const n = document.createElement("div"); n.className = "ck-onizleme";
  n.innerHTML = `Reklam önizlemesi<a href="?onizleme=kapat">kapat</a>`;
  document.body.appendChild(n);
})();
