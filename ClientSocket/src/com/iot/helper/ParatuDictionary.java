package com.iot.helper;

public class ParatuDictionary {
	
	public final static String[] weatherChoices = {"晴天", "雨天", "阴天", "雪天"};
	public final static String[] switchesChoices = {"开", "关"};
	public final static String[] testChoices = {"测试占坑", "测试占坑", "测试占坑"};
	
	public final static String dateTimerCN = "时间";
	public final static String weatherCN = "天气";
	public final static String emailCN = "发送邮件";
	public final static String deviceCN = "控制Paratu设备";
	public final static String recurrenceOnceCN = "按时间只发生一次";
	public final static String recurrenceManyCN = "按时间重复";

	public final static String dateTimer = "dateTimer";
	public final static String weather = "weather";
	public final static String email = "email";
	public final static String device = "device";
	public final static String recurrenceOnce = "onlyonce";
	public final static String recurrenceMany = "multiple";
	
	public static String translateForIfttt(String in) {
		if(in.equals(dateTimerCN)) {
			return dateTimer;
		} else if(in.equals(weatherCN)) {
			return weather;
		} else if(in.equals(emailCN)) {
			return email;
		} else if(in.equals(deviceCN)) {
			return device;
		} else if(in.equals(switchesChoices[0])) {
			return "1";
		} else if(in.equals(switchesChoices[1])) {
			return "0";
		} else if(in.equals(recurrenceOnceCN)) {
			return recurrenceOnceCN;
		} else if(in.equals(recurrenceManyCN)) {
			return recurrenceMany;
		}
		
		return in;
	}
}