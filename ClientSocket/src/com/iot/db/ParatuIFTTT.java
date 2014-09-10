package com.iot.db;

import java.util.Vector;

import org.json.JSONException;
import org.json.JSONObject;

import com.iot.helper.ParatuDictionary;

public class ParatuIFTTT {
	
	private String mUserName;
	private Vector<ParatuDevice> mDevices;
	
	public static final String JSON_MODULE = "ifttt";
	public static final String JSON_EVENT = "event";
	public static final String JSON_TRIGGEREVENT =  "triggerEvent";
	public static final String JSON_RESPONSEEVENT =  "responseEvent";
	public static final String JSON_RECIPEREC =  "recipeRec";
	public static final String JSON_REC =  "rec";

    public static final int TRIGGER_EVENT = 11;
    public static final int ACTION_EVENT = 21;
    public static final int RECURRENCE_EVENT = 31;

    public static final int TRIGGER_TYPE = 1;
    public static final int ACTION_TYPE = 2;
    public static final int RECURRENCE_TYPE = 3;

	private JSONObject triggerObject = new JSONObject();
	private JSONObject responseObject = new JSONObject();
	private JSONObject recurrenceObject = new JSONObject();

	private JSONObject triggerEvent = new JSONObject();
	private JSONObject responseEvent = new JSONObject();
	private JSONObject recurrenceEvent = new JSONObject();

	public ParatuIFTTT(String userName, Vector<ParatuDevice> devices) {
		mUserName = userName;
		mDevices = devices;
	}

	public void putKeyValue(int cursor, String key, String value) {
		String tranlsated = ParatuDictionary.translateForIfttt(value);
		
		try {
			if(cursor == TRIGGER_TYPE) {
				triggerObject.put(key, tranlsated);
			} else if(cursor == ACTION_TYPE) {
				responseObject.put(key, tranlsated);
			} else if(cursor == RECURRENCE_TYPE) {
				recurrenceObject.put(key, value);
			} else if(cursor == ACTION_EVENT) {
				responseEvent.put(key, tranlsated);
			} else if(cursor == TRIGGER_EVENT) {
				triggerEvent.put(key, tranlsated);
			} else if(cursor == RECURRENCE_EVENT) {
				recurrenceEvent.put(key, value);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void replaceDeivceNameByCoreId(JSONObject obj) throws JSONException {
		if(obj.has(ParatuDictionary.device)) {
			String selectedDevice = obj.getString(ParatuDictionary.device);
			for(ParatuDevice device : mDevices) {
				if(selectedDevice.equals(device.devicename)) {
					obj.remove(ParatuDictionary.device);
					obj.put(ParatuDevice.JSON_COREID, device.coreid);
					break;
				}
			}
		}
	}
	
	private void finalizeJsonData() throws JSONException {
		replaceDeivceNameByCoreId(responseEvent);
		replaceDeivceNameByCoreId(triggerEvent);
		
		triggerObject.put(JSON_EVENT, triggerEvent);
		responseObject.put(JSON_EVENT, responseEvent);
		recurrenceObject.put(JSON_REC, recurrenceEvent);
	}
	
	public String toString() {
		return new String(responseObject.toString() + responseEvent.toString() + triggerObject.toString() + triggerEvent.toString());
	}
	
	public String toString(String action) {
		try {
			finalizeJsonData();

			JSONObject jsonObj = new JSONObject();

			jsonObj.put(ParatuDevice.JSON_ACTION, action);
			jsonObj.put(ParatuDevice.JSON_OWNER, mUserName);
			jsonObj.put(JSON_TRIGGEREVENT, triggerObject);
			jsonObj.put(JSON_RESPONSEEVENT, responseObject);
			jsonObj.put(JSON_RECIPEREC, recurrenceObject);

			JSONObject jsonModule = new JSONObject();
			jsonModule.put("module", JSON_MODULE);
			jsonModule.put("object", jsonObj);
			
			return jsonModule.toString();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return "";
	}
}