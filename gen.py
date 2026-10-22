import json,hashlib,subprocess,os
g=json.load(open('/workspace/pp221/www/t5/ediciones/familia/guion.json'))
P={p['tipo']:p for p in g['pruebas']}
hd=[i for i in P['laPista']['items']]
de=P['tablero']['items']
ro=g['rosco']['p']
HIST=[
"Bienvenidos a La historia de Pasapalabra en familia. Pónganse cómodos, que esto va de familias, y en las familias siempre hay alguien que llega tarde.",
"Pasapalabra en familia se estrenó en Telecinco el dieciséis de abril de dos mil dieciocho, a la hora de comer. Así que medio país concursaba con la boca llena de macarrones.",
"Lo presentaba Christian Gálvez, el mismo de la tarde. Ese año comía y cenaba con el rosco. Literalmente.",
"Lo producía Xanela Producciones, y la idea era sencilla: dos familias de tres personas. La campeona, de naranja. La que llega, de azul. Como en las cenas de Navidad, pero con definiciones.",
"Las pruebas daban segundos: He dicho, Palabras cruzadas, Dónde están, Tú qué pintas, Esto me suena con su gramola, y La ristra, que es como intentar recordar la lista de la compra de tu abuela.",
"Y al final, El Rosco. Dos miembros de cada familia: uno contestaba de la A a la N, y el otro de la Eñe a la Zeta. Con ochenta y cinco segundos más los que hubieran ganado. Trabajo en equipo de verdad.",
"El primer programa lo vieron un millón ciento treinta y siete mil espectadores. La familia Herrera, Ana, Paz y Candela, ganó ese día y se quedó en el plató diecisiete programas. Casi les ponemos un sofá.",
"El bote crecía seis mil euros cada día, y llegó a ciento noventa y ocho mil euros en el programa treinta y tres, que es cuando por fin cayó. Imagínense la cena familiar de esa noche.",
"En total hubo cuarenta y un programas, hasta el catorce de junio de dos mil dieciocho. Al día siguiente llegó Ya es mediodía. Pero Pasapalabra en familia sigue aquí, en tu casa. Y en tu familia. Pasapalabra."]
PINTA={"tema":"En una boda","w":["tarta","anillo","novia","ramo","arroz","vals"]}
RISTRA=["casa","perro","luna","tren","queso","playa","reloj","nube","gafas","sol","libro","fresa"]
L={}
def t(k,s): L[k]=s; return k
fr={}
fr['pres']=[t('pres%d'%i,s) for i,s in enumerate(P['presentacion']['frases'])]
fr['hd']=[t('hdi%d'%i,s) for i,s in enumerate(P['laPista']['frases'])]
fr['de']=[t('dei%d'%i,s) for i,s in enumerate(P['tablero']['frases'])]
fr['ro']=[t('roi%d'%i,s) for i,s in enumerate(g['rosco']['frases'])]
fr['cierre']=[t('cie%d'%i,s) for i,s in enumerate(g['cierre'])]
fr['hist']=[t('his%d'%i,s) for i,s in enumerate(HIST)]
fr['pinta']=[t('pin0',"Tú qué pintas. Un miembro de la familia dibuja y los demás tienen que adivinar qué ha dibujado. El tema de hoy: en una boda.")]
fr['ristra']=[t('ris0',"La ristra. Hay que repetir la ristra de palabras sin equivocarse en el orden. Cada turno se añade una palabra nueva.")]
for k,s in [('ok',"¡Muy bien!"),('pasa',"Pasapalabra."),('tiempo',"¡Tiempo!"),('nopasa',"En esta prueba no se puede pasar palabra. Siempre hay que decir algo.")]: t(k,s)
for i,x in enumerate(hd): x['k']=t('hd%d'%i,x['q'])
for i,x in enumerate(de): x['k']=t('de%d'%i,x['q'])
for i,x in enumerate(ro):
  x['k']=t('ro%d'%i,("Con la %s: "%x['l'] if x['t']=='e' else "Contiene la %s: "%x['l'])+x['d'])
for i,w in enumerate(RISTRA): t('rw%d'%i,w)
D={'fr':fr,'hd':hd,'de':de,'ro':ro,'pinta':PINTA,'ristra':RISTRA,'L':L}
open('www/js/datos.js','w').write('window.PPF='+json.dumps(D,ensure_ascii=False)+';')
os.makedirs('/tmp/ppf/wav',exist_ok=True)
for k,s in L.items():
  o='www/tts/%s.mp3'%k
  if os.path.exists(o): continue
  w='/tmp/ppf/wav/%s.wav'%k
  subprocess.run(['/workspace/piperenv/bin/piper','-m','/workspace/piper/es_ES-davefx-medium.onnx','-f',w],input=s.encode(),check=True,stderr=subprocess.DEVNULL)
  subprocess.run(['ffmpeg','-v','error','-y','-i',w,'-ac','1','-b:a','40k',o],check=True); os.remove(w)
print(len(L))
