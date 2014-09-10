package com.iot.paratu;

import org.json.JSONException;

import com.iot.db.ParatuDBManager;
import com.iot.db.ParatuDevice;
import com.iot.db.ParatuUser;
import com.iot.helper.ParatuActivity;
import com.iot.helper.ParatuUtil;
import com.iot.services.SmartConfigService;
import com.iot.services.SocketThread;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class NewDeviceActivity extends ParatuActivity {
	private View mNewDeviceView;
	private View mNewDeviceStatusView;
	private EditText mWifiSSIDView;
	private EditText mWifiPasswordView;

	private SocketThread mService = null;
	private ParatuDBManager mDbManager;

	private String mUserName;
	private String mWifiSSId;
	private String mWifiGateway;
	private String mWifiPassword;

	private CreateNewDeviceTask mCreateNewDeviceTask = null;
	private SmartConfigBroadcastListener mSCListener;
	
	public final static String ARGS_USERNAME = "USERNAME";
	public final static String ARGS_WIFISSID = "WIFISSID";
	public final static String ARGS_GATEWAY = "GATEWAY";
	
	private ParatuDevice mAddedDevice;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_newdevice);

		Bundle args = getIntent().getExtras();
		mUserName = args.getString(ARGS_USERNAME);
		mWifiSSId = args.getString(ARGS_WIFISSID);
		mWifiGateway = args.getString(ARGS_GATEWAY);
		
		mNewDeviceView = findViewById(R.id.newDevice_form);
		mNewDeviceStatusView = findViewById(R.id.newdevice_status);
		setProgressViews(mNewDeviceView, mNewDeviceStatusView);
		
		mWifiSSIDView = (EditText)findViewById(R.id.wifiSSId);
		if(!ParatuUtil.isWifiEnabled(this)) {
			ParatuUtil.AlertToTurnOn(this);
			findViewById(R.id.newDevice_button).setEnabled(false);
		} else {
			findViewById(R.id.newDevice_button).setEnabled(true);
		}
		mWifiSSIDView.setText(mWifiSSId.replace("\"", ""));
		
		mWifiPasswordView = (EditText)findViewById(R.id.wifiPassword);
		mWifiPasswordView
				.setOnEditorActionListener(new TextView.OnEditorActionListener() {
					@Override
					public boolean onEditorAction(TextView textView, int id,
							KeyEvent keyEvent) {
						if (id == EditorInfo.IME_ACTION_GO) {
							mWifiSSId = mWifiSSIDView.getText().toString();
							mWifiPassword = mWifiPasswordView.getText().toString();

							if (!mWifiSSId.isEmpty() && !mWifiPassword.isEmpty()) {
								showProgress(true);
								SmartConfigService.startSmartConfig(
												getApplicationContext(),
												mWifiSSId,
												mWifiPassword,
												mWifiGateway,
												getString(R.string.smart_config_default_aes_key));

								ParatuUtil.hideIME(getApplicationContext(), textView);
							} else {
								if(mWifiSSId.isEmpty()) {
									mWifiSSIDView.setError(
											getString(R.string.error_field_required));
									mWifiSSIDView.requestFocus();
								} else if(mWifiPassword.isEmpty()) {
									mWifiPasswordView.setError(
											getString(R.string.error_field_required));
									mWifiPasswordView.requestFocus();
								}
							}
							return true;
						}
						return false;
					}
				});

		findViewById(R.id.newDevice_button).setOnClickListener(
				new NewDeviceClickListener());
		
		mSCListener = new SmartConfigBroadcastListener();
	}

	public void onStart() {
		super.onStart();
		mBroadcastMgr.registerReceiver(mSCListener, mSCListener.getFilter());
	}

	public void onStop() {
		mBroadcastMgr.unregisterReceiver(mSCListener);
		super.onStop();
	}

	class NewDeviceClickListener implements OnClickListener {

		@Override
		public void onClick(View v) {
			ParatuUtil.hideIME(getApplicationContext(), v);
			
			mWifiSSIDView.setError(null);
			mWifiPasswordView.setError(null);

			boolean error = false;
			View focusView = null;

			mWifiSSId = mWifiSSIDView.getText().toString();
			mWifiPassword = mWifiPasswordView.getText().toString();

			if (mWifiSSId.isEmpty()) {
				mWifiSSIDView
						.setError(getString(R.string.error_field_required));
				focusView = mWifiSSIDView;
				error = true;
				
			} else if (mWifiPassword.isEmpty()) {
				mWifiPasswordView
						.setError(getString(R.string.error_field_required));
				focusView = mWifiPasswordView;
				error = true;
			}

			if (error) {
				focusView.requestFocus();
			} else {
				showProgress(true);
				SmartConfigService.startSmartConfig(getApplicationContext(),
						mWifiSSId,
						mWifiPassword,
						mWifiGateway,
						getString(R.string.smart_config_default_aes_key));
			}
		}
	}
	
	class SmartConfigBroadcastListener extends BroadcastReceiver {
		public IntentFilter getFilter() {
			IntentFilter filter = new IntentFilter();
			filter.addAction(SmartConfigService.BROADCAST_PARATU_CORE_NOT_FOUND);
			filter.addAction(SmartConfigService.BROADCAST_PARATU_CORE_FOUND);
			return filter;
		}

		@Override
		public void onReceive(Context ctx, Intent intent) {		
			SmartConfigService.stopSmartConfig(getApplicationContext());

			if (intent.getAction()
					.equals(SmartConfigService.BROADCAST_PARATU_CORE_NOT_FOUND)) {
				ParatuUtil.MsgBox(ctx, "No Core Found!");
				
			} else if (intent.getAction()
					.equals(SmartConfigService.BROADCAST_PARATU_CORE_FOUND)) {
				
				final String coreId = SmartConfigService.smartConfigDevices.firstElement().toString();
				final EditText editView = new EditText(ctx);
				editView.setText(coreId);
				final String defaultDeviceName = coreId;
				
				AlertDialog.Builder builder = new Builder(ctx);
				builder
				.setView(editView)
				.setMessage(getString(R.string.newDevice_nameit))
				.setTitle(getString(R.string.newDevice_found_title)) 
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						
						String deviceName = "";
						if(!editView.getText().toString().isEmpty()){
							deviceName = editView.getText().toString();
						}else {
							deviceName = defaultDeviceName;
						}
						
						mAddedDevice = new ParatuDevice(mUserName, coreId, deviceName, ParatuDevice.DEVICE_OFF, ParatuDevice.DEVICE_CONNECTED);
						if (null != mCreateNewDeviceTask)
							return;
		
						String jsonString;
						try {
							jsonString = mAddedDevice.toJsonString("create");
							Log.d("IotUserHomepage", "Create device for user: "	+ jsonString);
							
							mCreateNewDeviceTask = new CreateNewDeviceTask();
							mCreateNewDeviceTask.execute(jsonString.toString());
						} catch (JSONException e) {
							e.printStackTrace();
						}
						
						dialog.dismiss();
					}
				}).create().show();
			}
		}
	}

	private class CreateNewDeviceTask extends AsyncTask<String, Void, String> {
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
			if (result.contains("create device success")) {
				mDbManager.addDevice(mAddedDevice);
				Toast.makeText(getApplicationContext(),
						R.string.New_Device_success, Toast.LENGTH_LONG).show();
			} else {
				mDbManager.setUserDeviceUptodate(mUserName, ParatuUser.OUTOFDATE);
				Toast.makeText(getApplicationContext(),
						R.string.New_Device_fail, Toast.LENGTH_LONG).show();
			}
			mCreateNewDeviceTask = null;
			showProgress(false);
		}

		@Override
		protected void onCancelled() {
			mCreateNewDeviceTask = null;
			showProgress(false);
		}
	}
	
	@TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
	public void showProgress(final boolean show) {
		if (mNewDeviceStatusView != null) {

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
				int shortAnimTime = getResources().getInteger(
						android.R.integer.config_shortAnimTime);

				mNewDeviceStatusView.setVisibility(View.VISIBLE);
				mNewDeviceStatusView.animate().setDuration(shortAnimTime)
						.alpha(show ? 1 : 0)
						.setListener(new AnimatorListenerAdapter() {
							@Override
							public void onAnimationEnd(Animator animation) {
								mNewDeviceStatusView.setVisibility(show ? View.VISIBLE
										: View.GONE);
							}
						});
			} else {
				mNewDeviceStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
			}
		}
	}
}