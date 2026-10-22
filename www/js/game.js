import * as THREE from './three.module.min.js';
const D=window.PPF, $=s=>document.querySelector(s), UI=$('#ui');
const PLATO=localStorage.ppf_plato!=='0';
// ---------- audio ----------
const MUTE=localStorage.ppf_mute==='1';const SND={};function snd(n,v=1){if(MUTE)v=0;try{let a=SND[n]||(SND[n]=new Audio('aud/'+n+'.mp3'));a.pause();a.currentTime=0;a.volume=v;a.play().catch(()=>{});return a}catch(e){}}
let voz=null;
function say(k){return new Promise(ok=>{const t=D.L[k];if(!t)return ok();$('#subt').textContent=t;$('#sub').style.display='block';
 if(voz){voz.onended=null;voz.pause()}voz=new Audio('tts/'+k+'.mp3');if(MUTE)voz.volume=0;let done=()=>{$('#sub').style.display='none';ok()};
 voz.onended=done;voz.onerror=()=>setTimeout(done,1500);voz.play().catch(()=>setTimeout(done,2500));});}
function callar(){if(voz){voz.onended=null;voz.pause()}$('#sub').style.display='none'}
async function sayAll(ks){for(const k of ks)await say(k)}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zñ0-9]/g,'');
// ---------- plató 3D principal (plato.js) de fondo, a media resolución ----------
let PW=null;
function plato(cam,pant){try{if(!PW||!PW.PP3D)return;if(cam)PW.PP3D.plano(cam);if(pant)PW.PP3D.pinta(pant)}catch(e){}}
if(PLATO){const f=document.createElement('iframe');f.id='plato';f.src='plato/index.html';f.setAttribute('aria-hidden','true');document.body.prepend(f);
 f.onload=()=>{try{PW=f.contentWindow;const st=PW.document.createElement('style');st.textContent='body>*:not(#c){display:none!important}';PW.document.head.appendChild(st);
  const tick=()=>{if(PW.PP3D){plato('general',{k:'logo',sub:''})}else setTimeout(tick,500)};tick()}catch(e){}}}
// ---------- three.js propio (cabecera, cortinillas, rosco) ----------
const R=new THREE.WebGLRenderer({canvas:$('#c3d'),antialias:false,alpha:true,powerPreference:'low-power'});R.setClearColor(0x000000,0);R.setPixelRatio(Math.min(devicePixelRatio||1,1));
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,1,0.1,200);
const S2=new THREE.Scene(),C2=new THREE.OrthographicCamera(0,1,1,0,-100,100);
function rs(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();C2.right=innerWidth;C2.top=innerHeight;C2.updateProjectionMatrix()}addEventListener('resize',rs);rs();
function cv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const bgTex=cv(4,256,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#5fb4ff');q.addColorStop(.6,'#1659d8');q.addColorStop(1,'#0a2f8c');g.fillStyle=q;g.fillRect(0,0,w,h)});
S.add(new THREE.AmbientLight(0xffffff,1.6));const dl=new THREE.DirectionalLight(0xffffff,2.2);dl.position.set(3,6,8);S.add(dl);
S2.add(new THREE.AmbientLight(0xffffff,1.3));const dl2=new THREE.DirectionalLight(0xffffff,2.4);dl2.position.set(-1,1,2);S2.add(dl2);
const ABC='ABCDEFGHIJLMNÑOPQRSTUVXYZ';const fondo=new THREE.Group();S.add(fondo);
for(let i=0;i<26;i++){const l=ABC[i%25];const t=cv(64,64,(g)=>{g.fillStyle='rgba(255,255,255,.22)';g.font='bold 54px F,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(l,32,36)});
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));m.position.set((Math.random()-.5)*30,(Math.random()-.5)*16,-10-Math.random()*8);const s=1.5+Math.random()*2.5;m.scale.set(s,s,1);m.userData.v=.2+Math.random()*.4;fondo.add(m)}
function fondoModo(propio){S.background=propio||!PLATO?bgTex:null;fondo.visible=propio||!PLATO}fondoModo(false);
// bolas legibles: la letra se imprime 4 veces alrededor, grande
function bolaTex(l,fg='#1b5ed6',bg='#f4f6fb'){return cv(256,128,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='bold 76px F,Arial';g.textAlign='center';g.textBaseline='middle';for(const x of [32,96,160,224])g.fillText(l,x,68)})}
const letraSpr=(l,px)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cv(64,64,(g)=>{g.fillStyle='#fff';g.font='bold 46px F,Arial';g.textAlign='center';g.textBaseline='middle';g.shadowColor='#0008';g.shadowBlur=4;g.fillText(l,32,35)}),transparent:true,depthTest:false}));s.scale.set(px,px,1);return s};
const geoB=new THREE.SphereGeometry(.42,16,12);const bolas=[];const cab=new THREE.Group();cab.visible=false;S.add(cab);
for(let i=0;i<25;i++){const b=new THREE.Mesh(geoB,new THREE.MeshStandardMaterial({map:bolaTex(ABC[i]),roughness:.3,metalness:.05}));cab.add(b);bolas.push(b)}
const tubos=new THREE.Group();cab.add(tubos);const gm=new THREE.MeshStandardMaterial({color:0xbfe6ff,transparent:true,opacity:.25,roughness:.1});
for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,14,12,1,true),gm);t.position.set(-4+i*2,0,-2);tubos.add(t)}
const am=new THREE.MeshStandardMaterial({color:0xffc21a,roughness:.5});const bloques=new THREE.Group();cab.add(bloques);
for(let i=0;i<22;i++){const h=1+Math.random()*4;const m=new THREE.Mesh(new THREE.BoxGeometry(1,h,1),am);m.position.set((i%11)*1.3-7,-8+h/2,-3-Math.floor(i/11)*2);bloques.add(m)}
const aro=new THREE.Mesh(new THREE.TorusGeometry(4.2,.08,6,64),new THREE.MeshStandardMaterial({color:0xffd04a,metalness:.6,roughness:.3}));cab.add(aro);
const logoT=new THREE.TextureLoader().load('img/logo_orig.png');logoT.colorSpace=THREE.SRGBColorSpace;
const logo=new THREE.Mesh(new THREE.PlaneGeometry(8,1.54),new THREE.MeshBasicMaterial({map:logoT,transparent:true}));logo.visible=false;S.add(logo);
// bucle: solo dibuja cuando hace falta (ahorro para Redmi A2)
let anim=null,last=0,activo=0,limpio=false;const clk=new THREE.Clock();
function loop(){requestAnimationFrame(loop);const now=performance.now();if(now-last<33)return;last=now;const dt=Math.min(clk.getDelta(),.1);
 const quiere=anim||activo||!PLATO;if(!quiere){if(!limpio){R.clear();R.domElement.style.visibility='hidden';limpio=true}return}if(limpio)R.domElement.style.visibility='visible';limpio=false;
 if(fondo.visible)fondo.children.forEach(m=>{m.position.x+=m.userData.v*dt;if(m.position.x>16)m.position.x=-16});
 if(anim)anim(dt);R.autoClear=true;R.render(S,C);if(roscoG.visible){R.autoClear=false;R.render(S2,C2)}}
C.position.set(0,0,10);loop();
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t;
// ---------- cabecera 3D (rehecha de la oficial) ----------
// Plano a plano como la cabecera oficial (0–21,6 s, sintonía original): tubos de bolas · máquina amarilla con llave y engranaje ·
// laberinto de tubos de cristal · manos amarillas y embudo · máquina rosa con rayos · ciudad amarilla de bloques y lápices · bloques naranjas ·
// barco rosa a rayas con figuras plateadas · el rosco se forma entre tubos · el logo entra «a lo grande» y queda con el rosco
const CABP=[[0,'tubos'],[1.5,'maquina'],[4,'laberinto'],[7,'manos'],[8,'rayos'],[9.5,'ciudad'],[13,'naranja'],[14,'barco'],[17,'rosco'],[19,'logo']];
function cabShots(){const G0={},mk=n=>{const g=new THREE.Group();g.visible=false;cab.add(g);G0[n]=g;return g};const A=(g,geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m};
 const Y=M(0xffc21a),O=M(0xff8a1c),P=M(0xff3fa0),Ag=M(0xd8dde8,{metalness:.8,roughness:.25}),Az=M(0x1d4fb8),Gl=gm;
 let g=mk('maquina');A(g,new THREE.BoxGeometry(5,4,2.5),Y,0,-1,-3);A(g,new THREE.TorusGeometry(1,.35,8,6),Ag,3.2,1.5,-2).userData.r=1;A(g,new THREE.BoxGeometry(.4,1.6,.3),M(0x7a5a10),-3,0,-1.4).userData.r=2;A(g,new THREE.CylinderGeometry(.5,.5,8,10,1,true),Gl,0,4,-3);
 g=mk('laberinto');for(let i=0;i<9;i++){const t=A(g,new THREE.CylinderGeometry(.18,.18,6,8,1,true),Gl,(i%3-1)*3,(Math.floor(i/3)-1)*2.4,-3);t.rotation.z=i%2?Math.PI/2:0;A(g,new THREE.TorusGeometry(.26,.06,6,12),Y,(i%3-1)*3,(Math.floor(i/3)-1)*2.4,-2.8)}for(let i=0;i<6;i++)A(g,new THREE.BoxGeometry(.6,.6,.4),O,4.6,-3+i*1.1,-3.5).rotation.z=i;
 g=mk('manos');const mano=x=>{const h=new THREE.Group();h.add(new THREE.Mesh(new THREE.SphereGeometry(.7,10,8),Y));for(let f=0;f<4;f++){const d=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.6,3,6),Y);d.position.set(-.45+f*.3,.8,0);h.add(d)}h.position.set(x,0,-1);h.userData.m=1;g.add(h)};mano(-3);mano(3);A(g,new THREE.ConeGeometry(2.4,1.6,24,1,true),Gl,0,-2.5,-2).rotation.x=Math.PI;
 g=mk('rayos');A(g,new THREE.CylinderGeometry(2.4,2.8,1.4,24),P,0,-3,-3);A(g,new THREE.CylinderGeometry(.15,.15,4,8),Ag,0,-.6,-3);for(let i=0;i<3;i++)A(g,new THREE.TorusGeometry(1.2-i*.3,.07,6,24),Ag,0,-.2+i*.7,-3).rotation.x=Math.PI/2;
  const ry=new THREE.Shape([[0,0],[.5,.9],[.25,.9],[.6,1.7],[-.1,.7],[.15,.7]].map(([x,y])=>new THREE.Vector2(x,y)));for(let i=0;i<6;i++){const m=A(g,new THREE.ShapeGeometry(ry),new THREE.MeshBasicMaterial({color:0xff2fd0,side:2}),(i%3-1)*3.4,1.8+(i>2?-1.6:0),-4);m.scale.setScalar(1.3);m.userData.ry=i}
 g=mk('ciudad');for(let i=0;i<40;i++){const h=1+((i*37)%10)/3,x=((i*53)%17)-8,z=-2-((i*29)%9);const b=A(g,i%4?new THREE.BoxGeometry(.9,h,.9):new THREE.ConeGeometry(.5,h,6),i%3?Y:O,x,-3+h/2,z);b.userData.h=h}
  const pared=cv(512,128,(x,W,H)=>{x.fillStyle='#1b4fd0';x.fillRect(0,0,W,H);x.fillStyle='#3a7bff';x.font='bold 90px F,Arial';x.fillText('ROSCO TIEMPO',0,100)});A(g,new THREE.PlaneGeometry(30,8),new THREE.MeshBasicMaterial({map:pared}),0,2,-12);
 g=mk('naranja');for(let i=0;i<12;i++)A(g,new THREE.BoxGeometry(1.4,6,1.4),i%2?O:Y,(i%6-2.5)*1.6,-2+(i%3),-2-Math.floor(i/6)*2);
 g=mk('barco');A(g,new THREE.BoxGeometry(7,2,2.6),P,0,-2,-3);for(let i=0;i<7;i++)A(g,new THREE.BoxGeometry(.35,2.05,2.65),M(0xffffff),-3+i*1,-2,-3);for(let i=0;i<4;i++){const f=A(g,new THREE.CapsuleGeometry(.3,.8,3,8),Ag,-2.4+i*1.6,-.2,-3);A(g,new THREE.SphereGeometry(.3,10,8),P,-2.4+i*1.6,.6,-3)}
  for(let i=0;i<3;i++)A(g,new THREE.TorusGeometry(.8,.25,6,8),M(0xffb31a),-4.5+i*4.5,1.6,-5).userData.r=1;A(g,new THREE.CylinderGeometry(.12,.12,12,8,1,true),Gl,0,2.6,-2.5).rotation.z=Math.PI/2;
 g=mk('rosco');for(let i=0;i<4;i++){const t=A(g,new THREE.TorusGeometry(6+i*1.4,.18,6,48,Math.PI*1.2),Gl,0,0,-3-i);t.rotation.z=i*1.3}
 return G0}
let CS=null;
function cabecera(){return new Promise(ok=>{UI.innerHTML='<button class="btn s" style="position:fixed;right:8px;bottom:20px" id="skip">Saltar ⏭</button>';
 if(!CS)CS=cabShots();cab.visible=true;logo.visible=false;fondoModo(true);fondo.visible=false;const m=snd('sintonia');let T=0,fin=false,sh='';
 const BG={tubos:'#1a7fd0',maquina:'#20a3b8',laberinto:'#0b2a7a',manos:'#123d9a',rayos:'#1b3fae',ciudad:'#1d55d8',naranja:'#ff9a1c',barco:'#2aa0d8',rosco:'#1a86f0',logo:'#1a86f0'};
 bolas.forEach((b,i)=>{b.userData={x:-4+(i%5)*2,y:6+Math.floor(i/5)*1.1,vy:0}});
 const end=()=>{if(fin)return;fin=true;anim=null;cab.visible=false;Object.values(CS).forEach(g=>g.visible=false);tubos.visible=true;bloques.visible=true;fondoModo(false);logo.visible=false;if(m)m.pause();C.position.set(0,0,10);C.lookAt(0,0,0);ok()};
 $('#skip').onclick=end;
 anim=dt=>{T=m&&!m.paused&&m.currentTime>0?m.currentTime:T+dt;let s='tubos',t0=0;for(const[t,n]of CABP)if(T>=t){s=n;t0=t}const k=T-t0;
  if(s!==sh){sh=s;Object.entries(CS).forEach(([n,g])=>g.visible=n===s);tubos.visible=s==='tubos'||s==='maquina';bloques.visible=false;aro.visible=s==='rosco'||s==='logo';logo.visible=s==='logo';S.background=new THREE.Color(BG[s])}
  const bol=(f)=>bolas.forEach((b,i)=>{f(b,i);b.lookAt(C.position)});
  if(s==='tubos'){bol((b,i)=>{b.position.set(-4+(i%5)*2,3-Math.floor(i/5)*1.0-k*2,-2)});C.position.set(0,lerp(1,-1,k/1.5),5.5);C.lookAt(0,0,-2)}
  else if(s==='maquina'){CS.maquina.children.forEach(c=>{if(c.userData.r===1)c.rotation.z+=dt*2;if(c.userData.r===2)c.rotation.y+=dt*4});bol((b,i)=>{const u=(k*1.4+i/25*3)%3;b.position.set(Math.sin(i)*.3,4-u*3,-3+((i%3)-1)*.4)});C.position.set(lerp(-6,2,ease(k/2.5)),lerp(1,3,k/2.5),6);C.lookAt(0,0,-3)}
  else if(s==='laberinto'){bol((b,i)=>{const u=(k*.8+i/25)%1,a=u*Math.PI*4;b.position.set(Math.cos(a)*3*(i%2?1:-1),lerp(-2.4,2.4,u),-2.6);b.scale.setScalar(.5)});C.position.set(Math.sin(k*.6)*3,0,lerp(8,5,k/3));C.lookAt(0,0,-3)}
  else if(s==='manos'){bolas.forEach(b=>b.scale.setScalar(.6));CS.manos.children.forEach(h=>{if(h.userData.m)h.position.x*=.985});bol((b,i)=>b.position.set(((i%7)-3)*.6,lerp(1.5,-2,Math.min(1,k*.8+(i%5)*.05)),-1.6));C.position.set(0,1,6);C.lookAt(0,-1,-2)}
  else if(s==='rayos'){bolas.forEach(b=>b.scale.setScalar(.5));CS.rayos.children.forEach(c=>{if(c.userData.ry!==undefined)c.visible=Math.sin(T*25+c.userData.ry)>-.2;if(c.geometry.type==='TorusGeometry')c.rotation.z+=dt*6});bol((b,i)=>{const a=i/25*Math.PI*2+k*5;b.position.set(Math.cos(a)*1.2,(i%3)*.6-.2,-3+Math.sin(a)*1.2)});C.position.set(0,0,lerp(6,5,k/1.5));C.lookAt(0,-.5,-3)}
  else if(s==='ciudad'){bolas.forEach(b=>b.scale.setScalar(.8));CS.ciudad.children.forEach(c=>{if(c.userData.h)c.scale.y=Math.min(1,.2+k*.8)});bol((b,i)=>b.position.set(-7+((i*1.7+k*3)%14),-1+Math.abs(Math.sin(k*4+i))*1.5,-2-(i%4)));C.position.set(lerp(-5,4,ease(k/3.5)),lerp(4,1,k/3.5),6);C.lookAt(0,-1,-4)}
  else if(s==='naranja'){bol((b,i)=>{b.scale.setScalar(.5);b.position.set(((i%5)-2)*1.2,-3+((k*3+i*.3)%6),-1)});C.position.set(0,lerp(-2,2,k),4);C.lookAt(0,1,-2)}
  else if(s==='barco'){bolas.forEach(b=>b.scale.setScalar(.6));CS.barco.children.forEach(c=>{if(c.userData.r)c.rotation.z+=dt*2});bol((b,i)=>b.position.set(-6+((i*.5+k*2)%12),2.6,-2.5));C.position.set(lerp(5,-3,ease(k/3)),lerp(.5,1.5,k/3),lerp(5,8,k/3));C.lookAt(0,-.5,-3)}
  else if(s==='rosco'){bolas.forEach(b=>b.scale.setScalar(1));CS.rosco.rotation.z+=dt*.3;const q=ease(Math.min(1,k/1.6));bol((b,i)=>{const a=Math.PI/2-i/25*Math.PI*2+(1-q)*2;b.position.set(Math.cos(a)*3.6*(.4+.6*q),Math.sin(a)*3.6*(.4+.6*q),0)});aro.rotation.z+=dt;C.position.set(lerp(-4,0,q),lerp(-2,0,q),lerp(7,11,q));C.lookAt(0,0,0)}
  else if(s==='logo'){bol((b,i)=>{const a=Math.PI/2-i/25*Math.PI*2;b.position.set(Math.cos(a)*3.6,Math.sin(a)*3.6,0)});const q=ease(Math.min(1,k/.6));logo.visible=true;logo.material.depthTest=false;logo.renderOrder=10;logo.position.set(0,-.2,lerp(7,1.5,q));logo.rotation.set(0,0,0);logo.scale.setScalar(1);C.position.set(0,0,11);C.lookAt(0,0,0);
   if(T>21.6||(m&&m.ended)){anim=null;cab.visible=false;logo.visible=false;bolas.forEach(b=>b.scale.setScalar(1));creditos().then(end)}}}});}
function creditos(){return new Promise(ok=>{UI.innerHTML=`<div class="card"><img src="img/logo_orig.png" style="width:min(70vw,360px)">
 <p>Cabecera reconstruida en 3D (three.js) · plató 3D de Pasapalabra<br>Sintonía, cabecera y despedida: audio y vídeo originales del programa</p><p>Frases nuevas: voz sintética Piper TTS <span class="tts">TTS</span></p>
 <p>Basado en «Pasapalabra en familia» (Telecinco, 2018)</p><h2>Creado por Ikeriano</h2></div>`;setTimeout(ok,4500)});}
function video(src){return new Promise(ok=>{UI.innerHTML=`<video id="vd" src="${src}" playsinline autoplay style="position:fixed;inset:0;width:100%;height:100%;background:#000;object-fit:contain"></video><button class="btn s" style="position:fixed;right:8px;bottom:20px" id="skip">Saltar ⏭</button>`;
 const v=$('#vd'),fin=()=>{v.pause();ok()};v.onended=fin;v.onerror=fin;$('#skip').onclick=fin;v.play().catch(()=>{})})}
// ---------- cortinillas 3D (una escena por prueba, como en el programa) ----------
function txt3d(t,c1,c2,w=8){const g=new THREE.Group();const mk=(col,st)=>cv(1024,256,(x,W,H)=>{let fs=170;x.font='bold 170px F,Arial';const mw=x.measureText(t).width;if(mw>W-60){fs=Math.floor(170*(W-60)/mw);x.font='bold '+fs+'px F,Arial'}x.textAlign='center';x.textBaseline='middle';if(st){x.lineWidth=22;x.strokeStyle=st;x.strokeText(t,W/2,H/2+8)}x.fillStyle=col;x.fillText(t,W/2,H/2+8)});
 const back=mk(c2,c2),front=mk(c1,'#fff');for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:i<5?back:front,transparent:true,depthWrite:false}));m.position.z=i*.06;m.renderOrder=i;g.add(m)}return g}
const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.45},o));
function escena(tipo){const g=new THREE.Group();let bg='#1aa7c8',titulo='',c1='#ffd21a',c2='#1d4fb8';const add=(geo,mat,x,y,z,s=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.setScalar(s);g.add(m);return m};
 if(tipo==='hd'){bg='#18b3c4';titulo='HE DICHO';c1='#ffd21a';c2='#1d4fb8';
  add(new THREE.CylinderGeometry(.6,.9,4,16),M(0x2f8f8a),-2.6,-1,-1);add(new THREE.ConeGeometry(1.3,1.8,24,1,true),M(0xe8a24a,{side:2}),-4.2,1.6,-.5).rotation.z=Math.PI/2;
  add(new THREE.BoxGeometry(1.8,2.4,.6),M(0x3a5a64),2.8,-.6,-1);add(new THREE.TorusGeometry(.6,.12,8,24),M(0xffd21a),2.8,-.4,-.6);
  for(let i=0;i<4;i++)add(new THREE.SphereGeometry(.25,10,8),M(0xffffff),-4+i*2.6,2.5,-2)}
 else if(tipo==='de'){bg='#2a7bff';titulo='¿DÓNDE ESTÁN?';c1='#ffffff';c2='#e86a00';
  for(let i=0;i<9;i++){const m=add(new THREE.BoxGeometry(1.5,1,.25),M(0xff9a1a),(i%3-1)*1.75,(1-Math.floor(i/3))*1.2+.4,-1.5);m.userData.f=i}}
 else if(tipo==='suena'){bg='#25c1c9';titulo='ESTO ME SUENA';c1='#ff4fa8';c2='#7a1a66';
  add(new THREE.BoxGeometry(2.4,2.8,1),M(0xff6ab8),0,-.8,-1.5);add(new THREE.TorusGeometry(1.2,.3,10,24,Math.PI),M(0xff9ad0),0,.6,-1.5);
  for(let i=0;i<5;i++)add(new THREE.BoxGeometry(.3,.3,.2),M([0x2a7bff,0xe8352f,0x2fc23f,0xffb31a,0xb04fff][i],{emissive:[0x2a7bff,0xe8352f,0x2fc23f,0xffb31a,0xb04fff][i],emissiveIntensity:.6}),-0.8+i*.4,-.4,-.95);
  add(new THREE.BoxGeometry(2,1.3,.8),M(0x3b4a8a),3.4,-1.6,-1);add(new THREE.CylinderGeometry(.45,.45,.2,18),M(0xffd21a),3.0,-1.6,-.55).rotation.x=Math.PI/2}
 else if(tipo==='pinta'){bg='#ffcf1f';titulo='¿TÚ QUÉ PINTAS?';c1='#ffffff';c2='#e05a00';
  add(new THREE.BoxGeometry(4.2,3,.05),M(0xffffff),-.6,-.6,-1.5).rotation.z=.12;const l=new THREE.MeshBasicMaterial({color:0xe8352f});
  for(let i=0;i<6;i++)add(new THREE.TorusGeometry(.35+i*.05,.04,6,20),l,-1.6+i*.5,-.6+Math.sin(i)*.5,-1.4);
  add(new THREE.CylinderGeometry(.12,.12,3,8),M(0x2a7bff),2.8,-.4,-1).rotation.z=-.7}
 else if(tipo==='ristra'){bg='#2f8cff';titulo='LA RISTRA';c1='#ff4fa8';c2='#ffd21a';
  const pals=['CRISTAL','LÁMPARA','PARADA','HABLAR'];pals.forEach((p,j)=>{const t=cv(512,64,(x,W,H)=>{x.fillStyle='#fff';x.font='bold 50px F,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(p.split('').join(' '),W/2,34)});
   const m=new THREE.Mesh(new THREE.PlaneGeometry(6,.75),new THREE.MeshBasicMaterial({map:t,transparent:true}));m.position.set(0,2.2-j*1.4,-2-j*.4);m.rotation.z=(j%2?.15:-.15);m.userData.r=j;g.add(m)})}
 else if(tipo==='cruz'){bg='#7c4dff';titulo='PALABRAS CRUZADAS';c1='#ffffff';c2='#2a2a8a';
  for(let i=0;i<5;i++){add(new THREE.BoxGeometry(1.8,.6,.25),M(0xff9a1a),-1.6,1.6-i*.75,-1.5).userData.f=i;add(new THREE.BoxGeometry(1.8,.6,.25),M(0x2a7bff),1.6,1.6-i*.75,-1.5).userData.f=-i}}
 else if(tipo==='rosco'){bg='#1d6ff0';titulo='EL ROSCO';c1='#ffffff';c2='#0b2f8e';
  add(new THREE.CylinderGeometry(.55,.55,9,14,1,true),gm,-3.6,0,-2).rotation.z=-.5;for(let i=0;i<8;i++){const b=add(geoB,bolas[i].material,-5+i*.8,2.4-i*.55,-2);b.userData.b=i}}
 g.userData.bg=bg;const tt=txt3d(titulo,c1,c2,tipo==='suena'||tipo==='cruz'||tipo==='de'||tipo==='pinta'?9:7);tt.position.set(0,-2.4,0);g.add(tt);g.userData.tt=tt;return g}
const TIT={hd:'He dicho',de:'¿Dónde están?',suena:'Esto me suena',pinta:'¿Tú qué pintas?',ristra:'La ristra',cruz:'Palabras cruzadas',rosco:'El Rosco'};
async function cortinilla(tipo){UI.innerHTML='';const g=escena(tipo);S.add(g);const ob=S.background;S.background=new THREE.Color(g.userData.bg);fondo.visible=false;snd('cortinilla');let T=0;
 await new Promise(ok=>{anim=dt=>{T+=dt;const k=Math.min(1,T/2.2);C.position.set(Math.sin(k*1.2-.6)*5,lerp(1.5,.2,ease(k)),lerp(13,8.5,ease(k)));C.lookAt(0,0,-1);
  g.children.forEach(m=>{if(m.userData.f!==undefined)m.rotation.y=Math.max(0,Math.PI*2*(1-ease(Math.min(1,T*1.6-Math.abs(m.userData.f)*.12))));if(m.userData.r!==undefined)m.position.x=Math.sin(T*2+m.userData.r)*1.2;if(m.userData.b!==undefined){m.position.x+=dt*1.6;m.position.y-=dt*1.1;m.rotation.z-=dt*4}});
  const tt=g.userData.tt;tt.scale.setScalar(ease(Math.min(1,T/0.7)));tt.rotation.y=(1-ease(Math.min(1,T/0.9)))*1.4;
  if(T>2.4){anim=null;ok()}}});
 S.remove(g);S.background=ob;fondoModo(false);C.position.set(0,0,10);C.lookAt(0,0,0);
 // barrido por el plató con el título, como hace la realización
 plato('general',{k:'texto',t:TIT[tipo],sub:'EN FAMILIA'});
 UI.innerHTML=`<div class="rot"><div class="tag">EN FAMILIA</div><div class="logo" style="font-size:min(9vw,50px)">${TIT[tipo]}</div></div>`;await wait(400);plato('pantalla');await wait(1300);plato('general',{k:'logo',sub:''})}
// ---------- estado ----------
const G={eq:[{n:'Familia Naranja',m:['','',''],c:'O',s:0},{n:'Familia Azul',m:['','',''],c:'B',s:0}],turno:[0,0]};
const jug=e=>{const q=G.eq[e];const ms=q.m.filter(Boolean);const j=ms[G.turno[e]%ms.length];G.turno[e]++;return j};
const camE=e=>plato(e?'azul':'naranja');
function marcador(t){plato('general');return new Promise(ok=>{UI.innerHTML=`<div class="card"><h2>${t||'Marcador de segundos'}</h2><div class="sc"><div class="bgO">${G.eq[0].s}</div><div class="bgB">${G.eq[1].s}</div></div><p><span class="O">${G.eq[0].n}</span> · <span class="B">${G.eq[1].n}</span></p><button class="btn" id="ok">Continuar ▶</button></div>`;$('#ok').onclick=ok})}
function aviso(html,b='Empezar ▶'){return new Promise(ok=>{UI.innerHTML=`<div class="card">${html}<br><button class="btn" id="ok">${b}</button></div>`;$('#ok').onclick=()=>{snd('menu_press');ok()}})}
function reloj(seg,el,fin){let t=seg,on=true;el.textContent=t;const id=setInterval(()=>{if(!el.isConnected){clearInterval(id);return}if(!on)return;t--;el.textContent=t;if(t<=5&&t>0)snd('countdown_time',.6);if(t<=0){clearInterval(id);snd('countdown_timeOut');fin()}},1000);return{stop(){clearInterval(id)},pausa(v){on=!v},get t(){return t}}}
// grafismo de columna (He dicho y La ristra): naranja a la izquierda, azul a la derecha (espejo), como en el vídeo
function columna(e,n,seg){const c=G.eq[e].c,lado=e?'R':'L';return`<div class="hd ${lado}"><div class="dots">${Array(n).fill(`<div class="dot bg${c}"></div>`).join('')}</div><div class="pills"></div><div class="num ${c}" id="n">${seg}</div><div class="who" id="who"></div><div class="bar bg${c}" id="q"></div><div class="ctl" id="ctl"></div></div>`}
const pill=(e,w)=>$('.pills').insertAdjacentHTML('beforeend',`<div class="pill bg${G.eq[e].c}">${w}</div>`);
// ---------- HE DICHO ----------
async function heDicho(){await cortinilla('hd');await aviso('<h2>He dicho</h2><p>Frases de famosos con una palabra oculta: solo vemos su inicial.</p><p><b>No se puede pasar palabra.</b> Siempre hay que decir algo.</p><p>Cada acierto: +5 segundos.</p>');
 await sayAll(D.fr.hd);const mid=Math.ceil(D.hd.length/2);
 for(const e of [0,1]){const it=D.hd.slice(e?mid:0,e?D.hd.length:mid);await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>60 segundos. ¡Adelante!</p>`);camE(e);await rondaHD(e,it)}await marcador()}
function rondaHD(e,it){return new Promise(async ok=>{let i=0,fin=false;UI.innerHTML=columna(e,it.length,60);
 $('#ctl').innerHTML='<input id="r" placeholder="respuesta" autocomplete="off"><button class="btn g s" id="ok">Comprobar</button><button class="btn s" id="si">✔</button><button class="btn r s" id="no">✘</button>';
 const rl=reloj(60,$('#n'),()=>terminar());const terminar=()=>{if(fin)return;fin=true;rl.stop();callar();setTimeout(ok,1200)};
 const show=async()=>{if(i>=it.length)return terminar();const x=it[i];document.querySelectorAll('.dot')[i].classList.add('off');$('#who').textContent='Responde: '+(jug(e)||'—');
  $('#q').innerHTML=x.q.replace(new RegExp('\\b'+x.x[0]+'\\b'),`<b class="ini">${x.x}</b>`);$('#r').value='';rl.pausa(true);await say(x.k);rl.pausa(false)};
 const res=v=>{if(fin)return;const x=it[i];if(v){snd('donut_hit');G.eq[e].s+=5;pill(e,x.a)}else{snd('donut_fail');$('#q').innerHTML+=` → <b>${x.a.toUpperCase()}</b>`}i++;setTimeout(show,v?500:1500)};
 $('#ok').onclick=()=>res(norm($('#r').value)===norm(it[i].a));$('#si').onclick=()=>res(true);$('#no').onclick=()=>res(false);$('#r').onkeydown=ev=>{if(ev.key==='Enter')$('#ok').click()};show()})}
// ---------- ¿DÓNDE ESTÁN? ----------
// Reglas reales (vídeo, 24:17–25:52): cada familia elige uno de dos temas; panel de 9 casillas con 9 palabras; se destapa 2 s;
// yo digo una palabra y dicen el número; acierto = sigue el mismo; fallo = turno al compañero, se tapa todo y se empieza de cero;
// no se puede pasar; 75 s por equipo; al acabar, 3 s por cada palabra destapada.
async function dondeEstan(){await cortinilla('de');await aviso('<h2>¿Dónde están?</h2><p>Un panel de <b>9 casillas</b> esconde 9 palabras del tema que elijáis. Lo destapamos solo un par de segundos.</p><p>Yo digo una palabra y decís detrás de qué número está. Si acertáis, seguís. Si falláis, el turno pasa al compañero, <b>se tapa todo y se empieza de cero</b>. No se puede pasar palabra.</p><p>75 segundos por equipo. Al acabar, <b>3 segundos por cada palabra destapada</b>.</p>');
 await say('dep0');const usados=new Set();
 for(let e=1;e>=0;e--){camE(e);const op=[0,1,2,3].filter(i=>!usados.has(i)).slice(0,2);const p=await new Promise(ok=>{UI.innerHTML=`<div class="card"><h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Elegid tema:</p>${op.map(i=>`<button class="btn s" data-p="${i}">${D.dep[i].t}</button>`).join(' ')}</div>`;UI.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>ok(+b.dataset.p))});usados.add(p);await rondaDE(e,p)}
 await marcador()}
function rondaDE(e,p){return new Promise(async ok=>{const c=G.eq[e].c,P=D.dep[p],pal=Array(9);P.w.forEach(([w,n])=>pal[n-1]=w);
 UI.innerHTML=`<div class="dep ${e?'R':'L'}"><div class="titde">${P.t}</div><div class="grid g3">${pal.map((w,i)=>`<div class="tile bg${c}" data-i="${i}">${i+1}</div>`).join('')}</div><div class="big ${c}" id="n">75</div><div class="def card" id="q"></div><div class="who" id="who"></div></div>`;
 const tl=[...document.querySelectorAll('.tile')];let ab=new Set();const flip=(i,v)=>{tl[i].classList.toggle('w',v);tl[i].textContent=v?pal[i]:i+1};
 await wait(800);for(let i=0;i<9;i++)flip(i,true);snd('whereAre_hide');await wait(2000);for(let i=0;i<9;i++)flip(i,false);snd('whereAre_hide');
 let k=0,fin=false,quien=jug(e);const rl=reloj(75,$('#n'),()=>end());
 const end=()=>{if(fin)return;fin=true;rl.stop();callar();const s3=ab.size*3;G.eq[e].s+=s3;$('#q').innerHTML=`Tiempo. <b>${ab.size}</b> palabras destapadas → <b>+${s3} s</b>`;setTimeout(ok,2600)};
 const preg=async()=>{if(fin)return;if(k>=9)return end();$('#who').textContent='Responde: '+(quien||'—');$('#q').textContent=P.w[k][0];await say('dw'+p+'_'+k)};
 tl.forEach(t=>t.onclick=()=>{if(fin)return;const i=+t.dataset.i;if(ab.has(i))return;
  if(i+1===P.w[k][1]){snd('whereAre_hit');ab.add(i);flip(i,true);k++;setTimeout(preg,500)}
  else{snd('whereAre_fail');flip(i,true);tl[i].classList.add('x');setTimeout(()=>{tl[i].classList.remove('x');for(let q=0;q<9;q++)flip(q,false);ab=new Set();k=0;quien=jug(e);preg()},900)}});preg()})}
// ---------- ESTO ME SUENA (gramola con 5 pistas; pulsadores azul y rojo; se ganan los segundos de las pistas que quedan) ----------
const JCOL=['#2a7bff','#e8352f','#2fc23f','#ffb31a','#b04fff'];
// Reglas reales (vídeo 12:52–23:15): parejas frente a frente; se elige un color de la gramola (5 s, luego 4, 3…) y suena la canción
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
// ---------- PALABRAS CRUZADAS (definición; respuesta partida en dos columnas desordenadas) ----------
async function cruzadas(){await cortinilla('cruz');await aviso('<h2>Palabras cruzadas</h2><p>Escucháis una definición. La respuesta está partida en dos: el principio en la columna de la izquierda y el final en la de la derecha, desordenados.</p><p>Tocad las dos mitades. 60 segundos · +5 s por acierto.</p>');await say(D.fr.cruz[0]);
 for(const e of [0,1]){const it=D.cruz[e];camE(e);await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2>`);
  await new Promise(ok=>{const c=G.eq[e].c,A=it.map((x,i)=>[x[1],i]).sort(()=>Math.random()-.5),B=it.map((x,i)=>[x[2],i]).sort(()=>Math.random()-.5);let k=0,sa=-1,fin=false;
   UI.innerHTML=`<div class="cz"><div class="col">${A.map(x=>`<div class="tile s bg${c}" data-a="${x[1]}">${x[0]}</div>`).join('')}</div><div class="col">${B.map(x=>`<div class="tile s bgM" data-b="${x[1]}">${x[0]}</div>`).join('')}</div>
   <div class="czr"><div class="big ${c}" id="n">60</div><div class="who" id="who"></div><div class="def card" id="q"></div><div class="pills"></div></div></div>`;
   const rl=reloj(60,$('#n'),()=>end());const end=()=>{if(fin)return;fin=true;rl.stop();callar();setTimeout(ok,1400)};
   const preg=async()=>{if(k>=it.length)return end();sa=-1;document.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));$('#who').textContent='Responde: '+(jug(e)||'—');$('#q').textContent=it[k][0];rl.pausa(true);await say('cz'+e+'_'+k);rl.pausa(false)};
   document.querySelectorAll('[data-a]').forEach(t=>t.onclick=()=>{if(t.classList.contains('x'))return;document.querySelectorAll('[data-a]').forEach(x=>x.classList.remove('sel'));t.classList.add('sel');sa=+t.dataset.a});
   document.querySelectorAll('[data-b]').forEach(t=>t.onclick=()=>{if(fin||sa<0||t.classList.contains('x'))return;const b=+t.dataset.b,okk=sa===k&&b===k;
    if(okk){snd('donut_hit');G.eq[e].s+=5;pill(e,it[k][1]+it[k][2])}else{snd('donut_fail');$('#q').innerHTML+=` → <b>${(it[k][1]+it[k][2]).toUpperCase()}</b>`}
    document.querySelector(`[data-a="${k}"]`).classList.add('x');document.querySelector(`[data-b="${k}"]`).classList.add('x');k++;setTimeout(preg,okk?500:1500)});preg()})}
 await marcador()}
// ---------- ¿TÚ QUÉ PINTAS? ----------
// Reglas reales (vídeo 31:41–32:10): la familia elige tema; uno dibuja (puede señalar o hacer gestos); 5 palabras, frases o expresiones;
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
// ---------- LA RISTRA (mismo grafismo de columna que en el vídeo: los pueblos se apilan) ----------
// Reglas reales (vídeo, 38:33–39:33): primer miembro dice la 1.ª palabra; el siguiente repite la 1.ª y añade la 2.ª… en orden.
// Si se olvida o salta el orden, el turno pasa al compañero, que tiene que recordarlas todas para seguir. 75 s por equipo.
// Cuenta el máximo alcanzado: la familia con más palabras gana 10 s; completar el panel, 20 s.
async function ristra(){await cortinilla('ristra');await aviso('<h2>La ristra</h2><p>Os doy una ristra de palabras. El primero repite la primera; el siguiente, la primera y la segunda… <b>siempre en orden</b>.</p><p>Si alguien se olvida o se salta el orden, el turno pasa al compañero, que tiene que <b>repetirlas todas</b> para seguir.</p><p>75 segundos. La familia que más palabras recuerde gana <b>10 s</b>; si completa el panel, <b>20 s</b>.</p>');await say(D.fr.ristra[0]);
 const max=[0,0],tot=[0,0],libres=[0,1];
 for(const e of [0,1]){camE(e);let ti=libres[0];if(libres.length>1)ti=await new Promise(ok=>{UI.innerHTML=`<div class="card"><h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>Elegid tema:</p>${libres.map(i=>`<button class="btn s" data-p="${i}">${D.ristra[i].t}</button>`).join(' ')}</div>`;document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>ok(+b.dataset.p))});
  libres.splice(libres.indexOf(ti),1);const ws=D.ristra[ti].w.map((w,i)=>[w,i]);tot[e]=ws.length;const RK=ti;
  await aviso(`<h2 class="${G.eq[e].c}">${G.eq[e].n}</h2><p>${D.ristra[ti].t} · ${ws.length} palabras · 75 segundos</p>`);
  await new Promise(ok=>{let n=0,fin=false,nuevo=true,j=jug(e)||'';UI.innerHTML=columna(e,ws.length,75);
   $('#ctl').innerHTML='<button class="btn g" id="si">✔ La ha dicho bien</button><button class="btn r" id="no">✘ Fallo</button>';
   const rl=reloj(75,$('#n'),()=>end());const end=()=>{if(fin)return;fin=true;rl.stop();callar();setTimeout(ok,1400)};
   const sig=async()=>{if(n>=ws.length)return end();$('#who').textContent='Repite: '+j;
    if(nuevo){document.querySelectorAll('.dot')[n].classList.add('off');$('#q').innerHTML=`Nueva palabra: <b class="ini">${ws[n][0].toUpperCase()}</b> · ${j}, repite la ristra desde el principio`;await say('rx'+RK+'_'+ws[n][1])}
    else $('#q').innerHTML=`${j}: repite toda la ristra hasta <b class="ini">${ws[n][0].toUpperCase()}</b>`};
   $('#si').onclick=()=>{if(fin)return;snd('donut_hit');pill(e,ws[n][0]);n++;max[e]=Math.max(max[e],n);nuevo=true;j=jug(e)||'';sig()};
   $('#no').onclick=()=>{if(fin)return;snd('donut_fail');nuevo=false;j=jug(e)||'';sig()};sig()})}
 let msg='';for(const e of [0,1])if(max[e]>=tot[e]){G.eq[e].s+=20;msg+=`${G.eq[e].n} completa el panel: +20 s. `}
 if(!msg){if(max[0]!==max[1]){const g=max[0]>max[1]?0:1;G.eq[g].s+=10;msg=`${G.eq[g].n} recuerda más palabras (${max[g]}): +10 s.`}else msg='Empate en la ristra.'}
 await marcador('La ristra · '+msg)}
// ---------- EL ROSCO DÚO (bolas 3D) ----------
const roscoG=new THREE.Group();roscoG.visible=false;S2.add(roscoG);const RB=[];const geoR=new THREE.SphereGeometry(1,20,14);
for(let i=0;i<25;i++){const m=new THREE.Mesh(geoR,new THREE.MeshStandardMaterial({color:0x1f7bff,roughness:.25,metalness:.1,emissive:0x0a2a80,emissiveIntensity:.25}));const l=letraSpr(ABC[i],1);m.add(l);l.position.z=1.2;roscoG.add(m);RB.push(m)}
function roscoPos(){const r=$('#ro');if(!r)return;const b=r.getBoundingClientRect(),cx=b.left+b.width/2,cy=innerHeight-(b.top+b.height/2),rad=b.width*.43,s=b.width*.052;
 RB.forEach((m,i)=>{const a=Math.PI/2-i/25*Math.PI*2;m.position.set(cx+rad*Math.cos(a),cy+rad*Math.sin(a),0);m.scale.setScalar(s);m.children[0].scale.set(1.7,1.7,1)})}
const COLR={0:0x1f7bff,1:0x2fc23f,2:0xe8352f};
function pintaR(s){RB.forEach((m,i)=>{const cur=i===s.pos;m.material.color.setHex(cur?0xff9a1c:COLR[s.est[i]]);m.material.emissive.setHex(cur?0x803a00:s.est[i]===1?0x0a5a10:s.est[i]===2?0x600000:0x0a2a80);m.userData.cur=cur})}
async function rosco(){await marcador('Antes del Rosco');await cortinilla('rosco');
 await aviso('<h2>El Rosco Dúo</h2><p>Juegan dos de cada familia: uno responde de la <b>A a la N</b> y el otro de la <b>Ñ a la Z</b>.</p><p>Empieza la familia con más segundos. El tiempo de cada familia son <b>los segundos acumulados</b> en las pruebas. Si acertáis, seguís; si decís «Pasapalabra», turno para la otra familia; si falláis, paramos, corregimos y pasa el turno.</p><p>Bote: 6.000 €</p>');
 const ms=e=>{const m=G.eq[e].m.filter(Boolean);return[m[0]||'Jugador 1',m[1]||m[0]||'Jugador 2']};
 const st=[0,1].map(e=>({t:Math.max(G.eq[e].s,30),est:D.ro.map(()=>0),pos:0,ac:0,fa:0,fin:false}));const iniN=D.ro.findIndex(x=>x.l==='Ñ');
 let e=G.eq[0].s>=G.eq[1].s?0:1;await say(D.fr.ro[0]);
 while(!(st[0].fin&&st[1].fin)){if(st[e].fin){e=1-e;continue}camE(e);await turnoRosco(e,st[e],ms(e),iniN);e=1-e}
 roscoG.visible=false;activo=0;
 const g=st[0].ac!==st[1].ac?(st[0].ac>st[1].ac?0:1):(st[0].fa!==st[1].fa?(st[0].fa<st[1].fa?0:1):-1);const bote=[0,1].some(i=>st[i].ac===25);plato('general');
 await aviso(`<h2>Resultado</h2><div class="sc"><div class="bgO">${st[0].ac}</div><div class="bgB">${st[1].ac}</div></div><p>Fallos: ${st[0].fa} · ${st[1].fa}</p><h2>${g<0?'¡Empate! 600 € para cada familia':`Gana <span class="${G.eq[g].c}">${G.eq[g].n}</span>: ${bote?'¡EL BOTE!':'1.200 €'}`}</h2>`,'Continuar ▶');
 await say('cie1');}
function turnoRosco(e,s,ms,iniN){return new Promise(ok=>{const c=G.eq[e].c;
 UI.innerHTML=`<div class="rw rosc"><div class="ro" id="ro"><div class="rbox"><div class="t bg${c}" id="n">${s.t}</div><div class="a bg${c}" id="ac">${s.ac}</div></div></div>
 <div class="rc card"><h3 class="${c}" style="margin:2px">${G.eq[e].n}<br><span id="who"></span></h3><div class="def" id="q"></div><input id="r" autocomplete="off" placeholder="respuesta"><button class="btn g s" id="ok">Comprobar</button><button class="btn s" id="pa">Pasapalabra</button><br><button class="btn s" id="si">✔</button><button class="btn r s" id="no">✘</button></div></div>`;
 roscoG.visible=true;activo=1;roscoPos();addEventListener('resize',roscoPos);let T0=0;anim=dt=>{T0+=dt;RB.forEach(m=>{m.rotation.y=m.userData.cur?T0*3:Math.sin(T0+m.position.x)*.3})};
 let fin=false;const end=()=>{if(fin)return;fin=true;clearInterval(id);callar();anim=null;removeEventListener('resize',roscoPos);s.fin=s.fin||s.t<=0||s.est.every(v=>v);setTimeout(ok,1300)};
 let hab=false;const id=setInterval(()=>{if(!$('#n')){clearInterval(id);return}if(!hab)return;s.t--;$('#n').textContent=s.t;if(s.t<=5&&s.t>0)snd('countdown_time',.6);if(s.t<=0){snd('countdown_timeOut');say('tiempo');end()}},1000);
 const sig=()=>{for(let k=1;k<=25;k++){const p=(s.pos+k)%25;if(!s.est[p]){s.pos=p;return true}}return false};
 const preg=async()=>{if(s.est[s.pos]&&!sig()){s.fin=true;return end()}pintaR(s);$('#who').textContent='Responde '+(s.pos<iniN?ms[0]+' (A–N)':ms[1]+' (Ñ–Z)');const x=D.ro[s.pos];$('#q').textContent=(x.t==='e'?'Empieza por ':'Contiene la ')+x.l+': '+x.d;$('#r').value='';hab=false;await say(x.k);hab=true};
 const res=v=>{if(fin)return;const x=D.ro[s.pos];if(v===1){snd('donut_hit');s.est[s.pos]=1;s.ac++;$('#ac').textContent=s.ac;if(!sig()){s.fin=true;pintaR(s);return end()}preg()}
  else if(v===2){snd('donut_fail');s.est[s.pos]=2;s.fa++;$('#q').innerHTML+=` → <b>${x.w.toUpperCase()}</b>`;sig();pintaR(s);hab=false;setTimeout(end,1500)}
  else{snd('donut_pass');sig();pintaR(s);end()}};
 $('#ok').onclick=()=>res(norm($('#r').value)===norm(D.ro[s.pos].w)?1:2);$('#pa').onclick=()=>res(0);$('#si').onclick=()=>res(1);$('#no').onclick=()=>res(2);$('#r').onkeydown=ev=>{if(ev.key==='Enter')$('#ok').click()};preg()})}
// ---------- historia ----------
async function historia(){UI.innerHTML=`<div class="card hist" style="max-width:640px"><div style="display:flex;align-items:center;gap:10px"><img src="img/christian.png" style="height:90px;border-radius:10px"><div><img src="img/logo_orig.png" style="width:200px"><h2 style="margin:4px">La historia de Pasapalabra en familia</h2></div></div><div id="hp"></div><button class="btn s" id="vol">◀ Menú</button></div>`;
 let stop=false;$('#vol').onclick=()=>{stop=true;callar();menu()};for(const k of D.fr.hist){if(stop)return;$('#hp').insertAdjacentHTML('beforeend',`<p>${D.L[k]}</p>`);$('#hp').lastChild.scrollIntoView();await say(k)}}
// ---------- menú y equipos ----------
const It=(t,sub,cl,f)=>{const n=document.createElement('button');n.className='mbtn '+(cl||'');n.innerHTML=`<span class="fp"></span><span>${t}${sub?`<small>${sub}</small>`:''}</span>`;n.onclick=e=>{e.stopPropagation();snd('menu_press',.6);f()};return n};
const Vol=a=>It('⟵ Volver','','back',()=>menu(a));
const para=()=>SND.music&&SND.music.pause();
function menu(a='main'){if(!SND.music||SND.music.paused)snd('music',.35);plato('general',{k:'logo',sub:''});
 UI.innerHTML=`<div id="menu"><div class="mbox"><div class="logo"><img class="mlogo" src="img/logo_orig.png"><div class="mtag">EN FAMILIA · 3D</div></div><div class="col"></div></div></div>`;const l=UI.querySelector('.col');const h=t=>{const e=document.createElement('h2');e.textContent=t;l.appendChild(e)};
 const P=(f)=>async()=>{para();await f();menu(a)};
 if(a==='main'){l.append(It('Jugar','Programa completo, pruebas sueltas…','gold',()=>menu('play')),It('Reglas','Christian Gálvez explica cada prueba (clips originales)','',()=>menu('reglas')),
  It('La historia de Pasapalabra en familia','Telecinco, 2018, contada con humor','hist',()=>{para();historia()}),It('Recreaciones e historias','Cabecera 3D, cabecera y despedida originales, cortinillas','',()=>menu('rec')),
  It('Cámara libre','Mueve la cámara por el plató 3D','',()=>camLibre()),It('Opciones','Plató 3D, pantalla completa, sonido','',()=>menu('opc')),It('Créditos','','',P(creditosMenu)))}
 else if(a==='play'){h('Jugar');l.append(It('Programa completo','Cabecera, 6 pruebas, Rosco Dúo y despedida','gold',()=>{para();equipos()}));
  for(const[k,f]of[['hd','heDicho'],['suena','estoMeSuena'],['de','dondeEstan'],['pinta','pintas'],['cruz','cruzadas'],['ristra','ristra'],['rosco','rosco']])l.append(It(TIT[k],'Prueba suelta','',()=>{para();G.suelta=1;Promise.resolve(window.__ppf[f]()).then(()=>menu('play'))}));l.append(Vol('main'))}
 else if(a==='reglas'){h('Reglas');for(const r of D.reglas)l.append(It(TIT[r.k],r.orig?'Clip original del programa':'Voz TTS (no hay explicación en el vídeo)','',()=>{para();reglas(r)}));l.append(Vol('main'))}
 else if(a==='rec'){h('Recreaciones e historias');l.append(It('Cabecera 3D','Recreación de la cabecera oficial','gold',P(cabecera)),It('Cabecera original','Vídeo del programa (Telecinco, 2018)','',P(()=>video('ediciones/cabecera.mp4'))),It('Despedida original','Vídeo del programa','',P(()=>video('ediciones/despedida.mp4'))));
  for(const k of Object.keys(TIT))l.append(It('Cortinilla: '+TIT[k],'Cabecera 3D de la prueba','',P(()=>cortinilla(k))));l.append(Vol('main'))}
 else if(a==='opc'){h('Opciones');l.append(It('Plató 3D: '+(PLATO?'sí':'no'),'Desactívalo si el móvil va lento','',()=>{localStorage.ppf_plato=PLATO?'0':'1';location.reload()}),It('Pantalla completa','','',()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{})),
  It('Sonido: '+(localStorage.ppf_mute==='1'?'no':'sí'),'','',()=>{localStorage.ppf_mute=localStorage.ppf_mute==='1'?'0':'1';location.reload()}),Vol('main'))}}
function creditosMenu(){return new Promise(ok=>{UI.innerHTML=`<div class="card"><img src="img/logo_orig.png" style="width:min(60vw,320px)"><p>Juego creado por <b>Ikeriano</b></p><p style="font-size:13px">Basado en «Pasapalabra en familia» (Telecinco, 2018; Xanela). Sintonía, cabecera, despedida y clips de reglas: audio y vídeo originales del programa.<br>Plató 3D del juego Pasapalabra de Ikeriano. Voces nuevas: Piper <span class="tts">TTS</span> (davefx).</p><button class="btn o" id="ok">Volver</button></div>`;$('#ok').onclick=ok})}
function camLibre(){para();const pl=['general','mesa','pantalla','azul','naranja'];let i=0;UI.innerHTML=`<div class="camb"><button class="btn" id="cp">◀</button><span id="cn">general</span><button class="btn" id="cs">▶</button><button class="btn o" id="cx">Salir</button></div>`;
 const f=$('#plato');if(f)f.style.pointerEvents='auto';const go=d=>{i=(i+d+pl.length)%pl.length;$('#cn').textContent=pl[i];plato(pl[i])};$('#cp').onclick=()=>go(-1);$('#cs').onclick=()=>go(1);$('#cx').onclick=()=>{if(f)f.style.pointerEvents='none';menu()}}
function reglas(r){return new Promise(ok=>{UI.innerHTML=`<div class="card reg"><h2>${TIT[r.k]} ${r.orig?'':'<span class="tts">TTS</span>'}</h2>${r.orig?`<video id="rv" src="reglas/${r.k}.mp4" playsinline></video><div id="rs" class="rsub"></div>`:`<p>${r.txt}</p>`}<button class="btn o" id="ok">Volver</button></div>`;
 const fin=()=>{const v=$('#rv');if(v)v.pause();callar();menu('reglas');ok()};$('#ok').onclick=fin;
 if(r.orig){const v=$('#rv');v.ontimeupdate=()=>{const t=v.currentTime;const s=r.sub.find(x=>t>=x[0]&&t<x[1]);($('#rs')||{}).textContent=s?s[2]:''};v.onended=fin;v.play().catch(()=>{})}else say('reg_'+r.k).then(()=>{})})}
function equipos(){const f=(e)=>`<div style="margin:6px"><h3 class="${G.eq[e].c}">Equipo ${e?'azul':'naranja'}</h3><input id="n${e}" value="${G.eq[e].n}"><br>${[0,1,2].map(i=>`<input id="m${e}${i}" placeholder="Miembro ${i+1}${i==2?' (opcional)':''}" value="${G.eq[e].m[i]}">`).join('<br>')}</div>`;
 UI.innerHTML=`<div class="card"><h2>Las familias (2–3 miembros)</h2><div style="display:flex;flex-wrap:wrap;justify-content:center">${f(0)}${f(1)}</div><p id="err" style="color:#ffb"></p><button class="btn o" id="go">¡A jugar! ▶</button> <button class="btn s" id="vol">◀</button></div>`;
 $('#vol').onclick=menu;$('#go').onclick=()=>{for(const e of [0,1]){G.eq[e].n=$('#n'+e).value||G.eq[e].n;G.eq[e].m=[0,1,2].map(i=>$('#m'+e+i).value.trim());if(G.eq[e].m.filter(Boolean).length<2){$('#err').textContent='Cada familia necesita al menos 2 miembros.';return}G.eq[e].s=0}programa()}}
async function programa(){await cabecera();plato('mesa');UI.innerHTML=`<div class="card"><img src="img/christian.png" style="height:150px"><p>${G.eq[0].n} <span class="O">●</span> contra <span class="B">●</span> ${G.eq[1].n}</p></div>`;await sayAll(D.fr.pres);
 await heDicho();await estoMeSuena();await dondeEstan();await pintas();await cruzadas();await ristra();await rosco();
 await video('ediciones/despedida.mp4');await creditos();menu()}
window.__ppf={G,D,reglas,camLibre,heDicho,dondeEstan,estoMeSuena,cruzadas,pintas,ristra,rosco,historia,cabecera,cortinilla,menu,equipos};
UI.innerHTML='<div class="card"><img src="img/logo_orig.png" style="width:min(70vw,380px)"><br><br><button class="btn o" id="st">Toca para empezar</button></div>';$('#st').onclick=()=>menu();
