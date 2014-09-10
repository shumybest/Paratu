package com.iot.wizard.model;

import com.iot.db.ParatuIFTTT;
import com.iot.wizard.ui.ParatuTimePickerFragment;

import android.support.v4.app.Fragment;
import android.text.TextUtils;

import java.util.ArrayList;

public class TimePickerPage extends Page {
    public static final String TIME_DATA_KEY = "time";

    public TimePickerPage(ModelCallbacks callbacks, String title) {
        super(callbacks, title);
    }

    @Override
    public Fragment createFragment() {
        return ParatuTimePickerFragment.create(getKey());
    }

    @Override
    public void getReviewItems(ArrayList<ReviewItem> dest) {
        dest.add(new ReviewItem("Ê±¼ä", mReviewData.getString(TIME_DATA_KEY), getKey(), -1));
    }

	@Override
	public void getIftttData(ParatuIFTTT collector) {
		collector.putKeyValue(mIFTTTDataType, mIFTTTDataKey, mReviewData.getString(TIME_DATA_KEY));
	}
    
    @Override
    public boolean isCompleted() {
        return !TextUtils.isEmpty(mReviewData.getString(TIME_DATA_KEY));
    }
}
