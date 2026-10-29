/* KampüsCepte ses efektleri — dosya yok, WebAudio ile üretilir (yumuşak kalimba/cam tınıları + hafif yankı).
   window.KC_SES.cal(ad); KC_SES.acik(bool). Arka planda medya bildirimi çıkarmaz (<audio> kullanılmaz). */
(function () {
  var ctx = null, ana = null, yank = null;
  function zincir(c, hedef) {
    var g = c.createGain(); g.gain.value = 0.85;
    var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 6500; lp.Q.value = 0.4;
    var kuru = c.createGain(); kuru.gain.value = 1;
    var islak = c.createGain(); islak.gain.value = 0.22;
    var cv = c.createConvolver();
    var n = Math.floor(c.sampleRate * 1.3), ir = c.createBuffer(2, n, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    cv.buffer = ir;
    var k = c.createDynamicsCompressor();
    g.connect(lp); lp.connect(kuru); lp.connect(cv); cv.connect(islak); kuru.connect(k); islak.connect(k); k.connect(hedef || c.destination);
    return g;
  }
  function hazir() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC(); ana = zincir(ctx);
    return ctx;
  }
  /* zarf: hızlı atak, üstel sönüm */
  function zarf(g, z, d, v, atak) {
    atak = atak || 0.008;
    g.gain.setValueAtTime(0.0001, z); g.gain.linearRampToValueAtTime(v, z + atak); g.gain.exponentialRampToValueAtTime(0.0001, z + d);
  }
  /* kalimba/marimba: temel sinüs + hızlı sönen 4. harmonik */
  function pluck(f, t, d, v) {
    var c = ctx, z = c.currentTime + t;
    [[1, 1, d], [4, 0.22, d * 0.22], [9.2, 0.05, d * 0.1]].forEach(function (p) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f * p[0]; zarf(g, z, p[2], v * p[1], 0.004);
      o.connect(g); g.connect(ana); o.start(z); o.stop(z + p[2] + 0.05);
    });
  }
  /* cam/çan: FM, modülasyon hızla sönerek yumuşak tını bırakır */
  function cam(f, t, d, v) {
    var c = ctx, z = c.currentTime + t;
    var o = c.createOscillator(), m = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    o.type = "sine"; o.frequency.value = f; m.type = "sine"; m.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 1.6, z); mg.gain.exponentialRampToValueAtTime(f * 0.02, z + d * 0.45);
    m.connect(mg); mg.connect(o.frequency); zarf(g, z, d, v, 0.006);
    o.connect(g); g.connect(ana); o.start(z); m.start(z); o.stop(z + d + 0.05); m.stop(z + d + 0.05);
  }
  /* hışırtı: filtrelenmiş gürültü, frekans süpürmeli */
  function hisirti(t, d, v, f1, f2) {
    var c = ctx, z = c.currentTime + t, n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0);
    for (var i = 0; i < n; i++) x[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(); s.buffer = b;
    var f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(f1, z); f.frequency.exponentialRampToValueAtTime(f2, z + d);
    var g = c.createGain(); g.gain.setValueAtTime(0.0001, z); g.gain.linearRampToValueAtTime(v, z + d * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, z + d);
    s.connect(f); f.connect(g); g.connect(ana); s.start(z);
  }
  /* yumuşak vuruş (tok, düşük) */
  function vurus(f, t, d, v) {
    var c = ctx, z = c.currentTime + t, o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(f * 1.5, z); o.frequency.exponentialRampToValueAtTime(f, z + 0.06);
    zarf(g, z, d, v, 0.004); o.connect(g); g.connect(ana); o.start(z); o.stop(z + d + 0.05);
  }
  /* piyano benzeri: harmonik seri, üst harmonikler daha hızlı söner */
  function piyano(f, t, d, v) {
    var c = ctx, z = c.currentTime + t;
    [[1, 1, 1], [2, 0.42, 0.7], [3, 0.2, 0.5], [4, 0.1, 0.35], [5, 0.05, 0.25]].forEach(function (p) {
      var o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f * p[0];
      zarf(g, z, d * p[2], v * p[1], 0.006); o.connect(g); g.connect(ana); o.start(z); o.stop(z + d * p[2] + 0.05);
    });
  }
  /* çan: eşuyumsuz üst tonlar (kule saati / kampüs çanı) */
  function can(f, t, d, v) {
    var c = ctx, z = c.currentTime + t;
    [[1, 1, 1], [2.0, 0.55, 0.8], [2.76, 0.35, 0.55], [5.4, 0.16, 0.32], [8.93, 0.07, 0.18]].forEach(function (p) {
      var o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f * p[0];
      zarf(g, z, d * p[2], v * p[1], 0.004); o.connect(g); g.connect(ana); o.start(z); o.stop(z + d * p[2] + 0.05);
    });
  }
  /* sayfa çevirme: kısa, parlak kâğıt hışırtısı */
  function sayfa(t, v) { hisirti(t, 0.16, v, 3200, 7000); hisirti(t + 0.05, 0.2, v * 0.6, 1800, 4200); }
  /* tahta tıkırtı */
  function tahta(f, t, d, v) { vurus(f, t, d, v); hisirti(t, 0.03, v * 0.35, 1500, 900); }
  var N = { E4: 329.63, Gs4: 415.3, Fs4: 369.99, B3: 246.94, G4: 392, B4: 493.88, D5: 587.33, E5: 659.25, G5: 783.99, B5: 987.77, D6: 1174.66 };
  var SESLER = {
    /* açılış: kampüs saat kulesi — dört çanlı kısa dizi */
    acilis: function () { can(N.E4 * 2, 0, 1.2, 0.14); can(N.Gs4 * 2, 0.3, 1.2, 0.13); can(N.Fs4 * 2, 0.6, 1.2, 0.13); can(N.B3 * 2, 0.95, 2.0, 0.15); },
    menu: function () { sayfa(0, 0.07); piyano(N.D5, 0.12, 0.7, 0.1); },
    kapat: function () { vurus(120, 0, 0.22, 0.24); hisirti(0, 0.12, 0.07, 2600, 1200); },
    basari: function () { piyano(N.G5, 0, 0.8, 0.15); piyano(N.B5, 0.1, 1.1, 0.14); },
    hata: function () { tahta(150, 0, 0.18, 0.22); tahta(125, 0.17, 0.26, 0.2); },
    bilgi: function () { can(N.G5 * 1.5, 0, 0.9, 0.12); },
    sekme: function () { sayfa(0, 0.09); },
    tik: function () { piyano(N.B5, 0, 0.12, 0.06); },
    yildiz: function () { piyano(N.G5, 0, 0.7, 0.12); piyano(N.B5, 0.09, 0.7, 0.12); piyano(N.D6, 0.18, 1.3, 0.13); },
    yenile: function () { sayfa(0, 0.06); sayfa(0.14, 0.06); piyano(N.E5, 0.3, 0.7, 0.1); }
  };
  var acik = true; try { acik = localStorage.getItem("kc-ses") !== "0"; } catch (e) {}
  function ac() { var c = hazir(); if (c && c.state === "suspended") c.resume(); }
  ["touchend", "pointerup", "click", "keydown"].forEach(function (o) { addEventListener(o, ac, { capture: true, passive: true }); });
  window.KC_SES = {
    cal: function (ad, zorla) {
      if (!acik && !zorla) return; if (!hazir() || !SESLER[ad]) return;
      try { if (ctx.state !== "running") { ctx.resume().then(function () { SESLER[ad](); }); return; } SESLER[ad](); } catch (e) {}
    },
    acik: function (v) { if (v === undefined) return acik; acik = !!v; try { localStorage.setItem("kc-ses", acik ? "1" : "0"); } catch (e) {} return acik; },
    calisiyor: function () { var c = hazir(); return !!c && c.state === "running"; },
    adlar: Object.keys(SESLER),
    /* test: çevrimdışı çiz, tepe ve süre döndür */
    _ciz: function (ad) {
      var off = new OfflineAudioContext(2, 44100 * 3, 44100), eski = [ctx, ana];
      ctx = off; ana = zincir(off); SESLER[ad]();
      return off.startRendering().then(function (b) { ctx = eski[0]; ana = eski[1]; var d = b.getChannelData(0), p = 0, son = 0; for (var i = 0; i < d.length; i++) { var a = Math.abs(d[i]); if (a > p) p = a; if (a > 0.003) son = i; } return { ad: ad, tepe: +p.toFixed(3), sure: +(son / 44100).toFixed(2) }; });
    }
  };
})();
