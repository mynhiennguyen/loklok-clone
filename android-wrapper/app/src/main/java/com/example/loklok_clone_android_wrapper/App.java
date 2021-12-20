package com.example.loklok_clone_android_wrapper;

import android.app.*;
import android.app.Application;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.res.ResourcesCompat;

public class App extends Application {

private String CHANNEL_ID = "heads_up_alerts";
private String CHANNEL_NAME = "Heads Up Alerts";

private NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        notificationManager.notify(1, createNotification());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationChannel notificationChannel = new NotificationChannel(
                CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);

        notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

        notificationManager.createNotificationChannel(notificationChannel);
        }

    private Notification createNotification() {
        Intent contentIntent = new Intent(this, MainActivity.class);
        PendingIntent contentPendingIntent =
        PendingIntent.getActivity(this, 0, contentIntent, 0);

        Intent fullScreenIntent = new Intent(this, LockScreenActivity.class);
        PendingIntent fullScreenPendingIntent =
        PendingIntent.getActivity(this, 0, fullScreenIntent, 0);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                // .setSmallIcon(R.drawable.notifications_active_black_24)
        // .setColor(ResourcesCompat.getColor(resources, R.color.purple_200, null))
        .setContentTitle("Heads Up Notification")
        .setAutoCancel(true)
        .setContentIntent(contentPendingIntent)
        .setFullScreenIntent(fullScreenPendingIntent, true)
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setCategory(NotificationCompat.CATEGORY_ALARM)
        .build();
        }

        }