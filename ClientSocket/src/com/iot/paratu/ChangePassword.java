package com.iot.paratu;

import org.json.JSONException;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.iot.db.ParatuUser;
import com.iot.helper.ParatuActivity;

public class ChangePassword  extends ParatuActivity {
	private UserChangePasswordTask mchPasswdTask = null;
	
	private String mUserName;
	private String mPassword;
	private String mPasswordConfirm;

	private EditText mUserNameView;
	private EditText mPasswordView;
	private EditText mPasswordConfirmView;
	
	private View mChangePasswordFormView;
	private View mChangePasswordStatusView;
	private TextView mChangePasswordStatusMessageView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.activity_change_password);
		
		mChangePasswordFormView = findViewById(R.id.changepassword_form);
		mChangePasswordStatusView = findViewById(R.id.changepassword_status);
		setProgressViews(mChangePasswordFormView, mChangePasswordStatusView);
		
		mChangePasswordStatusMessageView = (TextView) findViewById(R.id.changepassword_status_message);

		mUserNameView = (EditText) findViewById(R.id.userName);

		mPasswordView = (EditText) findViewById(R.id.password);
		mPasswordView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == R.id.register_password
								|| id == EditorInfo.IME_NULL) {
							return true;
						}
						return false;
					}
				});

		mPasswordConfirmView = (EditText) findViewById(R.id.password_confirm);
		mPasswordConfirmView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == R.id.register_password_confirm
								|| id == EditorInfo.IME_NULL) {
							return true;
						}
						return false;
					}
				});
		
		findViewById(R.id.changepassword_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						changePasswordOnCloud();

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
	
	public void changePasswordOnCloud() {
		if (mchPasswdTask != null) {
			return;
		}

		mUserNameView.setError(null);
		mPasswordView.setError(null);
		mPasswordConfirmView.setError(null);

		mUserName = mUserNameView.getText().toString();
		mPassword = mPasswordView.getText().toString();
		mPasswordConfirm = mPasswordConfirmView.getText().toString();

		boolean cancel = false;
		View focusView = null;

		if (mUserName.isEmpty()) {
			mUserNameView.setError(getString(R.string.error_field_required));
			focusView = mUserNameView;
			cancel = true;
		}
		
		if (mPassword.isEmpty()) {
			mPasswordView.setError(getString(R.string.error_field_required));
			focusView = mPasswordView;
			cancel = true;
		}  else if (mPasswordConfirm.isEmpty()) {
			mPasswordConfirmView
					.setError(getString(R.string.error_field_required));
			focusView = mPasswordConfirmView;
			cancel = true;
		}  else if (false == mPassword.equals(mPasswordConfirm)) {
			mPasswordConfirmView
					.setError(getString(R.string.error_mismatch_password));
			focusView = mPasswordConfirmView;
			cancel = true;
		}

		if (cancel) {
			focusView.requestFocus();
		} else {
			ParatuUser user = new ParatuUser(mUserName, mUserName, mPassword);
			
			try {
				mChangePasswordStatusMessageView.setText(R.string.change_password);
				showProgress(true);
				mchPasswdTask = new UserChangePasswordTask();
				mchPasswdTask.execute(user.toJsonString("changepassword"));
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	public class UserChangePasswordTask extends AsyncTask<String, Void, String> {
		
		@Override
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
			mchPasswdTask = null;
			showProgress(false);

			if (result.contains("change password success")) {
				Toast.makeText(getApplicationContext(),
						R.string.change_passowrd_status_success, Toast.LENGTH_SHORT).show();
				
				ParatuUser user = new ParatuUser();
				user.username = mUserName;
				user.password = mPassword;				
				mDbManager.updateUserPassword(user);

				Intent intent = new Intent();
				intent.setClass(ChangePassword.this, Login.class);
				startActivity(intent);
				ChangePassword.this.finish();
			} else {
				Toast.makeText(getApplicationContext(),
						R.string.change_passowrd_status_failed, Toast.LENGTH_SHORT).show();

			}
		}

		@Override
		protected void onCancelled() {
			mchPasswdTask = null;
			showProgress(false);
		}
	}

}
