package com.iot.db;

import org.json.JSONException;
import org.json.JSONObject;

public class ParatuUser {
	public String username = "";
	public String email = "";
	public String password = "";
	
	public static final int USER_ACTIVE = 1;
	public static final int USER_DEACTIVE = 0;
	
	public static final int UPTODATE = 1;
	public static final int OUTOFDATE = 1;
	
	public static final String JSON_ACTION = "action";
	public static final String JSON_USERNAME = "username";
	public static final String JSON_PASSWORD = "password";
	public static final String JSON_EMAIL = "email";
	public static final String JSON_MODULE = "user";
	
	public ParatuUser(String username, String email, String password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}

	public ParatuUser() {
	}
	
	public String toJsonString(String action) throws JSONException {
		JSONObject userJsonObj = new JSONObject();
		userJsonObj.put(JSON_ACTION, action);
		userJsonObj.put(JSON_USERNAME, this.username);
		userJsonObj.put(JSON_PASSWORD, this.password);
		userJsonObj.put(JSON_EMAIL, this.email);

		JSONObject jsonTopObj = new JSONObject();
		jsonTopObj.put("module", JSON_MODULE);
		jsonTopObj.put("object", userJsonObj);
		
		return jsonTopObj.toString();
	}
	
	public String toFindAllJsonString() throws JSONException {
		JSONObject userJsonObj = new JSONObject();
		userJsonObj.put(JSON_ACTION, "findAll");
		userJsonObj.put(JSON_USERNAME, this.username);

		JSONObject jsonTopObj = new JSONObject();
		jsonTopObj.put("module", ParatuDevice.JSON_MODULE);
		jsonTopObj.put("object", userJsonObj);
		
		return jsonTopObj.toString();
	}
}
