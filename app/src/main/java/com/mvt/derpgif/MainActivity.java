package com.mvt.derpgif;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.support.annotation.NonNull;
import android.view.KeyEvent;
import android.webkit.WebView;
import java.util.List;

public class MainActivity extends Activity {

    private WebView _webView;
    private static final int SPEECH_REQUEST_CODE = 0;

    @SuppressLint("SetJavaScriptEnabled")
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

    private void displaySpeechRecognizer() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);

        startActivityForResult(intent, SPEECH_REQUEST_CODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SPEECH_REQUEST_CODE && resultCode == RESULT_OK) {
            List<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);

            _webView.loadUrl("javascript:App.search('" + results.get(0) + "')");
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onKeyDown(int keyCode, @NonNull KeyEvent event) {
        if (event.getRepeatCount() % 10 == 0) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    _webView.loadUrl("javascript:App.previous()");
                    return true;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    _webView.loadUrl("javascript:App.next()");
                    return true;
                case KeyEvent.KEYCODE_SEARCH:
                    displaySpeechRecognizer();
                    return true;
            }
        }

        return super.onKeyDown(keyCode, event);
    }
}
