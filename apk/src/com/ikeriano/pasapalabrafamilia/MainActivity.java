package com.ikeriano.pasapalabrafamilia;
import android.app.Activity;import android.os.Bundle;import android.view.*;import android.webkit.*;import java.io.InputStream;
public class MainActivity extends Activity {
  WebView w;
  static final java.util.Map<String,String> MT=new java.util.HashMap<>();
  static{String[] a={"html","text/html","htm","text/html","js","text/javascript","mjs","text/javascript","css","text/css","json","application/json","mp3","audio/mpeg","wav","audio/wav","ogg","audio/ogg","mp4","video/mp4","webm","video/webm","png","image/png","jpg","image/jpeg","jpeg","image/jpeg","gif","image/gif","webp","image/webp","svg","image/svg+xml","ttf","font/ttf","otf","font/otf","woff","font/woff","woff2","font/woff2","glb","model/gltf-binary","txt","text/plain"};for(int i=0;i<a.length;i+=2)MT.put(a[i],a[i+1]);}
  @Override protected void onCreate(Bundle b){super.onCreate(b);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    w=new WebView(this);setContentView(w);WebSettings s=w.getSettings();
    s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);
    w.setWebChromeClient(new WebChromeClient());
    w.setWebViewClient(new WebViewClient(){
      @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){
        android.net.Uri u=r.getUrl();if(!"appassets.local".equals(u.getHost()))return null;
        String p=u.getPath();if(p==null||p.equals("/"))p="/index.html";
        try{InputStream in=getAssets().open("www"+android.net.Uri.decode(p));String e=p.substring(p.lastIndexOf('.')+1).toLowerCase();
          String m=MT.containsKey(e)?MT.get(e):"application/octet-stream";WebResourceResponse res=new WebResourceResponse(m,"utf-8",in);java.util.Map<String,String> h=new java.util.HashMap<>();h.put("Access-Control-Allow-Origin","*");res.setResponseHeaders(h);return res;}
        catch(Exception x){return new WebResourceResponse("text/plain","utf-8",404,"Not Found",new java.util.HashMap<String,String>(),new java.io.ByteArrayInputStream(new byte[0]));}
      }});
    hide();w.loadUrl("https://appassets.local/index.html");}
  void hide(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);}
  @Override public void onWindowFocusChanged(boolean f){super.onWindowFocusChanged(f);if(f)hide();}
  @Override public void onBackPressed(){w.evaluateJavascript("window.__ppfAtras?String(window.__ppfAtras()):'false'",r->{if(!"\"true\"".equals(r)){if(w.canGoBack())w.goBack();else finish();}});}
  @Override protected void onPause(){super.onPause();w.onPause();}
  @Override protected void onResume(){super.onResume();w.onResume();}
}
