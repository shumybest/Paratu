package com.iot.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.Vector;

import com.iot.paratu.R;

import android.app.Service;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Binder;
import android.os.IBinder;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

public final class SocketThread extends Service {	
	public static final String BROADCAST_PARATU_SOCKET_CONNECTED = "BROADCAST_PARATU_SOCKET_CONNECTED";
	public static final String BROADCAST_PARATU_SOCKET_DISCONNECTED = "BROADCAST_PARATU_SOCKET_DISCONNECTED";
	public static final String BROADCAST_PARATU_SERVICE_BINDED = "BROADCAST_PARATU_SERVICE_BINDED";
	
	private final IBinder mBinder = new SockBinder();
	private Socket socket = null;
	private InputStream in = null;
	private OutputStream out = null;
	private BufferedReader din;

	private SockReceiver mReceiver = null;
	
	private LocalBroadcastManager mBroadcastMgr;

	private static Vector<String> receivedMsgList = new Vector<String>();
	
	public class SockBinder extends Binder { 
		public SocketThread getSockThread() {
			Log.d("IotThread(" + Thread.currentThread().getId() + ")", "Exposing Service");
			return SocketThread.this;
		}
	}

	public IBinder onBind(Intent intent) {
		return mBinder;
	}
	
	private void startSocketThreads() {
		mReceiver = new SockReceiver();
		mReceiver.start();
	}
	
	private void stopSocketThreads() {
		if(mReceiver != null) {
			mReceiver.setRunning(false);
			mReceiver.interrupt();
			mReceiver = null;
		}
	}

	public void onCreate() {
		super.onCreate();
		Log.d("IotThread(" + Thread.currentThread().getId() + ")", "Mainthread Starting total: " + Thread.activeCount());
		mBroadcastMgr = LocalBroadcastManager.getInstance(this);
        startSocketThreads();
	}
	
	public void onDestroy() {
		stopSocketThreads();
		Log.d("IotThread(" + Thread.currentThread().getId() + ")", "Stop Service total: "  + Thread.activeCount());
		 
		super.onDestroy();
	}

	private boolean isConnected() {
		if (null == socket || !socket.isConnected() || socket.isClosed()) {
			return false;
		} else {
			return true;
		}
	}

	private void connectCloud() throws IOException {
		if(null != in) {
			in.close();
		}
		if(null != out) {
			out.close();
		}
		if (null != socket) {
			socket.close();
		}

		Resources res = getResources();
		
		socket = new Socket();
		SocketAddress addr = new InetSocketAddress(getString(R.string.CLOUD_IPADDR),
				res.getInteger(R.integer.CLOUD_PORT));
		socket.connect(addr, res.getInteger(R.integer.CLOUD_TIMEOUT));
		
		if (isConnected()) {
			in = socket.getInputStream();
			out = socket.getOutputStream();
			din = new BufferedReader(new InputStreamReader(in));
			mBroadcastMgr.sendBroadcast(new Intent(
					BROADCAST_PARATU_SOCKET_CONNECTED));
			Log.d("IotReceiver(" + Thread.currentThread().getId() + ")",
					"Socket Connected");
		}
	}
	
	private void closeCloudConnect() throws IOException {
		if(null != in) {
			in.close();
		}
		if(null != out) {
			out.close();
		}
		if (null != socket) {
			socket.close();
		}
	}

	public void sendMsg(String msg) throws IOException {
		if (isConnected()) {
			PrintWriter dout = new PrintWriter(out, true);
			dout.println(msg);
			out.flush();
		}
	}

	public String popMsgFromReceivedList() throws Throwable {
		if (receivedMsgList.size() > 0) {
			String msg = receivedMsgList.firstElement();
			receivedMsgList.remove(0);
			return msg;
		}
		return "";
	}

	public class SockReceiver extends Thread {
		private boolean running = true;

		public void run() {
			Log.d("IotReceiver(" + Thread.currentThread().getId() + ")", "Receiver Starting: TID " + Thread.currentThread().getId());
			String msgin = "";

			while (running) {
				if (isConnected()) {
					try {
						while ((msgin = din.readLine()) != null) {
							Log.d("IotReceiver(" + Thread.currentThread().getId() + ")", "Socket Received: " + msgin);
							receivedMsgList.add(msgin);
						}
					} catch (IOException e) {
						e.printStackTrace();
						try {
							connectCloud();
						} catch (IOException e1) {
							e1.printStackTrace();
						}
					}
				} else {
					try {
						connectCloud();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}

				if(Thread.interrupted()) {
					Log.d("IotReceiver(" + Thread.currentThread().getId() + ")", "Receiver Intrreupted: TID " + Thread.currentThread().getId());
					break;
				}
			}
			Log.d("IotReceiver(" + Thread.currentThread().getId() + ")", "Receiver Ended: TID " + Thread.currentThread().getId());
			try {
				closeCloudConnect();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		public void setRunning(boolean val) {
			running = val;
		}
	}

	// send: arg0, expect: arg1
	public String sendAndExpect(String sendStr, String expectStr)
			throws Throwable {
		Log.d("IotThread(" + Thread.currentThread().getId() + ")", "Sending: " + sendStr);
		if (isConnected()) {
			try {
				sendMsg(sendStr);
			} catch (IOException e) {
				e.printStackTrace();
			}

			for (int retryTime = 0; retryTime < 3; retryTime++) {
				try {
					String receivedResult = popMsgFromReceivedList();
					if (receivedResult.contains(expectStr)) {
						return receivedResult;
					}
					Thread.sleep(1000);
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}
			}
		} else {
			Log.d("IotThread(" + Thread.currentThread().getId() + ")", "Send failed, broadcast disconnected");
			mBroadcastMgr.sendBroadcast(new Intent(BROADCAST_PARATU_SOCKET_DISCONNECTED));
		}
		return "";
	}
}