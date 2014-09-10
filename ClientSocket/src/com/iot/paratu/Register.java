package com.iot.paratu;

import org.json.JSONException;


import com.iot.db.ParatuUser;
import com.iot.helper.ParatuActivity;
import com.iot.helper.ParatuUtil;

import android.os.AsyncTask;
import android.os.Bundle;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class Register extends ParatuActivity {

	// Keep track of the login task to ensure we can cancel it if requested.
	private UserRegisterTask mAuthTask = null;
	// Values for phone number and password at the time of the register attempt.
	private String mUserName;
	private String mPassword;
	private String mPasswordConfirm;
	private String mEmail;

	// UI references.
	private EditText mUserNameView;
	private EditText mPasswordView;
	private EditText mPasswordConfirmView;
	private EditText mEmailView;
	private View mRegisterFormView;
	private View mRegisterStatusView;
	private TextView mRegisterStatusMessageView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);

		setContentView(R.layout.activity_register);

		mRegisterFormView = findViewById(R.id.register_form);
		mRegisterStatusView = findViewById(R.id.register_status);
		setProgressViews(mRegisterFormView, mRegisterStatusView);

		mRegisterStatusMessageView = (TextView) findViewById(R.id.register_status_message);
		mUserNameView = (EditText) findViewById(R.id.userName);
		mPasswordView = (EditText) findViewById(R.id.password);

		mPasswordConfirmView = (EditText) findViewById(R.id.password_confirm);
		mPasswordConfirmView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == EditorInfo.IME_ACTION_GO) {
							
							attemptRegister();
							ParatuUtil.hideIME(getApplicationContext(), textView);
							
							return true;
						}
						return false;
					}
				});

		mEmailView = (EditText) findViewById(R.id.email);

		findViewById(R.id.register_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						attemptRegister();
					}
				});

	}

	protected void onStart() {
		super.onStart();
	}

	protected void onStop() {
		super.onStop();
	}

	protected void onDestory() {
		super.onDestroy();
	}

	/**
	 * Attempts to register the account specified by the login form. If there
	 * are form errors (invalid phone number, missing fields, etc.), the errors
	 * are presented and no actual login attempt is made.
	 */
	@SuppressLint("ShowToast")
	private void attemptRegister() {
		if (mAuthTask != null) {
			return;
		}
		// Reset errors.
		mUserNameView.setError(null);
		mPasswordView.setError(null);
		mPasswordConfirmView.setError(null);
		mEmailView.setError(null);

		// Store values at the time of the login attempt.
		mUserName = mUserNameView.getText().toString();
		mPassword = mPasswordView.getText().toString();
		mPasswordConfirm = mPasswordConfirmView.getText().toString();
		mEmail = mEmailView.getText().toString();

		boolean cancel = false;
		View focusView = null;

		// Check for a valid user name.
		if (mUserName.isEmpty()) {
			mUserNameView.setError(getString(R.string.error_field_required));
			focusView = mUserNameView;
			cancel = true;
		}
		// Check for a valid password.
		if (mPassword.isEmpty()) {
			mPasswordView.setError(getString(R.string.error_field_required));
			focusView = mPasswordView;
			cancel = true;
		} else if (mPassword.length() < 4) {
			mPasswordView.setError(getString(R.string.error_invalid_password));
			focusView = mPasswordView;
			cancel = true;
		} else if (mPasswordConfirm.isEmpty()) {
			mPasswordConfirmView
					.setError(getString(R.string.error_field_required));
			focusView = mPasswordConfirmView;
			cancel = true;
		} else if (mPasswordConfirm.length() < 4) {
			mPasswordConfirmView
					.setError(getString(R.string.error_invalid_password));
			focusView = mPasswordConfirmView;
			cancel = true;
		} else if (false == mPassword.equals(mPasswordConfirm)) {
			mPasswordConfirmView
					.setError(getString(R.string.error_mismatch_password));
			focusView = mPasswordConfirmView;
			cancel = true;
		}

		// Check for a valid phone number.
		if (mEmail.isEmpty()) {
			mEmailView.setError(getString(R.string.error_field_required));
			focusView = mEmailView;
			cancel = true;
		} else if (!isEmail(mEmail)) {
			mEmailView.setError(getString(R.string.error_invalid_email_add));
			focusView = mEmailView;
			cancel = true;
		}

		if (cancel) {
			focusView.requestFocus();
		} else {
			ParatuUser user = new ParatuUser(mUserName, mEmail, mPassword);

			try {
				mRegisterStatusMessageView.setText(R.string.action_register_short);
				showProgress(true);
				mAuthTask = new UserRegisterTask();
				mAuthTask.execute(user.toJsonString("register"));
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	private class UserRegisterTask extends AsyncTask<String, Void, String> {
		@Override
		protected String doInBackground(String... args) {
			try {
				if(mService != null){
					return mService.sendAndExpect(args[0], "register success");
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

			if (result.contains("register success")) {
				Toast.makeText(getApplicationContext(),
						R.string.register_status_success, Toast.LENGTH_SHORT).show();

				Intent intent = new Intent();
				intent.setClass(Register.this, Login.class);
				startActivity(intent);
				Register.this.finish();
			} else {
				Toast.makeText(getApplicationContext(),
						R.string.register_status_fail, Toast.LENGTH_SHORT).show();
			}
		}

		@Override
		protected void onCancelled() {
			mAuthTask = null;
			showProgress(false);
		}
	}

}
