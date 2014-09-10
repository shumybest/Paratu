package com.iot.paratu;

import org.json.JSONException;

import com.iot.db.ParatuUser;
import com.iot.helper.ParatuActivity;

import android.os.AsyncTask;
import android.os.Bundle;
import android.content.Intent;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class ResetPassword extends ParatuActivity {

	// Keep track of the login task to ensure we can cancel it if requested.
	private UserResetPasswordTask mAuthTask = null;
	private String mUserName;
	private String mEmail;
	

	// UI references.
	private View mResetPasswordFormView;
	private View mResetPasswordStatusView;
	private TextView mResetPasswordStatusMessageView;
	private EditText mUserNameView;
	private EditText mEmailView;
	

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);

		setContentView(R.layout.activity_reset_password);

		mResetPasswordFormView = findViewById(R.id.reset_password_form);
		mResetPasswordStatusView = findViewById(R.id.reset_password_status);
		setProgressViews(mResetPasswordFormView, mResetPasswordStatusView);
		
		mResetPasswordStatusMessageView = (TextView) findViewById(R.id.reset_password_status_message);

		mUserNameView = (EditText) findViewById(R.id.userName);

		mEmailView = (EditText) findViewById(R.id.email_add);
		mEmailView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == R.id.email_add
								|| id == EditorInfo.IME_NULL) {
							return true;
						}
						return false;
					}
				});

	

		findViewById(R.id.confirm_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						attemptResetPassword();
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

	private void attemptResetPassword() {

		mUserNameView.setError(null);
		mEmailView.setError(null);


		mUserName = mUserNameView.getText().toString();
		mEmail = mEmailView.getText().toString();


		boolean cancel = false;
		View focusView = null;

		// Check for a valid user name or phone number.
		if (mUserName.isEmpty()) {
			mUserNameView
					.setError(getString(R.string.error_field_required));
			focusView = mUserNameView;
			cancel = true;
		}

		// Check for a valid password.
		if (mEmail.isEmpty()) {
			mEmailView.setError(getString(R.string.error_field_required));
			focusView = mEmailView;
			cancel = true;
		} else if (!isEmail(mEmail)) {
			mEmailView.setError(getString(R.string.error_invalid_password));
			focusView = mEmailView;
			cancel = true;
		} 

		if (cancel) {
			focusView.requestFocus();
		} else {
			ParatuUser user = new ParatuUser(mUserName, mEmail, "");

			try {
				mResetPasswordStatusMessageView.setText(R.string.reset_password);
				showProgress(true);
				mAuthTask = new UserResetPasswordTask();
				mAuthTask.execute(user.toJsonString("forgetPassword"));
			} catch (JSONException e) {
				e.printStackTrace();
			}

		}
	}

	// Represents an asynchronous reset password task for user.
	private class UserResetPasswordTask extends AsyncTask<String, Void, String> {
		@Override
		protected String doInBackground(String... args) {
			try {
				if(mService != null) {
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

			if (result.contains("reset password success")) {
				Toast.makeText(getApplicationContext(),
						R.string.reset_password_status_success,
						Toast.LENGTH_SHORT).show();

				Intent intent = new Intent();
				intent.setClass(ResetPassword.this, Login.class);
				startActivity(intent);
				ResetPassword.this.finish();
			} else {
				Toast.makeText(getApplicationContext(),
								R.string.reset_password_status_fail,
								Toast.LENGTH_SHORT).show();
			}
		}

		@Override
		protected void onCancelled() {
			mAuthTask = null;
			showProgress(false);
		}
	}

}
