import * as THREE from './three.module.min.js';
const D=window.PPF, $=s=>document.querySelector(s), UI=$('#ui');
const low=Math.min(window.devicePixelRatio||1,1);
// ---------- audio ----------
const SND={};function snd(n,v=1){try{let a=SND[n]||(SND[n]=new Audio('aud/'+n+'.mp3'));a.pause();a.currentTime=0;a.volume=v;a.play().catch(()=>{});return a}catch(e){}}
let voz=null;
function say(k){return new Promise(ok=>{const t=D.L[k];if(!t)return ok();$('#subt').textContent=t;$('#sub').style.display='block';
 if(voz){voz.onended=null;voz.pause()}voz=new Audio('tts/'+k+'.mp3');let done=()=>{$('#sub').style.display='none';ok()};
 voz.onended=done;voz.onerror=()=>setTimeout(done,1500);voz.play().catch(()=>setTimeout(done,2500));});}
function callar(){if(voz){voz.onended=null;voz.pause()}$('#sub').style.display='none'}
async function sayAll(ks){for(const k of ks)await say(k)}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zñ0-9]/g,'');
// ---------- three.js plató ----------
const R=new THREE.WebGLRenderer({canvas:$('#c3d'),antialias:false,powerPreference:'low-power'});R.setPixelRatio(low);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,1,0.1,200);
function rs(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}addEventListener('resize',rs);rs();
function cv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const bg=cv(4,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#5fb4ff');q.addColorStop(.6,'#1659d8');q.addColorStop(1,'#0a2f8c');g.fillStyle=q;g.fillRect(0,0,w,h)});S.background=bg;
S.add(new THREE.AmbientLight(0xffffff,1.6));const dl=new THREE.DirectionalLight(0xffffff,2.2);dl.position.set(3,6,8);S.add(dl);
// letras flotantes del fondo (como el grafismo del programa)
const ABC='ABCDEFGHIJLMNÑOPQRSTUVXYZ';const fondo=new THREE.Group();S.add(fondo);
for(let i=0;i<26;i++){const l=ABC[i%25];const t=cv(64,64,(g)=>{g.fillStyle='rgba(255,255,255,.22)';g.font='bold 54px F,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(l,32,36)});
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));m.position.set((Math.random()-.5)*30,(Math.random()-.5)*16,-10-Math.random()*8);const s=1.5+Math.random()*2.5;m.scale.set(s,s,1);m.userData.v=.2+Math.random()*.4;fondo.add(m)}
// bolas con letras (cabecera)
function bolaTex(l){return cv(128,64,(g,w,h)=>{g.fillStyle='#f4f6fb';g.fillRect(0,0,w,h);g.fillStyle='#1b5ed6';g.font='bold 40px F,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(l,32,34);g.fillText(l,96,34)})}
const geoB=new THREE.SphereGeometry(.42,14,10);const bolas=[];const cab=new THREE.Group();cab.visible=false;S.add(cab);
for(let i=0;i<25;i++){const b=new THREE.Mesh(geoB,new THREE.MeshStandardMaterial({map:bolaTex(ABC[i]),roughness:.35,metalness:.1}));cab.add(b);bolas.push(b)}
// tubos de cristal y bloques amarillos
const tubos=new THREE.Group();cab.add(tubos);const gm=new THREE.MeshStandardMaterial({color:0xbfe6ff,transparent:true,opacity:.25,roughness:.1});
for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,14,12,1,true),gm);t.position.set(-4+i*2,0,-2);tubos.add(t)}
const am=new THREE.MeshStandardMaterial({color:0xffc21a,roughness:.5});const bloques=new THREE.Group();cab.add(bloques);
for(let i=0;i<22;i++){const h=1+Math.random()*4;const m=new THREE.Mesh(new THREE.BoxGeometry(1,h,1),am);m.position.set((i%11)*1.3-7,-8+h/2,-3-Math.floor(i/11)*2);bloques.add(m)}
const aro=new THREE.Mesh(new THREE.TorusGeometry(4.2,.08,6,64),new THREE.MeshStandardMaterial({color:0xffd04a,metalness:.6,roughness:.3}));cab.add(aro);
// logo
const logoT=cv(1024,320,(g,w,h)=>{g.font='bold 150px F,Arial';g.textAlign='center';g.textBaseline='middle';g.lineWidth=18;g.strokeStyle='#0b2f8e';g.strokeText('Pasapalabra',w/2,120);g.fillStyle='#fff';g.fillText('Pasapalabra',w/2,120);
 g.save();g.translate(w*0.68,250);g.rotate(-.06);const q=g.createLinearGradient(0,-40,0,40);q.addColorStop(0,'#ffd65c');q.addColorStop(1,'#ee7d00');g.fillStyle=q;g.fillRect(-170,-38,340,76);g.strokeStyle='#fff';g.lineWidth=4;g.strokeRect(-170,-38,340,76);g.fillStyle='#fff';g.font='bold 56px F,Arial';g.lineWidth=8;g.strokeStyle='#a33a00';g.strokeText('EN FAMILIA',0,4);g.fillText('EN FAMILIA',0,4);g.restore()});
const logo=new THREE.Mesh(new THREE.PlaneGeometry(8,2.5),new THREE.MeshBasicMaterial({map:logoT,transparent:true}));logo.visible=false;S.add(logo);
// animación
let anim=null,last=0;const clk=new THREE.Clock();
function loop(){requestAnimationFrame(loop);const now=performance.now();if(now-last<33)return;last=now;const dt=Math.min(clk.getDelta(),.1);
 fondo.children.forEach(m=>{m.position.x+=m.userData.v*dt;if(m.position.x>16)m.position.x=-16});
 if(anim)anim(dt);R.render(S,C)}
C.position.set(0,0,10);loop();
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t;
function cabecera(){return new Promise(ok=>{UI.innerHTML='<button class="btn s" style="position:fixed;right:8px;bottom:20px" id="skip">Saltar ⏭</button>';
 cab.visible=true;logo.visible=false;fondo.visible=false;const m=snd('sintonia');let T=0,fin=false;
 bolas.forEach((b,i)=>{b.userData={x:-4+(i%5)*2,y:6+Math.floor(i/5)*1.1,vy:0}});
 const end=()=>{if(fin)return;fin=true;anim=null;cab.visible=false;fondo.visible=true;logo.visible=false;if(m)m.pause();C.position.set(0,0,10);C.lookAt(0,0,0);ok()};
 $('#skip').onclick=end;
 anim=dt=>{T+=dt;
  if(T<7){// bolas cayendo por los tubos, barrido de cámara lateral
   tubos.visible=true;bolas.forEach(b=>{const u=b.userData;u.vy-=9*dt;u.y+=u.vy*dt;if(u.y<-5+Math.floor(bolas.indexOf(b)/5)*.9){u.y=-5+Math.floor(bolas.indexOf(b)/5)*.9;u.vy*=-.3}b.position.set(u.x,u.y,-2);b.rotation.y+=dt*2});
   C.position.set(lerp(-8,6,ease(T/7)),lerp(3,-1,T/7),lerp(6,7,T/7));C.lookAt(0,-1,-2)}
  else if(T<12){tubos.visible=false;const k=(T-7)/5;bloques.children.forEach((b,i)=>{b.scale.y=.3+.7*Math.abs(Math.sin(T*2+i))});
   bolas.forEach((b,i)=>{b.position.set(-7+((i*1.7+T*3)%14),-3+Math.sin(T*3+i)*1.5+((i*7)%5)*.4,-1);b.rotation.x+=dt*4});
   C.position.set(lerp(0,-3,k),lerp(-2,2,k),lerp(4,9,k));C.lookAt(0,-2,-2)}
  else if(T<19){bloques.visible=false;const k=ease(Math.min(1,(T-12)/5));// las bolas forman el rosco
   bolas.forEach((b,i)=>{const a=Math.PI/2-i/25*Math.PI*2,tx=Math.cos(a)*3.6,ty=Math.sin(a)*3.6;b.position.x=lerp(b.position.x,tx,k*.2+.02);b.position.y=lerp(b.position.y,ty,k*.2+.02);b.position.z=lerp(b.position.z,0,.1);b.rotation.set(0,-Math.PI/2+.3,0)});
   aro.visible=true;aro.rotation.z+=dt;C.position.set(Math.sin((T-12)*.5)*6,1-k,lerp(14,11,k));C.lookAt(0,0,0);
   if(T>16){logo.visible=true;logo.position.set(0,-.3,1.5);const z=Math.min(1,(T-16)/1);logo.scale.setScalar(.2+.8*ease(z))}}
  else if(T<21.5){const k=(T-19)/2.5;logo.rotation.y=-k*1.2;logo.position.z=1.5+k*7;}
  else{cab.visible=false;logo.visible=false;bloques.visible=true;tubos.visible=true;anim=null;creditos().then(end)}}});}
function creditos(){return new Promise(ok=>{UI.innerHTML=`<div class="card"><div class="logo">Pasapalabra</div><div class="tag">EN FAMILIA</div>
 <p>Cabecera reconstruida en 3D (three.js)<br>Sintonía y sonidos: audio original del programa / del juego</p><p>Frases nuevas: voz sintética Piper TTS <span class="tts">TTS</span></p>
 <p>Basado en «Pasapalabra en familia» (Telecinco, 2018)</p><h2>Creado por Ikeriano</h2></div>`;
 C.position.set(0,0,10);setTimeout(ok,4500)});}
async function cortinilla(titulo,col){UI.innerHTML='';logo.visible=true;snd('cortinilla');let T=0;
 await new Promise(ok=>{anim=dt=>{T+=dt;const k=Math.min(1,T/1.3);logo.position.set(0,0,lerp(-6,3,ease(k)));logo.rotation.y=(1-ease(k))*Math.PI*2;logo.rotation.z=Math.sin(k*Math.PI)*.3;if(T>1.4){anim=null;logo.visible=false;ok()}}});
 UI.innerHTML=`<div class="card" style="font-size:34px;padding:22px 30px"><div class="tag">EN FAMILIA</div><div class="logo" style="font-size:min(10vw,54px)">${titulo}</div></div>`;await wait(1600)}
// ---------- estado ----------
const G={eq:[{n:'Familia Naranja',m:['','',''],c:'O',s:0},{n:'Familia Azul',m:['','',''],c:'B',s:0}],turno:[0,0]};
const jug=e=>{const q=G.eq[e];const ms=q.m.filter(Boolean);const j=ms[G.turno[e]%ms.length];G.turno[e]++;return j};
function marcador(t){return new Promise(ok=>{UI.innerHTML=`<div class="card"><h2>${t||'Marcador de segundos'}</h2><div class="sc"><div class="bgO">${G.eq[0].s}</div><div class="bgB">${G.eq[1].s}</div></div><p><span class="O">${G.eq[0].n}</span> · <span class="B">${G.eq[1].n}</span></p><button class="btn" id="ok">Continuar ▶</button></div>`;$('#ok').onclick=ok})}
function aviso(html,b='Empezar ▶'){return new Promise(ok=>{UI.innerHTML=`<div class="card">${html}<br><button class="btn" id="ok">${b}</button></div>`;$('#ok').onclick=()=>{snd('menu_press');ok()}})}
function reloj(seg,el,fin){let t=seg,on=true;el.textContent=t;const id=setInterval(()=>{if(!el.isConnected){clearInterval(id);return}if(!on)return;t--;el.textContent=t;if(t<=5&&t>0)snd('countdown_time',.6);if(t<=0){clearInterval(id);snd('countdown_timeOut');fin()}},1000);return{stop(){clearInterval(id)},pausa(v){on=!v},get t(){return t}}}
// ---------- HE DICHO (mecánica del vídeo: no se puede pasar; cada acierto suma su palabra a la columna) ----------
async function heDicho(){await cortinilla('He dicho');await aviso('<h2>He dicho</h2><p>Frases de famosos con una palabra oculta: solo vemos su inicial.</p><p><b>No se puede pasar palabra.</b> Siempre hay que decir algo.</p><p>Cada acierto: +5 segundos.</p>');
 await sayAll(D.fr.hd);const mid=Math.ceil(D.hd.length/2);
 for(const e of [0,1]){const it=D.hd.slice(e?mid:0,e?D.hd.length:mid);await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>60 segundos. ¡Adelante!</p>`);await rondaHD(e,it)}await marcador()}
function rondaHD(e,it){return new Promise(async ok=>{const c=G.eq[e].c;let i=0,fin=false;
 UI.innerHTML=`<div class="hd"><div class="dots">${it.map(()=>`<div class="dot bg${c}"></div>`).join('')}</div><div class="pills"></div><div class="num ${c}" id="n">60</div><div class="who" id="who"></div>
 <div class="bar bg${c}" id="q"></div><div class="ctl"><input id="r" placeholder="respuesta" autocomplete="off"><button class="btn g s" id="ok">Comprobar</button><button class="btn s" id="si">✔</button><button class="btn r s" id="no">✘</button></div></div>`;
 const rl=reloj(60,$('#n'),()=>terminar());
 const terminar=()=>{if(fin)return;fin=true;rl.stop();callar();setTimeout(ok,1200)};
 const show=async()=>{if(i>=it.length)return terminar();const x=it[i];document.querySelectorAll('.dot')[i].classList.add('off');$('#who').textContent='Responde: '+(jug(e)||'—');
  $('#q').innerHTML=x.q.replace(new RegExp('\\b'+x.x[0]+'\\b'),`<b style="background:#fff;color:#123;border-radius:5px;padding:0 6px">${x.x}</b>`);$('#r').value='';rl.pausa(true);await say(x.k);rl.pausa(false)};
 const res=ok2=>{if(fin)return;const x=it[i];if(ok2){snd('donut_hit');G.eq[e].s+=5;$('.pills').insertAdjacentHTML('beforeend',`<div class="pill bg${c}">${x.a}</div>`)}else{snd('donut_fail');$('#q').innerHTML+=` → <b>${x.a.toUpperCase()}</b>`}i++;setTimeout(show,ok2?500:1500)};
 $('#ok').onclick=()=>res(norm($('#r').value)===norm(D.hd.find(y=>y===it[i]).a));$('#si').onclick=()=>res(true);$('#no').onclick=()=>res(false);
 $('#r').onkeydown=ev=>{if(ev.key==='Enter')$('#ok').click()};show()})}
// ---------- ¿DÓNDE ESTÁN? ----------
async function dondeEstan(){await cortinilla('¿Dónde están?');await aviso('<h2>¿Dónde están?</h2><p>Nueve casillas esconden nueve palabras. Se giran solo un par de segundos.</p><p>Yo digo una palabra y decís detrás de qué número está. Si falláis, todo se vuelve a ocultar y pasa el turno.</p><p>Cada acierto: +5 segundos.</p>');
 await sayAll(D.fr.de);
 const pan={};D.de.forEach(x=>{const t=x.x.split(' · ')[0];(pan[t]=pan[t]||[]).push(x)});const ts=Object.keys(pan);
 for(let p=0;p<ts.length;p++){const e=p%2;await rondaDE(e,ts[p],pan[ts[p]])}await marcador()}
function rondaDE(e,tit,it){return new Promise(async ok=>{const c=G.eq[e].c;const pal=Array(9).fill('★');it.forEach(x=>pal[+x.a-1]=x.q.split('¿Dónde está')[1].replace(/^\s*(el|la|los|las)?\s*/,'').replace('?',''));
 await aviso(`<h2 class="${c}">${G.eq[e].n}</h2><p>Panel: <b>${tit}</b></p><p>75 segundos.</p>`);
 UI.innerHTML=`<div class="card de"><div><h3>${tit}</h3><div class="grid">${pal.map((w,i)=>`<div class="tile bg${c}" data-i="${i}">${i+1}</div>`).join('')}</div></div><div><div class="def" id="q"></div><div style="display:flex;justify-content:space-between;align-items:center"><span id="who"></span><span class="big ${c}" id="n">75</span></div></div></div>`;
 const tl=[...document.querySelectorAll('.tile')],abiertas=new Set();const flip=(i,v)=>{tl[i].classList.toggle('w',v);tl[i].textContent=v?pal[i]:i+1};
 for(let i=0;i<9;i++)flip(i,true);snd('whereAre_hide');await wait(2200);for(let i=0;i<9;i++)flip(i,false);snd('whereAre_hide');
 let k=0,fin=false;const rl=reloj(75,$('#n'),()=>end());const end=()=>{if(fin)return;fin=true;rl.stop();callar();setTimeout(ok,1500)};
 const preg=async()=>{if(k>=it.length)return end();$('#who').textContent='Responde: '+(jug(e)||'—');$('#q').textContent=it[k].q;rl.pausa(true);await say(it[k].k);rl.pausa(false)};
 tl.forEach(t=>t.onclick=()=>{if(fin||abiertas.has(+t.dataset.i))return;const i=+t.dataset.i;if(i+1==it[k].a){snd('whereAre_hit');G.eq[e].s+=5;abiertas.add(i);flip(i,true);k++;setTimeout(preg,600)}else{snd('whereAre_fail');abiertas.forEach(j=>flip(j,false));abiertas.clear();flip(+it[k].a-1,true);setTimeout(end,600)}});preg()})}
// ---------- ¿TÚ QUÉ PINTAS? ----------
async function pintas(){await cortinilla('¿Tú qué pintas?');await say(D.fr.pinta[0]);
 for(const e of [0,1]){const dib=jug(e)||'Dibujante';await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Dibuja: <b>${dib}</b>. Los demás adivinan. Tema: <b>${D.pinta.tema}</b>.</p><p>45 segundos · +5 s por acierto.</p>`);
  await new Promise(ok=>{const c=G.eq[e].c,ws=[...D.pinta.w].sort(()=>Math.random()-.5);let i=0,fin=false;
  UI.innerHTML=`<div class="card"><div><span class="tag">${D.pinta.tema.toUpperCase()}</span> <span class="big ${c}" id="n" style="font-size:34px">45</span></div><canvas id="pad" width="300" height="200"></canvas><div>Palabra (solo para quien dibuja): <b id="w" style="filter:blur(6px)" onclick="this.style.filter=''"></b></div><button class="btn g s" id="si">✔ Acertado</button><button class="btn s" id="pa">Pasapalabra</button></div>`;
  const pad=$('#pad'),g=pad.getContext('2d');g.lineWidth=4;g.lineCap='round';g.strokeStyle='#123';let d=false;const xy=ev=>{const r=pad.getBoundingClientRect(),p=ev.touches?ev.touches[0]:ev;return[(p.clientX-r.left)*300/r.width,(p.clientY-r.top)*200/r.height]};
  pad.onpointerdown=ev=>{d=true;g.beginPath();g.moveTo(...xy(ev))};pad.onpointermove=ev=>{if(d){g.lineTo(...xy(ev));g.stroke()}};onpointerup=()=>d=false;
  const nx=()=>{if(i>=ws.length)return end();g.clearRect(0,0,300,200);$('#w').textContent=ws[i];$('#w').style.filter='blur(6px)'};
  const rl=reloj(45,$('#n'),()=>end());const end=()=>{if(fin)return;fin=true;rl.stop();setTimeout(ok,1000)};
  $('#si').onclick=()=>{snd('donut_hit');G.eq[e].s+=5;i++;nx()};$('#pa').onclick=()=>{snd('donut_pass');ws.push(ws[i]);i++;nx()};nx()})}await marcador()}
// ---------- LA RISTRA ----------
async function ristra(){await cortinilla('La ristra');await say(D.fr.ristra[0]);
 for(const e of [0,1]){await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Repetid la ristra en orden, por turnos. +5 s por ronda superada.</p>`);
  const base=D.ristra.map((w,i)=>[w,i]).sort(()=>Math.random()-.5);let n=2;
  while(n<=base.length){const sec=base.slice(0,n);UI.innerHTML=`<div class="card"><p>Memoriza (${n} palabras):</p><h2>${sec.map(x=>x[0]).join(' · ')}</h2></div>`;
   for(const x of [sec[n-1]])await say('rw'+x[1]);await wait(1200+n*500);
   const j=jug(e)||'';const r=await new Promise(ok=>{UI.innerHTML=`<div class="card"><h2 class="${G.eq[e].c}">${j}, ¡repite la ristra!</h2><p>Ronda de ${n} palabras</p><button class="btn g" id="si">✔ Sin fallos</button><button class="btn r" id="no">✘ Fallo</button><button class="btn s" id="ver">Ver la ristra</button></div>`;
    $('#si').onclick=()=>ok(1);$('#no').onclick=()=>ok(0);$('#ver').onclick=()=>$('#ver').textContent=sec.map(x=>x[0]).join(' · ')});
   if(!r){snd('donut_fail');break}snd('donut_hit');G.eq[e].s+=5;n++}}
 await marcador()}
// ---------- EL ROSCO DÚO ----------
async function rosco(){await marcador('Antes del Rosco');await cortinilla('El Rosco');
 await aviso('<h2>El Rosco Dúo</h2><p>Juegan dos de cada familia: uno responde de la <b>A a la N</b> y el otro de la <b>Ñ a la Z</b>.</p><p>Tiempo: 85 segundos + los acumulados. Si falláis o decís «Pasapalabra», pasa el turno a la otra familia.</p><p>Bote: 6.000 €</p>');
 const ms=e=>{const m=G.eq[e].m.filter(Boolean);return[m[0]||'Jugador 1',m[1]||m[0]||'Jugador 2']};
 const st=[0,1].map(e=>({t:85+G.eq[e].s,est:D.ro.map(()=>0),pos:0,ac:0,fa:0,fin:false}));
 const iniN=D.ro.findIndex(x=>x.l==='Ñ');
 let e=G.eq[0].s>=G.eq[1].s?0:1;await say(D.fr.ro[0]);
 while(!(st[0].fin&&st[1].fin)){if(st[e].fin){e=1-e;continue}await turnoRosco(e,st[e],ms(e),iniN);e=1-e}
 const g=st[0].ac!==st[1].ac?(st[0].ac>st[1].ac?0:1):(st[0].fa!==st[1].fa?(st[0].fa<st[1].fa?0:1):-1);
 const bote=[0,1].some(i=>st[i].ac===25);
 await aviso(`<h2>Resultado</h2><div class="sc"><div class="bgO">${st[0].ac}</div><div class="bgB">${st[1].ac}</div></div><p>Fallos: ${st[0].fa} · ${st[1].fa}</p><h2>${g<0?'¡Empate! 600 € para cada familia':`Gana <span class="${G.eq[g].c}">${G.eq[g].n}</span>: ${bote?'¡EL BOTE!':'1.200 €'}`}</h2>`,'Continuar ▶');
 await say('cie1');}
function turnoRosco(e,s,ms,iniN){return new Promise(ok=>{const c=G.eq[e].c;
 UI.innerHTML=`<div class="card rw" style="padding:8px"><div class="ro" id="ro">${D.ro.map((x,i)=>{const a=Math.PI/2-i/25*Math.PI*2;return`<div class="le" style="left:${50+43*Math.cos(a)}%;top:${50-43*Math.sin(a)}%">${x.l}</div>`}).join('')}
 <div class="rbox"><div class="t bg${c}" id="n">${s.t}</div><div class="a bg${c}" id="ac">${s.ac}</div></div></div>
 <div class="rc"><h3 class="${c}" style="margin:2px">${G.eq[e].n}<br><span id="who"></span></h3><div class="def" id="q"></div><input id="r" autocomplete="off" placeholder="respuesta"><button class="btn g s" id="ok">Comprobar</button><button class="btn s" id="pa">Pasapalabra</button><br><button class="btn s" id="si">✔</button><button class="btn r s" id="no">✘</button></div></div>`;
 const L=[...document.querySelectorAll('.le')];const pinta=()=>L.forEach((l,i)=>{l.className='le'+(s.est[i]===1?' h':s.est[i]===2?' f':'')+(i===s.pos?' a':'')});
 let fin=false;const end=()=>{if(fin)return;fin=true;clearInterval(id);callar();s.fin=s.fin||s.t<=0||s.est.every(v=>v);setTimeout(ok,1300)};
 let hab=false;const id=setInterval(()=>{if(!$("#n")){clearInterval(id);return}if(!hab)return;s.t--;$('#n').textContent=s.t;if(s.t<=5&&s.t>0)snd('countdown_time',.6);if(s.t<=0){snd('countdown_timeOut');say('tiempo');end()}},1000);
 const sig=()=>{for(let k=1;k<=25;k++){const p=(s.pos+k)%25;if(!s.est[p]){s.pos=p;return true}}return false};
 const preg=async()=>{if(s.est[s.pos]&&!sig()){s.fin=true;return end()}pinta();$('#who').textContent='Responde '+(s.pos<iniN?ms[0]+' (A–N)':ms[1]+' (Ñ–Z)');const x=D.ro[s.pos];$('#q').textContent=(x.t==='e'?'Empieza por ':'Contiene la ')+x.l+': '+x.d;$('#r').value='';hab=false;await say(x.k);hab=true};
 const res=v=>{if(fin)return;const x=D.ro[s.pos];if(v===1){snd('donut_hit');s.est[s.pos]=1;s.ac++;$('#ac').textContent=s.ac;if(!sig()){s.fin=true;pinta();return end()}preg()}
  else if(v===2){snd('donut_fail');s.est[s.pos]=2;s.fa++;$('#q').innerHTML+=` → <b>${x.w.toUpperCase()}</b>`;pinta();sig();hab=false;setTimeout(end,1500)}
  else{snd('donut_pass');sig();pinta();end()}};
 $('#ok').onclick=()=>res(norm($('#r').value)===norm(D.ro[s.pos].w)?1:2);$('#pa').onclick=()=>res(0);$('#si').onclick=()=>res(1);$('#no').onclick=()=>res(2);$('#r').onkeydown=ev=>{if(ev.key==='Enter')$('#ok').click()};preg()})}
// ---------- historia ----------
async function historia(){UI.innerHTML=`<div class="card hist" style="max-width:640px"><div style="display:flex;align-items:center;gap:10px"><img src="img/christian.png" style="height:90px;border-radius:10px"><div><div class="tag">EN FAMILIA</div><h2 style="margin:4px">La historia de Pasapalabra en familia</h2></div></div><div id="hp"></div><button class="btn s" id="vol">◀ Menú</button></div>`;
 let stop=false;$('#vol').onclick=()=>{stop=true;callar();menu()};for(const k of D.fr.hist){if(stop)return;$('#hp').insertAdjacentHTML('beforeend',`<p>${D.L[k]}</p>`);$('#hp').lastChild.scrollIntoView();await say(k)}}
// ---------- menú y equipos ----------
function menu(){snd('music',.35);UI.innerHTML=`<div class="card"><div class="logo">Pasapalabra</div><div class="tag">EN FAMILIA</div><br><br>
 <button class="btn o" id="j">▶ Jugar en familia</button><br><button class="btn" id="h">📖 La historia de Pasapalabra en familia</button><br><button class="btn" id="c">🎬 Ver la cabecera</button><br><button class="btn s" id="fs">⛶ Pantalla completa</button><p style="font-size:12px">Creado por Ikeriano · voces nuevas: Piper <span class="tts">TTS</span></p></div>`;
 $('#j').onclick=()=>{SND.music&&SND.music.pause();equipos()};$('#h').onclick=()=>{SND.music&&SND.music.pause();historia()};$('#c').onclick=async()=>{SND.music&&SND.music.pause();await cabecera();menu()};$('#fs').onclick=()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{})}
function equipos(){const f=(e)=>`<div style="margin:6px"><h3 class="${G.eq[e].c}">Equipo ${e?'azul':'naranja'}</h3><input id="n${e}" value="${G.eq[e].n}"><br>${[0,1,2].map(i=>`<input id="m${e}${i}" placeholder="Miembro ${i+1}${i==2?' (opcional)':''}" value="${G.eq[e].m[i]}">`).join('<br>')}</div>`;
 UI.innerHTML=`<div class="card"><h2>Las familias (2–3 miembros)</h2><div style="display:flex;flex-wrap:wrap;justify-content:center">${f(0)}${f(1)}</div><p id="err" style="color:#ffb"></p><button class="btn o" id="go">¡A jugar! ▶</button> <button class="btn s" id="vol">◀</button></div>`;
 $('#vol').onclick=menu;$('#go').onclick=()=>{for(const e of [0,1]){G.eq[e].n=$('#n'+e).value||G.eq[e].n;G.eq[e].m=[0,1,2].map(i=>$('#m'+e+i).value.trim());if(G.eq[e].m.filter(Boolean).length<2){$('#err').textContent='Cada familia necesita al menos 2 miembros.';return}G.eq[e].s=0}programa()}}
async function programa(){await cabecera();UI.innerHTML=`<div class="card"><img src="img/christian.png" style="height:150px"><p>${G.eq[0].n} <span class="O">●</span> contra <span class="B">●</span> ${G.eq[1].n}</p></div>`;await sayAll(D.fr.pres);
 await heDicho();await dondeEstan();await pintas();await ristra();await rosco();
 UI.innerHTML='<div class="card"><div class="logo">Pasapalabra</div><div class="tag">EN FAMILIA</div><p>¡Gracias por jugar en familia!</p></div>';await say('cie0').catch(()=>{});await creditos();menu()}
window.__ppf={G,heDicho,dondeEstan,rosco,historia,cabecera,menu,equipos};
UI.innerHTML='<div class="card"><div class="logo">Pasapalabra</div><div class="tag">EN FAMILIA</div><br><br><button class="btn o" id="st">Toca para empezar</button></div>';$('#st').onclick=()=>menu();
