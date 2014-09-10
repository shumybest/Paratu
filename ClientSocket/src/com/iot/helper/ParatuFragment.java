package com.iot.helper;

import com.iot.db.ParatuDBManager;
import com.iot.services.SocketThread;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.os.Build;
import android.support.v4.app.Fragment;
import android.support.v4.content.LocalBroadcastManager;
import android.view.View;

@SuppressLint("ValidFragment")
public class ParatuFragment extends Fragment {
	protected ParatuDBManager mDbManager;
	protected SocketThread mService;

	private View mRealView = null;
	private View mStatusView = null;
	protected LocalBroadcastManager mBroadcastMgr;

	public void setServices(SocketThread service, ParatuDBManager dbMgr) {
		mService = service;
		mDbManager = dbMgr;
	}

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		setRetainInstance(true);
		mBroadcastMgr = LocalBroadcastManager.getInstance(activity);
	}

	public void setProgressViews(View real, View progress) {
		mRealView = real;
		mStatusView = progress;
	}

	@TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
	public void showProgress(final boolean show) {
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
				mStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
				mRealView.setVisibility(show ? View.GONE : View.VISIBLE);
			}
		}
	}

	public void doSomething() {		
	}
}
