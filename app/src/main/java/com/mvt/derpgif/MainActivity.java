package com.mvt.derpgif;

import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebView;

import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.HeadersCallback;
import com.koushikdutta.ion.HeadersResponse;
import com.koushikdutta.ion.Ion;
import com.koushikdutta.ion.Response;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private WebView _webView;
    private List<String> _pastGifUrls;
    private int _currentGifIndex;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        _webView = (WebView) findViewById(R.id.web_view);
        _webView.setFocusable(false);
        _webView.getSettings().setJavaScriptEnabled(true);
        _webView.loadUrl("file:///android_asset/content.html");

        _pastGifUrls = new ArrayList<String>();

        loadNewGif();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (event.getRepeatCount() == 0) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_DPAD_CENTER:
                    return true;
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    loadPreviousGif();
                    return true;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    loadNextGif();
                    return true;
            }
        }

        return super.onKeyDown(keyCode, event);
    }

    private void loadPreviousGif() {
        if (_currentGifIndex > 0) {
            clearGif();

            String gifUrl = _pastGifUrls.get(--_currentGifIndex);
            loadGif(gifUrl);
        }
    }

    private void loadNextGif() {
        clearGif();

        int size = _pastGifUrls.size();
        if (_currentGifIndex < size - 1) {
            String gifUrl = _pastGifUrls.get(++_currentGifIndex);
            loadGif(gifUrl);
        }
        else {
            loadNewGif();
        }
    }

    private void loadNewGif() {
        Ion.with(MainActivity.this)
            .load("http://gifs.com/r.json")
            .setTimeout(5000)
            .asJsonObject()
            .withResponse()
            .setCallback(new FutureCallback<Response<JsonObject>>() {
                @Override
                public void onCompleted(Exception e, Response<JsonObject> result) {
                    if (e != null) {
                        e.printStackTrace();
                    }
                    else {
                        String gifUrl = result.getResult().get("gif_url").getAsString();
                        Log.i("MainActivity", "Loading GIF:" + gifUrl);
                        if (!TextUtils.isEmpty(gifUrl)) {
                            loadGifIfAvailable(gifUrl);
                        }
                    }
                }
            });
    }

    private void loadGifIfAvailable(final String gifUrl) {
        Ion.with(MainActivity.this)
            .load("HEAD", gifUrl)
            .setTimeout(5000)
            .onHeaders(new HeadersCallback() {
                @Override
                public void onHeaders(HeadersResponse headers) {
                    Log.i("MainActivity", "HTTP Code:" + headers.code());

                    if (headers.code() < 400) {
                        _pastGifUrls.add(gifUrl);
                        _currentGifIndex++;
                        loadGif(gifUrl);
                    }
                }
            })
            .asInputStream();
    }

    private void clearGif() {
        _webView.loadUrl("javascript:clearGif()");
    }

    private void loadGif(final String gifUrl) {
        _webView.loadUrl("javascript:setGifUrl('" + gifUrl + "', false)");
    }
}
