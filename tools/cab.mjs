import puppeteer from 'puppeteer-core';const w=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--mute-audio']});
const p=await b.newPage();await p.setViewport({width:480,height:270});await p.goto('http://127.0.0.1:18878/');await w(6000);
const L=[];await p.evaluate(()=>{window.__cabT=0;window.__ppf.cabecera()});
for(let i=0;i<200;i++){const t=await p.evaluate(()=>window.__cabT);await p.evaluate(()=>{const s=document.querySelector('#skip');if(s)s.style.display='none'});await p.screenshot({path:`sh/cab_${String(i).padStart(3,'0')}.png`});L.push(t);if(t>21.6)break;await w(60)}
console.log(JSON.stringify(L.map(x=>+x.toFixed(2))));await b.close()
