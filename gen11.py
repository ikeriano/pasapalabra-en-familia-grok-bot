import json,subprocess,os
exec(open('gen.py').read().split("D={'fr'")[0])  # reuse v1.0 definitions
RISTRA=["Villaviciosa","Guardamar","Alcorcón","Calatayud","Mondoñedo","Villanueva","Tordesillas","Sanlúcar","Ponferrada","Navalcarnero","Almendralejo","Torrelodones","Benicàssim","Valdepeñas","Medina del Campo"]
SUENA=[{"t":"La Macarena","p":["Es una canción de baile de los años noventa.","La cantaba un dúo sevillano.","Tiene una coreografía con los brazos que conoce todo el mundo.","Su protagonista es una chica con nombre de virgen sevillana.","Dale a tu cuerpo alegría…"],"ok":["macarena","lamacarena"]},
{"t":"Bailando","p":["Es una canción de dos mil catorce.","La canta Enrique Iglesias con Descemer Bueno y Gente de Zona.","Su videoclip tiene miles de millones de visitas.","El título es un gerundio.","Va de lo que se hace en una pista de baile."],"ok":["bailando"]},
{"t":"Despacito","p":["Es una canción de dos mil diecisiete.","La cantan Luis Fonsi y Daddy Yankee.","Fue el vídeo más visto de YouTube durante años.","El título es un adverbio en diminutivo.","Lo contrario de deprisa."],"ok":["despacito"]},
{"t":"Mediterráneo","p":["Es una canción de mil novecientos setenta y uno.","La canta Joan Manuel Serrat.","Habla de dónde nació el cantante: junto al mar.","Muchos la consideran la mejor canción española de la historia.","El título es el nombre de un mar."],"ok":["mediterraneo"]}]
CRUZ=[[["Fruta amarilla y alargada.","plá","tano"],["Animal que hace muuu.","va","ca"],["Lo usamos para ver la hora.","re","loj"],["Mueble para dormir.","ca","ma"],["Se pone en la cabeza contra el sol.","gor","ra"],["Se usa para escribir en la pizarra.","ti","za"]],
[["Ave que dice quiquiriquí.","ga","llo"],["Fruta roja con pepitas por fuera.","fre","sa"],["Sirve para abrir una puerta.","lla","ve"],["Pez grande con aletas que da miedo en las películas.","tibu","rón"],["Lugar con arena junto al mar.","pla","ya"],["Calzado para la lluvia.","bo","ta"]]]
fr['suena']=[t('sue0',"Esto me suena. Nuestra gramola nos da hasta cinco pistas de una canción. Pulsad cuanto antes: los segundos que ganáis son las pistas que quedan.")]
fr['cruz']=[t('cru0',"Palabras cruzadas. Os doy una definición y la respuesta está partida en dos columnas, desordenada. Tenéis que unir las dos mitades.")]
fr['ristra']=[t('ris0',"La ristra. Os voy diciendo nombres de pueblos de España. Hay que repetir la ristra entera, en orden, y cada vez se añade uno más.")]
for i,w in enumerate(RISTRA): t('rw%d'%i,w)
for i,s in enumerate(SUENA):
  for j,p in enumerate(s['p']): t('su%d_%d'%(i,j),p)
for e,c in enumerate(CRUZ):
  for i,x in enumerate(c): t('cz%d_%d'%(e,i),x[0])
DEP=[{"t":"Baño de Falete","w":[["Tinte",6],["Rulos",5],["Plancha",3],["Báscula",9],["Volantes",1],["Rímel",8],["Laca",2],["Peineta",4],["Abanico",7]]},
{"t":"Currículum de Ana Obregón","w":[["Bióloga",2],["Actriz",4],["Guionista",7],["Bailarina",5],["Presentadora",1],["Productora",9],["Directora",3],["Escritora",8],["Modelo",6]]},
{"t":"Cocina de la abuela","w":[["Puchero",3],["Delantal",7],["Rodillo",1],["Cazuela",9],["Mortero",5],["Croquetas",2],["Sartén",8],["Cucharón",4],["Torrijas",6]]},
{"t":"Maleta de vacaciones","w":[["Bañador",8],["Toalla",2],["Chanclas",6],["Crema",4],["Gafas",9],["Sombrero",1],["Cámara",5],["Pasaporte",3],["Cepillo",7]]}]
for p_,d_ in enumerate(DEP):
  for i,(w,n) in enumerate(d_["w"]): t('dw%d_%d'%(p_,i),w)
t('dep0',"¿Dónde están? Tenemos un panel con nueve casillas que esconden nueve palabras del tema que elijáis. Lo destapamos solo un par de segundos. Yo digo una palabra y me decís detrás de qué número está. Si acertáis, seguís. Si falláis, el turno pasa al compañero, todo se vuelve a tapar y empezamos desde cero. No se puede pasar palabra. Setenta y cinco segundos por equipo, y al acabar, tres segundos por cada palabra destapada.")
t('reg_cruz',"Palabras cruzadas. Os doy una definición y la respuesta está partida en dos columnas, desordenada. Tenéis que unir las dos mitades. Esta prueba no salió en el primer programa: esta explicación es de voz sintética.")
t('desp',"Esto ha sido Pasapalabra en familia. Gracias por jugar todos juntos.")
REGLAS=json.load(open('reglas.json'))
D={'fr':fr,'hd':hd,'de':de,'ro':ro,'pinta':PINTA,'ristra':RISTRA,'suena':SUENA,'cruz':CRUZ,'dep':DEP,'reglas':REGLAS,'L':L}
open('www/js/datos.js','w').write('window.PPF='+json.dumps(D,ensure_ascii=False)+';')
os.makedirs('/tmp/ppf11/wav',exist_ok=True)
for k in ['ris0']+[f'rw{i}' for i in range(12)]:
  if os.path.exists('www/tts/%s.mp3'%k): os.remove('www/tts/%s.mp3'%k)
for k,s in L.items():
  o='www/tts/%s.mp3'%k
  if os.path.exists(o): continue
  w='/tmp/ppf11/wav/%s.wav'%k
  subprocess.run(['/workspace/piperenv/bin/piper','-m','/workspace/piper/es_ES-davefx-medium.onnx','-f',w],input=s.encode(),check=True,stderr=subprocess.DEVNULL)
  subprocess.run(['ffmpeg','-v','error','-y','-i',w,'-ac','1','-b:a','40k',o],check=True); os.remove(w)
print('TTS OK',len(L))
