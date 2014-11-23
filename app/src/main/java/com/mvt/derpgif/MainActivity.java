package com.mvt.derpgif;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.KeyEvent;
import android.webkit.WebView;

public class MainActivity extends Activity {

    private WebView _webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        _webView = (WebView) findViewById(R.id.web_view);
        _webView.setFocusable(false);
        _webView.getSettings().setJavaScriptEnabled(true);
        _webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        _webView.loadUrl("file:///android_asset/main.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, @NonNull KeyEvent event) {
        if (event.getRepeatCount() % 10 == 0) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    _webView.loadUrl("javascript:App.previous()");
                    return true;
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    _webView.loadUrl("javascript:App.next()");
                    return true;
            }
        }

        return super.onKeyDown(keyCode, event);
    }
}
