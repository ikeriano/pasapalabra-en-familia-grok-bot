/* Normas sorpresa · motor común (ES5, sin dependencias) · juegos de Iker
   Opciones › «🎲 Normas sorpresa» (clave localStorage 'ns_on', NO por defecto).
   Al empezar cada partida se sortean 10 normas (repartidas entre las categorías) entre las que sirven para ese modo,
   el presentador las anuncia con subtítulos y su voz Piper (ns/voz/<id>.mp3) y el juego las aplica. */
(function () {
  'use strict';
  var NS = window.NS = window.NS || {};
  var CAT = null, BASE = '', activas = [], est = {}, badge = null, sonOn = true;
  var D = document;
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  NS.on = function () { return ls('ns_on') === '1'; };
  NS.pon = function (v) { try { localStorage.setItem('ns_on', v ? '1' : '0'); } catch (e) { } };
  NS.catalogo = function (c) { CAT = c; };
  NS.cat = function () { return CAT; };
  NS.base = function (b) { if (b != null) BASE = b; return BASE; };
  NS.sonido = function (on) { sonOn = on !== false; };
  // ---------- sorteo ----------
  function sirve(r, tipos) { var q = r.req || []; for (var i = 0; i < q.length; i++) { var alt = q[i].split('|'), ok = false; for (var j = 0; j < alt.length; j++) if (tipos.indexOf(alt[j]) >= 0) ok = true; if (!ok) return false; } return true; }
  function chocan(a, b) { var x = CAT.excl || []; for (var i = 0; i < x.length; i++) if ((x[i][0] === a.id && x[i][1] === b.id) || (x[i][1] === a.id && x[i][0] === b.id)) return true; return false; }
  NS.aplicables = function (tipos) { var p = {}, L = CAT ? CAT.reglas : []; for (var i = 0; i < L.length; i++) if (sirve(L[i], tipos)) (p[L[i].c] = p[L[i].c] || []).push(L[i]); return p; };
  function baraja(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  NS.sortea = function (tipos) {
    activas = []; est = { racha: 0, aciertos: 0, fallos: 0, escudos: 0, usado: {}, estrellas: 0, bolsa: 0, primer: false, pasas: 0 };
    if (!CAT) return activas; if (window.__NS_FIJA) return NS.fija(window.__NS_FIJA); // pruebas
    var p = NS.aplicables(tipos), cats = baraja(Object.keys(p)); var max = CAT.max || 10;
    var k = Math.min(max, (function () { var n = 0; for (var c in p) n += p[c].length; return n; })()); // v2.18: 10 normas por partida
    var bolsas = {}; cats.forEach(function (c) { bolsas[c] = baraja(p[c]); });
    for (var vuelta = 0, puesto = true; activas.length < k && puesto; vuelta++) { puesto = false;
      for (var i = 0; i < cats.length && activas.length < k; i++) { var op = bolsas[cats[i]];
        while (op.length) { var r = op.shift(), ch = false; for (var m = 0; m < activas.length; m++) if (chocan(r, activas[m]) || (r.fx && activas[m].fx && Object.keys(r.fx).some(function (x) { return x in activas[m].fx; }))) ch = true; if (!ch) { activas.push(r); puesto = true; break; } } } }
    var orden = (CAT.cats || []).map(function (c) { return c.id; }); activas.sort(function (a, b) { return orden.indexOf(a.c) - orden.indexOf(b.c); });
    est.escudos = NS.fx('escudo', 0); return activas;
  };
  NS.fija = function (ids) { var L = CAT.reglas; activas = []; ids.forEach(function (id) { for (var i = 0; i < L.length; i++) if (L[i].id === id) activas.push(L[i]); }); est = { racha: 0, aciertos: 0, fallos: 0, usado: {}, estrellas: 0, bolsa: 0, pasas: 0 }; est.escudos = NS.fx('escudo', 0); return activas; };
  NS.activas = function () { return activas.slice(); };
  NS.tiene = function (id) { for (var i = 0; i < activas.length; i++) if (activas[i].id === id) return true; return false; };
  var MULT = { tiempo: 1, premio: 1, memoria: 1, vel: 1, dinero: 1, rival: 1 };
  NS.fx = function (k, def) { var v = null; for (var i = 0; i < activas.length; i++) { var f = activas[i].fx || {}; if (f[k] == null) continue; if (typeof f[k] === 'boolean' || typeof f[k] === 'string') return f[k]; v = v == null ? f[k] : (k in MULT ? v * f[k] : v + f[k]); } return v == null ? (def == null ? (k in MULT ? 1 : 0) : def) : v; };
  NS.tiempo = function (s) { var m = NS.fx('tiempo', 1); return m === 1 ? s : Math.max(5, Math.round(s * m)); };
  NS.premio = function (n) { var m = NS.fx('premio', 1); return m === 1 ? n : Math.round(n * m); };
  NS.est = function () { return est; };
  NS.una = function (k) { if (est.usado[k]) return false; est.usado[k] = 1; return true; }; // comodín de un solo uso
  NS.usado = function (k) { return !!est.usado[k]; };
  // ---------- eventos del juego ----------
  // acierto: devuelve los segundos (o puntos) extra que dan las normas activas
  NS.acierto = function (o) { o = o || {}; if (!activas.length) return 0; est.aciertos++; est.racha++; var x = 0;
    if (NS.fx('primer') && !est.primer) { est.primer = true; x += NS.fx('primer'); }
    var r = NS.fx('racha'); if (r && est.racha % 3 === 0) { x += r; NS.aviso('🔥 ¡Racha de 3! +' + r); NS.vozEv('racha'); }
    if (o.oro) { x += NS.fx('oroMas', 0); }
    if (NS.fx('estrellas')) { est.estrellas++; pintaBadge(); }
    fiesta('ok', o); if (x && !r) NS.aviso('+' + x + (o.ud || ' s')); est.bolsa += x; return x; };
  // fallo: {perdon: true si un escudo lo perdona, multa: segundos/puntos que se restan}
  NS.fallo = function (o) { o = o || {}; if (!activas.length) return { perdon: false, multa: 0 }; est.racha = 0;
    if (est.escudos > 0) { est.escudos--; NS.aviso('🛡️ ¡Escudo! Este fallo no cuenta'); NS.vozEv('escudo'); return { perdon: true, multa: 0 }; }
    est.fallos++; var m = NS.fx('multa', 0); est.bolsa -= m; fiesta('ko', o); if (m) NS.aviso('−' + m + (o.ud || ' s')); return { perdon: false, multa: m }; };
  NS.pasa = function () { if (!activas.length) return 0; var b = NS.fx('pasaMas', 0); if (b && est.pasas < 5) { est.pasas++; NS.aviso('+' + b + ' s por pasar'); return b; } return 0; };
  NS.bolsa = function () { var b = est.bolsa || 0; est.bolsa = 0; return b; };
  // ---------- efectos visuales y sonoros (ligeros: pocos nodos, CSS) ----------
  var css = D.createElement('style'); css.textContent =
    '.nsov{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99990;background:radial-gradient(ellipse at 50% 30%,rgba(40,80,200,.93),rgba(5,10,40,.96));display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:3vh 3vw 150px;box-sizing:border-box;font-family:Nunito,"Varela Round",Arial,sans-serif;color:#fff;overflow:auto;-webkit-user-select:none;user-select:none}' +
    '.nsov h1{margin:.2em 0 .1em;font-size:min(7vw,44px);letter-spacing:1px;text-shadow:0 3px 0 #b8860b,0 0 18px #ffd84a;color:#ffe066;text-align:center}' +
    '.nsov .nsp{font-size:min(4vw,20px);opacity:.9;margin-bottom:1.2vh;text-align:center}' +
    '.nscards{display:flex;flex-wrap:wrap;gap:1.4vh 2vw;justify-content:center;max-width:960px;width:100%}' +
    '.nscard{background:linear-gradient(180deg,#fff,#dfe8ff);color:#123;border-radius:16px;padding:1.4vh 1.6vw;width:min(44vw,420px);box-shadow:0 6px 0 #0a2a7a,0 0 0 3px #ffd84a;transform:scale(.6);opacity:0;transition:transform .35s,opacity .35s;box-sizing:border-box}' +
    '.nsaviso,.nscom,.nscom button{font-family:Nunito,"Varela Round",Arial,sans-serif}.nscard.on{transform:none;opacity:1}.nscard b{display:block;font-size:min(4.6vw,23px);color:#0b3cc8}.nscard i{font-style:normal;font-size:min(3.6vw,17px);line-height:1.25}.nscard em{float:right;font-style:normal;font-size:min(3vw,13px);background:#0b3cc8;color:#fff;border-radius:10px;padding:1px 8px}@media (max-height:520px) and (orientation:landscape){.nsov{padding-top:1.5vh}.nsov h1{font-size:26px!important;margin:0!important}.nscard{width:min(30vw,300px);padding:6px 10px}.nscard b{font-size:16px}.nscard i{font-size:13px}.nscard em{font-size:10px}.nssub{font-size:15px;min-width:0;max-width:70vw}}' +
    '.nssub{font-family:Nunito,"Varela Round",Arial,sans-serif;position:fixed;left:50%;bottom:calc(2vh + 58px);transform:translateX(-50%);max-width:92vw;min-width:min(80vw,520px);box-sizing:border-box;background:rgba(0,0,0,.78);color:#fff;border-radius:10px;padding:.4em .9em;font-size:min(4.4vw,5.4vh,22px);line-height:1.25;text-align:center;z-index:99992}.nssub b{color:#ffd84a}' +
    '.nsbtns{font-family:Nunito,"Varela Round",Arial,sans-serif;position:fixed;bottom:2vh;left:0;right:0;display:flex;gap:12px;justify-content:center;z-index:99993}.nsbtns button{font:inherit;font-weight:900;font-size:min(4.4vw,20px);border:0;border-radius:30px;padding:.55em 1.4em;background:#ff8a1c;color:#fff;box-shadow:0 4px 0 #a84f00}.nsbtns button.s{background:#5b6b9a;box-shadow:0 4px 0 #2b375e}' +
    '.nsbadge{position:fixed;left:6px;bottom:6px;z-index:99980;background:rgba(10,30,110,.85);color:#ffe066;border:2px solid #ffd84a;border-radius:16px;padding:3px 9px;font:900 13px Arial,sans-serif;pointer-events:auto;max-width:60vw}' +
    '.nsbadge ul{margin:4px 0 0;padding-left:16px;color:#fff;font-weight:400}.nsaviso{position:fixed;left:50%;top:14vh;transform:translateX(-50%);z-index:99985;background:#ffd84a;color:#102060;font:900 min(5vw,24px) Arial,sans-serif;padding:.35em .9em;border-radius:22px;box-shadow:0 4px 0 #b8860b;animation:nsav 1.8s forwards;pointer-events:none;white-space:nowrap}' +
    '@keyframes nsav{0%{opacity:0;transform:translate(-50%,10px) scale(.8)}12%{opacity:1;transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-14px)}}' +
    '.nsconf{position:fixed;top:-4vh;width:10px;height:16px;z-index:99984;pointer-events:none;animation:nsc 1.6s linear forwards;will-change:transform}@keyframes nsc{to{transform:translate3d(var(--dx),108vh,0) rotate(540deg)}}' +
    '.nsemo{position:fixed;bottom:-6vh;font-size:34px;z-index:99984;pointer-events:none;animation:nse 1.8s ease-out forwards;will-change:transform}@keyframes nse{to{transform:translate3d(var(--dx),-70vh,0);opacity:0}}' +
    '.nsarco{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99979;pointer-events:none;border:6px solid transparent;border-image:linear-gradient(90deg,#ff3b3b,#ffb000,#ffe600,#3ad14a,#1fa0ff,#9b4dff) 1;animation:nsarco 3s linear infinite}@keyframes nsarco{50%{opacity:.45}}' +
    '.nscom{position:fixed;right:6px;top:30%;z-index:99981;display:flex;flex-direction:column;gap:8px}.nscom button{font:900 15px Arial,sans-serif;border:2px solid #fff;border-radius:18px;padding:7px 12px;background:#ff8a1c;color:#fff;box-shadow:0 3px 0 #a84f00}' +
    '.nsluz{outline:3px solid #ffd84a;outline-offset:-3px}.nspista{font-size:.8em;color:#ffe066;margin-top:.3em;text-shadow:0 1px 2px #000}' +
    '.nsoro{box-shadow:0 0 0 4px #ffd84a,0 0 18px #ffd84a!important}.nsgold{color:#ffd84a!important;text-shadow:0 0 8px #b8860b}';
  (D.head || D.documentElement).appendChild(css);
  function el(t, c, h) { var e = D.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  NS.el = el;
  NS.aviso = function (txt) { var a = el('div', 'nsaviso', txt); D.body.appendChild(a); setTimeout(function () { a.remove(); }, 1900); };
  var AC = null; function ac() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; } return AC; }
  function nota(f, t0, d, tipo, vol) { var c = ac(); if (!c) return; var o = c.createOscillator(), g = c.createGain(); o.type = tipo || 'triangle'; o.frequency.value = f; var t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || 0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05); }
  NS.fanfarria = function () { if (!sonOn) return; [523, 659, 784, 1047].forEach(function (f, i) { nota(f, i * 0.09, i === 3 ? 0.5 : 0.15, 'square', 0.08); }); };
  NS.aplauso = function (seg) { if (!sonOn) return; var c = ac(); if (!c) return; seg = seg || 1.4; var n = Math.floor(c.sampleRate * seg), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var k = 0; k < 90; k++) { var p = Math.floor(Math.random() * (n - 900)); for (var j = 0; j < 900; j++) d[p + j] += (Math.random() * 2 - 1) * Math.exp(-j / 120) * 0.5; }
    for (var i = 0; i < n; i++) d[i] *= Math.min(1, (n - i) / (n * 0.35));
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.6; g.gain.value = 0.35; s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); };
  NS.confeti = function (n) { var C = ['#ff3b3b', '#ffb000', '#ffe600', '#3ad14a', '#1fa0ff', '#9b4dff', '#ffffff']; n = n || 24; for (var i = 0; i < n; i++) { var c = el('div', 'nsconf'); c.style.left = (Math.random() * 100) + 'vw'; c.style.background = C[i % C.length]; c.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw'); c.style.animationDelay = (Math.random() * 0.35) + 's'; D.body.appendChild(c); (function (c) { setTimeout(function () { c.remove(); }, 2100); })(c); } };
  NS.emojis = function (L) { L = L || ['🎉', '⭐', '👏', '😄', '🏆', '💙']; for (var i = 0; i < 7; i++) { var c = el('div', 'nsemo', L[Math.floor(Math.random() * L.length)]); c.style.left = (8 + Math.random() * 84) + 'vw'; c.style.setProperty('--dx', (Math.random() * 20 - 10) + 'vw'); c.style.animationDelay = (Math.random() * 0.4) + 's'; D.body.appendChild(c); (function (c) { setTimeout(function () { c.remove(); }, 2400); })(c); } };
  var ANIMO = ['¡Casi! ¡La siguiente es tuya!', '¡Ánimo, lo estás haciendo genial!', '¡No pasa nada, sigue así!', '¡Tú puedes!', '¡Qué cerca! ¡Vamos!'];
  function fiesta(t, o) { var v = NS.fx('fiesta', ''); if (t === 'ok') { if (v === 'confeti') NS.confeti(); else if (v === 'aplausos') NS.aplauso(); else if (v === 'emojis') NS.emojis(); else if (v === 'fanfarria') NS.fanfarria(); else if (v === 'globos') NS.emojis(['🎈', '🎈', '🎈', '🎊']); else if (v === 'estrellas') NS.emojis(['⭐', '🌟', '✨']);
      if (NS.fx('vozBien')) NS.vozEv('bien'); }
    else { if (v === 'animo') NS.aviso(ANIMO[Math.floor(Math.random() * ANIMO.length)]); if (NS.fx('vozAnimo')) NS.vozEv('animo'); } }
  NS.fiesta = fiesta;
  // ---------- voz ----------
  var aud = null, ultimaEv = 0;
  function suena(k, maxMs) { return new Promise(function (res) { var hecho = false; var fin = function () { if (!hecho) { hecho = true; res(); } };
    if (!sonOn || NS.mudo) return setTimeout(fin, maxMs || 1500);
    try { var a = new Audio(BASE + 'voz/' + k + '.mp3'); aud = a; a.onended = fin; a.onerror = function () { setTimeout(fin, maxMs || 2500); }; var p = a.play(); if (p && p.catch) p.catch(function () { setTimeout(fin, maxMs || 2500); }); setTimeout(fin, maxMs || 12000); } catch (e) { setTimeout(fin, maxMs || 1500); } }); }
  NS.suena = suena;
  NS.vozEv = function (tipo) { var n = Date.now(); if (n - ultimaEv < 2500) return; ultimaEv = n; var L = (CAT && CAT.ev && CAT.ev[tipo]) || []; if (!L.length) return; suena('ev_' + tipo + '_' + Math.floor(Math.random() * L.length), 4000); };
  NS.para = function () { try { aud && aud.pause(); } catch (e) { } };
  // ---------- anuncio del presentador ----------
  function txtVoz(r) { return r.v || (r.n + '. ' + r.d); }
  NS.textoVoz = txtVoz;
  NS.anuncia = function (op) { op = op || {}; return new Promise(function (res) {
    if (!activas.length) return res();
    var ov = el('div', 'nsov'); var P = (CAT && CAT.presentador) || 'El presentador';
    ov.appendChild(el('h1', '', '🎲 ¡NORMAS SORPRESA!')); ov.appendChild(el('div', 'nsp', '🎤 ' + P + ' anuncia las normas de esta partida' + (op.modo ? ' · ' + op.modo : '')));
    var cs = el('div', 'nscards'); ov.appendChild(cs); var cats = {}; (CAT.cats || []).forEach(function (c) { cats[c.id] = c; });
    var cards = activas.map(function (r) { var c = cats[r.c] || { n: '', ico: '🎲' }; var d = el('div', 'nscard', '<em>' + c.ico + ' ' + c.n + '</em><b>' + (r.ico || c.ico) + ' ' + r.n + '</b><i>' + r.d + '</i>'); cs.appendChild(d); return d; });
    var sub = el('div', 'nssub'); var bt = el('div', 'nsbtns'); var go = el('button', '', '¡A jugar!'), sk = el('button', 's', 'Saltar ⏭');
    bt.appendChild(sk); bt.appendChild(go); D.body.appendChild(ov); D.body.appendChild(sub); D.body.appendChild(bt);
    var cerrado = false; var cierra = function () { if (cerrado) return; cerrado = true; NS.para(); ov.remove(); sub.remove(); bt.remove(); pintaBadge(); res(); };
    var salta = false; go.onclick = function (e) { e.stopPropagation(); cierra(); }; sk.onclick = function (e) { e.stopPropagation(); salta = true; NS.para(); cards.forEach(function (c) { c.classList.add('on'); }); sub.style.display = 'none'; };
    var di = function (k, t) { if (salta || cerrado) return Promise.resolve(); sub.style.display = ''; sub.innerHTML = '<b>' + P + ':</b> ' + t; return suena(k, 1200 + t.length * 75).then(function () { sub.style.display = 'none'; }); };
    var I = (CAT.intro || '¡Atención! Hoy jugamos con normas sorpresa.'), F = (CAT.outro || '¡Mucha suerte! ¡A jugar!');
    var cadena = di('intro', I); activas.forEach(function (r, i) { cadena = cadena.then(function () { cards[i].classList.add('on'); try { cards[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { } NS.fanfarriaCorta(); return di(r.id, txtVoz(r)); }); });
    cadena.then(function () { cards.forEach(function (c) { c.classList.add('on'); }); return di('outro', F); }).then(function () { if (op.auto !== false && !salta) setTimeout(cierra, 600); });
    if (window.__NS_AUTO) setTimeout(cierra, window.__NS_AUTO);
  }); };
  NS.fanfarriaCorta = function () { if (!sonOn) return; nota(784, 0, 0.12, 'square', 0.05); nota(1047, 0.08, 0.25, 'square', 0.05); };
  // ---------- distintivo durante la partida ----------
  function pintaBadge() { if (!activas.length) { if (badge) { badge.remove(); badge = null; } return; }
    if (!badge) { badge = el('div', 'nsbadge'); badge.onclick = function (e) { e.stopPropagation(); badge.classList.toggle('abre'); pintaBadge(); }; D.body.appendChild(badge); }
    var ab = badge.classList.contains('abre'); badge.innerHTML = '🎲 ' + activas.length + ' normas' + (NS.fx('estrellas') ? ' · ⭐ ' + est.estrellas : '') + (ab ? '<ul>' + activas.map(function (r) { return '<li>' + r.n + '</li>'; }).join('') + '</ul>' : '');
    var arco = D.querySelector('.nsarco'); if (NS.fx('fiesta', '') === 'arcoiris') { if (!arco) D.body.appendChild(el('div', 'nsarco')); } else if (arco) arco.remove(); }
  NS.badge = pintaBadge;
  // ---------- ciclo de partida ----------
  // NS.empieza('rosco', ['reloj','teclado',...], {modo:'El rosco'}) -> Promise<activas>. Si está apagado, no hace nada.
  NS.empieza = function (tipos, op) { if (!NS.on() || !CAT) { activas = []; pintaBadge(); return Promise.resolve([]); } NS.sortea(tipos); return NS.anuncia(op).then(function () { return activas; }); };
  NS.termina = function () { var e = est.estrellas; if (activas.length && NS.fx('estrellas') && e) NS.aviso('⭐ ¡Has ganado ' + e + ' estrellas!'); activas = []; pintaBadge(); var a = D.querySelector('.nsarco'); a && a.remove(); [].forEach.call(D.querySelectorAll('.nscom'), function (x) { x.remove(); }); };
  NS.sigue = function () { pintaBadge(); }; // mantiene las normas (p. ej. entre pruebas de una carrera)

  // ---------- ayudas comunes para los juegos ----------
  NS.tipos = function (modo) { return (CAT && CAT.modos && CAT.modos[modo]) || []; };
  // ¿a y b son la misma respuesta? (con «Respuesta cariñosa», vale una letra de diferencia)
  NS.casi = function (a, b) { if (a === b) return true; if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > 1) return false; var i = 0, j = 0, d = 0;
    while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++d > 1) return false; if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } } return d + (a.length - i) + (b.length - j) <= 1; };
  NS.igual = function (a, b, norm) { norm = norm || function (x) { return String(x || '').trim().toUpperCase(); }; var x = norm(a), y = norm(b); if (x === y) return true; if (NS.fx('tolerante') && NS.casi(x, y)) { NS.aviso('💙 ¡Casi perfecta, vale!'); return true; } return false; };
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }
  // pistas de las normas activas para la respuesta w (texto corto o '')
  NS.pista = function (w, sinLong) { if (!activas.length || !w) return ''; w = String(w).toUpperCase(); var L = [];
    if (NS.fx('longitud') && !sinLong) L.push(w.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').length + ' letras');
    if (NS.fx('ultima')) L.push('termina en ' + w.charAt(w.length - 1));
    if (NS.fx('regalo') && w.length > 2) { var k = 1 + hash(w) % (w.length - 2); L.push('la ' + (k + 1) + 'ª letra es ' + w.charAt(k)); }
    return L.length ? '🔤 ' + L.join(' · ') : ''; };
  NS.publicoTexto = function (w) { w = String(w).toUpperCase(); var n = Math.max(1, Math.ceil(w.length / 2)); return '👥 El público dice: empieza por «' + w.slice(0, n) + '…»'; };
  // porcentajes del público para opciones (la buena casi siempre gana)
  NS.porcentajes = function (n, buena) { var p = [], b = 45 + Math.floor(Math.random() * 30), r = 100 - b, w = [], t = 0, i; for (i = 0; i < n; i++) { w.push(i === buena ? 0 : 0.2 + Math.random()); t += w[i]; }
    var usado = 0, prim = -1; for (i = 0; i < n; i++) { if (i === buena) { p.push(b); continue; } var v = Math.floor(r * w[i] / t); p.push(v); usado += v; if (prim < 0) prim = i; } if (prim >= 0) p[prim] += r - usado; return p; };
  // barra de comodines: h = {publico: fn, c5050: fn, ctiempo: fn}; solo salen los de las normas activas y sin usar
  NS.comodines = function (padre, h) { var w = el('div', 'nscom'); var N = { publico: '👥 Público', c5050: '✂️ 50:50', ctiempo: '⏱️ +' + NS.fx('ctiempo', 15) + ' s', segunda: null };
    Object.keys(h).forEach(function (k) { if (!N[k] || !NS.fx(k) || NS.usado(k)) return; var b = el('button', '', N[k]); b.onclick = function (e) { e.stopPropagation(); if (!NS.una(k)) return; if (h[k]() === false) { est.usado[k] = 0; NS.aviso('Espera a tu turno'); return; } b.remove(); NS.fanfarriaCorta(); }; w.appendChild(b); });
    if (w.children.length) (padre || D.body).appendChild(w); return w; };
  // segundos de la ruleta de la suerte (r_suerte) + regalo fijo (r_final20)
  NS.extraFinal = function () { var x = NS.fx('finalMas', 0); if (NS.fx('suerte')) { var s = 5 + 5 * Math.floor(Math.random() * 5); x += s; NS.aviso('🎰 ¡La ruleta te regala ' + s + ' segundos!'); } else if (x) NS.aviso('🎁 +' + x + ' segundos de regalo'); return x; };
  NS.esVocal = function (l) { return 'AEIOU'.indexOf(String(l).toUpperCase()) >= 0; };
  // ---------- fila para Opciones ----------
  NS.fila = function (claseFila, claseBoton) { var R = el('div', claseFila || 'orow'); var l = el('label', '', '🎲 Normas sorpresa'); R.appendChild(l);
    [['0', 'No (normas de siempre)'], ['1', 'Sí']].forEach(function (o) { var b = el('button', (claseBoton || 'tbtn') + (((ls('ns_on') || '0') === o[0]) ? ' sel' : ''), o[1]); b.onclick = function (e) { e.stopPropagation(); NS.pon(o[0] === '1'); [].forEach.call(R.querySelectorAll('button'), function (x) { x.className = (claseBoton || 'tbtn') + (x === b ? ' sel' : ''); }); }; R.appendChild(b); });
    return R; };
})();
