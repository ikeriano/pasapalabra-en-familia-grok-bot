// Pasapalabra 2.21 · pruebas nuevas, finales nuevas y normas nuevas (plató 3D).
// Usa los mismos grafismos del juego (panel, rosco, marcador, crono, letras del suelo) a través de window.__PPX.
(function () {
  const LSg = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const X = () => window.__PPX;
  const TTS = ' <small style="opacity:.7;font-weight:400">· voz TTS</small>';
  const say = (s, t, o) => X().Me(s, t, Object.assign({ txt: t + TTS }, o || {}));
  const rnd = n => Math.floor(Math.random() * n);
  const mezcla = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const N = s => X().Js(s);
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const PR = () => window.PPN_PRUEBAS || [], FI = () => window.PPN_FINALES || [];
  const frase = s => s.replace(/_+/g, '…');
  const intro = (n, sub) => 'Vamos con ' + n + '. ' + sub + '.';
  // ---- normas nuevas (Opciones) ----
  let extraUsado = false, racha = { A: 0 };
  const R = {
    on: k => LSg(k) === '1',
    hit(h, M) { if (h !== 'A' || !R.on('pp_racha')) return 0; racha.A++; if (racha.A % 3 === 0) { X().ze.aviso('🔥 ¡Racha de 3! +3 s'); if (M) M.t += 3; return 3; } return 0; },
    miss(h) { if (h === 'A') racha.A = 0; },
    extraBtn: () => R.on('pp_pextra') && !extraUsado ? [['🃏 Pasapalabra extra (+5 s)', 'PEXTRA']] : [],
    usaExtra() { if (extraUsado || !R.on('pp_pextra')) return false; extraUsado = true; return true; }
  };
  // ---- utilidades de banco (las mismas definiciones del rosco, con su voz) ----
  const banco = () => X().ou.filter(b => b.t === 'e' && /^[A-ZÑ]{4,9}$/.test(b.w));
  const tomaBanco = n => mezcla(banco()).slice(0, n);
  const revuelve = w => { let r; for (let i = 0; i < 20; i++) { r = mezcla(w.split('')).join(''); if (r !== w) break; } return r; };
  const sinVoc = w => w.replace(/[AEIOU]/g, '_');
  // ---- turno de un concursante en una prueba: devuelve true/false ----
  async function turno(who, html, ok, ops, voz) {
    const x = X(); x.bn(html); const P = x.Ct;
    if (voz) await say('H', voz, { keep: true }); 
    if (ops) {
      let i;
      if (who === 'A') i = await x.Ef(ops.map(esc)); else { await x.pn(700); i = Math.random() < .7 ? ops.indexOf(ok) : rnd(ops.length); await say('B', ops[i] + '.'); }
      const bien = ops[i] === ok;
      [].forEach.call(P.querySelectorAll('.op'), (b, k) => { if (ops[k] === ok) b.classList.add('okb'); else if (k === i) b.classList.add('kob'); });
      return bien;
    }
    const oks = (Array.isArray(ok) ? ok : [ok]).map(N);
    if (who === 'A') { const w = await x.go([['PASAPALABRA', 'PASA']], 20, null, false); return !!w && w !== 'PASA' && oks.indexOf(N(w)) >= 0; }
    await x.pn(800); const b = Math.random() < .65; const dicho = Array.isArray(ok) ? ok[0] : ok; if (b) await say('B', x.ui(dicho) + '.'); else await x.Me('B', x.ke.pasaB[0][1]); return b;
  }
  async function cierraTurno(who, bien, seg, oro, i) {
    const x = X();
    if (bien) { x.bu(who, (oro === i ? 2 : 1) * seg); x.ut('oneOfFour_hit'); if (oro === i && who === 'A') x.ze.aviso('⭐ Letra de oro: segundos dobles'); const r = R.hit(who); if (r) x.vt.A += r; await x.Me('H', x.Nt(x.ke.bien)[1]); }
    else { x.Su(who); R.miss(who); x.ut('oneOfFour_fail'); await x.Me('H', x.Nt(x.ke.mal)[1]); }
    x.Qn();
  }
  // ---- una prueba nueva ----
  async function prueba(p) {
    const x = X(); x.Sn(p.n); x.Pt({ k: 'texto', t: p.n, sub: '+' + p.seg + ' s por acierto' }); x.Rt('general'); x.ut('oneOfFour_in');
    await say('H', intro(p.n, p.sub));
    const oro = R.on('pp_letraoro') ? rnd(6) : -1;
    const tit = (i) => '<div class="q">' + (i === oro ? '⭐ <b class="nsgold">PREGUNTA DE ORO</b> ⭐<br>' : '') + esc(p.n) + '</div>';
    const items = [];
    if (p.t === 'escalera') { const ch = mezcla(p.it)[0], ch2 = mezcla(p.it.filter(c => c !== ch))[0]; ch.concat(ch2).slice(0, 6).forEach(([w, d]) => items.push({ html: '<div class="def">' + esc(d) + '</div><div class="estr">' + w.split('').map(() => '_').join(' ') + '</div><div class="res">' + w.length + ' letras</div>', ok: w, voz: d })); }
    else if (p.t === 'bomba') {
      for (const sil of mezcla(p.it).slice(0, 6)) items.push({ bomba: sil });
    } else if (['espejo', 'anagrama', 'sinvocales', 'extremos', 'medias', 'contar'].indexOf(p.t) >= 0) {
      for (const b of tomaBanco(6)) {
        const w = b.w; let show = '';
        if (p.t === 'espejo') show = w.split('').reverse().join('');
        if (p.t === 'anagrama') show = revuelve(w);
        if (p.t === 'sinvocales') show = sinVoc(w).split('').join(' ');
        if (p.t === 'extremos') show = w[0] + ' ' + w.slice(1, -1).replace(/./g, '_ ') + w.slice(-1);
        if (p.t === 'medias') show = w.split('').map((c, k) => k % 2 ? '_' : c).join(' ');
        if (p.t === 'contar') { const n = w.length, ops = mezcla([n, n - 1, n + 1, n + 2].map(String)); items.push({ html: '<div class="def">' + esc(b.d) + '</div><div class="res">¿Cuántas letras tiene la respuesta?</div>', ok: String(n), ops, voz: b.d, w }); continue; }
        items.push({ html: '<div class="estr">' + esc(show) + '</div>' + (p.t === 'espejo' || p.t === 'anagrama' ? '' : '<div class="def">' + esc(b.d) + '</div>'), ok: w, voz: p.t === 'espejo' || p.t === 'anagrama' ? null : b.d });
      }
    } else {
      const pool = mezcla(p.it).slice(0, 6), todas = [...new Set(p.it.map(i => i[1]))];
      for (const it of pool) {
        const [q, a] = it; let ops = null;
        if (p.t === 'ops') ops = mezcla([a].concat(mezcla(todas.filter(t => t !== a)).slice(0, 3)));
        if (p.t === 'opx') ops = mezcla([a].concat(it[2]));
        items.push({ html: '<div class="def">' + esc(q) + '</div>', ok: a, ops, voz: frase(q) });
      }
    }
    for (let i = 0; i < items.length; i++) {
      const who = i % 2 ? 'B' : 'A', it = items[i];
      await x.Me('H', x.Nt(who === 'A' ? x.ke.turnoA : x.ke.turnoB)[1]);
      if (it.bomba) { await bomba(who, it.bomba, p, tit(i), i, oro); continue; }
      const bien = await turno(who, tit(i) + it.html, it.ok, it.ops, it.voz);
      if (!bien && !it.ops) { x.Ct.insertAdjacentHTML('beforeend', '<div class="res">Era: <b>' + esc(Array.isArray(it.ok) ? it.ok[0] : it.ok) + '</b></div>'); }
      await cierraTurno(who, bien, p.seg, oro, i); x.Sn(p.n);
    }
    await x.Me('H', x.Tt.ganados('A', x.vt.A)); await x.Me('H', x.Tt.ganados('B', x.vt.B));
  }
  // Sílaba bomba: 8 segundos de mecha; cada palabra buena con la sílaba suma
  async function bomba(who, sil, p, tit, i, oro) {
    const x = X(); const usadas = {}; let n = 0, t0 = Date.now(); const lim = 8;
    const pinta = () => x.bn(tit + '<div class="estr">💣 ' + sil + '</div><div class="res">Palabras con «' + sil + '» antes de que explote: ' + n + '</div>');
    pinta(); await say('H', 'La sílaba es ' + sil + '.', { keep: true });
    x.Yg(lim);
    for (;;) {
      const resta = lim - (Date.now() - t0) / 1000; if (resta <= 0) break;
      let w;
      if (who === 'A') w = await x.go([], resta, () => x.Yg(lim - (Date.now() - t0) / 1000), false);
      else { await x.pn(1800); if (Math.random() < .6) { const c = x.ou.find(b => b.w.indexOf(sil) >= 0 && !usadas[b.w] && Math.random() < .3) || x.ou.find(b => b.w.indexOf(sil) >= 0 && !usadas[b.w]); w = c && c.w; if (w) await x.Me('B', x.ui(w) + '.'); } else w = null; }
      if (!w) break;
      const v = N(w); if (v.length >= 3 && v.indexOf(sil) >= 0 && !usadas[v]) { usadas[v] = 1; n++; x.ut('oneOfFour_hit'); pinta(); }
    }
    x.Yg(null); x.ut('donut_fail'); x.bn(tit + '<div class="estr">💥 ¡BUM!</div><div class="res">' + n + ' palabras con «' + sil + '»</div>');
    if (n) { x.bu(who, Math.min(3, n) * (oro === i ? 2 : 1)); await x.Me('H', x.Nt(x.ke.bien)[1]); } else { await x.Me('H', x.Nt(x.ke.mal)[1]); }
    x.Qn(); x.Sn(p.n);
  }
  // ---- programa completo: pruebas según Opciones (Clásico / Nuevo / Mezcla) ----
  async function pruebas(cl) {
    const modo = LSg('pp_pruebas') || 'clasico'; extraUsado = false; racha.A = 0;
    const nuevas = mezcla(PR());
    if (modo === 'nuevo') { for (const p of nuevas.slice(0, 5)) await prueba(p); return; }
    if (modo === 'mezcla') { await cl.una4(); await prueba(nuevas[0]); await cl.pista(); await prueba(nuevas[1]); await cl.sopa(); await prueba(nuevas[2]); await cl.donde(); return; }
    await cl.una4(); await cl.pista(); await cl.sopa(); await cl.donde();
  }
  // ---- finales ----
  async function final() {
    const f = LSg('pp_final3d') || 'alaz', x = X();
    if (f === 'alaz' || f === 'rosco') return x.hf(f);
    const F = FI().find(z => z.id === f); if (!F) return x.hf('alaz');
    return rosco(F);
  }
  async function rosco(F) {
    const x = X(), id = F.id, torre = id === 'torre';
    x.Sn(F.n); x.ut('game_in'); x.Vn(.25); x.Rt('suelo'); x.Nn(false);
    x.Pt({ k: 'texto', t: F.n, sub: F.sub });
    await say('H', 'Llega la prueba final: ' + F.n + '. ' + F.sub + '.');
    const base = id === 'relampago' ? 60 : x.ze.tiempo(85);
    const L = x.un; let juega = L.map((_, i) => i);
    if (id === 'relampago') juega = mezcla(juega).slice(0, 15).sort((a, b) => a - b);
    const mk = h => ({ p: x.rf(), est: L.map((_, i) => juega.indexOf(i) >= 0 ? 0 : 9), t: base + (id === 'relampago' ? 0 : x.vt[h]) + (h === 'A' ? x.ze.extraFinal() : 0), ok: 0, ko: 0, cur: juega[0], fuera: false });
    const J = { A: mk('A'), B: mk('B'), n: 999 };
    if (id === 'parejas') { J.B.p = J.A.p; J.B.est = J.A.est; J.B.t = J.A.t = base + Math.max(x.vt.A, x.vt.B); }
    const oro = R.on('pp_letraoro') ? juega[rnd(juega.length)] : -1;
    const pend = M => juega.filter(i => M.est[i] === 0);
    const vivo = M => M.t > 0 && !M.fuera && pend(M).length > 0;
    const hud = x.rt('div', 'rhud'); x.$t.appendChild(hud);
    const cls = (M, h, b, i) => 'rl ' + (i === b ? 'c' : M.est[i] === 1 ? 'o' : M.est[i] === 2 ? 'k' : '') + (h === 'A' && i === oro && !M.est[i] ? ' nsoro' : '');
    const pinta = (M, h, b) => {
      hud.innerHTML = '';
      L.forEach((l, i) => {
        const txt = id === 'ciegas' && i === b ? '?' : l;
        const z = x.rt('div', cls(M, h, b, i), txt);
        if (M.est[i] === 9) z.style.opacity = '.3';
        if (torre) { const fila = Math.floor(i / 5), col = fila % 2 ? 4 - i % 5 : i % 5; z.style.left = (10 + col * 20) + '%'; z.style.top = (90 - fila * 20) + '%'; z.className = 'rl ' + (i < M.ok ? 'o' : i === M.ok ? 'c' : ''); z.textContent = String(i + 1); }
        else { const a = -Math.PI / 2 + i / 25 * Math.PI * 2; z.style.left = 50 + 44 * Math.cos(a) + '%'; z.style.top = 50 + 44 * Math.sin(a) + '%'; }
        hud.appendChild(z);
      });
      hud.appendChild(x.rt('div', 'rt ' + (h === 'A' ? 'az' : 'na'), '<b>' + Math.max(0, Math.ceil(M.t)) + '</b><small>' + x.Dn[h].n.split(' ')[0] + ' · ' + (torre ? 'piso ' + M.ok + '/25' : M.ok + ' ✓') + '</small>'));
      L.forEach((l, i) => x.Ya(i, i === b ? 3 : M.est[i] === 9 ? 0 : M.est[i]));
      x.Pt({ k: 'rosco', est: M.est.map(e => e === 9 ? 0 : e), cur: b, who: x.Dn[h].n, t: Math.max(0, Math.ceil(M.t)), ok: M.ok });
    };
    for (const h of ['A', 'B']) await x.Me('H', x.Tt.segundos(Math.max(30, Math.min(300, Math.round(J[h].t)))));
    let h = x.vt.A >= x.vt.B ? 'A' : 'B';
    while (vivo(J.A) || vivo(J.B)) {
      if (!vivo(J[h])) { h = h === 'A' ? 'B' : 'A'; continue; }
      const M = J[h]; x.Rt(h === 'A' ? 'azul' : 'naranja'); await x.Me('H', x.Nt(h === 'A' ? x.ke.turnoA : x.ke.turnoB)[1]); x.Rt('suelo');
      let sigue = true;
      while (sigue && vivo(M)) {
        const P = pend(M); let b = id === 'inverso' ? P[rnd(P.length)] : (P.find(i => i >= M.cur) ?? P[0]); M.cur = b;
        const I = M.p[b]; pinta(M, h, id === 'inverso' ? -1 : b);
        let T0 = Date.now(); const tic = () => { M.t -= (Date.now() - T0) / 1000; T0 = Date.now(); pinta(M, h, id === 'inverso' ? -1 : b); };
        const cab = id === 'inverso' || id === 'ciegas' ? '<span class="ltr">?</span> ' : '<span class="ltr">' + I.l + '</span> ' + (h === 'A' && b === oro ? '⭐ LETRA DE ORO · ' : '') + (I.t === 'e' ? 'EMPIEZA POR ' : 'CONTIENE LA ') + I.l;
        let extra = '';
        if (id === 'pistas') extra = '<div class="estr">' + I.w.split('').map((c, k) => k ? '_' : c).join(' ') + '</div>';
        if (id === 'desordenado') extra = '<div class="estr">' + revuelve(I.w) + '</div>';
        let ops = null;
        if (id === 'tres') { const otras = mezcla(x.LS(I.l).filter(o => o.w !== I.w && o.t === I.t)).slice(0, 2).map(o => o.w); ops = mezcla([I.w].concat(otras)); }
        if (id === 'inverso') { const otras = mezcla(P.filter(i => i !== b)).slice(0, 3).map(i => L[i]); ops = mezcla([L[b]].concat(otras)); }
        x.bn('<div class="q">' + cab + '</div><div class="def">' + esc(I.d) + '</div>' + extra);
        if (id !== 'inverso' && id !== 'ciegas') await x.Me('H', x.Tt.prefijo(I), { txt: x.Tt.prefijoTxt(I), keep: true });
        await x.Me('H', I.d, { noCam: true, keep: true }); tic();
        let W = null;
        if (h === 'A') {
          for (;;) {
            if (ops) { const lab = ops.concat(['PASAPALABRA']).concat(R.extraBtn().map(e => e[0])); const tm = new Promise(r => setTimeout(() => r(-1), Math.max(100, M.t * 1000))); const k = await Promise.race([x.Ef(lab), tm]); tic(); W = k < 0 ? null : k < ops.length ? ops[k] : k === ops.length ? 'PASA' : 'PEXTRA'; }
            else { W = await x.go([['PASAPALABRA', 'PASA']].concat(R.extraBtn()), Math.max(.1, M.t), () => tic(), true); tic(); }
            if (W === 'PEXTRA') { if (R.usaExtra()) { M.t += 5; x.ze.aviso('🃏 Pasapalabra extra: +5 s'); } continue; }
            break;
          }
        } else { await x.pn(900); M.t -= 2.5; const r = Math.random(); W = r < .62 ? (id === 'inverso' ? L[b] : I.w) : r < .85 ? 'PASA' : 'XXX'; if (W !== 'PASA' && W !== 'XXX') await x.Me('B', id === 'inverso' ? 'La ' + L[b] + '.' : x.ui(I.w) + '.').catch(() => { }); }
        x.gf && x.gf();
        if (M.t <= 0 && W == null) { await x.Me('H', x.ke.tiempo[0][1]); sigue = false; break; }
        const nxt = () => { const k = juega.indexOf(b); M.cur = juega[(k + 1) % juega.length]; };
        if (W === 'PASA') { await x.Me(h, (h === 'A' ? x.ke.pasaA : x.ke.pasaB)[0][1]); x.ut('donut_pass'); nxt(); sigue = false; R.miss(h); }
        else if (W && (id === 'inverso' ? W === L[b] : N(W) === N(I.w))) { M.est[b] = 1; M.ok++; x.ut('donut_hit'); if (h === 'A' && b === oro) { M.t += 5; x.ze.aviso('⭐ Letra de oro: +5 s'); } R.hit(h, M); nxt(); }
        else {
          x.ut('donut_fail'); R.miss(h);
          if (torre) { hud.animate && hud.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 420, iterations: 2 }); M.ko++; }
          else { M.est[b] = 2; M.ko++; }
          await x.Me('H', x.Nt(x.ke.mal)[1]); if (!torre) await x.Me('H', x.Tt.era(I.w));
          if (id === 'sinred') M.fuera = true;
          nxt(); sigue = false;
        }
        x.Qn(); if (M.t <= 0) { await x.Me('H', x.ke.tiempo[0][1]); sigue = false; }
      }
      pinta(M, h, -1); if (id !== 'parejas' || true) h = h === 'A' ? 'B' : 'A';
    }
    const todas = juega.length;
    J.bote = id === 'parejas' ? J.A.ok + J.B.ok === todas : (J.A.ok === todas || J.B.ok === todas);
    hud.remove(); x.Qn(); x.Vn(1); x.Nn(true);
    for (let i = 0; i < 25; i++) x.Ya(i, 0);
    return J;
  }
  // ---- jugar una prueba o final suelta (?prueba=n_<id> o f_<id>) ----
  const tiene = id => /^(n|f)_/.test(id);
  async function solo(id) {
    const x = X(); x.Rt('general');
    if (id.startsWith('n_')) { const p = PR().find(z => z.id === id.slice(2)); if (p) await prueba(p); return; }
    const F = FI().find(z => z.id === id.slice(2)); if (F) await x.i0(await rosco(F));
  }
  window.__ppNuevo = { pruebas, final, prueba, rosco, solo, tiene, R, hit: R.hit, miss: R.miss, extraBtn: R.extraBtn, usaExtra: R.usaExtra };
})();
