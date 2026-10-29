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
  /* dokunma: kısa, yuvarlak, tok bir "tık" (klavye/cam tuş hissi); süre ~40 ms, çok düşük ses */
  function tuk(yuk, v) {
    var c = ctx, z = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    o.type = "sine"; o.frequency.setValueAtTime(520 * yuk, z); o.frequency.exponentialRampToValueAtTime(300 * yuk, z + 0.04);
    f.type = "lowpass"; f.frequency.value = 1800;
    g.gain.setValueAtTime(0.0001, z); g.gain.linearRampToValueAtTime(0.3 * v, z + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, z + 0.05);
    o.connect(f); f.connect(g); g.connect(ana); o.start(z); o.stop(z + 0.07);
  }
  var N = { G4: 392, B4: 493.88, D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99, B5: 987.77, D6: 1174.66, E4: 329.63, A4: 440, A5: 880 };
  var SESLER = {
    acilis: function () { pluck(N.G4, 0, 1.0, 0.2); pluck(N.B4, 0.12, 1.0, 0.18); pluck(N.D5, 0.24, 1.1, 0.18); cam(N.G5, 0.38, 1.6, 0.14); },
    menu: function () { hisirti(0, 0.22, 0.06, 500, 2400); pluck(N.D5, 0.1, 0.5, 0.12); },
    kapat: function () { hisirti(0, 0.2, 0.08, 2200, 450); pluck(N.G4, 0.04, 0.4, 0.14); },
    basari: function () { cam(N.E5, 0, 0.7, 0.14); cam(N.B5, 0.11, 1.0, 0.13); },
    hata: function () { vurus(165, 0, 0.35, 0.22); vurus(130, 0.15, 0.45, 0.2); },
    bilgi: function () { cam(N.A5, 0, 0.6, 0.2); },
    sekme: function () { tuk(1, 0.5); },
    tik: function () { tuk(0.8, 0.4); },
    yildiz: function () { cam(N.G5, 0, 0.6, 0.12); cam(N.B5, 0.09, 0.6, 0.12); cam(N.D6, 0.18, 1.1, 0.13); },
    yenile: function () { hisirti(0, 0.35, 0.06, 400, 3000); pluck(N.E5, 0.28, 0.5, 0.1); }
  };
  var acik = true; try { acik = localStorage.getItem("kc-ses") !== "0"; } catch (e) {}
  function ac() { var c = hazir(); if (c && c.state === "suspended") c.resume(); }
  ["touchend", "pointerup", "click", "keydown"].forEach(function (o) { addEventListener(o, ac, { capture: true, passive: true }); });
  window.KC_SES = {
    cal: function (ad, zorla) {
      if (!acik && !zorla) return; if (!hazir() || !SESLER[ad]) return;
      try { if (ctx.state !== "running") { ctx.resume().then(function () { SESLER[ad](); }); return; } SESLER[ad](); } catch (e) {}
    },
    titret: function (ms) { if (acik && navigator.vibrate) try { navigator.vibrate(ms || 8); } catch (e) {} },
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
