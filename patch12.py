p='www/js/game.js';s=open(p).read()
s=s.replace("const quiere=anim||activo||!PLATO;if(!quiere){if(!limpio){R.clear();limpio=true}return}limpio=false;","const quiere=anim||activo||!PLATO;if(!quiere){if(!limpio){R.clear();R.domElement.style.visibility='hidden';limpio=true}return}if(limpio)R.domElement.style.visibility='visible';limpio=false;")
a=s.index('async function estoMeSuena(){');b=s.index('\n',s.index(' await marcador()}',a))+1
ems=r'''// Reglas reales (vídeo 12:52–23:15): parejas frente a frente; se elige un color de la gramola (5 s, luego 4, 3…) y suena la canción
// (clip original cortado del audio del programa). Christian da el año. Solo se pulsa cuando termina de sonar entera: si se pulsa antes es fallo y rebote.
async function estoMeSuena(){await cortinilla('suena');await aviso('<h2>Esto me suena</h2><p>Juega una pareja: uno de cada familia. Se elige un <b>color de la gramola</b> y suena una canción (los clips son los del programa original). Os doy el <b>año</b> de la canción.</p><p>Hay que <b>esperar a que termine de sonar entera</b>. Si pulsáis antes, es fallo y hay <b>rebote</b> para la otra familia.</p><p>El primer color vale <b>5 s</b>, el siguiente 4 s, luego 3 s…</p>');
 await say(D.fr.suena[0]);let quienElige=0;
 for(let s=0;s<D.suena.length;s++){const so=D.suena[s],J=[jug(0)||'Naranja',jug(1)||'Azul'];
  await new Promise(async ok=>{let ci=0,fin=false,sonando=false,quien=-1,bloq=[false,false],au=null;const usados=new Set();
   UI.innerHTML=`<div class="ems"><div class="jb"><div class="jbt"></div><div class="jbb">${JCOL.map((c,i)=>`<i style="background:${c}" id="jb${i}" data-c="${i}"></i>`).join('')}</div><div class="jbg"></div></div>
   <div class="def card" id="q">Canción ${s+1} de ${D.suena.length}${so.y?` · Año <b>${so.y}</b>`:''}</div>
   <div class="duel"><div class="pl B"><span class="pul bz" id="b1" style="--c:#1f6bff"></span><b>${J[1]}</b><span class="sq bgB">${G.eq[1].s}</span></div><span class="sq mor" id="np">5</span><div class="pl O"><span class="sq bgO">${G.eq[0].s}</span><b>${J[0]}</b><span class="pul bz" id="b0" style="--c:#e8352f"></span></div></div>
   <div id="jz" style="display:none"><input id="r" autocomplete="off" placeholder="título"><button class="btn g s" id="ok">Comprobar</button><button class="btn s" id="si">✔</button><button class="btn r s" id="no">✘</button></div></div>`;
   const val=()=>Math.max(1,5-ci);
   const acabar=m=>{if(fin)return;fin=true;if(au)au.pause();callar();$('#q').innerHTML=(m||'')+` La canción era: <b>${so.t}</b>${so.a?' ('+so.a+')':''}${so.y?' · '+so.y:''}`;setTimeout(ok,3200)};
   const elegir=()=>{if(fin)return;if(ci>=so.c.length)return acabar('¡Nadie la ha acertado!');bloq=[false,false];quien=-1;$('#np').textContent=val();
    const e=quienElige;$('#q').innerHTML=`${J[e]} (${G.eq[e].n}): elige un color por <b>${val()} segundos</b>${so.y?` · Año ${so.y}`:''}`;
    document.querySelectorAll('.jbb i').forEach(el=>el.onclick=()=>{const c=+el.dataset.c;if(usados.has(c)||sonando||fin)return;usados.add(c);el.classList.add('on');quienElige=1-quienElige;tocar()})};
   const tocar=async()=>{sonando=true;$('#q').innerHTML=`♪ Suena la gramola… <b>esperad a que acabe</b> ♪`;snd('menu_press');
    await new Promise(r=>{au=new Audio('ems/'+so.c[ci]+'.mp3');au.volume=MUTE?0:1;let h=setTimeout(r,14000);au.onended=()=>{clearTimeout(h);r()};au.onerror=()=>{clearTimeout(h);setTimeout(r,8000)};au.play().catch(()=>{})});
    sonando=false;if(fin)return;if(bloq[0]&&bloq[1]){ci++;return elegir()}$('#q').innerHTML='¡Ya! <b>Pulsad</b> si sabéis el título';snd('donut_pass')};
   const buzz=e=>{if(fin||quien>=0||bloq[e])return;if(sonando){snd('donut_fail');bloq[e]=true;$('#q').innerHTML=`¡${J[e]} ha pulsado antes de que acabe la canción! Fallo y <b>rebote</b>.`;return}
    quien=e;callar();document.getElementById('b'+e).classList.add('on');camE(e);$('#jz').style.display='block';$('#r').value='';$('#r').focus()};
   const res=v=>{if(quien<0)return;const e=quien;quien=-1;$('#jz').style.display='none';document.getElementById('b'+e).classList.remove('on');
    if(v){const g=val();snd('donut_hit');G.eq[e].s+=g;acabar(`¡${J[e]} la acierta! +${g} segundos para ${G.eq[e].n}.`)}
    else{snd('donut_fail');bloq[e]=true;if(bloq[1-e]){ci++;elegir()}else $('#q').innerHTML=`Fallo. <b>Rebote</b> para ${J[1-e]}…`}};
   $('#b0').onclick=()=>buzz(0);$('#b1').onclick=()=>buzz(1);$('#ok').onclick=()=>res(so.ok.includes(norm($('#r').value)));$('#si').onclick=()=>res(true);$('#no').onclick=()=>res(false);$('#r').onkeydown=ev=>{if(ev.key==='Enter')$('#ok').click()};
   await say('suy'+s);elegir()})}
 await marcador()}
'''
s=s[:a]+ems+s[b:]
a=s.index('async function pintas(){');b=s.index('// ---------- LA RISTRA')
pin=r'''// Reglas reales (vídeo 31:41–32:10): la familia elige tema; uno dibuja (puede señalar o hacer gestos); 5 palabras, frases o expresiones;
// 30 s por cada una pero el tiempo es compartido (150 s) y se administra como se quiera; 3 s por acierto.
async function pintas(){await cortinilla('pinta');await aviso('<h2>¿Tú qué pintas?</h2><p>Elegís un <b>tema</b>. Uno de la familia dibuja y <b>puede señalar o hacer gestos</b>; los demás adivinan.</p><p><b>5</b> palabras, frases o expresiones. 30 segundos por cada una, pero el tiempo es <b>compartido</b>: tenéis <b>150 segundos</b> y los administráis como queráis.</p><p><b>3 segundos</b> por acierto.</p>');await say(D.fr.pinta[0]);
 const libres=[0,1];
 for(const e of [0,1]){camE(e);let ti=libres[0];if(libres.length>1)ti=await new Promise(ok=>{UI.innerHTML=`<div class="card"><h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Elegid tema:</p>${libres.map(i=>`<button class="btn s" data-p="${i}">${D.pinta[i].t}</button>`).join(' ')}</div>`;document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>ok(+b.dataset.p))});
  libres.splice(libres.indexOf(ti),1);const T=D.pinta[ti];const dib=jug(e)||'Dibujante';
  await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Tema: <b>${T.t}</b> · Dibuja: <b>${dib}</b></p><p>5 tarjetas · 150 segundos compartidos · +3 s por acierto</p>`);
  await new Promise(ok=>{const c=G.eq[e].c,ws=[...T.w];let i=0,fin=false,ac=0;
  UI.innerHTML=`<div class="card rw"><canvas id="pad" width="300" height="200"></canvas><div><div class="tema bg${c}">${T.t.toUpperCase()}</div><div class="sc" style="margin:6px"><div class="bg${c}" id="n" style="font-size:30px">150</div><div class="bg${c}" id="ac" style="font-size:30px">0</div></div><div id="tj" style="margin:4px"></div><div>Tarjeta (solo quien dibuja, toca para ver): <b id="w" style="filter:blur(7px)" onclick="this.style.filter=''"></b></div><button class="btn g s" id="si">✔ Acertado</button><button class="btn s" id="pa">Siguiente tarjeta ▶</button><button class="btn s" id="bo">Borrar</button></div></div>`;
  const pad=$('#pad'),g=pad.getContext('2d');g.lineWidth=4;g.lineCap='round';g.strokeStyle='#123';let d=false;const xy=ev=>{const r=pad.getBoundingClientRect();return[(ev.clientX-r.left)*300/r.width,(ev.clientY-r.top)*200/r.height]};
  pad.onpointerdown=ev=>{d=true;g.beginPath();g.moveTo(...xy(ev))};pad.onpointermove=ev=>{if(d){g.lineTo(...xy(ev));g.stroke()}};onpointerup=()=>d=false;$('#bo').onclick=()=>g.clearRect(0,0,300,200);
  const hech=new Set();const tj=()=>{$('#tj').innerHTML=T.w.map((w,k)=>`<span class="sq ${hech.has(k)?'bg'+c:''}" style="display:inline-block;min-width:22px;margin:1px;${k===i?'outline:2px solid #fff':''}">${k+1}</span>`).join('')};
  const nx=()=>{if(hech.size>=ws.length)return end();let n=0;while(hech.has(i)&&n++<10)i=(i+1)%ws.length;g.clearRect(0,0,300,200);$('#w').textContent=ws[i];$('#w').style.filter='blur(7px)';tj()};
  const rl=reloj(150,$('#n'),()=>end());const end=()=>{if(fin)return;fin=true;rl.stop();setTimeout(ok,1200)};
  $('#si').onclick=()=>{if(fin)return;snd('donut_hit');G.eq[e].s+=3;hech.add(i);$('#ac').textContent=++ac;i=(i+1)%ws.length;nx()};$('#pa').onclick=()=>{if(fin)return;snd('donut_pass');i=(i+1)%ws.length;nx()};nx()})}await marcador()}
'''
s=s[:a]+pin+s[b:]
old="await say(D.fr.ristra[0]);\n const mitad=Math.ceil(D.ristra.length/2);const max=[0,0],tot=[0,0];\n for(const e of [0,1]){const ws=D.ristra.map((w,i)=>[w,i]).slice(e?mitad:0,e?D.ristra.length:mitad);tot[e]=ws.length;camE(e);\n  await aviso(`<h2 class=\"${G.eq[e].c}\">${G.eq[e].n}</h2><p>Pueblos de España · ${ws.length} palabras · 75 segundos</p>`);"
assert old in s
s=s.replace(old,"await say(D.fr.ristra[0]);\n const max=[0,0],tot=[0,0],libres=[0,1];\n for(const e of [0,1]){camE(e);let ti=libres[0];if(libres.length>1)ti=await new Promise(ok=>{UI.innerHTML=`<div class=\"card\"><h2 class=\"${G.eq[e].c}\">${G.eq[e].n}</h2><p>Elegid tema:</p>${libres.map(i=>`<button class=\"btn s\" data-p=\"${i}\">${D.ristra[i].t}</button>`).join(' ')}</div>`;document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>ok(+b.dataset.p))});\n  libres.splice(libres.indexOf(ti),1);const ws=D.ristra[ti].w.map((w,i)=>[w,i]);tot[e]=ws.length;const RK=ti;\n  await aviso(`<h2 class=\"${G.eq[e].c}\">${G.eq[e].n}</h2><p>${D.ristra[ti].t} · ${ws.length} palabras · 75 segundos</p>`);")
assert "await say('rw'+ws[n][1])}" in s
s=s.replace("await say('rw'+ws[n][1])}","await say('rx'+RK+'_'+ws[n][1])}")
s=s.replace("Tiempo: 85 segundos + los acumulados. Si falláis o decís «Pasapalabra», pasa el turno a la otra familia.","Empieza la familia con más segundos. El tiempo de cada familia son <b>los segundos acumulados</b> en las pruebas. Si acertáis, seguís; si decís «Pasapalabra», turno para la otra familia; si falláis, paramos, corregimos y pasa el turno.")
assert "t:85+G.eq[e].s," in s
s=s.replace("t:85+G.eq[e].s,","t:Math.max(G.eq[e].s,30),")
s=s.replace("window.__ppf={G,reglas,","window.__ppf={G,D,reglas,")
s=s.replace("$('#rs').textContent=","($('#rs')||{}).textContent=")
open(p,'w').write(s)
