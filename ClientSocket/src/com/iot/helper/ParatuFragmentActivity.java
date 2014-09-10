package com.iot.helper;

import java.util.Vector;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.iot.db.ParatuDBManager;
import com.iot.db.ParatuDevice;
import com.iot.db.ParatuUser;
import com.iot.services.SocketThread;
import com.iot.services.SocketThread.SockBinder;

public class ParatuFragmentActivity extends FragmentActivity {
	protected boolean mBound = false;
	public SocketThread mService;
	protected ParatuDBManager mDbManager;
	protected LocalBroadcastManager mBroadcastMgr;
	
	protected String mUserName = "";
	protected Vector<ParatuDevice> mDevices = new Vector<ParatuDevice>();
		
	protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);
        mDbManager = new ParatuDBManager(this);
        mBroadcastMgr = LocalBroadcastManager.getInstance(this);
        
		ParatuUser user = mDbManager.queryCurrentActiveUser();
		mUserName = user.username;
		mDbManager.queryDevices(mDevices, mUserName);
    }
    
    protected void onDestroy() {
    	mDbManager.closeDB();
        super.onDestroy();  
    }
    
	protected void onStart() {
		super.onStart();
		Log.d("IotParatuFragmentActivity", "Starting service: "
				+ SocketThread.class.getName());

		Intent intent = new Intent(SocketThread.class.getName());
		this.startService(intent);

		if (true == bindService(intent, mSockConnector, BIND_AUTO_CREATE)) {
			Log.d("IotParatuFragmentActivity",
					"Serivce Bind OK for mSockConnector");
		} else {
			Log.d("IotParatuFragmentActivity",
					"Serivce Bind Fail for mSockConnector");
		}

		return;
	}

	protected void onStop() {
		Log.d("IotParatuFragmentActivity", "unBind Serivce");

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
				Log.d("IotParatuFragmentActivity", "Serivce Bind OK");
				mBroadcastMgr.sendBroadcast(new Intent(SocketThread.BROADCAST_PARATU_SERVICE_BINDED));
			}
		}

		public void onServiceDisconnected(ComponentName arg0) {
			mBound = false;
		}
	};
}