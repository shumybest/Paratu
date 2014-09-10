package com.iot.paratu;

import java.util.ArrayList;

import org.json.JSONException;

import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.echo.holographlibrary.Bar;
import com.echo.holographlibrary.BarGraph;
import com.echo.holographlibrary.Line;
import com.echo.holographlibrary.LineGraph;
import com.echo.holographlibrary.LineGraph.OnPointClickedListener;
import com.echo.holographlibrary.LinePoint;
import com.iot.db.ParatuDevice;
import com.iot.db.ParatuElectric;
import com.iot.helper.ParatuFragment;

public class UsageFragment extends ParatuFragment {
	private View mRootView;
	private TextView mDataView;
	
	private ParatuDevice mDevice;
	private ParatuElectric mElectric;
	private ParatuElectric mTotalElectric;
	
	private GetElectricUsageTask mGetElectricUsageTask = null;
	private GetElectricTotalBarUsageTask mGetElectricTotalBarUsageTask = null;
	
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		mRootView = inflater.inflate(R.layout.activity_fragment_usage, container, false);
		mDataView = (TextView)mRootView.findViewById(R.id.datatextView);
		mDataView.setFreezesText(true);
		return mRootView;
	}
	
	public void doSomething() {
		if(null == mDevice)
			return;
		
		if (null != mGetElectricUsageTask)
			return;
		
		try {
			mGetElectricUsageTask = new GetElectricUsageTask();
			mGetElectricUsageTask.execute(mElectric.toJsonRequestString("showElec", mDevice, "hour"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if (null != mGetElectricTotalBarUsageTask)
			return;
		
		try {
			mGetElectricTotalBarUsageTask = new GetElectricTotalBarUsageTask();
			mGetElectricTotalBarUsageTask.execute(mTotalElectric.toJsonRequestString("showElecDayTotal", mDevice, "day"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void drawLineGraph() {
		if(mElectric.getDataCount() <= 0)
			return;
		
        final Resources resources = getResources();
        Line line = new Line();
        line.setUsingDips(true);
        
        for(int i = 0; i < mElectric.getDataCount(); i++) {
        	LinePoint p = new LinePoint();
        	p.setX(i);
        	p.setY(mElectric.getData(i));
        	p.setColor(resources.getColor(R.color.blue));
        	p.setSelectedColor(resources.getColor(R.color.transparent_blue));
        	line.addPoint(p);
        }
        
        line.setColor(resources.getColor(R.color.blue));

        LineGraph graph = (LineGraph) mRootView.findViewById(R.id.linegraph);
        graph.setUsingDips(true);
        graph.removeAllLines();
        graph.addLine(line);
        graph.setRangeY(0, mElectric.getMaxData());
        graph.setLineToFill(1);

        graph.setOnPointClickedListener(new OnPointClickedListener() {
            @Override
            public void onClick(int lineIndex, int pointIndex) {
                mDataView.setText("µçÁ¿£º " + String.valueOf(mElectric.getData(pointIndex)));
            }
        });
	}
	
	private class GetElectricUsageTask extends AsyncTask<String, Void, String> {
		protected String doInBackground(String... args) {
			try {
				if(mService != null){
					return mService.sendAndExpect(args[0], "res");
				} else {
					return "";
				}
			} catch (Throwable e) {
				e.printStackTrace();
			}
			return "";
		}

		protected void onPostExecute(final String result) {
			try {
				if(result != "") {
					mElectric.put(result);
					drawLineGraph();
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
			mGetElectricUsageTask = null;
		}
		
		@Override
		protected void onCancelled() {
			mGetElectricUsageTask = null;
		}
	}
		
	private void drawBarGraph() {
		if(mTotalElectric.getDataCount() <= 0)
			return;
		
		final Resources resources = getResources();

		ArrayList<Bar> aBars = new ArrayList<Bar>();
		for(int i = 0; i < mTotalElectric.getDataCount(); i++) {
			Bar bar = new Bar();
			bar.setColor(resources.getColor(R.color.transparent_blue));
			bar.setSelectedColor(resources.getColor(R.color.blue));
			bar.setName(mTotalElectric.getDay(i));
			bar.setValue(mTotalElectric.getData(i));
			bar.setValueString(String.valueOf(mTotalElectric.getData(i)));
			aBars.add(bar);
		}
		
		BarGraph barGraph = (BarGraph) mRootView.findViewById(R.id.bargraph);
		barGraph.setBars(aBars);
	}
	
	private class GetElectricTotalBarUsageTask extends AsyncTask<String, Void, String> {
		protected String doInBackground(String... args) {
			try {
				if(mService != null){
					return mService.sendAndExpect(args[0], "res");
				} else {
					return "";
				}
			} catch (Throwable e) {
				e.printStackTrace();
			}
			return "";
		}

		protected void onPostExecute(final String result) {
			try {
				if(result != "") {
					mTotalElectric.put(result);
					drawBarGraph();
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
			mGetElectricTotalBarUsageTask = null;
		}
		
		@Override
		protected void onCancelled() {
			mGetElectricTotalBarUsageTask = null;
		}
	}

	public void setDevice(ParatuDevice paratuDevice) {
		mDevice = paratuDevice;
		mElectric = new ParatuElectric(mDevice);
		mTotalElectric = new ParatuElectric(mDevice);
	}
}
