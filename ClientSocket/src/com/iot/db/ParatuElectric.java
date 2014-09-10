package com.iot.db;

import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.text.format.Time;

public class ParatuElectric {
	public static final String JSON_MODULE = "electric";
	public static final String JSON_ACTION = "action";
	public static final String JSON_TYPE = "type";
	public static final String JSON_STARTDAY = "startday";
	public static final String JSON_ENDDAY = "endday";
	
	private Vector<Integer> mData = new Vector<Integer>();
	private ParatuDevice mDevice;
	private Time mStart;
	
	public ParatuElectric(ParatuDevice device) {
		mDevice = device;
	}

	public String toJsonRequestString(String action, ParatuDevice device, String type) throws JSONException {
		JSONObject elecJsonObj = new JSONObject();
		elecJsonObj.put(JSON_ACTION, action);
		
		if(device != null) {
			JSONArray jsonCoreIdArray = new JSONArray();
			jsonCoreIdArray.put(device.coreid);
			elecJsonObj.put(ParatuDevice.JSON_COREID, jsonCoreIdArray);
		}
		
		Time now = new Time();
		now.setToNow();

		if("hour" == type) {
			mStart = new Time(now);
			mStart.set(now.second, now.minute, now.hour, now.monthDay - 1, now.month, now.year);
			elecJsonObj.put(JSON_STARTDAY, mStart.format("%Y-%m-%d-%H"));
			elecJsonObj.put(JSON_ENDDAY, now.format("%Y-%m-%d-%H"));
		} else if("day" == type) {
			mStart = new Time(now);
			mStart.set(now.monthDay - 6, now.month, now.year);
			elecJsonObj.put(JSON_STARTDAY, mStart.format("%Y-%m-%d"));
			elecJsonObj.put(JSON_ENDDAY, now.format("%Y-%m-%d"));
		}
		
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("module", JSON_MODULE);
		jsonObj.put("object", elecJsonObj);
		
		return jsonObj.toString();
	}
	
	public void put(String str) throws JSONException {
		JSONObject jsonData = new JSONObject(str);
		if(null != jsonData) {
			JSONObject res = jsonData.getJSONObject("res");
			if(res.has("yaxisValue")) {
				JSONObject yaxisValue = res.getJSONObject("yaxisValue");
				if(yaxisValue.has(mDevice.coreid.toString())){
					JSONObject deviceData = yaxisValue.getJSONObject(mDevice.coreid.toString());
					if(deviceData.has("data")) {
						mData.clear();
						JSONArray data = deviceData.getJSONArray("data");
						for(int i = 0; i < data.length(); i++) {
							mData.add(data.getInt(i));
						}
					}
				}
			}
		}
	}
	
	public int getData(int position) {
		if(position >= mData.size())
			return -1;
		
		return mData.get(position);
	}
	
	public int getDataCount() {
		return mData.size();
	}
	
	public int getMaxData() {
		int tmpmax = 0;
		for(int i = 0; i < mData.size(); i++) {
			if(mData.get(i) > tmpmax)
				tmpmax = mData.get(i);
		}
		
		return tmpmax;
	}
	
	public String getDay(int position) {
		if(mStart != null) {
			Time tmp = new Time(mStart);
			tmp.set(mStart.monthDay + position, mStart.month, mStart.year);
			return tmp.format("%Y-%m-%d");
		}
		return "";
	}
}
