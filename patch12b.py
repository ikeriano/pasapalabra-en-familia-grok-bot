p='www/js/game.js';s=open(p).read()
NEW=r'''// ---- v1.2: cabeceras de cada prueba copiadas plano a plano de las del programa (ver cabecera_compare/pruebas) ----
function escenaV(tipo){const g=new THREE.Group();const add=(geo,mat,x,y,z,s=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(typeof s==='number')m.scale.setScalar(s);else m.scale.set(...s);g.add(m);return m};
 const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),Cy=(a,b,h,n=20)=>new THREE.CylinderGeometry(a,b,h,n),Sp=r=>new THREE.SphereGeometry(r,18,12),To=(r,t,a=Math.PI*2)=>new THREE.TorusGeometry(r,t,10,32,a);
 const tex=(t,col,bg,w=512,h=128,fs=64)=>cv(w,h,(x,W,H)=>{if(bg){x.fillStyle=bg;x.fillRect(0,0,W,H)}x.fillStyle=col;x.font='bold '+fs+'px F,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(t,W/2,H/2+4)});
 const plano=(t,col,bg,w,h,x,y,z,fs)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex(t,col,bg,512,Math.round(512*h/w),fs||60),transparent:!bg}));m.position.set(x,y,z);g.add(m);return m};
 let bg,titulo,c1,c2,cam,dur,tt0,tpos=[0,-2.2,0.5],tw=8;
 if(tipo==='hd'){bg='#1594d6';titulo='HE DICHO';c1='#ffc928';c2='#c77a00';dur=5.2;tt0=2.4;tpos=[-1.2,-1.6,1.2];tw=6;
  const mq=new THREE.Group();g.add(mq);const a2=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);mq.add(m);return m};
  a2(B(2.6,2.4,1.8),M(0x3fb7a6),0,0,0);a2(B(.06,2.0,1.5),M(0x1f4a4a),-1.32,0,0);
  const bub=a2(new THREE.PlaneGeometry(1.2,.9),new THREE.MeshBasicMaterial({map:cv(256,192,(x,W,H)=>{x.strokeStyle='#fff';x.lineWidth=10;x.beginPath();x.roundRect(20,20,W-40,H-70,22);x.moveTo(60,H-50);x.lineTo(50,H-12);x.lineTo(100,H-50);x.stroke()}),transparent:true}),-1.36,.1,0);bub.rotation.y=-Math.PI/2;
  for(let i=0;i<3;i++){const r=a2(Cy(.38,.38,.5),M(0xffc928),-.5+i*.55,.1,.92);r.rotation.z=Math.PI/2}
  a2(B(2.0,.25,.4),M(0xe8742a),0,.75,.85);for(let i=0;i<5;i++)a2(Sp(.09),M(0xffffff,{emissive:0xffffff,emissiveIntensity:.6}),-.8+i*.4,1.35,.5);
  for(let i=0;i<6;i++)a2(To(.3,.09),M(0x161616),0,1.4+i*.17,0).rotation.x=Math.PI/2;a2(Sp(.25),M(0x161616),0,2.5,0);
  a2(B(1.1,.8,.2),M(0xffc928),.9,2.3,-.2);const hn=a2(new THREE.ConeGeometry(.9,1.6,28,1,true),M(0xe8b54a,{side:2,metalness:.5,roughness:.3}),-2.3,.6,.6);hn.rotation.z=Math.PI/2;
  a2(To(.32,.1,Math.PI),M(0xffc928),2.4,1.1,.4).rotation.z=Math.PI;a2(Cy(.02,.02,3),M(0x222222),2.4,2.8,.4);
  a2(B(1.6,.4,1.0),M(0xeeeeee),2.2,-1.0,1.2);a2(B(.4,.12,.3),M(0xe8742a),2.0,-.75,1.3);a2(Cy(.06,.06,1.2,8),M(0x333333),1.2,-1.0,1.2).rotation.z=Math.PI/2;
  mq.position.set(1.2,.2,-1);mq.rotation.y=-.35;
  cam=[[0,.6,.6,2.4,1.0,.2,-1],[1.1,-.3,.4,2.2,.4,.2,-1.2],[1.9,-1.4,.6,1.6,-.6,.4,-1.4],[2.5,-2.0,.8,2.2,-1.0,.7,-.8],[3.3,-.4,.8,7,-.2,.1,-.5],[5.2,0,.7,8.6,0,0,-.5]]}
 else if(tipo==='suena'){bg='#bfe8f6';titulo='ESTO ME SUENA';c1='#ff3fa4';c2='#9a1670';dur=6.2;tt0=3.1;tpos=[0,-1.9,1.2];tw=7.5;
  add(Cy(3.2,3.4,.5,40),M(0x3ccbe0),0,-1.6,-1.5);for(let i=0;i<40;i++){const a=i/40*Math.PI*2;const k=add(B(.32,.18,.7),M(i%2?0xffffff:0xff3fa4),Math.sin(a)*3.25,-1.25,-1.5+Math.cos(a)*3.25);k.rotation.y=a}
  add(B(2.2,2.4,1.2),M(0xff3fa4),0,0,-1.5);add(To(1.1,.35,Math.PI),M(0x3ccbe0),0,1.2,-1.5);add(To(.75,.18,Math.PI),M(0xffffff),0,1.2,-1.4);
  for(let i=0;i<4;i++)add(B(1.8,.08,.1),M(0xffffff),0,.7-i*.25,-.88);for(const x of [-.45,.45]){add(Sp(.28),M(0xffffff),x,-.55,-.75);add(Cy(.12,.12,.3),M(0xffffff),x,-.25,-.8)}
  add(Cy(.9,.9,.08,32),M(0x222222),0,.35,-1.0).rotation.x=0;add(Cy(.7,.7,.5,24),M(0xffffff),-1.9,.0,-1.2).rotation.x=Math.PI/2;add(To(.7,.06),M(0xe8352f),-1.9,0,-.95);
  add(new THREE.ConeGeometry(.7,1.2,28,1,true),M(0xe8c24a,{side:2,metalness:.6,roughness:.3}),2.0,.6,-.6).rotation.z=-2.2;add(Cy(.08,.2,1.0),M(0xe8c24a,{metalness:.6}),-2.6,-.5,-.4).rotation.z=1.3;
  for(const [x,z] of [[2.8,.6],[-2.9,.9],[2.3,1.8]])add(Cy(.45,.45,.04,24),M(0x111111),x,-1.3,z);add(B(.9,.8,.5),M(0x2fb8c8),1.9,-.7,-1.2);
  cam=[[0,-.4,-.7,1.6,0,-.7,-1.5],[1.4,.8,-.5,1.4,.2,-.6,-1.5],[2.0,2.4,.4,1.2,2.0,.4,-.6],[2.6,-1.8,.2,2.6,-1.4,0,-1],[3.6,0,1.0,7.4,0,-.2,-1.2],[6.2,.6,.9,7.0,0,-.2,-1.2]]}
 else if(tipo==='de'){bg='#1e4fb8';titulo='¿DÓNDE ESTÁN?';c1='#ff3348';c2='#8a0c22';dur=5.2;tt0=3.2;tpos=[0,2.1,.6];tw=7.5;
  const W=['CONDICIÓN','AVANZAR','TELÉFONO','ZONA','JUGUETE','ILUSIÓN','TRÁNSITO','PLÁCIDO','CANICA','BELLEZA','LEER','RÍO','DIRIGIR','ARENA','PEATONES','HOMBRO','INMENSO','CONFIANZA','EMPACAR','ROCÍO','OBSERVAR','AUTORIZAR'];
  let n=0;for(let r=0;r<5;r++)for(let c=-6;c<=6;c++){const a=c*.2;const R=6;const pn=plano(W[n++%W.length],'#1d56c8','#ffe21a',1.25,.55,Math.sin(a)*R,1.4-r*.72,-R*Math.cos(a)+2,46);pn.rotation.y=-a;
   const fr=add(B(1.38,.66,.05),M(0x2b7fe0),pn.position.x,pn.position.y,pn.position.z-.04);fr.rotation.y=-a}
  add(Cy(.5,.6,1.6,24),M(0xffffff),0,-1.6,0);for(let i=0;i<5;i++)add(To(.56,.06),M(0x2b7fe0),0,-2.2+i*.3,0).rotation.x=Math.PI/2;
  const si=add(Sp(.55),M(0xe8203a,{emissive:0x880010,emissiveIntensity:.5}),0,-.5,0);for(let i=0;i<14;i++){const a=i*2.4,b=Math.acos(1-2*(i+.5)/14);add(Sp(.08),M(0xffd21a),Math.sin(b)*Math.cos(a)*.56,-.5+Math.cos(b)*.56,Math.sin(b)*Math.sin(a)*.56)}
  add(Sp(.75),new THREE.MeshStandardMaterial({color:0xcfefff,transparent:true,opacity:.25}),0,-.5,0);add(B(14,.4,.5),M(0xd8246a),0,3.0,-3);
  cam=[[0,-3.2,1.0,-.6,-3.2,1.0,-4.0],[1.2,-1.0,.6,-.4,-1.0,.6,-4.0],[2.2,1.5,-.2,-.2,1.6,-.2,-4.0],[3.0,0,-.3,2.4,0,-.3,-2],[5.2,0,.2,5.2,0,.3,-1.5]]}
 else if(tipo==='pinta'){bg='#f3d21c';titulo='¿TÚ QUÉ PINTAS?';c1='#d42ac8';c2='#6a1070';dur=5.2;tt0=3.7;tpos=[0,1.8,.4];tw=7.5;
  add(B(2.8,1.6,1.4),M(0xff8a1a),0,-.3,-1.5);add(B(2.0,.35,.1),M(0xffd34a),0,.15,-.78);for(let i=0;i<6;i++)add(Sp(.07),M(0xbbbbbb,{metalness:.6}),-1.0+i*.4,-.25,-.78);
  add(To(1.8,.14,Math.PI),new THREE.MeshStandardMaterial({color:0xeef8ff,transparent:true,opacity:.45,roughness:.05}),0,-.2,-1.5);
  const dib=cv(1024,256,(x,W,H)=>{x.fillStyle='#fff';x.fillRect(0,0,W,H);x.strokeStyle='#e8601a';x.lineWidth=7;const fig=[[90,128,40],[300,110,35],[520,130,45],[760,120,38],[940,125,30]];
   fig.forEach(([cx,cy,r],i)=>{x.beginPath();if(i%2){x.moveTo(cx-r,cy);x.bezierCurveTo(cx-r,cy-r,cx,cy-r,cx,cy-r/3);x.bezierCurveTo(cx,cy-r,cx+r,cy-r,cx+r,cy);x.lineTo(cx,cy+r)}else{x.arc(cx,cy,r,0,6.3);x.moveTo(cx+r*1.6,cy);x.arc(cx+r*1.2,cy,r*.4,0,6.3)}x.closePath();x.stroke()})});
  const pap=new THREE.Mesh(new THREE.PlaneGeometry(9,2.2),new THREE.MeshStandardMaterial({map:dib,side:2}));pap.rotation.x=-Math.PI/2.4;pap.position.set(2.6,-1.25,0);pap.rotation.z=.25;g.add(pap);
  const mk=new THREE.Group();g.add(mk);const mm=(geo,mat,y)=>{const m=new THREE.Mesh(geo,mat);m.position.y=y;mk.add(m)};mm(Cy(.25,.25,1.8),M(0xff8a1a),0);mm(Cy(.27,.27,.3),M(0xffd34a),-.6);mm(new THREE.ConeGeometry(.25,.4,20),M(0xff8a1a),-1.1);mm(Cy(.05,.05,.15),M(0x333333),-1.35);mk.rotation.x=Math.PI;mk.position.set(.6,.2,-.4);mk.rotation.z=.3;mk.userData.pen=1;
  for(let i=0;i<8;i++)add(Sp(.16),new THREE.MeshStandardMaterial({color:0xeef8ff,transparent:true,opacity:.5}),-3.2+i*.15,-.2+Math.sin(i*.6)*.4,-1.2+i*.2);
  cam=[[0,0,.1,1.6,0,.1,-1.5],[1.2,.6,.3,1.4,.6,-.2,-.4],[2.4,2.2,.6,1.2,2.4,-1.2,0],[3.4,-.8,1.4,4.6,0,-.4,-1],[5.2,0,1.2,6.4,0,-.3,-1]]}
 else if(tipo==='ristra'){bg='#1f6fe0';titulo='LA RISTRA';c1='#ff2fb0';c2='#7a0f5a';dur=5.6;tt0=3.4;tpos=[.2,.3,1.0];tw=5.5;
  const rib=['CAFÉPALOCRISTALTRABAJOJUGAR','PARAGUASCOMPERCOLOR','LÁMPARACOCHEHABLARPARADA','APRENDERFUERZAMIGO'];
  rib.forEach((t,j)=>{const tx=cv(2048,128,(x,W,H)=>{x.fillStyle='#bfe9ff';x.font='bold 96px F,Arial';x.textBaseline='middle';x.fillText(t+t,10,68)});tx.wrapS=THREE.RepeatWrapping;
   const R=3.2+j*.9;const m=new THREE.Mesh(new THREE.CylinderGeometry(R,R,.6,64,1,true,0,Math.PI*1.4),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:2}));m.position.set(0,-1.4+j*.9,-2);m.rotation.y=j*.7;m.userData.rib=j;g.add(m);
   add(To(R,.03,Math.PI*1.4),new THREE.MeshBasicMaterial({color:0xeaffff}),0,-1.75+j*.9,-2).rotation.x=Math.PI/2})
  for(let i=0;i<6;i++){const a=i*1.05;const x=Math.sin(a)*4.4,z=-2+Math.cos(a)*4.4;add(Cy(.18,.22,1.0),M(0xffd21a),x,-.6+i%2*.8,z);add(Sp(.16),M(0xffffff,{emissive:0xffffff,emissiveIntensity:.8}),x+.6,.4+i%3*.5,z);add(Cy(.12,.18,.3),M(0xff2fb0),x+.6,.15+i%3*.5,z);add(To(.4,.14,Math.PI),M(0x2fa0ff),x-.6,-1.3,z)}
  cam=[[0,-1.4,-1.1,1.6,-1.4,-1.1,-2],[1.0,1.5,.2,2.4,0,.2,-2],[2.2,-2.5,.6,3.2,0,0,-2],[3.2,0,1.2,7,0,0,-2],[5.6,.8,1.4,7.4,0,0,-2]]}
 else return null;
 g.userData.bg=bg;g.userData.cam=cam;g.userData.dur=dur;g.userData.tt0=tt0;const tt=txt3d(titulo,c1,c2,tw);tt.position.set(...tpos);g.add(tt);g.userData.tt=tt;return g}
function camKF(k,T){let i=0;while(i<k.length-2&&T>k[i+1][0])i++;const a=k[i],b=k[i+1];const u=ease(Math.min(1,Math.max(0,(T-a[0])/(b[0]-a[0]))));C.position.set(lerp(a[1],b[1],u),lerp(a[2],b[2],u),lerp(a[3],b[3],u));C.lookAt(lerp(a[4],b[4],u),lerp(a[5],b[5],u),lerp(a[6],b[6],u))}
'''
i=s.index('function escena(tipo){')
s=s[:i]+NEW+s[i:]
old="async function cortinilla(tipo){UI.innerHTML='';const g=escena(tipo);S.add(g);"
assert old in s
s=s.replace(old,"async function cortinilla(tipo){UI.innerHTML='';const gv=escenaV(tipo);if(gv){S.add(gv);const ob=S.background;S.background=new THREE.Color(gv.userData.bg);fondo.visible=false;snd('cortinilla');let T=0;const tt=gv.userData.tt;tt.scale.setScalar(.001);\n  await new Promise(ok=>{anim=dt=>{T+=dt;camKF(gv.userData.cam,T);const k=Math.max(0,T-gv.userData.tt0);tt.scale.setScalar(Math.max(.001,ease(Math.min(1,k/.6))*(1+Math.sin(Math.min(1,k/.6)*Math.PI)*.12)));tt.rotation.y=(1-ease(Math.min(1,k/.8)))*1.2;\n   gv.children.forEach(m=>{if(m.userData.rib!==undefined)m.rotation.y+=dt*(.25+m.userData.rib*.08);if(m.userData.pen)m.position.x=.6+Math.sin(T*5)*.4});if(T>gv.userData.dur){anim=null;ok()}}});\n  S.remove(gv);S.background=ob;fondoModo(false);C.position.set(0,0,10);C.lookAt(0,0,0);return cortinillaPlato(tipo)}\n const g=escena(tipo);S.add(g);")
# split the plato barrido part into its own function
old2=" S.remove(g);S.background=ob;fondoModo(false);C.position.set(0,0,10);C.lookAt(0,0,0);\n"
assert old2 in s
s=s.replace(old2," S.remove(g);S.background=ob;fondoModo(false);C.position.set(0,0,10);C.lookAt(0,0,0);return cortinillaPlato(tipo)}\nasync function cortinillaPlato(tipo){\n",1)
open(p,'w').write(s)
