package com.iot.paratu;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.iot.db.ParatuDevice;
import com.iot.db.ParatuIFTTT;
import com.iot.helper.ParatuFragment;
import com.iot.wizard.IFTTTWizard;

public class IFTTTFragment extends ParatuFragment {
	
	private View mRootView;
	private Button mNewIftttButton;
	private TableLayout mTable;
	
	private ParatuIFTTT mIFTTT;
		
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		mRootView = inflater.inflate(R.layout.activity_fragment_ifttt,
				container, false);
		mNewIftttButton = (Button)mRootView.findViewById(R.id.ifttt_new_button);
		mNewIftttButton.setOnClickListener(new NewIftttClickListener());
		mTable = (TableLayout)mRootView.findViewById(R.id.ifttt_table);

		return mRootView;
	}
	
	public void doSomething() {
		addItem();
	}
	
	public void addItem() {
//		TextView header = new TextView(getActivity());
//		header.setText(mDevice.devicename);
//		header.setTextSize(24);
//		header.setPadding(10, 5, 0, 5);
//		header.setFreezesText(true);
//		
//		Switch onoff = new Switch(getActivity());
//		onoff.setPadding(0, 5, 10, 5);
//		
//		TableRow row = new TableRow(getActivity());
//		row.addView(header);
//		row.addView(onoff);
//		
//		TextView desc = new TextView(getActivity());
//		desc.setText(mDevice.coreid);
//		desc.setTextSize(16);
//		desc.setTextColor(Color.rgb(204, 204, 204));
//		desc.setPadding(10, 5, 0, 5);
//		desc.setFreezesText(true);
//		
//		TableRow descrow = new TableRow(getActivity());
//		descrow.addView(desc);
//		
//		mTable.addView(row);
//		mTable.addView(descrow);
	}
	
	class NewIftttClickListener implements OnClickListener {

		@Override
		public void onClick(View view) {
			Intent intent = new Intent(getActivity(), IFTTTWizard.class);
			getActivity().startActivity(intent);
		}
	}
}
