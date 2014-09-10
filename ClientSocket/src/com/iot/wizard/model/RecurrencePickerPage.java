package com.iot.wizard.model;

import com.iot.db.ParatuIFTTT;
import com.iot.wizard.ui.ParatuRecurrencePickerFragment;

import android.support.v4.app.Fragment;
import android.text.TextUtils;

import java.util.ArrayList;

public class RecurrencePickerPage extends Page {
    public static final String RECURRENCE_DATA_KEY = "recurrence";

    public RecurrencePickerPage(ModelCallbacks callbacks, String title) {
        super(callbacks, title);
    }

    @Override
    public Fragment createFragment() {
        return ParatuRecurrencePickerFragment.create(getKey());
    }

    @Override
    public void getReviewItems(ArrayList<ReviewItem> dest) {
        dest.add(new ReviewItem("ÖØ¸´ÖÜÆÚ", mReviewData.getString(RECURRENCE_DATA_KEY), getKey(), -1));
    }

	@Override
	public void getIftttData(ParatuIFTTT collector) {
		collector.putKeyValue(mIFTTTDataType, mIFTTTDataKey, mReviewData.getString(RECURRENCE_DATA_KEY));
	}
    
    @Override
    public boolean isCompleted() {
        return !TextUtils.isEmpty(mReviewData.getString(RECURRENCE_DATA_KEY));
    }
    
}
