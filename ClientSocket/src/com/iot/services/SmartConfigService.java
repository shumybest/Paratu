package com.iot.services;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Formatter;
import java.util.Vector;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.integrity_project.smartconfiglib.FirstTimeConfig;
import com.integrity_project.smartconfiglib.FirstTimeConfigListener;
import com.iot.paratu.R;

/**
 * Service for handling SmartConfig operations. Can be easily started and
 * stopped via the static convenience methods startSmartConfig() and
 * stopSmartConfig()
 * TODO: support multi-core configuration
 */
public class SmartConfigService extends Service implements
		FirstTimeConfigListener {
	public static final String EXTRA_SSID = "EXTRA_SSID";
	public static final String EXTRA_WIFI_PASSWORD = "EXTRA_WIFI_PASSWORD";
	public static final String EXTRA_GATEWAY_IP = "EXTRA_GATEWAY_IP";
	public static final String EXTRA_AES_KEY = "EXTRA_AES_KEY";

	public static final String ACTION_START_SMART_CONFIG = "ACTION_START_SMART_CONFIG";
	public static final String ACTION_STOP_SMART_CONFIG = "ACTION_STOP_SMART_CONFIG";
	
	public static final String BROADCAST_PARATU_CORE_FOUND = "BROADCAST_PARATU_CORE_FOUND";
	public static final String BROADCAST_PARATU_CORE_NOT_FOUND = "BROADCAST_PARATU_CORE_NOT_FOUND";
	public static final int    NOTIFICATION_PARATU_CORE_FOUND = 100;
	
	public static Vector<String> smartConfigDevices = new Vector<String>();

	public static void startSmartConfig(Context ctx, String ssid,
			String wifiPassword, String gatewayIP, String aesKey) {
		if (aesKey == null || aesKey.length() != 16) {
			aesKey = ctx.getString(R.string.smart_config_default_aes_key);
		}
		Intent intent = new Intent(ctx, SmartConfigService.class)
				.setAction(SmartConfigService.ACTION_START_SMART_CONFIG)
				.putExtra(EXTRA_SSID, ssid)
				.putExtra(EXTRA_WIFI_PASSWORD, wifiPassword)
				.putExtra(EXTRA_GATEWAY_IP, gatewayIP)
				.putExtra(EXTRA_AES_KEY, aesKey);
		ctx.startService(intent);
	}

	public static void stopSmartConfig(Context ctx) {
		ctx.startService(new Intent(ctx, SmartConfigService.class)
				.setAction(SmartConfigService.ACTION_STOP_SMART_CONFIG));
	}

	private final ScheduledExecutorService executor = Executors
			.newScheduledThreadPool(4);

	private LocalBroadcastManager broadcastMgr;

	private FirstTimeConfig firstTimeConfig;
	private HelloListener helloListener;
	private Future<?> postOnNoHellosReceivedFuture;

	private boolean isStarted = false;
	private boolean receivedHello = false;
	private static Formatter formatter;

	@Override
	public void onCreate() {
		super.onCreate();
		broadcastMgr = LocalBroadcastManager.getInstance(this);
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if (intent == null) {
			Log.d("IotSmartConfig",
					"onStartCommand() - intent arg was null, intentionally doing nothing until receving an intent with an action attached.");
		} else {
			if (ACTION_START_SMART_CONFIG.equals(intent.getAction())) {
				startSmartConfig(intent);

			} else if (ACTION_STOP_SMART_CONFIG.equals(intent.getAction())) {
				stopSmartConfig();
			}
		}

		return super.onStartCommand(intent, flags, startId);
	}

	@Override
	public void onFirstTimeConfigEvent(FtcEvent ftcEvent, Exception error) {
		Log.d("IotSmartConfig", "onFirstTimeConfigEvent(): " + ftcEvent);
		if (error != null) {
			Log.d("IotSmartConfig", "Error during first time config: " + error);
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		// this method must be present but doesn't need to do anything.
		return null;
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
	}

	private void startSmartConfig(Intent intent) {
		if (isStarted) {
			Log.d("IotSmartConfig",
					"Smart config already started, ignoring new request to start it gain.");
			return;
		}
		try {
			if (firstTimeConfig != null) {
				firstTimeConfig.stopTransmitting();
			}
			if (helloListener != null) {
				helloListener.stopListener();
			}
			if (postOnNoHellosReceivedFuture != null) {
				postOnNoHellosReceivedFuture.cancel(true);
			}

			postOnNoHellosReceivedFuture = executor.schedule(new Runnable() {
				@Override
				public void run() {
					if (!receivedHello) {
						Log.d("IotSmartConfig",
								"No Hello messages heard");
						broadcastMgr.sendBroadcast(new Intent(BROADCAST_PARATU_CORE_NOT_FOUND));
					} else {
						broadcastMgr.sendBroadcast(new Intent(BROADCAST_PARATU_CORE_FOUND));
					}
				}
			}, 60, TimeUnit.SECONDS);

			receivedHello = false;
			isStarted = true;
			firstTimeConfig = buildFirstTimeConfig(this, intent);
			helloListener = new HelloListener();
			helloListener.startListener();
			firstTimeConfig.transmitSettings();
		} catch (Exception e) {
			Log.d("IotSmartConfig", "Error while transmitting settings: " + e);
		}
	}

	private void stopSmartConfig() {
		if (firstTimeConfig != null) {
			try {
				firstTimeConfig.stopTransmitting();
				helloListener.stopListener();
				if (postOnNoHellosReceivedFuture != null) {
					postOnNoHellosReceivedFuture.cancel(true);
				}
			} catch (Exception e) {
				Log.d("IotSmartConfig", "Error trying to stop transmitting: "
						+ e);
			}
			firstTimeConfig = null;
			helloListener = null;
			postOnNoHellosReceivedFuture = null;
		}
		isStarted = false;
		receivedHello = false;
		stopSelf();
	}

	private void onHelloIdReceived(final String hexId) {
		Log.d("IotSmartConfig", "Core ID received via CoAP 'Hello': " + hexId);
		receivedHello = true;
		
		 NotificationCompat.Builder notifyBuilder = new NotificationCompat.Builder(this)
		 .setSmallIcon(R.drawable.ic_launcher)
		 .setContentTitle("Paratu")
		 .setContentText("New Core Found: " + hexId);
				
		NotificationManager notificationMgr =
				(NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		
		notificationMgr.notify(NOTIFICATION_PARATU_CORE_FOUND, notifyBuilder.build());
	}

	private FirstTimeConfig buildFirstTimeConfig(
			FirstTimeConfigListener listener, Intent intent) throws Exception {
		Bundle extras = intent.getExtras();

		String ssid = extras.getString(EXTRA_SSID);
		String wifiPassword = extras.getString(EXTRA_WIFI_PASSWORD);
		String gatewayIP = extras.getString(EXTRA_GATEWAY_IP);
		String aesKey = extras.getString(EXTRA_AES_KEY);
		byte[] transmissionKey = aesKey.getBytes();

		// AES key isn't being redacted below because it's public knowledge.
		Log.d("IotSmartConfig", "FirstTimeConfig params: SSID=" + ssid
				+ ", wifiPassword=" + wifiPassword + ", gatewayIP=" + gatewayIP
				+ ", aesKey=" + aesKey);

		return new FirstTimeConfig(listener, wifiPassword, transmissionKey,
				gatewayIP, ssid);
	}

	class HelloListener {
		final AtomicBoolean shouldContinue = new AtomicBoolean(true);
		MulticastSocket socket;
		Future<?> future;

		void startListener() {
			final String addr = getString(R.string.smart_config_hello_listen_address);
			final int port = getResources().getInteger(
					R.integer.smart_config_hello_port);

			try {
				socket = new MulticastSocket(port);
			} catch (IOException e1) {
				Log.d("IotSmartConfig",
						"Error while listening for Hello messages", e1);
				return;
			}

			this.future = executor.submit(new Runnable() {

				@Override
				public void run() {
					try {
						socket.joinGroup(InetAddress.getByName(addr));

						// I assume this is sufficient
						byte[] buffer = new byte[1024];
						DatagramPacket dgram = new DatagramPacket(buffer,
								buffer.length);

						Log.d("IotSmartConfig",
								"Listening for CoAP Hello messages on " + addr
										+ ":" + port);

						while (shouldContinue.get()) {
							// blocks until a datagram is received
							socket.receive(dgram);
							readCoreId(dgram);
							dgram.setLength(buffer.length);
						}
					} catch (UnknownHostException e) {
						// only log when we were intending to continue,
						// otherwise we always show an exception in the log when
						// shutting down the socket
						if (shouldContinue.get()) {
							Log.d("IotSmartConfig",
									"Error while listening for Hello messages",
									e);
						}
					} catch (IOException e) {
						// (see above)
						if (shouldContinue.get()) {
							Log.d("IotSmartConfig",
									"Error while listening for Hello messages",
									e);
						}
					}
				}
			});
		}

		void stopListener() {
			shouldContinue.set(false);
			if (socket != null) {
				socket.close();
				socket = null;
			}
			if (future != null) {
				future.cancel(true);
				future = null;
			}
			smartConfigDevices.clear();
		}

		void readCoreId(DatagramPacket dgram) {
			Log.d("IotSmartConfig", "Received " + dgram.getLength()
					+ " byte datagram from " + dgram.getAddress());
			if (dgram.getLength() != getResources().getInteger(R.integer.smart_config_hello_msg_length)) {
				Log.w("IotSmartConfig",
						"Received datagram with a payload having a length of "
								+ dgram.getLength() + ", ignoring.");
				return;
			}
			byte[] idAsBytes = Arrays.copyOfRange(dgram.getData(), 7, 19);
			String asString = bytesToHexString(idAsBytes);
			if (!smartConfigDevices.contains(asString)) {
				smartConfigDevices.add(asString);
				onHelloIdReceived(asString);
			}
		}
	}

	public static String bytesToHexString(byte[] bytes) {
		StringBuilder sb = new StringBuilder(bytes.length * 2);
		formatter = new Formatter(sb);
		for (byte b : bytes) {
			formatter.format("%02x", b);
		}
		return sb.toString();
	}
}
