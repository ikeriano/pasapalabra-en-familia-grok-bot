package com.ikeriano.pasapalabrafamilia;
import android.app.Activity;import android.os.Bundle;import android.view.*;import android.webkit.*;import java.io.InputStream;
public class MainActivity extends Activity {
  WebView w;
  @Override protected void onCreate(Bundle b){super.onCreate(b);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    w=new WebView(this);setContentView(w);WebSettings s=w.getSettings();
    s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);
    w.setWebChromeClient(new WebChromeClient());
    w.setWebViewClient(new WebViewClient(){
      @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){
        android.net.Uri u=r.getUrl();if(!"appassets.local".equals(u.getHost()))return null;
        String p=u.getPath();if(p==null||p.equals("/"))p="/index.html";
        try{InputStream in=getAssets().open("www"+p);String e=p.substring(p.lastIndexOf('.')+1);
          String m=e.equals("html")?"text/html":e.equals("js")?"text/javascript":e.equals("css")?"text/css":e.equals("mp3")?"audio/mpeg":e.equals("png")?"image/png":e.equals("ttf")?"font/ttf":e.equals("json")?"application/json":"application/octet-stream";
          WebResourceResponse res=new WebResourceResponse(m,"utf-8",in);java.util.Map<String,String> h=new java.util.HashMap<>();h.put("Access-Control-Allow-Origin","*");res.setResponseHeaders(h);return res;}
        catch(Exception x){return new WebResourceResponse("text/plain","utf-8",404,"Not Found",null,null);}
      }});
    hide();w.loadUrl("https://appassets.local/index.html");}
  void hide(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);}
  @Override public void onWindowFocusChanged(boolean f){super.onWindowFocusChanged(f);if(f)hide();}
  @Override public void onBackPressed(){if(w.canGoBack())w.goBack();else super.onBackPressed();}
  @Override protected void onPause(){super.onPause();w.onPause();}
  @Override protected void onResume(){super.onResume();w.onResume();}
}
