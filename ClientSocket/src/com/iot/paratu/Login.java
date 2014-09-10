package com.iot.paratu;

import org.json.JSONException;

import com.iot.db.ParatuUser;
import com.iot.helper.ParatuActivity;
import com.iot.helper.ParatuUtil;
import com.iot.services.SocketThread;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Html;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class Login extends ParatuActivity {
	private UserLoginTask mAuthTask = null;
	private String mUserNameOrEmail;
	private String mPassword;

	private EditText mUserNameOrEmailView;
	private EditText mPasswordView;
	private View mLoginFormView;
	private View mLoginStatusView;
	private TextView mLoginStatusMessageView;
	private TextView mRegisterView;
	private TextView mResetPasswordView;
	private Button loginButton;
	
    private SocketBroadcastListener socketBCListener;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);

		setContentView(R.layout.activity_login);
		socketBCListener = new SocketBroadcastListener();

		mUserNameOrEmailView = (EditText) findViewById(R.id.userName);

		mPasswordView = (EditText) findViewById(R.id.password);
		mPasswordView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == EditorInfo.IME_ACTION_GO) {
							attemptLogin();
							ParatuUtil.hideIME(getApplicationContext(), textView);
							return true;
						}
						return false;
					}
				});

		mLoginFormView = findViewById(R.id.login_form);
		mLoginStatusView = findViewById(R.id.login_status);
		setProgressViews(mLoginFormView, mLoginStatusView);

		mLoginStatusMessageView = (TextView) findViewById(R.id.login_status_message);

		myClickListener clickListener = new myClickListener(getApplicationContext());

		loginButton = (Button) findViewById(R.id.sign_in_button);
		loginButton.setOnClickListener(clickListener);

		mRegisterView = (TextView) findViewById(R.id.action_register);
		mRegisterView.setText(Html.fromHtml("<u>"
				+ mRegisterView.getText().toString() + "</u>"));

		mRegisterView.setOnClickListener(clickListener);

		mResetPasswordView = (TextView) findViewById(R.id.action_forgetPassword);
		mResetPasswordView.setText(Html.fromHtml("<u>"
				+ mResetPasswordView.getText().toString() + "</u>"));

		mResetPasswordView.setOnClickListener(clickListener);
	}
	
	public void onBackPressed () {
		android.os.Process.killProcess(android.os.Process.myPid());
		System.exit(0);
	}

	protected void onStart() {
		super.onStart();
		
		ParatuUser user = mDbManager.queryCurrentActiveUser();
		if ((!user.username.isEmpty()) && (!user.password.isEmpty())) {
			Log.d("IotActivityLogin", "Userinfo found in DB, directly login");

			Intent intent = new Intent();
			intent.setClass(Login.this, UserHomepage.class);
			startActivity(intent);
			Login.this.finish();
		}
		
		mBroadcastMgr.registerReceiver(socketBCListener, socketBCListener.getFilter());
	}

	protected void onStop() {
		mBroadcastMgr.unregisterReceiver(socketBCListener);
		super.onStop();
	}

	protected void onDestory() {
		super.onDestroy();
	}
	
	class SocketBroadcastListener extends BroadcastReceiver {
		public IntentFilter getFilter() {
			IntentFilter filter = new IntentFilter();
			filter.addAction(SocketThread.BROADCAST_PARATU_SOCKET_CONNECTED);
			return filter;
		}
		
		@Override
		public void onReceive(Context ctx, Intent intent) {
			if (intent.getAction().equals(SocketThread.BROADCAST_PARATU_SOCKET_CONNECTED)) {
				Toast.makeText(getApplicationContext(),	R.string.connected,
						Toast.LENGTH_SHORT).show();
			}
		}
	}

	class myClickListener implements OnClickListener {
		Context mContext;
		public myClickListener(Context applicationContext) {
			mContext = applicationContext;
		}

		public void onClick(View v) {
			if (loginButton == v) {
				ParatuUtil.hideIME(mContext, v);
				attemptLogin();
			} else if (mRegisterView == v) {
				Intent intent = new Intent();
				intent.setClass(Login.this, Register.class);
				startActivity(intent);
			} else if (mResetPasswordView == v) {
				Intent intent = new Intent();
				intent.setClass(Login.this, ResetPassword.class);
				startActivity(intent);
			}
		}
	}

	private void attemptLogin() {
		if (mAuthTask != null) {
			return;
		}

		mUserNameOrEmailView.setError(null);
		mPasswordView.setError(null);

		mUserNameOrEmail = mUserNameOrEmailView.getText().toString();
		mPassword = mPasswordView.getText().toString();

		boolean cancel = false;
		View focusView = null;

		if (mUserNameOrEmail.isEmpty()) {
			mUserNameOrEmailView
					.setError(getString(R.string.error_field_required));
			focusView = mUserNameOrEmailView;
			cancel = true;
		}

		if (mPassword.isEmpty()) {
			mPasswordView.setError(getString(R.string.error_field_required));
			focusView = mPasswordView;
			cancel = true;
		} else if (mPassword.length() < 4) {
			mPasswordView.setError(getString(R.string.error_invalid_password));
			focusView = mPasswordView;
			cancel = true;
		}

		if (cancel) {
			focusView.requestFocus();
		} else {
			ParatuUser user = new ParatuUser(mUserNameOrEmail, mUserNameOrEmail, mPassword);
			if(!mDbManager.isUserExist(mUserNameOrEmail)) {
				mDbManager.addUser(user);
			}

			Log.d("IotActivityLogin", "Login");

			try {
				mLoginStatusMessageView.setText(R.string.login_progress_signing_in);
				showProgress(true);
				mAuthTask = new UserLoginTask();
				mAuthTask.execute(user.toJsonString("login"), mUserNameOrEmail, mPassword);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	private class UserLoginTask extends AsyncTask<String, Void, String> {
		protected String doInBackground(String... args) {
			try {			
				if(mService != null){
					return mService.sendAndExpect(args[0], "res");
				} else {
					return "";
				}
				
			} catch (Throwable e) {
				e.printStackTrace();
			}
			
			return "";
		}

		@Override
		protected void onPostExecute(final String result) {
			mAuthTask = null;
			showProgress(false);

			if (result.contains("login success")) {
				Toast.makeText(getApplicationContext(),
						R.string.Login_successfully,
						Toast.LENGTH_SHORT).show();
				
				mDbManager.setUserActive(mUserNameOrEmail);
				
				Intent intent = new Intent();
				intent.setClass(Login.this, UserHomepage.class);
				startActivity(intent);
				Login.this.finish();
			} else {
				Toast.makeText(getApplicationContext(),
						R.string.error_user_info_not_correct,
						Toast.LENGTH_SHORT).show();
			}
		}

		@Override
		protected void onCancelled() {
			mAuthTask = null;
			showProgress(false);
		}
	}

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
		}
	};
}