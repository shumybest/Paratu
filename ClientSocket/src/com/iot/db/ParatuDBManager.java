package com.iot.db;

import java.util.Vector;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

public class ParatuDBManager {
	private ParatuSQLHelper helper;
	private SQLiteDatabase db;

	public ParatuDBManager(Context ctx) {
		helper = new ParatuSQLHelper(ctx);
		db = helper.getWritableDatabase();
		
		Log.d("IotParatuDBManager", "Open ParatuDB");
	}
	
	//OK
	public Cursor queryDevicesCursor() {
		return db.rawQuery("SELECT * FROM devices", null);
	}
	
    //devices: owner coreid devicename value isconnected
	public void addDevice(ParatuDevice device) {
		db.beginTransaction();
		db.execSQL("INSERT INTO devices VALUES(null, ?, ?, ?, ?, ?)", new Object[]{device.owner, device.coreid, device.devicename, device.value, device.isconnected});
		db.setTransactionSuccessful();
		db.endTransaction();
	}
	
	public void deleteAllDevice(String username) {
		String[] args = {String.valueOf(username)};
		db.delete("devices", "owner=?", args);
	}
	
	public void updateDeviceName(ParatuDevice device) {
        ContentValues cv = new ContentValues();
        cv.put("devicename", device.devicename);
        db.update("devices", cv, "coreid = ?", new String[]{device.coreid});
	}
	
	public void updateDeviceOnOffState(ParatuDevice device) {
        ContentValues cv = new ContentValues();
        cv.put("value", device.value);
        db.update("devices", cv, "coreid = ?", new String[]{device.coreid});
	}
	
	//OK
	public Vector<ParatuDevice> queryDevices(Vector<ParatuDevice> devices, String userName) {
		Cursor c = queryDevicesCursor();
		while(c.moveToNext()) {
			ParatuDevice device = new ParatuDevice();
			device.owner = c.getString(c.getColumnIndex("owner"));
			device.coreid = c.getString(c.getColumnIndex("coreid"));
			device.devicename = c.getString(c.getColumnIndex("devicename"));
			device.value = c.getInt(c.getColumnIndex("value"));
			device.isconnected = c.getInt(c.getColumnIndex("isconnected"));
			
			if(userName.equals(device.owner)) {
				devices.add(device);				
			}
		}
		c.close();
		return devices;
	}
	
	//OK
	public Cursor queryUsersCursor() {
		return db.rawQuery("SELECT * FROM users", null);
	}
	
	//OK
	public Cursor queryUsersByNameCursor(String username) {
		return db.rawQuery("SELECT * FROM users WHERE username = ?", new String[]{username});
	}
	
	//OK
	public boolean isUserExist(String username) {
		Cursor c = queryUsersByNameCursor(username);
		if(c.getCount() > 0)
			return true;
		
		return false;
	}
	
	//OK
	public boolean isUserDeviceUptodate(String username) {
		Cursor c = queryUsersByNameCursor(username);
		if(c.getCount() > 0) {
			c.moveToFirst();
			if (ParatuUser.UPTODATE == c.getInt(c.getColumnIndex("devicesuptodate"))) {
				return true;
			}
		}
		
		return false;
	}
	
	//OK
	public void setUserDeviceUptodate(String username, int uptodate) {
        ContentValues cv = new ContentValues();
        cv.put("devicesuptodate", uptodate);
        db.update("users", cv, "username = ?", new String[]{username});
	}
	
	//OK
	//users: username email password active devicesuptodate
	public void addUser(ParatuUser user) {
		db.beginTransaction();
		db.execSQL("INSERT INTO users VALUES(null, ?, ?, ?, ?, ?)", new Object[]{user.username, user.email, user.password, 0, 0});
		db.setTransactionSuccessful();
		db.endTransaction();
	}
	
	//OK
	public void setUserActive(String username) {
        ContentValues cv = new ContentValues();
        cv.put("active", ParatuUser.USER_ACTIVE);
        db.update("users", cv, "username = ?", new String[]{username});
	}
	
	//OK
	public void setUserDeActive(String username) {
        ContentValues cv = new ContentValues();
        cv.put("active", ParatuUser.USER_DEACTIVE);
        db.update("users", cv, "username = ?", new String[]{username});
	}
	
	//OK
	public ParatuUser queryCurrentActiveUser() {
		Cursor c = queryUsersCursor();
		ParatuUser user = new ParatuUser();
		
		while(c.moveToNext()) {
			if(ParatuUser.USER_ACTIVE == c.getInt(c.getColumnIndex("active"))) {
				
				user.username = c.getString(c.getColumnIndex("username"));
				user.password = c.getString(c.getColumnIndex("password"));
				user.email = c.getString(c.getColumnIndex("email"));
				
				break;
			}
		}
		
		c.close();
		return user;
	}
	
	public void updateUserPassword(ParatuUser user) {
        ContentValues cv = new ContentValues();
        cv.put("password", user.password);
        db.update("users", cv, "username = ?", new String[]{user.username});
	}
	
    public void closeDB() {
        db.close();
    }
}
