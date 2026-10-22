import puppeteer from 'puppeteer-core';const w=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio']});
const p=await b.newPage();await p.setViewport({width:480,height:270});
for(const k of process.argv.slice(2)){await p.goto('http://127.0.0.1:18878/');await w(5000);await p.evaluate(k=>{window.__cortT=0;window.__ppf.cortinilla(k)},k);const L=[];
 for(let i=0;i<60;i++){const t=await p.evaluate(()=>window.__cortT);if(i>0&&t<0.01&&L.length>3)break;await p.screenshot({path:`sh/c_${k}_${String(i).padStart(2,'0')}.png`});L.push(t);await w(150);if(t>7)break}
 console.log(k,JSON.stringify(L.map(x=>+x.toFixed(2))))}
await b.close()
