package com.example.loklok_clone_android_wrapper;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GestureDetectorCompat;

public class LockScreenActivity extends AppCompatActivity {
    private GestureDetectorCompat mDetector;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        showWhenLockedAndTurnScreenOn();
        super.onCreate(savedInstanceState);
        setContentView(R.layout.lock_screen);
        WebView wv = (WebView) findViewById(R.id.webview);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });
        wv.loadUrl("demo--loklok-clone.netlify.app/canvas");
        wv.setBackgroundColor(Color.TRANSPARENT);

        mDetector = new GestureDetectorCompat(this, new GestureDetector.SimpleOnGestureListener() {
            @Override
            public boolean onDown(MotionEvent event) {
                Log.d("GESTURE","onDown: " + event.toString());
                return true;
            }

            @Override
            public boolean onDoubleTapEvent(MotionEvent event) {
                Log.d("GESTURE","onDown: " + event.toString());
                openEditMode();
                return true;
            }
        });

        getSupportActionBar().hide();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event){
        this.mDetector.onTouchEvent(event);
        return super.onTouchEvent(event);
    }

    private void openEditMode() {
        Intent intent = new Intent(this, EditActivity.class);
        startActivity(intent);

    }

    private void showWhenLockedAndTurnScreenOn() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1){
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }
    }
}
