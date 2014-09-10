package com.iot.wizard;

import java.util.Vector;

import com.iot.db.ParatuDevice;
import com.iot.db.ParatuIFTTT;
import com.iot.helper.ParatuDictionary;
import com.iot.wizard.model.AbstractWizardModel;
import com.iot.wizard.model.BranchPage;
import com.iot.wizard.model.DatePickerPage;
import com.iot.wizard.model.PageList;
import com.iot.wizard.model.RecurrencePickerPage;
import com.iot.wizard.model.SingleFixedChoicePage;
import com.iot.wizard.model.TimePickerPage;

import android.content.Context;

public class IFTTTWizardModel extends AbstractWizardModel {
		
	public IFTTTWizardModel(Context context, Vector<ParatuDevice> devices) {
		super(context, devices);
	}

	@Override
	protected PageList onNewRootPageList(Vector<ParatuDevice> devices) {
		
		//Branch Action
		BranchPage actionBranch = new BranchPage(this, "选择动作");
		actionBranch.setDataType(ParatuIFTTT.ACTION_TYPE).setDataKey("type");
		
		// Action: send mail
		actionBranch.addBranch(ParatuDictionary.emailCN,
				new SingleFixedChoicePage(this, "未完待续")
						.setChoices(ParatuDictionary.testChoices)
						.setDataType(ParatuIFTTT.ACTION_EVENT)
						.setDataKey("mail")).setRequired(true);
		
		// Action: device on off
		if(devices.size() > 0) {
			String[] deviceNames = new String[devices.size()];
			for(int index = 0; index < devices.size(); index++) {
				deviceNames[index] = devices.get(index).devicename;
			}
			actionBranch.addBranch(ParatuDictionary.deviceCN,
					new SingleFixedChoicePage(this, "选择设备")
							.setChoices(deviceNames)
							.setDataType(ParatuIFTTT.ACTION_EVENT)
							.setDataKey("device"),
					new SingleFixedChoicePage(this, "控制电源")
							.setChoices(ParatuDictionary.switchesChoices)
							.setDataType(ParatuIFTTT.ACTION_EVENT)
							.setDataKey("value"));
		}
		
		//Branch Trigger
		BranchPage triggerBranch = new BranchPage(this, "触发条件类型");
		triggerBranch.setDataType(ParatuIFTTT.TRIGGER_TYPE).setDataKey("type");
		
		// Trigger: Time
		triggerBranch.addBranch(ParatuDictionary.dateTimerCN,
				new DatePickerPage(this, "选择日期")
						.setRequired(true)
						.setDataType(ParatuIFTTT.TRIGGER_EVENT)
						.setDataKey("date"),
				new TimePickerPage(this, "选择时间")
						.setRequired(true)
						.setDataType(ParatuIFTTT.TRIGGER_EVENT)
						.setDataKey("time"));
		
		// Trigger: weather
		triggerBranch.addBranch(ParatuDictionary.weatherCN,
				new SingleFixedChoicePage(this, "天气情况")
						.setChoices(ParatuDictionary.weatherChoices)
						.setRequired(true)
						.setDataType(ParatuIFTTT.TRIGGER_EVENT)
						.setDataKey("weather")).setRequired(true);
		
		// Branch recurrence
		BranchPage recurrenceBranch = new BranchPage(this, "选择重复周期");
		recurrenceBranch.setDataType(ParatuIFTTT.RECURRENCE_TYPE).setDataKey("type");

		// Recurrence: once
		recurrenceBranch.addBranch(ParatuDictionary.recurrenceOnceCN,
				new DatePickerPage(this, "选择日期")
						.setRequired(true)
						.setDataType(ParatuIFTTT.RECURRENCE_EVENT)
						.setDataKey("date"),
				new TimePickerPage(this, "选择时间")
						.setRequired(true)
						.setDataType(ParatuIFTTT.RECURRENCE_EVENT)
						.setDataKey("time"));
		
		// Recurrence: multiple
		recurrenceBranch.addBranch(ParatuDictionary.recurrenceManyCN,
				new DatePickerPage(this, "选择日期")
						.setRequired(true)
						.setDataType(ParatuIFTTT.RECURRENCE_EVENT)
						.setDataKey("date"),
				new TimePickerPage(this, "选择时间")
						.setRequired(true)
						.setDataType(ParatuIFTTT.RECURRENCE_EVENT)
						.setDataKey("time"),
				new RecurrencePickerPage(this, "选择重复周期")
						.setRequired(false)
						.setDataType(ParatuIFTTT.RECURRENCE_EVENT)
						.setDataKey("recurrence"));
		
		// final page list
		return new PageList(actionBranch, triggerBranch, recurrenceBranch);
	}
}
