package com.iot.helper;

import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.text.format.Formatter;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;

public class ParatuUtil {
	private static WifiManager wifiManager = null;
	private static WifiInfo wifiInfo = null;
	private static InputMethodManager inputMgr = null;

	public static Boolean isWifiEnabled(Context ctx) {
		wifiManager = (WifiManager) ctx.getSystemService(Context.WIFI_SERVICE);
		wifiInfo = wifiManager.getConnectionInfo();
		
		if (WifiManager.WIFI_STATE_ENABLED == wifiManager.getWifiState()
				|| WifiManager.WIFI_STATE_ENABLING == wifiManager.getWifiState()) {
			return true;
		}

		return false;
	}
	
	public static void MsgBox(Context ctx, String msg) {
		AlertDialog.Builder builder = new Builder(ctx);
		builder
		.setMessage(msg)
		.setTitle("Paratu") 
		.setPositiveButton("OK", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
			}
		})
		.create().show();
	}
		
	public static void AlertToTurnOn(Activity activity) {
		if(!isWifiEnabled(activity.getApplicationContext())) {
			AlertDialog.Builder builder = new Builder(activity);
			builder
			.setMessage("Your WIFI is off, would you like to turn it on?")
			.setTitle("Paratu")
			.setPositiveButton("Yes", new OnClickListener() {
				public void onClick(DialogInterface dialog, int which) {
					wifiManager.setWifiEnabled(true);
					dialog.dismiss();
				}
			})
			.setNegativeButton("No", new OnClickListener() {
				public void onClick(DialogInterface dialog, int which) {
					dialog.dismiss();
				}
			})
			.create().show();
		}
	}
	
	public static String getWifiSSID(Context ctx) {
		if(isWifiEnabled(ctx)) {
			return wifiInfo.getSSID();
		}
		
		return "";
	}
	
	@SuppressWarnings("deprecation")
	public static String getGateway(Context ctx) {
		if(isWifiEnabled(ctx)) {
			return Formatter.formatIpAddress(
					wifiManager.getDhcpInfo().gateway);
		}
		
		return "";
	}
	
	public static void hideIME(Context ctx, View myView) {
		if(null == inputMgr) {
		    inputMgr = (InputMethodManager) ctx.getSystemService(Context.INPUT_METHOD_SERVICE);
		}
		
		inputMgr.hideSoftInputFromWindow(myView.getApplicationWindowToken(),
        		InputMethodManager.HIDE_NOT_ALWAYS);
	}
}
