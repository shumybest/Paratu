package com.iot.paratu;

import android.os.Bundle;
import android.os.Handler;
import android.view.Window;
import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;

public class Splash extends Activity {

    private final int SPLASH_DISPLAY_LENGHT = 2000;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);  

        Resources res = getResources();  
        Drawable drawable = res.getDrawable(R.drawable.bkcolor);  
        this.getWindow().setBackgroundDrawable(drawable);

        setContentView(R.layout.activity_splash);
        
        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
            	Intent mainIntent = new Intent(Splash.this, Login.class);
                Splash.this.startActivity(mainIntent);
                Splash.this.finish();
            }
        }, SPLASH_DISPLAY_LENGHT);
    }
}