package com.iot.paratu;

import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.iot.db.ParatuDevice;
import com.iot.db.ParatuUser;
import com.iot.helper.ParatuFragment;
import com.iot.helper.ParatuFragmentActivity;
import com.iot.helper.ParatuUtil;
import com.iot.services.SocketThread;

import android.app.ActionBar;
import android.app.ActionBar.Tab;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Toast;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;

public class UserHomepage extends ParatuFragmentActivity implements ActionBar.TabListener {
	private ListDevicesTask mListDevicesTask = null;
	
	private DrawerLayout mDrawerLayout;
	private ActionBarDrawerToggle mDrawerToggle;
    private ListView mDeviceList;
    private ArrayAdapter<String> mAdapter;
    private AppSectionsPagerAdapter mPagerAdapter;
    private DevicesManagerFragment mDeviceFragment;
    private UsageFragment mUsageFragment;
    private IFTTTFragment mIftttFragment;
    private MenuItem refreshItem;
    private ViewPager mViewPager;
    private ActionBar mActionBar;
    
    private SocketBroadcastListener mSocketBCListener;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_user_homepage);
		
        mSocketBCListener = new SocketBroadcastListener();

		mActionBar = getActionBar();
        mActionBar.setTitle("Paratu");
        mActionBar.setDisplayHomeAsUpEnabled(false);
        mActionBar.setHomeButtonEnabled(false);
        mActionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
        
		mPagerAdapter = new AppSectionsPagerAdapter(getSupportFragmentManager());
		mDeviceFragment = new DevicesManagerFragment();
		mIftttFragment = new IFTTTFragment();
		mUsageFragment = new UsageFragment();
		mPagerAdapter.add(mDeviceFragment, getString(R.string.title_monitored_device_list));//0
		mPagerAdapter.add(mUsageFragment, getString(R.string.title_usage));//1
		mPagerAdapter.add(mIftttFragment, getString(R.string.title_IFTTT));//2

		mViewPager = (ViewPager) findViewById(R.id.pager);
		mViewPager.setAdapter(mPagerAdapter);
		mViewPager.setOnPageChangeListener(new ViewPager.SimpleOnPageChangeListener() {
			@Override
			public void onPageSelected(int tabid) {
				mActionBar.setSelectedNavigationItem(tabid);
				mPagerAdapter.doSomething(tabid);
			}
		});
				
		mActionBar.removeAllTabs();
		for (int i = 0; i < mPagerAdapter.getCount(); i++) {
			mActionBar.addTab(mActionBar.newTab()
					.setText(mPagerAdapter.getPageTitle(i))
					.setTabListener(this));
		}
		
        mDrawerLayout = (DrawerLayout)findViewById(R.id.drawer_layout);
        mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow, GravityCompat.START);
        
        mDeviceList = (ListView)findViewById(R.id.home_drawer);
        
		Vector<String> deviceList = new Vector<String>();
		mAdapter = new ArrayAdapter<String>(this, R.layout.drawer_device_name, deviceList);
		mAdapter.setNotifyOnChange(true);
		
        mDeviceList.setAdapter(mAdapter);
        mDeviceList.setOnItemClickListener(new DrawerDevicesClickListener());
        
        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout,
                R.drawable.ic_launcher, R.string.drawer_open, R.string.drawer_close) {

            public void onDrawerClosed(View view) {
                super.onDrawerClosed(view);
            }

            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
            }
        };
        
        mDrawerLayout.setDrawerListener(mDrawerToggle);
	}
	
	protected void onStart() {
		super.onStart();
		mBroadcastMgr.registerReceiver(mSocketBCListener, mSocketBCListener.getFilter());
	}

	protected void onStop() {
		mBroadcastMgr.unregisterReceiver(mSocketBCListener);
		super.onStop();
	}
	
	protected void onResume() {
		super.onResume();
		if(mDbManager.isUserDeviceUptodate(mUserName)) {
			listFromDb();
		} else {
			retrieveDeviceListFromCloud();
		}
		Log.d("Iottest", "OnResume");
		mDeviceList.setAdapter(mAdapter);
		mAdapter.notifyDataSetChanged();
	}
	
	protected void onDestroy() {
		super.onDestroy();
	}
	
    private void selectItem(int deviceindex) {
    	mDeviceFragment.setDevice(mDevices.get(deviceindex));
    	mUsageFragment.setDevice(mDevices.get(deviceindex));
        mDeviceList.setItemChecked(deviceindex, true);
        mDrawerLayout.closeDrawer(mDeviceList);
    }
 
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.user_home, menu);
		return true;
	}
	
	private void startNewDeviceFragment() {				
		Bundle args = new Bundle();
		args.putString(NewDeviceActivity.ARGS_USERNAME, mUserName);
		args.putString(NewDeviceActivity.ARGS_WIFISSID, ParatuUtil.getWifiSSID(getApplicationContext()));
		args.putString(NewDeviceActivity.ARGS_GATEWAY, ParatuUtil.getGateway(getApplicationContext()));

		Intent intent = new Intent(UserHomepage.this, NewDeviceActivity.class);
		intent.putExtras(args);
		UserHomepage.this.startActivity(intent);
	}
	
	private void changePassword() {
		Intent intent = new Intent(UserHomepage.this, ChangePassword.class);
		UserHomepage.this.startActivity(intent);
	}

	private void logOut() {
		mDbManager.setUserDeActive(mUserName);

		Intent intent = new Intent(UserHomepage.this, Login.class);
		UserHomepage.this.startActivity(intent);
		UserHomepage.this.finish();
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.action_refresh:
			refreshItem = item;
			startRefreshAnim();
			retrieveDeviceListFromCloud();
			return true;
		case R.id.action_newdevice:
			startNewDeviceFragment();
			return true;
		case R.id.action_changepasswd:
			changePassword();
			return true;
		case R.id.action_logout:
			logOut();
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}
	
	//TODO: data consistency between cloud and phone
	private void retrieveDeviceListFromCloud() {
		mDbManager.deleteAllDevice(mUserName);
		
		if (null != mListDevicesTask)
			return;
		
		ParatuUser user = new ParatuUser(mUserName, mUserName, "");

		try {
			mListDevicesTask = new ListDevicesTask();
			mListDevicesTask.execute(user.toFindAllJsonString());
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void listFromDb() {
		mAdapter.clear();
		mDevices.clear();
		mDbManager.queryDevices(mDevices, mUserName);
		if(mDevices.size() > 0) {
			for(int i = 0; i < mDevices.size(); i++) {
				Log.d("IotUserHomepage", "Get " + mDevices.size() + " devices from DB");
				mAdapter.add(mDevices.get(i).devicename);
			}
		}
	}
	
	private void listFromjson(JSONObject jsonObj) throws JSONException {
		mAdapter.clear();
		
		JSONArray devicelist = jsonObj.getJSONArray("res");
		Log.d("IotUserHomepage", "Get " + devicelist.length() + " devices from cloud");
		
		if (devicelist.length() > 0) {
			for (int i = 0; i < devicelist.length(); i++) {
				Log.d("IotUserHomepage", "Device(" + i + "): " + devicelist.getJSONObject(i).toString());
				ParatuDevice device = new ParatuDevice(devicelist.getJSONObject(i));
				
				mDevices.add(device);
				mDbManager.addDevice(device);
				mAdapter.add(device.devicename);
			}
			
			mDbManager.setUserDeviceUptodate(mUserName, ParatuUser.UPTODATE);
			selectItem(0);
			Toast.makeText(getApplicationContext(),
					R.string.retrieved_Devices, Toast.LENGTH_LONG).show();
		} else {
			Toast.makeText(getApplicationContext(),
					R.string.no_Device, Toast.LENGTH_LONG).show();
		}
	}
	
	private class ListDevicesTask extends AsyncTask<String, Void, JSONObject> {
		protected JSONObject doInBackground(String... args) {
			JSONObject jsonResult = null;
			String msg = "";
			try {
				if(mService != null){
					msg = mService.sendAndExpect(args[0], "res");
				}
				
				if (true != msg.isEmpty()) {
					jsonResult = new JSONObject(msg);
					return jsonResult;
				}
			} catch (Throwable e) {
				e.printStackTrace();
			}
			return null;
		}

		@Override
		protected void onPostExecute(final JSONObject jsonObj) {
			if (jsonObj != null) {
				try {
					listFromjson(jsonObj);
				} catch (Throwable e) {
					e.printStackTrace();
				}
			} else {
				Toast.makeText(getApplicationContext(),
						R.string.devicesList_fail, Toast.LENGTH_SHORT).show();
			}
			mListDevicesTask = null;
			stopRefreshAnim();
		}

		@Override
		protected void onCancelled() {
			mListDevicesTask = null;
		}
	}
	
	class SocketBroadcastListener extends BroadcastReceiver {
		public IntentFilter getFilter() {
			IntentFilter filter = new IntentFilter();
			filter.addAction(SocketThread.BROADCAST_PARATU_SOCKET_CONNECTED);
			filter.addAction(SocketThread.BROADCAST_PARATU_SERVICE_BINDED);
			return filter;
		}
		
		@Override
		public void onReceive(Context ctx, Intent intent) {
			if (intent.getAction().equals(SocketThread.BROADCAST_PARATU_SOCKET_CONNECTED)) {
				Log.d("IotUserHomepage", "Received broadcast from socket with socket connected");
				if(!mDbManager.isUserDeviceUptodate(mUserName)) {
					retrieveDeviceListFromCloud();
				}
			} else if(intent.getAction().equals(SocketThread.BROADCAST_PARATU_SERVICE_BINDED)) {
			    mDeviceFragment.setServices(mService, mDbManager);
			    mUsageFragment.setServices(mService, mDbManager);
			    mIftttFragment.setServices(mService, mDbManager);
				if(mDevices.size() > 0)
					selectItem(0);
			}
		}
	}
	
    private class DrawerDevicesClickListener implements ListView.OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> adapter, View view, int position,
				long id) {
			selectItem(position);
		}
    }
    
    public class AppSectionsPagerAdapter extends FragmentPagerAdapter {
    	private Vector<ParatuFragment> fragments = new Vector<ParatuFragment>();
    	private Vector<String> fragmentsTitle = new Vector<String>();
    	
        public AppSectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }
        
        public void add(ParatuFragment fragment, String title) {
        	fragments.add(fragment);
        	fragmentsTitle.add(title);
        }

        @Override
        public Fragment getItem(int i) {
        	return fragments.get(i);
        }

        @Override
        public int getCount() {
            return fragments.size();
        }

        @Override
        public CharSequence getPageTitle(int position) {
        	return fragmentsTitle.get(position);
        }
        
        public void doSomething(int position) {
        	fragments.get(position).doSomething();
        }
    }
	
	public void startRefreshAnim() {
	     LayoutInflater inflater = (LayoutInflater)this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	     ImageView iv = (ImageView) inflater.inflate(R.layout.actionbar_refresh, null);
	     Animation rotation = AnimationUtils.loadAnimation(this, R.drawable.rotate);
	     rotation.setRepeatCount(Animation.INFINITE);
	     iv.startAnimation(rotation);
	     refreshItem.setActionView(iv);
	 }
	
	public void stopRefreshAnim() {
		refreshItem.getActionView().clearAnimation();
		refreshItem.setActionView(null);
	}

	@Override
	public void onTabReselected(Tab tab, android.app.FragmentTransaction ft) {
		
	}

	@Override
	public void onTabSelected(Tab tab, android.app.FragmentTransaction ft) {
        mViewPager.setCurrentItem(tab.getPosition());
	}

	@Override
	public void onTabUnselected(Tab tab, android.app.FragmentTransaction ft) {
		
	}
}
