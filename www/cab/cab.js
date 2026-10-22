/* Pasapalabra · cabeceras de las pruebas (v2.10)
   App privada: vídeos originales que envió Iker (cab/*.mp4, lista en cab/list.js).
   Web pública: sin vídeos oficiales; recreaciones ligeras en CSS (A la Z y El Rosco) con sonido sintetizado. ES5. */
(function () {
  var s = document.currentScript, BASE = s ? s.src.replace(/cab\.js(\?.*)?$/, '') : '../cab/';
  var LIST = window.__CAB_LIST || {};
  var AC = null, FT = /cabt=([\d.]+)/.exec(location.search);
  function css(t) { var e = document.createElement('style'); e.textContent = t; document.head.appendChild(e); }
  css('@font-face{font-family:CABF;src:url(' + BASE + 'NunitoAZ.woff2) format("woff2"),url(' + BASE + 'NunitoAZ.ttf) format("truetype")}' +
    '.cabw{position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;background:#000;overflow:hidden;font-family:CABF,Arial,sans-serif}' +
    '.cabw video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;background:#000}' +
    '.cabx{position:absolute;right:12px;bottom:12px;z-index:3;padding:8px 14px;border-radius:10px;border:2px solid #ffd23a;background:#000a;color:#fff;font:bold 14px Arial;cursor:pointer}' +
    '.cabw *{box-sizing:border-box}');
  function capa() { var w = document.createElement('div'); w.className = 'cabw'; document.body.appendChild(w); return w; }
  function boton(w, fin) { var b = document.createElement('button'); b.className = 'cabx'; b.textContent = 'Saltar ⏭'; b.onclick = function (e) { e.stopPropagation(); fin(); }; w.appendChild(b); }
  function video(lista) {
    return new Promise(function (res) {
      var f = lista[Math.floor(Math.random() * lista.length)], w = capa(), v = document.createElement('video'), hecho = false;
      function fin() { if (hecho) return; hecho = true; try { v.pause(); } catch (e) { } v.removeAttribute('src'); try { v.load(); } catch (e) { } w.parentNode && w.parentNode.removeChild(w); res(); }
      v.setAttribute('playsinline', ''); v.playsInline = true; v.preload = 'auto'; v.src = BASE + f; v.onended = fin; v.onerror = fin; w.appendChild(v); boton(w, fin);
      setTimeout(fin, 12000);
      var p = v.play(); if (p && p['catch']) p['catch'](function () { v.muted = true; var q = v.play(); if (q && q['catch']) q['catch'](fin); });
    });
  }
  // ---------- sonido neutro sintetizado (web pública) ----------
  function ac() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; } return AC; }
  function whoosh(t, d, v) { var a = ac(); if (!a) return; var n = a.createBufferSource(), b = a.createBuffer(1, Math.floor(a.sampleRate * d), a.sampleRate), x = b.getChannelData(0); for (var i = 0; i < x.length; i++) x[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / x.length);
    n.buffer = b; var f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(400, a.currentTime + t); f.frequency.exponentialRampToValueAtTime(3000, a.currentTime + t + d); var g = a.createGain(); g.gain.value = v || 0.35; n.connect(f); f.connect(g); g.connect(a.destination); n.start(a.currentTime + t); }
  function nota(t, fr, d, v) { var a = ac(); if (!a) return; var o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = fr; g.gain.setValueAtTime(0, a.currentTime + t); g.gain.linearRampToValueAtTime(v || 0.18, a.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + t + d); o.connect(g); g.connect(a.destination); o.start(a.currentTime + t); o.stop(a.currentTime + t + d + 0.05); }
  // ---------- animación por fotogramas clave (una sola rAF, transform/opacity: ligera) ----------
  function anima(w, dur, pasos, res) { var t0 = null, hecho = false; function fin() { if (hecho) return; hecho = true; w.parentNode && w.parentNode.removeChild(w); res(); } boton(w, fin);
    function f(ts) { if (hecho) return; if (t0 == null) t0 = ts; var t = FT ? +FT[1] : (ts - t0) / 1000; for (var i = 0; i < pasos.length; i++) pasos[i](t); if (t >= dur && !FT) return fin(); requestAnimationFrame(f); } requestAnimationFrame(f); }
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; }, eo = function (x) { x = cl(x); return 1 - Math.pow(1 - x, 3); }, ei = function (x) { x = cl(x); return x * x * x; };
  function el(p, tag, st, html) { var e = document.createElement(tag); e.style.cssText = st; if (html != null) e.innerHTML = html; p.appendChild(e); return e; }
  function tr(e, x, y, r, s, o, blur) { var v = 'translate(' + x + 'vmin,' + y + 'vmin) rotate(' + (r || 0) + 'deg) scale(' + (s == null ? 1 : s) + ')'; e.style.webkitTransform = v; e.style.transform = v; e.style.opacity = o == null ? 1 : o; if (blur != null) e.style.filter = blur > 0.3 ? 'blur(' + blur.toFixed(1) + 'px)' : 'none'; }
  var L = 'ABCDEFGHIJLMNÑOPQRSTUVXYZ'.split('');
  // ---- A la Z (4,9 s, calcado de cabecera_alaz.mp4) ----
  function recAlaz() { return new Promise(function (res) {
    var w = capa(); w.style.background = 'transparent';
    var bg = el(w, 'div', 'position:absolute;left:0;top:0;width:100%;height:100%;background:#0f8ff0 url(' + BASE + 'fondo.jpg) center/cover');
    var mid = el(w, 'div', 'position:absolute;left:50%;top:42%;width:0;height:0');
    var tile = 'position:absolute;width:28vmin;height:33vmin;margin:-16.5vmin 0 0 -14vmin;border-radius:3.4vmin;background:linear-gradient(#f4f5fa,#d9dce8);border:2vmin solid #2448c8;box-shadow:0 0 0 .5vmin #1838b0,0 1.5vmin 3vmin #0007;color:#2c46d6;font:900 27vmin/29vmin CABF,Arial;text-align:center;text-shadow:0 .4vmin 0 #4a66f0,0 .9vmin 0 #1a2a9a';
    var A = el(mid, 'div', tile, 'A'), Z = el(mid, 'div', tile, 'Z');
    var la = el(mid, 'div', 'position:absolute;width:20vmin;margin-left:-10vmin;margin-top:-7vmin;text-align:center;color:#e9ecf6;font:900 11vmin/14vmin CABF,Arial;text-shadow:0 .5vmin 0 #9aa3c8', 'la');
    var fl1 = el(mid, 'div', 'position:absolute;width:12vmin;margin:-15vmin 0 0 -6vmin;text-align:center;color:#2448d8;font:900 9vmin/9vmin Arial', '⟵'), fl2 = el(mid, 'div', 'position:absolute;width:12vmin;margin:5vmin 0 0 -6vmin;text-align:center;color:#2448d8;font:900 9vmin/9vmin Arial', '⟶');
    var fila = el(w, 'div', 'position:absolute;left:0;right:0;top:72%;text-align:center;white-space:nowrap'), T = [];
    for (var i = 0; i < L.length; i++) T.push(el(fila, 'span', 'display:inline-block;width:3.5vmax;margin:0 .1vmax;border-radius:.6vmax;background:linear-gradient(#fff,#d8dcf0);border:.25vmax solid #2448c8;color:#2a44d0;font:900 2.5vmax/3.1vmax CABF,Arial;opacity:0', L[i]));
    var banda = el(w, 'div', 'position:absolute;left:0;right:0;top:46%;height:8%;background:linear-gradient(#0a2a9a,#1f6bff 40%,#0a2a9a);opacity:0');
    whoosh(0.0, 0.35, 0.3); whoosh(0.3, 0.3); whoosh(0.55, 0.25); whoosh(0.75, 0.3); [523, 659, 784].forEach(function (f, i) { nota(0.95 + i * 0.12, f, 0.5); });
    whoosh(2.2, 0.5, 0.25); nota(2.5, 880, 0.4, 0.12); whoosh(4.0, 0.45, 0.4); nota(4.5, 392, 0.6, 0.15);
    anima(w, 4.9, [function (t) {
      tr(bg, 0, -100 * (1 - eo(t / 0.25)), 0, 1, 1); // la cortina azul baja
      // entrada: A desde la izquierda, «la» desde la derecha, Z desde la derecha; swap A<->Z a los 2,25-2,75 s; salida a los 4,05 s
      var sw = t < 2.35 ? 0 : t < 2.55 ? eo((t - 2.35) / 0.2) : t < 2.68 ? 1 : 1 - eo((t - 2.68) / 0.25);
      var outA = ei((t - 4.12) / 0.2) + 0.15 * cl((t - 3.95) / 0.17), outL = ei((t - 4.15) / 0.2), outZ = ei((t - 4.25) / 0.25);
      var inA = eo((t - 0.35) / 0.2), inL = eo((t - 0.55) / 0.2), inZ = eo((t - 0.75) / 0.2);
      var xa = -29 + 58 * sw, xz = 29 - 58 * sw;
      tr(A, xa - 110 * (1 - inA) - 120 * outA, -30 * (1 - inA) + 10 * outA, -35 * (1 - inA) - 40 * outA + 6 * Math.sin(sw * Math.PI), 1 + 0.25 * Math.sin(sw * Math.PI), t < 0.35 ? 0 : 1, 14 * (1 - inA) + 10 * outA + 4 * Math.sin(sw * Math.PI));
      tr(la, 90 * (1 - inL) - 120 * outL, 0, 0, 1, t < 0.55 ? 0 : 1, 10 * (1 - inL) + 10 * outL);
      tr(Z, xz + 100 * (1 - inZ) + 120 * outZ, -12 * (1 - inZ) - 25 * outZ, 25 * (1 - inZ) + 30 * outZ - 6 * Math.sin(sw * Math.PI), 1 + 0.25 * Math.sin(sw * Math.PI), t < 0.75 ? 0 : 1, 12 * (1 - inZ) + 10 * outZ + 4 * Math.sin(sw * Math.PI));
      var fo = cl((t - 0.6) / 0.15) * (1 - cl((t - 4.0) / 0.15)); tr(fl1, 0, 0, 0, 1, fo); tr(fl2, 0, 0, 0, 1, fo);
      for (var i = 0; i < T.length; i++) { var a = 0.85 + i * 0.04, b = 3.15 + i * 0.028; T[i].style.opacity = t < a ? 0 : t < b ? cl((t - a) / 0.06) : 1 - cl((t - b) / 0.06); }
      banda.style.opacity = t < 4.45 ? 0 : 1 - cl((t - 4.75) / 0.15); var sc = cl((t - 4.45) / 0.3); banda.style.webkitTransform = banda.style.transform = 'scaleY(' + (0.2 + sc * 2) + ')';
    }], res);
  }); }
  // ---- El Rosco Antena 3 (4,27 s, calcado de cabecera_rosco_a3.mp4) ----
  function recRosco() { return new Promise(function (res) {
    var w = capa(); w.style.background = '#1a63f0';
    var rings = el(w, 'div', 'position:absolute;left:50%;top:50%;width:220vmax;height:220vmax;margin:-110vmax 0 0 -110vmax;border-radius:50%;background:repeating-radial-gradient(circle,#2a86ff 0,#3b95ff 1vmax,#1556e6 2.2vmax,#2a86ff 2.6vmax)');
    var c = el(w, 'div', 'position:absolute;left:50%;top:50%;width:0;height:0'), B = [], O = [];
    for (var i = 0; i < 25; i++) { var a = -Math.PI / 2 + (i + 0.6) / 25 * Math.PI * 2; B.push(el(c, 'div', 'position:absolute;width:8vmin;height:8vmin;margin:-4vmin;left:' + (Math.cos(a) * 43).toFixed(2) + 'vmin;top:' + (Math.sin(a) * 42).toFixed(2) + 'vmin;border-radius:50%;background:radial-gradient(circle at 40% 35%,#6d8cff,#1d3bb0 70%);border:.35vmin solid #e8f0ff;color:#fff;font:900 4vmin/7.2vmin CABF,Arial;text-align:center;opacity:0', L[i])); }
    for (var j = 0; j < 44; j++) { var b2 = j / 44 * Math.PI * 2; O.push(el(c, 'div', 'position:absolute;width:3vmin;margin-left:-1.5vmin;margin-top:-1.5vmin;left:' + (Math.cos(b2) * 56).toFixed(1) + 'vmin;top:' + (Math.sin(b2) * 52).toFixed(1) + 'vmin;color:#cfe0ff;font:900 2.2vmin CABF,Arial;text-align:center;opacity:0', L[j % 25])); }
    var txt = el(w, 'div', 'position:absolute;left:0;right:0;top:50%;margin-top:-7vmin;text-align:center;color:#f4f8ff;font:900 16vmin/14vmin CABF,Arial;text-shadow:0 0 2vmin #9fd0ff;white-space:nowrap;opacity:0', 'El Rosco');
    var sw = el(w, 'div', 'position:absolute;left:-30%;top:20%;width:60%;height:60%;border-radius:50%;background:radial-gradient(ellipse,#ffffffee,#d8e4ffaa 40%,#ffffff00 70%);opacity:0');
    whoosh(0.4, 0.5, 0.45); whoosh(0.9, 0.4, 0.3); [392, 523, 659, 784].forEach(function (f, i) { nota(1.05 + i * 0.1, f, 0.45); }); for (var k = 0; k < 12; k++) nota(1.5 + k * 0.15, k % 3 === 2 ? 330 : 990, 0.12, 0.06); whoosh(3.3, 0.5, 0.35); whoosh(3.8, 0.45, 0.45);
    var COL = { v: 'radial-gradient(circle at 40% 35%,#9dffd8,#14c48a 70%)', r: 'radial-gradient(circle at 40% 35%,#ff9ad0,#d0207a 70%)' };
    anima(w, 4.27, [function (t) {
      var z = 1.6 - 0.6 * eo(t / 0.9); rings.style.webkitTransform = rings.style.transform = 'scale(' + z.toFixed(3) + ') rotate(' + (t * 8).toFixed(1) + 'deg)';
      var s1 = cl((t - 0.3) / 0.6), s2 = cl((t - 3.75) / 0.5); sw.style.opacity = (Math.sin(s1 * Math.PI) + Math.sin(s2 * Math.PI)) * 0.9; sw.style.left = (-40 + s1 * 120 + s2 * 120 - (s2 > 0 ? 120 : 0)) + '%';
      var tin = cl((t - 0.95) / 0.45), tout = cl((t - 3.6) / 0.4); txt.style.opacity = t < 0.95 ? 0 : 1 - tout; var v = 'translateX(' + ((1 - eo(tin)) * 30 - ei(tout) * 40).toFixed(1) + 'vw)'; txt.style.webkitTransform = txt.style.transform = v; txt.style.filter = (tin < 1 || tout > 0) ? 'blur(' + (((1 - tin) + tout) * 6).toFixed(1) + 'px)' : 'none';
      for (var i = 0; i < 25; i++) { var ap = 0.55 + i * 0.012; B[i].style.opacity = t < ap ? 0 : t > 4.0 ? 1 - cl((t - 4.0) / 0.2) : 1;
        // las bolas se encienden en verde dando vueltas (con alguna rosa abajo), como en la cabecera
        var k = Math.floor((t - 1.4) / 0.075), on = t > 1.4 && ((k - i) % 25 + 25) % 25 < 3, c2 = on ? (i > 12 && i < 17 ? COL.r : COL.v) : (i > 12 && i < 17 && t > 2.2 ? COL.r : ''); if (B[i]._c !== c2) { B[i]._c = c2; B[i].style.background = c2 || 'radial-gradient(circle at 40% 35%,#6d8cff,#1d3bb0 70%)'; } }
      for (var j = 0; j < O.length; j++) O[j].style.opacity = t < 0.7 ? 0 : t > 4.0 ? 0 : 0.9;
    }], res);
  }); }
  var REC = { alaz: recAlaz, rosco: recRosco };
  window.PPCab = {
    tiene: function (n) { return !!(LIST[n] || REC[n]); },
    oficial: function (n) { return !!LIST[n]; },
    play: function (n) { if (/cab=0/.test(location.search)) return Promise.resolve(); if (LIST[n] && LIST[n].length) return video(LIST[n]); if (REC[n] && !/cabrec=0/.test(location.search)) return REC[n](); return Promise.resolve(); }
  };
})();
