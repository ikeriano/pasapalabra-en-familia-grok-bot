import puppeteer from 'puppeteer-core';
const O='/workspace/envio/ppfamilia/';const w=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--mute-audio']});
const p=await b.newPage();await p.setViewport({width:800,height:360,deviceScaleFactor:1});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8765/',{waitUntil:'load'});await w(1500);await p.click('#st');await w(800);await p.screenshot({path:O+'01-menu.png'});
await p.click('#c');for(const [t,n] of [[4000,'02-cabecera-bolas'],[5500,'03-cabecera-bloques'],[7000,'04-cabecera-rosco'],[5500,'05-creditos']]){await w(t);await p.screenshot({path:O+n+'.png'})}
await w(5000);await p.click('#j');await w(500);
await p.evaluate(()=>{['Ana','Paz','Candela'].forEach((v,i)=>document.querySelector('#m0'+i).value=v);['David','Susana'].forEach((v,i)=>document.querySelector('#m1'+i).value=v);document.querySelector('#n0').value='Familia Herrera';document.querySelector('#n1').value='Familia García'});
await p.screenshot({path:O+'06-familias.png'});
const P=await p.evaluate(()=>{window.__ppf.G.eq[0].m=['Ana','Paz','Candela'];window.__ppf.G.eq[1].m=['David','Susana','María'];window.__ppf.G.eq[0].n='Familia Herrera';window.__ppf.G.eq[1].n='Familia García';window.__ppf.heDicho();});
await w(1000);await p.screenshot({path:O+'07-cortinilla.png'});await w(2500);await p.click('#ok');await w(20000);await p.click('#ok').catch(()=>{});await w(2000);
await p.click('#si').catch(e=>console.log('nosi'));await w(6000);await p.click('#si').catch(()=>{});await w(5000);await p.screenshot({path:O+'08-he-dicho.png'});
await p.evaluate(()=>window.__ppf.dondeEstan());await w(4000);await p.click('#ok');await w(16000);await p.click('#ok').catch(()=>{});await w(1000);await p.screenshot({path:O+'09-donde-estan-giro.png'});await w(6000);
await p.click('.tile[data-i="5"]').catch(()=>{});await w(4000);await p.screenshot({path:O+'10-donde-estan.png'});
await p.evaluate(()=>window.__ppf.rosco());await w(1500);await p.click('#ok');await w(4000);await p.click('#ok');await w(4000);await p.click('#si').catch(()=>{});await w(9000);await p.click('#si').catch(()=>{});await w(6000);await p.screenshot({path:O+'11-rosco-duo.png'});
await p.evaluate(()=>window.__ppf.historia());await w(15000);await p.screenshot({path:O+'12-historia.png'});
await b.close();
