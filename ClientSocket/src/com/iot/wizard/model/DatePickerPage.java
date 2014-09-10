package com.iot.wizard.model;

import com.iot.db.ParatuIFTTT;
import com.iot.paratu.R;
import com.iot.wizard.ui.ParatuDatePickerFragment;

import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.text.format.Time;

import java.util.ArrayList;

public class DatePickerPage extends Page {
    public static final String DATE_DATA_KEY = "date";

    public DatePickerPage(ModelCallbacks callbacks, String title) {
        super(callbacks, title);
    }

    @Override
    public Fragment createFragment() {
		Time now = new Time();
		now.setToNow();
		
        return ParatuDatePickerFragment.create(getKey(), R.style.BetterPickersDialogFragment_Light,
				now.month, now.monthDay, now.year);
    }

    @Override
    public void getReviewItems(ArrayList<ReviewItem> dest) {
        dest.add(new ReviewItem("ÈÕÆÚ", mReviewData.getString(DATE_DATA_KEY), getKey(), -1));
    }

	@Override
	public void getIftttData(ParatuIFTTT collector) {
		collector.putKeyValue(mIFTTTDataType, mIFTTTDataKey, mReviewData.getString(DATE_DATA_KEY));
	}
    
    @Override
    public boolean isCompleted() {
        return !TextUtils.isEmpty(mReviewData.getString(DATE_DATA_KEY));
    }
}
