/* KampüsCepte ses efektleri — dosya yok, WebAudio ile üretilir. window.KC_SES.cal(ad); KC_SES.acik(bool) */
(function () {
  var ctx = null, ana = null;
  function hazir() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC(); ana = ctx.createGain(); ana.gain.value = 0.9;
    var k = ctx.createDynamicsCompressor(); ana.connect(k); k.connect(ctx.destination);
    return ctx;
  }
  /* tek nota: f Hz, t sn sonra başla, d sn sürsün, v ses, tip dalga */
  function nota(f, t, d, v, tip, f2) {
    var c = ctx, o = c.createOscillator(), g = c.createGain(), z = c.currentTime + t;
    o.type = tip || "sine"; o.frequency.setValueAtTime(f, z);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, z + d);
    g.gain.setValueAtTime(0.0001, z); g.gain.exponentialRampToValueAtTime(v, z + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, z + d);
    o.connect(g); g.connect(ana); o.start(z); o.stop(z + d + 0.05);
  }
  /* parlak çan sesi: temel + 2. ve 3. harmonik */
  function can(f, t, d, v) { nota(f, t, d, v); nota(f * 2.01, t, d * 0.6, v * 0.35); nota(f * 3.02, t, d * 0.35, v * 0.12); }
  /* iOS: sessiz anahtarı ve ilk dokunuş kilidini aşmak için ses oturumunu "playback" yap, sessiz bir ses çal */
  var kilit = false;
  function ac() {
    var c = hazir(); if (!c) return;
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try { var b = c.createBuffer(1, 1, 22050), n = c.createBufferSource(); n.buffer = b; n.connect(c.destination); n.start(0); } catch (e) {}
    if (kilit) return; kilit = true;
    try {
      var a = document.createElement("audio");
      a.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      a.loop = true; a.setAttribute("playsinline", ""); a.volume = 0.01; a.play().catch(function () {});
    } catch (e) {}
  }
  ["touchend", "pointerup", "click", "keydown"].forEach(function (o) { addEventListener(o, ac, { capture: true, passive: true }); });
  var SESLER = {
    acilis: function () { can(523.25, 0, 0.9, 0.16); can(659.25, 0.11, 0.9, 0.15); can(783.99, 0.22, 0.9, 0.15); can(1046.5, 0.34, 1.3, 0.16); },
    menu: function () { nota(520, 0, 0.16, 0.11, "triangle", 880); nota(880, 0.07, 0.2, 0.08, "sine"); },
    kapat: function () { nota(760, 0, 0.14, 0.09, "triangle", 420); },
    basari: function () { can(659.25, 0, 0.35, 0.13); can(987.77, 0.1, 0.5, 0.13); },
    hata: function () { nota(300, 0, 0.18, 0.12, "sawtooth", 220); nota(220, 0.14, 0.26, 0.11, "sawtooth", 160); },
    bilgi: function () { can(880, 0, 0.3, 0.1); },
    sekme: function () { nota(620, 0, 0.07, 0.07, "sine", 740); },
    tik: function () { nota(1200, 0, 0.035, 0.06, "square"); },
    yildiz: function () { can(784, 0, 0.25, 0.1); can(988, 0.08, 0.25, 0.1); can(1319, 0.16, 0.45, 0.11); },
    yenile: function () { nota(400, 0, 0.18, 0.08, "sine", 800); nota(800, 0.12, 0.2, 0.07, "sine", 1200); }
  };
  var acik = true; try { acik = localStorage.getItem("kc-ses") !== "0"; } catch (e) {}
  window.KC_SES = {
    cal: function (ad, zorla) { if (!acik && !zorla) return; if (!hazir() || !SESLER[ad]) return; try { if (ctx.state !== "running") { ctx.resume().then(function () { SESLER[ad](); }); return; } SESLER[ad](); } catch (e) {} },
    acik: function (v) { if (v === undefined) return acik; acik = !!v; try { localStorage.setItem("kc-ses", acik ? "1" : "0"); } catch (e) {} return acik; },
    calisiyor: function () { var c = hazir(); return !!c && c.state === "running"; },
    adlar: Object.keys(SESLER)
  };
})();
