package com.youverse.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.splashscreen.SplashScreen;
import com.airbnb.lottie.LottieAnimationView;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        
        LottieAnimationView animationView = findViewById(R.id.lottieAnimationView);
        if (animationView != null) {
            animationView.setAnimation(R.raw.splash_animation);
            animationView.playAnimation();
        }
    }
}
