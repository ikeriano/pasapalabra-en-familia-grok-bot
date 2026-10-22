import json,os
from PIL import Image,ImageDraw
O='/workspace/envio/ppfamilia12/cabecera_compare';os.makedirs(O+'/pruebas',exist_ok=True)
def pair(a,b,lab,out):
    A=Image.open(a).convert('RGB').resize((480,270));B=Image.open(b).convert('RGB').resize((480,270))
    I=Image.new('RGB',(960,300),'black');I.paste(B,(0,30));I.paste(A,(480,30))
    d=ImageDraw.Draw(I);d.text((8,8),'VIDEO '+lab,fill='white');d.text((488,8),'JUEGO v1.2 '+lab,fill='yellow');I.save(out)
def sheet(fs,out):
    ims=[Image.open(f) for f in fs];S=Image.new('RGB',(960,300*len(ims)));[S.paste(m,(0,300*i)) for i,m in enumerate(ims)];S.save(out,quality=80)
for l in open('cp.log'):
    if not l[:1].isalpha():continue
    k,js=l.split(' ',1);T=json.loads(js);seen=set();fs=[]
    for i,t in enumerate(T):
        if t in seen:continue
        seen.add(t);v=f'in/{k}_{round(t*2)+1:02d}.jpg'
        if not os.path.exists(v):continue
        f=f'{O}/pruebas/{k}_{len(fs):02d}.png';pair(f'sh/c_{k}_{i:02d}.png',v,f't={t:.2f}s',f);fs.append(f)
    sheet(fs[::2],f'{O}/pruebas/{k}_hoja.jpg')
T=json.loads(open('cab.log').read().strip().splitlines()[-1]);nx=0;fs=[]
for i,t in enumerate(T):
    if t+1e-6<nx:continue
    nx=t+0.5;v=f'vc/v_{min(88,round(t*4)+1):03d}.jpg'
    f=f'{O}/cab_{len(fs):02d}.png';pair(f'sh/cab_{i:03d}.png',v,f't={t:.2f}s',f);fs.append(f)
for j in range(0,len(fs),11):sheet(fs[j:j+11],f'{O}/cab_hoja_{j//11}.jpg')
print(len(fs))
