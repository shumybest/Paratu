package com.iot.helper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.iot.db.ParatuDBManager;
import com.iot.services.SocketThread;
import com.iot.services.SocketThread.SockBinder;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.view.View;

public class ParatuActivity extends Activity {
	protected boolean mBound = false;
	public SocketThread mService;
	protected ParatuDBManager mDbManager;
	protected LocalBroadcastManager mBroadcastMgr;

	private View mRealView = null;
	private View mStatusView = null;

	protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);
        mDbManager = new ParatuDBManager(this);
        mBroadcastMgr = LocalBroadcastManager.getInstance(this);
    }
    
    protected void onDestroy() {  
    	mDbManager.closeDB();
        super.onDestroy();  
    }
    
	protected void onStart() {
		super.onStart();

		Log.d("IotParatuActivity",
				"Starting service: " + SocketThread.class.getName());

		Intent intent = new Intent(SocketThread.class.getName());
		this.startService(intent);

		if (true == bindService(intent, mSockConnector, BIND_AUTO_CREATE)) {
			Log.d("IotParatuActivity", "Serivce Bind OK for mSockConnector");
		} else {
			Log.d("IotParatuActivity", "Serivce Bind Fail for mSockConnector");
		}
	}

	protected void onStop() {
		Log.d("IotParatuActivity", "unBind Serivce");

		if (mBound) {
			unbindService(mSockConnector);
			mBound = false;
		}

		Intent intent = new Intent(SocketThread.class.getName());
		this.stopService(intent);
		super.onStop();
	}

	private ServiceConnection mSockConnector = new ServiceConnection() {
		public void onServiceConnected(ComponentName className, IBinder service) {
			SockBinder binder = (SockBinder) service;
			mService = binder.getSockThread();
			mBound = true;
			if (null != mService) {
				Log.d("IotParatuActivity", "Serivce Bind OK");
				mBroadcastMgr.sendBroadcast(new Intent(SocketThread.BROADCAST_PARATU_SERVICE_BINDED));
			}
		}

		public void onServiceDisconnected(ComponentName arg0) {
			mBound = false;
		}
	};

	public void setProgressViews(View real, View progress) {
		mRealView = real;
		mStatusView = progress;
	}

	/**
	 * Shows the progress UI and hides the login form.
	 */
	@TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
	protected void showProgress(final boolean show) {
		if (mRealView != null && mStatusView != null) {

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
				int shortAnimTime = getResources().getInteger(
						android.R.integer.config_shortAnimTime);

				mStatusView.setVisibility(View.VISIBLE);
				mStatusView.animate().setDuration(shortAnimTime)
						.alpha(show ? 1 : 0)
						.setListener(new AnimatorListenerAdapter() {
							@Override
							public void onAnimationEnd(Animator animation) {
								mStatusView.setVisibility(show ? View.VISIBLE
										: View.GONE);
							}
						});

				mRealView.setVisibility(View.VISIBLE);
				mRealView.animate().setDuration(shortAnimTime)
						.alpha(show ? 0 : 1)
						.setListener(new AnimatorListenerAdapter() {
							@Override
							public void onAnimationEnd(Animator animation) {
								mRealView.setVisibility(show ? View.GONE
										: View.VISIBLE);
							}
						});
			} else {
				// The ViewPropertyAnimator APIs are not available, so simply
				// show
				// and hide the relevant UI components.
				mStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
				mRealView.setVisibility(show ? View.GONE : View.VISIBLE);
			}
		}
	}
	
	public boolean isEmail(String email) {
		String str = "^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$";
		Pattern p = Pattern.compile(str);
		Matcher m = p.matcher(email);
		return m.matches();
	}
}
