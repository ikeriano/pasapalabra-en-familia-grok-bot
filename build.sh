#!/bin/bash
# Build APK + instalador Windows de Pasapalabra en familia. Uso: ./build.sh 1.1
set -e; V=${1:-1.1}; cd "$(dirname "$0")"; B=$(mktemp -d /tmp/ppfbuild.XXXX); BT=/home/box/android-sdk/build-tools/34.0.0; AJ=/home/box/android-sdk/platforms/android-34/android.jar
SP=$(grep storepass keystore/LEEME.txt | sed 's/.*: //'); KP=$(grep -i keypass keystore/LEEME.txt | sed 's/.*: //'); KP=${KP:-$SP}
$BT/aapt2 compile --dir apk/res -o $B/res.zip
$BT/aapt2 link -o $B/base.apk -I $AJ --manifest apk/AndroidManifest.xml -R $B/res.zip --java $B/gen
mkdir -p $B/cls; /home/box/jdk17/bin/javac -source 8 -target 8 -nowarn -cp $AJ -d $B/cls $(find apk/src $B/gen -name '*.java') 2>/dev/null
$BT/d8 --min-api 21 --output $B $(find $B/cls -name '*.class')
python3 - "$B" <<'P'
import zipfile,os,sys;B=sys.argv[1];src=zipfile.ZipFile(B+'/base.apk');o=zipfile.ZipFile(B+'/u.apk','w')
for i in src.infolist():o.writestr(i,src.read(i.filename))
o.write(B+'/classes.dex','classes.dex',zipfile.ZIP_DEFLATED)
for r,d,f in os.walk('www'):
  for n in f:
    p=os.path.join(r,n);a='assets/'+os.path.relpath(p,'www');o.write(p,a,zipfile.ZIP_STORED if n.endswith(('.mp4','.mp3','.png')) else zipfile.ZIP_DEFLATED)
o.close()
P
$BT/zipalign -f -p 4 $B/u.apk $B/a.apk
$BT/apksigner sign --ks keystore/pasapalabrafamilia.jks --ks-key-alias ppfamilia --ks-pass pass:$SP --key-pass pass:$KP --out PasapalabraEnFamilia-$V.apk $B/a.apk
$BT/apksigner verify --print-certs PasapalabraEnFamilia-$V.apk | grep SHA-256
# Windows
W=win/dist/win-unpacked; rm -rf win/dist; mkdir -p $W; python3 -c "import zipfile;zipfile.ZipFile('/home/box/.cache/electron/electron-v31.7.7-win32-x64.zip').extractall('$W')"
rm -f $W/resources/default_app.asar; mkdir -p $W/resources/app; cp /workspace/pc/tpl/app/main.js /workspace/pc/tpl/app/preload.js $W/resources/app/
echo '{"nombre":"Pasapalabra en familia","port":47851}' > $W/resources/app/juego.json; echo '{"name":"pasapalabra-en-familia","version":"'$V'.0","main":"main.js"}' > $W/resources/app/package.json
cp -r www $W/resources/app/www
python3 -c "from PIL import Image;Image.open('www/icon.png').convert('RGBA').resize((256,256)).save('win/app.ico',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])"
mv $W/electron.exe "$W/Pasapalabra en familia.exe"
NODE_PATH=/tmp/ppf12/rs/node_modules node -e "
const R=require('resedit'),fs=require('fs');const f='$W/Pasapalabra en familia.exe';const exe=R.NtExecutable.from(fs.readFileSync(f));const res=R.NtExecutableResource.from(exe);
const ico=R.Data.IconFile.from(fs.readFileSync('win/app.ico'));R.Resource.IconGroupEntry.replaceIconsForResource(res.entries,1,1033,ico.icons.map(i=>i.data));
const vi=R.Resource.VersionInfo.fromEntries(res.entries)[0];vi.setStringValues({lang:1033,codepage:1200},{ProductName:'Pasapalabra en familia',FileDescription:'Pasapalabra en familia',CompanyName:'Ikeriano',OriginalFilename:'Pasapalabra en familia.exe'});
vi.setFileVersion($(echo $V|tr . ,),0,0);vi.setProductVersion($(echo $V|tr . ,),0,0);vi.outputToResourceEntries(res.entries);res.outputResource(exe);fs.writeFileSync(f,Buffer.from(exe.generate()));console.log('icono OK')"
(cd win && makensis -V2 installer.nsi) && mv win/PasapalabraEnFamilia-$V-Windows-Setup.exe .
rm -rf win/dist $B; sha256sum PasapalabraEnFamilia-$V.apk PasapalabraEnFamilia-$V-Windows-Setup.exe
