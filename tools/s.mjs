import puppeteer from 'puppeteer-core';const w=ms=>new Promise(r=>setTimeout(r,ms));const O='/workspace/envio/ppfamilia12/';
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:120000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--mute-audio']});
const p=await b.newPage();await p.setViewport({width:800,height:360});p.on('pageerror',e=>console.log('ERR',e.message));
const U='http://127.0.0.1:18878/';const shot=n=>{console.log(n);return p.screenshot({path:O+n+'.png'})};
const ck=async(s,t=30000)=>{try{await p.waitForSelector(s,{visible:true,timeout:t});await w(300);await p.click(s);await w(500);return true}catch(e){console.log('noclick',s);return false}};
const go=async(f,a)=>{await p.goto(U,{waitUntil:'load'});await w(5000);await p.evaluate((f,a)=>{const G=window.__ppf.G;G.eq[0].m=['Ana','Paz','Candela'];G.eq[1].m=['David','Susana','María'];G.eq[0].n='Familia Herrera';G.eq[1].n='Familia García';G.eq[0].s=145;G.eq[1].s=120;window.__ppf[f](a);},f,a)};
const J=process.argv[2];
if(J==='a'){await p.goto(U);await w(5000);await shot('00-inicio');await ck('#st');await w(1500);await shot('01-menu-principal');
 for(const s of ['play','reglas','rec','opc']){await go('menu',s);await w(2000);await shot('02-menu-'+s)}
 await go('camLibre');await w(3000);await shot('03-camara-libre');
 await go('historia');await w(9000);await shot('04-historia');
 for(const k of ['hd','suena','de','pinta','ristra','cruz','rosco']){await go('menu');await p.evaluate(k=>{window.__ppf.reglas(window.__ppf.D.reglas.find(r=>r.k==k))},k);await w(7000);await shot('05-reglas-'+k)}
 for(const t of ['hd','suena','de','pinta','cruz','ristra','rosco']){await go('menu');await p.evaluate(t=>{window.__ppf.cortinilla(t)},t);await w(['cruz','rosco'].includes(t)?1300:4200);await shot('06-cortinilla-'+t);await w(['cruz','rosco'].includes(t)?1600:3200);await shot('07-plato-titulo-'+t)}}
if(J==='b'){
 await go('heDicho');await ck('#ok');await w(2000);await ck('#ok');await w(6000);await shot('10-he-dicho');
 await go('estoMeSuena');await ck('#ok');await w(14000);await shot('11-esto-me-suena-elige-color');await ck('#jb2');await w(2500);await shot('12-esto-me-suena-suena-gramola');await p.click('#b1');await w(800);await shot('13-esto-me-suena-pulsa-antes-rebote');await w(12000);await shot('14-esto-me-suena-ya-pulsad');await p.click('#b0');await w(800);await shot('15-esto-me-suena-responde');
 await go('dondeEstan');await ck('#ok');await w(2500);await shot('16-donde-estan-elige-tema');await ck('[data-p]');await w(1000);await shot('17-donde-estan-panel');await w(5000);await shot('18-donde-estan-pregunta');await ck('[data-i]');await w(1500);await shot('19-donde-estan-fallo-companero');
 await go('pintas');await ck('#ok');await w(16000);await shot('20-tu-que-pintas-elige-tema');await ck('[data-p]');await ck('#ok');await w(1500);await p.click('#si').catch(()=>{});await w(600);await p.click('#si').catch(()=>{});await w(1200);await shot('21-tu-que-pintas-tiempo-compartido');
 await go('ristra');await ck('#ok');await w(9000);await shot('22-ristra-elige-tema');await ck('[data-p]');await ck('#ok');await w(2500);for(let i=0;i<3;i++){await p.click('#si').catch(()=>{});await w(2200)}await shot('23-ristra-cadena');await p.click('#no').catch(()=>{});await w(1500);await shot('24-ristra-fallo-companero');
 await go('cruzadas');await ck('#ok');await w(9000);await ck('#ok',8000);await w(3000);await p.click('[data-a="0"]').catch(()=>{});await p.click('[data-b="0"]').catch(()=>{});await w(2000);await shot('25-palabras-cruzadas');
 await go('rosco');await w(1500);await ck('#ok');await w(4000);await ck('#ok');await w(5000);await shot('26-rosco-145-segundos');await p.click('#si').catch(()=>{});await w(6000);await shot('27-rosco-duo-3d');}
await b.close();
