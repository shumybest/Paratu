package com.iot.db;

import org.json.JSONException;
import org.json.JSONObject;

public class ParatuDevice {
	public String owner = "";
	public String coreid = "";
	public String devicename = "";
	public int value = DEVICE_OFF;
	public int isconnected = DEVICE_DISCONNECTED;
	
	public static final int DEVICE_ON = 1;
	public static final int DEVICE_OFF = 0;
	public static final int DEVICE_CONNECTED = 1;
	public static final int DEVICE_DISCONNECTED = 0;

	public static final String JSON_ACTION = "action";
	public static final String JSON_OWNER = "owner";
	public static final String JSON_DEVICENAME = "devicename";
	public static final String JSON_COREID = "coreid";
	public static final String JSON_VALUE = "value";
	public static final String JSON_ISCONNECT = "isConnect";
	public static final String JSON_MODULE = "device";

	public ParatuDevice() {
	}
	
	public ParatuDevice(String owner, String coreid, String devicename, int onoff, int isConnected) {
		this.owner = owner;
		this.coreid = coreid;
		this.devicename = devicename;
		this.value = onoff;
		this.isconnected = isConnected;
	}
	
	public ParatuDevice(JSONObject jsonStr) throws JSONException {
		this.owner = jsonStr.getString(JSON_OWNER).toString();
		this.coreid = jsonStr.getString(JSON_COREID).toString();
		this.devicename = jsonStr.getString(JSON_DEVICENAME).toString();
		this.value = jsonStr.getInt(JSON_VALUE);
		this.isconnected = jsonStr.getInt(JSON_ISCONNECT);
	}
		
	public String toJsonString(String action) throws JSONException {
		JSONObject deviceJsonObj = new JSONObject();
		deviceJsonObj.put(JSON_ACTION, action);
		deviceJsonObj.put(JSON_OWNER, this.owner);
		deviceJsonObj.put(JSON_COREID, this.coreid);
		deviceJsonObj.put(JSON_DEVICENAME, this.devicename);
		deviceJsonObj.put(JSON_VALUE, this.value);

		JSONObject jsonObj = new JSONObject();
		jsonObj.put("module", JSON_MODULE);
		jsonObj.put("object", deviceJsonObj);
		
		return jsonObj.toString();
	}
}
