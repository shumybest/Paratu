package com.iot.wizard.ui;

import java.text.DateFormatSymbols;
import java.util.ArrayList;

import com.doomonafireball.betterpickers.HapticFeedbackController;
import com.doomonafireball.betterpickers.radialtimepicker.RadialPickerLayout;
import com.doomonafireball.betterpickers.radialtimepicker.RadialPickerLayout.OnValueSelectedListener;
import com.doomonafireball.betterpickers.radialtimepicker.RadialTimePickerFragment;
import com.iot.paratu.R;
import com.iot.wizard.model.TimePickerPage;

import android.app.Activity;
import android.app.ActionBar.LayoutParams;
import android.content.res.Resources;
import android.os.Bundle;
import android.text.format.Time;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class ParatuTimePickerFragment extends RadialTimePickerFragment implements OnValueSelectedListener {
	
    private static final String ARG_KEY = "key";

    private PageFragmentCallbacks mCallbacks;
    private String mKey;
    private TimePickerPage mPage;

    public static ParatuTimePickerFragment create(String key) {
        Bundle args = new Bundle();
        args.putString(ARG_KEY, key);

		ParatuTimePickerFragment fragment = new ParatuTimePickerFragment();
        fragment.setArguments(args);
        
		Time now = new Time();
		now.setToNow();
		
		fragment.initialize(null, now.hour,
        		now.minute,
        		true);		
        
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle args = getArguments();
        mKey = args.getString(ARG_KEY);
        mPage = (TimePickerPage) mCallbacks.onGetPage(mKey);
    }

	@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_fragment_timepicker, container, false);
        ((TextView) view.findViewById(android.R.id.title)).setText(mPage.getTitle());
        
        Resources res = getResources();
        mHourPickerDescription = res.getString(R.string.hour_picker_description);
        mSelectHours = res.getString(R.string.select_hours);
        mMinutePickerDescription = res.getString(R.string.minute_picker_description);
        mSelectMinutes = res.getString(R.string.select_minutes);
        mSelectedColor = res.getColor(mThemeDark ? R.color.red : R.color.blue);
        mUnselectedColor = res.getColor(mThemeDark ? R.color.white : R.color.numbers_text_color);

        mHourView = (TextView) view.findViewById(R.id.hours);
        mHourSpaceView = (TextView) view.findViewById(R.id.hour_space);
        mMinuteSpaceView = (TextView) view.findViewById(R.id.minutes_space);
        mMinuteView = (TextView) view.findViewById(R.id.minutes);
        mAmPmTextView = (TextView) view.findViewById(R.id.ampm_label);
        String[] amPmTexts = new DateFormatSymbols().getAmPmStrings();
        mAmText = amPmTexts[0];
        mPmText = amPmTexts[1];

        mHapticFeedbackController = new HapticFeedbackController(getActivity());

        mTimePicker = (RadialPickerLayout) view.findViewById(R.id.time_picker);
        mTimePicker.setOnValueSelectedListener(this);
        mTimePicker.initialize(getActivity(), mHapticFeedbackController, mInitialHourOfDay,
                mInitialMinute, true);

        int currentItemShowing = HOUR_INDEX;
        if (savedInstanceState != null &&
                savedInstanceState.containsKey(KEY_CURRENT_ITEM_SHOWING)) {
            currentItemShowing = savedInstanceState.getInt(KEY_CURRENT_ITEM_SHOWING);
        }
        setCurrentItemShowing(currentItemShowing, false, true, true);
        mTimePicker.invalidate();

        mHourView.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                setCurrentItemShowing(HOUR_INDEX, true, false, true);
                tryVibrate();
            }
        });
        mMinuteView.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                setCurrentItemShowing(MINUTE_INDEX, true, false, true);
                tryVibrate();
            }
        });

        mAmPmHitspace = view.findViewById(R.id.ampm_hitspace);
        mAmPmTextView.setVisibility(View.GONE);

        RelativeLayout.LayoutParams paramsSeparator = new RelativeLayout.LayoutParams(
                    LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        paramsSeparator.addRule(RelativeLayout.CENTER_IN_PARENT);
        TextView separatorView = (TextView) view.findViewById(R.id.separator);
        separatorView.setLayoutParams(paramsSeparator);

        mAllowAutoAdvance = true;
        setHour(mInitialHourOfDay, true);
        setMinute(mInitialMinute);

        mDoublePlaceholderText = res.getString(R.string.time_placeholder);
        mDeletedKeyFormat = res.getString(R.string.deleted_key);
        mPlaceholderText = mDoublePlaceholderText.charAt(0);
        mAmKeyCode = mPmKeyCode = -1;
        generateLegalTimesTree();
        if (mInKbMode) {
            mTypedTimes = savedInstanceState.getIntegerArrayList(KEY_TYPED_TIMES);
            tryStartingKbMode(-1);
            mHourView.invalidate();
        } else if (mTypedTimes == null) {
            mTypedTimes = new ArrayList<Integer>();
        }

        mTimePicker.setTheme(getActivity().getApplicationContext(), mThemeDark);
        
        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        if (!(activity instanceof PageFragmentCallbacks)) {
            throw new ClassCastException("Activity must implement PageFragmentCallbacks");
        }

        mCallbacks = (PageFragmentCallbacks)activity;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    public void onValueSelected(int pickerIndex, int newValue, boolean autoAdvance) {
    	super.onValueSelected(pickerIndex, newValue, autoAdvance);
		mPage.getReviewData().putString(TimePickerPage.TIME_DATA_KEY,
				String.valueOf(mTimePicker.getHours()) + ":"
						+ String.valueOf(mTimePicker.getMinutes()));
		mPage.notifyDataChanged();
    }
}