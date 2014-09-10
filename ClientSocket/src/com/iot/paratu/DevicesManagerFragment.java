package com.iot.paratu;

import org.json.JSONException;

import com.iot.db.ParatuDevice;
import com.iot.helper.ParatuFragment;

import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

public class DevicesManagerFragment extends ParatuFragment {
	private UpdateDeviceTask mUpdateDeviceTask = null;

	private View mDevicesListView;
	private View mDevicesListStatusView;
	private ImageView mPowerButtonView;
	private TextView mCoreidView;
	private TextView mDeviceNameView;
	private ParatuDevice mDevice;
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.activity_fragment_devices,
				container, false);
		
		mDevicesListView = rootView.findViewById(R.id.devicehome);
		mDevicesListStatusView = rootView.findViewById(R.id.devicehome_status);
		setProgressViews(mDevicesListView, mDevicesListStatusView);
		
		mPowerButtonView = (ImageView)rootView.findViewById(R.id.powerButton);
		mPowerButtonView.setOnClickListener(new PowerButtonClickListener());

		mDeviceNameView = (TextView)rootView.findViewById(R.id.devicenameView);
		mDeviceNameView.setFreezesText(true);
		mCoreidView = (TextView)rootView.findViewById(R.id.coreidView);
		mCoreidView.setFreezesText(true);
		
		return rootView;
	}
	
	//On tab selected
	public void doSomething() {
		
	}
	
	private void drawPowerButton() {
		Drawable powerImg;
		if(ParatuDevice.DEVICE_DISCONNECTED == mDevice.isconnected) {
			powerImg = getActivity().getResources().getDrawable(R.drawable.powerdisable);
		} else {
			if(mDevice.value == ParatuDevice.DEVICE_ON) {
				powerImg = getActivity().getResources().getDrawable(R.drawable.poweron);
			} else {
				powerImg = getActivity().getResources().getDrawable(R.drawable.power);
			}
		}
		mPowerButtonView.setImageDrawable(powerImg);
	}
	
	class PowerButtonClickListener implements OnClickListener {

		@Override
		public void onClick(View view) {
			if(null == mDevice)
				return;
			
			if(ParatuDevice.DEVICE_OFF == mDevice.value) {
				mDevice.value = ParatuDevice.DEVICE_ON;
			} else {
				mDevice.value = ParatuDevice.DEVICE_OFF;
			}
			try {
				if (mUpdateDeviceTask != null) {
					mUpdateDeviceTask.cancel(true);
				}
				mUpdateDeviceTask = new UpdateDeviceTask();
				mUpdateDeviceTask.execute(mDevice.toJsonString("update"));
				showProgress(true);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}
		
	private class UpdateDeviceTask extends AsyncTask<String, Void, String> {
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

		protected void onPostExecute(final String result) {
			showProgress(false);
			if (result.contains("update device success")) {
				mDbManager.updateDeviceOnOffState(mDevice);
				drawPowerButton();
			} else {
				Toast.makeText(getActivity().getApplicationContext(),
						R.string.update_device_fail, Toast.LENGTH_LONG).show();
			}
			mUpdateDeviceTask = null;
		}
		
		@Override
		protected void onCancelled() {
			mUpdateDeviceTask = null;
		}
	}

	public void setDevice(ParatuDevice paratuDevice) {
		mDevice = paratuDevice;
		mDeviceNameView.setText(getString(R.string.device_name) + ": " + mDevice.devicename);
		mCoreidView.setText(getString(R.string.coreid) + ": " + mDevice.coreid);
		drawPowerButton();
	}
}
