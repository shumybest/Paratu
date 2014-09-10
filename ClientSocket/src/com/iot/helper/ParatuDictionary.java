package com.iot.helper;

public class ParatuDictionary {
	
	public final static String[] weatherChoices = {"����", "����", "����", "ѩ��"};
	public final static String[] switchesChoices = {"��", "��"};
	public final static String[] testChoices = {"����ռ��", "����ռ��", "����ռ��"};
	
	public final static String dateTimerCN = "ʱ��";
	public final static String weatherCN = "����";
	public final static String emailCN = "�����ʼ�";
	public final static String deviceCN = "����Paratu�豸";
	public final static String recurrenceOnceCN = "��ʱ��ֻ����һ��";
	public final static String recurrenceManyCN = "��ʱ���ظ�";

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