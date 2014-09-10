package com.iot.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class ParatuSQLHelper extends SQLiteOpenHelper {
	private static final String DATABASE_NAME = "paratu.db";
    private static final int DATABASE_VERSION = 1;
    
    public ParatuSQLHelper(Context ctx) {
        super(ctx, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
	@Override
	public void onCreate(SQLiteDatabase db) {
		//users: username email password active devicesuptodate
        db.execSQL("CREATE TABLE IF NOT EXISTS users" +  
                "(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR, email VARCHAR, password VARCHAR, active INTEGER DEFAULT 0, devicesuptodate INTEGER DEFAULT 0)");
        
        //devices: owner coreid devicename value isconnected
        db.execSQL("CREATE TABLE IF NOT EXISTS devices" +  
                "(id INTEGER PRIMARY KEY AUTOINCREMENT, owner VARCHAR, coreid VARCHAR, devicename VARCHAR, value INTEGER DEFAULT 0, isconnected INTEGER DEFAULT 0)");
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
//        db.execSQL("ALTER TABLE users ADD COLUMN devicesuptodate INTEGER DEFAULT 0");
	}
}
