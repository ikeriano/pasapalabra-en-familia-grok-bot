# v1.4: menú igual que Ahora Caigo 1.52 (estructura Je()/_t()/Lo()/Wa())
f='/workspace/ppfam/www/js/game.js';s=open(f).read()
a=s.index("const It=(t,sub,cl,f)=>");b=s.index("function creditosMenu(")
new=r'''const It=(t,sub,cl,f)=>{const n=document.createElement('button');n.className='mbtn '+(cl||'');n.innerHTML=`<span class="fp"></span><span>${t}${sub?`<small>${sub}</small>`:''}</span>`;n.onclick=e=>{e.stopPropagation();snd('tecla',.8);f()};return n};
const Vol=a=>{const e=document.createElement('button');e.className='tbtn back';e.innerHTML='⟵ Volver';e.onclick=t=>{t.stopPropagation();snd('tecla',.8);menu(a)};return e};
const para=()=>SND.music&&SND.music.pause();
let MENU_A='main';const MENU_PADRE={play:'main',reglas:'main',rec:'main',mejor:'main',opc:'main'};
addEventListener('keydown',e=>{if(!document.getElementById('menu'))return;if(e.key==='Escape'||e.key==='Backspace'){if(MENU_A!=='main'&&MENU_A!=='title'){e.preventDefault();snd('tecla',.8);menu(MENU_PADRE[MENU_A]||'main')}return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){const bs=[...document.querySelectorAll('#menu .col button')];if(!bs.length)return;e.preventDefault();let i=bs.indexOf(document.activeElement);i=e.key==='ArrowDown'?(i+1)%bs.length:(i-1+bs.length)%bs.length;bs[i].focus();bs[i].scrollIntoView({block:'nearest'})}});
window.__ppfAtras=()=>{if(document.getElementById('menu')&&MENU_A!=='main'&&MENU_A!=='title'){menu(MENU_PADRE[MENU_A]||'main');return true}return false};
function menu(a='main'){MENU_A=a;if(!SND.music||SND.music.paused)snd('music',.35);plato('orbita');
 if(a==='title'){UI.innerHTML=`<div id="menu"><div class="title"><img class="tlogo" src="img/logo_orig.png"><div class="tsub">En familia</div><div class="ttap">Toca para empezar</div></div></div>`;
  const t=$('#menu');const h=m=>{m.stopPropagation();snd('tecla',.8);t.removeEventListener('pointerup',h);removeEventListener('keydown',h);menu('main')};t.addEventListener('pointerup',h);addEventListener('keydown',h);return}
 UI.innerHTML=`<div id="menu"><div class="mbox"><div class="logo"><img class="mlogo" src="img/logo_orig.png"><div class="mtag">EN FAMILIA · 3D</div></div><div class="col ui"></div></div><div class="mver">v1.4</div></div>`;const l=UI.querySelector('.col');const h=t=>{const e=document.createElement('h2');e.textContent=t;l.appendChild(e)};
 const P=(f)=>async()=>{para();await f();menu(a)};
 if(a==='main'){l.append(It('Jugar','Programa completo, pruebas sueltas, Rosco Dúo…','gold',()=>menu('play')),
  It('⭐ Lo mejor de Pasapalabra en familia','Cabecera, canciones de Esto me suena, reglas y despedida originales','gold',()=>menu('mejor')),
  It('🎞️ Recreaciones e historias','Cabecera 3D, cortinillas 3D de cada prueba y vídeos originales','',()=>menu('rec')),
  It('📖 Reglas','Christian Gálvez explica cada prueba (clips originales)','gold',()=>menu('reglas')),
  It('🏛️ La historia de Pasapalabra en familia','Telecinco, 2018, contada con humor','gold',()=>{para();historia()}),
  It('🎥 Cámara libre','Mueve la cámara por el plató 3D','gold',()=>camLibre()),
  It('⚙️ Opciones','Plató 3D, pantalla completa, sonido','gold',()=>menu('opc')),
  It('🎬 Créditos','Quién ha hecho el juego','gold',P(creditosMenu)))}
 else if(a==='play'){h('🎮 Jugar');l.append(It('Programa completo','Cabecera, 6 pruebas, Rosco Dúo y despedida','gold',()=>{para();equipos()}));
  for(const[k,f]of[['hd','heDicho'],['suena','estoMeSuena'],['de','dondeEstan'],['pinta','pintas'],['cruz','cruzadas'],['ristra','ristra'],['rosco','rosco']])l.append(It(TIT[k],'Prueba suelta','gold',()=>{para();G.suelta=1;Promise.resolve(window.__ppf[f]()).then(()=>menu('play'))}));l.append(Vol('main'))}
 else if(a==='mejor'){h('⭐ Lo mejor de Pasapalabra en familia');l.append(It('Cabecera original','Vídeo del programa (Telecinco, 2018)','gold',P(()=>video('ediciones/cabecera.mp4'))),
  It('Despedida original','Vídeo del programa','gold',P(()=>video('ediciones/despedida.mp4'))));
  const ems=[['c0_0','La bomba (King África)'],['c1_0','El toro enamorado de la luna'],['c2_0','Un año más (Mecano)']];
  for(const[c,t]of ems)l.append(It('🎵 '+t,'Canción original de Esto me suena','gold',()=>{const x=new Audio('ems/'+c+'.mp3');x.volume=MUTE?0:1;para();x.play().catch(()=>{});x.onended=()=>snd('music',.35)}));
  for(const r of D.reglas.filter(r=>r.orig))l.append(It('Reglas: '+TIT[r.k],'Christian Gálvez (clip original)','gold',()=>{para();reglas(r)}));l.append(Vol('main'))}
 else if(a==='reglas'){h('📖 Reglas');for(const r of D.reglas)l.append(It(TIT[r.k],r.orig?'Clip original del programa':'Voz TTS (no hay explicación en el vídeo)','gold',()=>{para();reglas(r)}));l.append(Vol('main'))}
 else if(a==='rec'){h('🎞️ Recreaciones e historias');l.append(It('Cabecera 3D','Recreación de la cabecera oficial','gold',P(cabecera)),It('Cabecera original','Vídeo del programa (Telecinco, 2018)','gold',P(()=>video('ediciones/cabecera.mp4'))),It('Despedida original','Vídeo del programa','gold',P(()=>video('ediciones/despedida.mp4'))));
  for(const k of Object.keys(TIT))l.append(It('Cortinilla: '+TIT[k],'Cabecera 3D de la prueba','gold',P(()=>cortinilla(k))));l.append(Vol('main'))}
 else if(a==='opc'){h('⚙️ Opciones');l.append(It('Plató 3D: '+(PLATO?'sí':'no'),'Desactívalo si el móvil va lento','gold',()=>{localStorage.ppf_plato=PLATO?'0':'1';location.reload()}),It('Pantalla completa','','gold',()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{})),
  It('Sonido: '+(localStorage.ppf_mute==='1'?'no':'sí'),'','gold',()=>{localStorage.ppf_mute=localStorage.ppf_mute==='1'?'0':'1';location.reload()}),Vol('main'))}}
'''
s=s[:a]+new+s[b:]
old="UI.innerHTML='<div class=\"card\"><img src=\"img/logo_orig.png\" style=\"width:min(70vw,380px)\"><br><br><button class=\"btn o\" id=\"st\">Toca para empezar</button></div>';$('#st').onclick=()=>menu();"
assert old in s;s=s.replace(old,"menu('title');")
open(f,'w').write(s)
