package com.iot.wizard.ui;

import java.text.DateFormatSymbols;

import org.jraf.android.backport.switchwidget.Switch;

import com.doomonafireball.betterpickers.calendardatepicker.CalendarDatePickerDialog;
import com.doomonafireball.betterpickers.recurrencepicker.EventRecurrence;
import com.doomonafireball.betterpickers.recurrencepicker.RecurrencePickerFragment;
import com.doomonafireball.betterpickers.recurrencepicker.Utils;
import com.iot.paratu.R;
import com.iot.wizard.model.RecurrencePickerPage;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.text.format.Time;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.ToggleButton;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.CompoundButton.OnCheckedChangeListener;

public class ParatuRecurrencePickerFragment extends RecurrencePickerFragment
		implements OnClickListener, OnItemSelectedListener,
		OnCheckedChangeListener,
		android.widget.RadioGroup.OnCheckedChangeListener,
		CalendarDatePickerDialog.OnDateSetListener {
	
    private static final String ARG_KEY = "key";

    private PageFragmentCallbacks mCallbacks;
    private String mKey;
    private RecurrencePickerPage mPage;

    public static ParatuRecurrencePickerFragment create(String key) {
        Bundle args = new Bundle();		
        args.putString(ARG_KEY, key);

		ParatuRecurrencePickerFragment fragment = new ParatuRecurrencePickerFragment();
        fragment.setArguments(args);
        
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle args = getArguments();
        mKey = args.getString(ARG_KEY);
        mPage = (RecurrencePickerPage) mCallbacks.onGetPage(mKey);
    }

	@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        mRecurrence.wkst = EventRecurrence.timeDay2Day(Utils.getFirstDayOfWeek(getActivity()));

        boolean endCountHasFocus = false;
        if (savedInstanceState != null) {
            RecurrenceModel m = (RecurrenceModel) savedInstanceState.get(BUNDLE_MODEL);
            if (m != null) {
                mModel = m;
            }
            endCountHasFocus = savedInstanceState.getBoolean(BUNDLE_END_COUNT_HAS_FOCUS);
        } else {
            Bundle b = getArguments();
            if (b != null) {
                mTime.set(b.getLong(BUNDLE_START_TIME_MILLIS));

                String tz = b.getString(BUNDLE_TIME_ZONE);
                if (!TextUtils.isEmpty(tz)) {
                    mTime.timezone = tz;
                }
                mTime.normalize(false);

                // Time days of week: Sun=0, Mon=1, etc
                mModel.weeklyByDayOfWeek[mTime.weekDay] = true;
                String rrule = b.getString(BUNDLE_RRULE);
                if (!TextUtils.isEmpty(rrule)) {
                    mModel.recurrenceState = RecurrenceModel.STATE_RECURRENCE;
                    mRecurrence.parse(rrule);
                    copyEventRecurrenceToModel(mRecurrence, mModel);
                    // Leave today's day of week as checked by default in weekly view.
                    if (mRecurrence.bydayCount == 0) {
                        mModel.weeklyByDayOfWeek[mTime.weekDay] = true;
                    }
                }

            } else {
                mTime.setToNow();
            }
        }

        mResources = getResources();
        mView = inflater.inflate(R.layout.activity_fragment_recurrencepicker, container, false);
        ((TextView) mView.findViewById(android.R.id.title)).setText(mPage.getTitle());

        mRepeatSwitch = (Switch) mView.findViewById(R.id.repeat_switch);
        mRepeatSwitch.setChecked(mModel.recurrenceState == RecurrenceModel.STATE_RECURRENCE);
        mRepeatSwitch.setOnCheckedChangeListener(new OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                mModel.recurrenceState = isChecked ? RecurrenceModel.STATE_RECURRENCE
                        : RecurrenceModel.STATE_NO_RECURRENCE;
                togglePickerOptions();
                collectRecurrence();
            }
        });

        mFreqSpinner = (Spinner) mView.findViewById(R.id.freqSpinner);
        mFreqSpinner.setOnItemSelectedListener(this);
        ArrayAdapter<CharSequence> freqAdapter = ArrayAdapter.createFromResource(getActivity(),
                R.array.recurrence_freq, R.layout.recurrencepicker_freq_item);
        freqAdapter.setDropDownViewResource(R.layout.recurrencepicker_freq_item);
        mFreqSpinner.setAdapter(freqAdapter);

        mInterval = (EditText) mView.findViewById(R.id.interval);
        mInterval.addTextChangedListener(new minMaxTextWatcher(1, INTERVAL_DEFAULT, INTERVAL_MAX) {
        	
            @Override
            public void onChange(int v) {
                if (mIntervalResId != -1 && mInterval.getText().toString().length() > 0) {
                    mModel.interval = v;
                    updateIntervalText();
                    mInterval.requestLayout();
                    collectRecurrence();
                }
            }
        });
        mIntervalPreText = (TextView) mView.findViewById(R.id.intervalPreText);
        mIntervalPostText = (TextView) mView.findViewById(R.id.intervalPostText);

        mEndNeverStr = mResources.getString(R.string.recurrence_end_continously);
        mEndDateLabel = mResources.getString(R.string.recurrence_end_date_label);
        mEndCountLabel = mResources.getString(R.string.recurrence_end_count_label);

        mEndSpinnerArray.add(mEndNeverStr);
        mEndSpinnerArray.add(mEndDateLabel);
        mEndSpinnerArray.add(mEndCountLabel);
        mEndSpinner = (Spinner) mView.findViewById(R.id.endSpinner);
        mEndSpinner.setOnItemSelectedListener(this);
        mEndSpinnerAdapter = new EndSpinnerAdapter(getActivity(), mEndSpinnerArray,
                R.layout.recurrencepicker_freq_item, R.layout.recurrencepicker_end_text);
        mEndSpinnerAdapter.setDropDownViewResource(R.layout.recurrencepicker_freq_item);
        mEndSpinner.setAdapter(mEndSpinnerAdapter);

        mEndCount = (EditText) mView.findViewById(R.id.endCount);
        mEndCount.addTextChangedListener(new minMaxTextWatcher(1, COUNT_DEFAULT, COUNT_MAX) {
        	
            @Override
            public void onChange(int v) {
                if (mModel.endCount != v) {
                    mModel.endCount = v;
                    updateEndCountText();
                    mEndCount.requestLayout();
                    collectRecurrence();
                }
            }
        });
        mPostEndCount = (TextView) mView.findViewById(R.id.postEndCount);

        mEndDateTextView = (TextView) mView.findViewById(R.id.endDate);
        mEndDateTextView.setOnClickListener(this);
        if (mModel.endDate == null) {
            mModel.endDate = new Time(mTime);
            switch (mModel.freq) {
                case RecurrenceModel.FREQ_DAILY:
                case RecurrenceModel.FREQ_WEEKLY:
                    mModel.endDate.month += 1;
                    break;
                case RecurrenceModel.FREQ_MONTHLY:
                    mModel.endDate.month += 3;
                    break;
                case RecurrenceModel.FREQ_YEARLY:
                    mModel.endDate.year += 3;
                    break;
            }
            mModel.endDate.normalize(false);
            collectRecurrence();
        }

        mWeekGroup = (LinearLayout) mView.findViewById(R.id.weekGroup);
        mWeekGroup2 = (LinearLayout) mView.findViewById(R.id.weekGroup2);

        // In Calendar.java day of week order e.g Sun = 1 ... Sat = 7
        String[] dayOfWeekString = new DateFormatSymbols().getWeekdays();

        mMonthRepeatByDayOfWeekStrs = new String[7][];
        // from Time.SUNDAY as 0 through Time.SATURDAY as 6
        mMonthRepeatByDayOfWeekStrs[0] = mResources.getStringArray(R.array.repeat_by_nth_sun);
        mMonthRepeatByDayOfWeekStrs[1] = mResources.getStringArray(R.array.repeat_by_nth_mon);
        mMonthRepeatByDayOfWeekStrs[2] = mResources.getStringArray(R.array.repeat_by_nth_tues);
        mMonthRepeatByDayOfWeekStrs[3] = mResources.getStringArray(R.array.repeat_by_nth_wed);
        mMonthRepeatByDayOfWeekStrs[4] = mResources.getStringArray(R.array.repeat_by_nth_thurs);
        mMonthRepeatByDayOfWeekStrs[5] = mResources.getStringArray(R.array.repeat_by_nth_fri);
        mMonthRepeatByDayOfWeekStrs[6] = mResources.getStringArray(R.array.repeat_by_nth_sat);

        // In Time.java day of week order e.g. Sun = 0
        int idx = Utils.getFirstDayOfWeek(getActivity());

        // In Calendar.java day of week order e.g Sun = 1 ... Sat = 7
        dayOfWeekString = new DateFormatSymbols().getShortWeekdays();

        int numOfButtonsInRow1;
        int numOfButtonsInRow2;

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.HONEYCOMB_MR2) {
            // Get screen width in dp first
            Display display = getActivity().getWindowManager().getDefaultDisplay();
            DisplayMetrics outMetrics = new DisplayMetrics();
            display.getMetrics(outMetrics);

            float density = getResources().getDisplayMetrics().density;
            float dpWidth = outMetrics.widthPixels / density;
            if (dpWidth > MIN_SCREEN_WIDTH_FOR_SINGLE_ROW_WEEK) {
                numOfButtonsInRow1 = 7;
                numOfButtonsInRow2 = 0;
                mWeekGroup2.setVisibility(View.GONE);
                mWeekGroup2.getChildAt(3).setVisibility(View.GONE);
            } else {
                numOfButtonsInRow1 = 4;
                numOfButtonsInRow2 = 3;

                mWeekGroup2.setVisibility(View.VISIBLE);
                mWeekGroup2.getChildAt(3).setVisibility(View.INVISIBLE);
            }
        } else {
            numOfButtonsInRow1 = 4;
            numOfButtonsInRow2 = 3;

            mWeekGroup2.setVisibility(View.VISIBLE);
            mWeekGroup2.getChildAt(3).setVisibility(View.INVISIBLE);
        }

        /* First row */
        for (int i = 0; i < 7; i++) {
            if (i >= numOfButtonsInRow1) {
                mWeekGroup.getChildAt(i).setVisibility(View.GONE);
                continue;
            }

            mWeekByDayButtons[idx] = (ToggleButton) mWeekGroup.getChildAt(i);
            mWeekByDayButtons[idx].setTextOff(dayOfWeekString[TIME_DAY_TO_CALENDAR_DAY[idx]]);
            mWeekByDayButtons[idx].setTextOn(dayOfWeekString[TIME_DAY_TO_CALENDAR_DAY[idx]]);
            mWeekByDayButtons[idx].setOnCheckedChangeListener(this);

            if (++idx >= 7) {
                idx = 0;
            }
        }

        /* 2nd Row */
        for (int i = 0; i < 3; i++) {
            if (i >= numOfButtonsInRow2) {
                mWeekGroup2.getChildAt(i).setVisibility(View.GONE);
                continue;
            }
            mWeekByDayButtons[idx] = (ToggleButton) mWeekGroup2.getChildAt(i);
            mWeekByDayButtons[idx].setTextOff(dayOfWeekString[TIME_DAY_TO_CALENDAR_DAY[idx]]);
            mWeekByDayButtons[idx].setTextOn(dayOfWeekString[TIME_DAY_TO_CALENDAR_DAY[idx]]);
            mWeekByDayButtons[idx].setOnCheckedChangeListener(this);

            if (++idx >= 7) {
                idx = 0;
            }
        }

        mMonthGroup = (RadioGroup) mView.findViewById(R.id.monthGroup);
        mMonthRepeatByRadioGroup = (RadioGroup) mMonthGroup;
        mMonthRepeatByRadioGroup.setOnCheckedChangeListener(this);
        mRepeatMonthlyByNthDayOfWeek = (RadioButton) mView
                .findViewById(R.id.repeatMonthlyByNthDayOfTheWeek);
        mRepeatMonthlyByNthDayOfMonth = (RadioButton) mView
                .findViewById(R.id.repeatMonthlyByNthDayOfMonth);

        togglePickerOptions();
        updateDialog();
        if (endCountHasFocus) {
            mEndCount.requestFocus();
        }
        return mView;
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

    protected class minMaxTextWatcher implements TextWatcher {

        private int mMin;
        private int mMax;
        private int mDefault;

        public minMaxTextWatcher(int min, int defaultInt, int max) {
            mMin = min;
            mMax = max;
            mDefault = defaultInt;
        }

        @Override
        public void afterTextChanged(Editable s) {

            boolean updated = false;
            int value;
            try {
                value = Integer.parseInt(s.toString());
            } catch (NumberFormatException e) {
                value = mDefault;
            }

            if (value < mMin) {
                value = mMin;
                updated = true;
            } else if (value > mMax) {
                updated = true;
                value = mMax;
            }

            // Update UI
            if (updated) {
                s.clear();
                s.append(Integer.toString(value));
            }

            onChange(value);
        }

        /**
         * Override to be called after each key stroke
         */
        void onChange(int value) {
        }

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }
    }
    
    @Override
    public void onClick(View v) {
        if (mEndDateTextView == v) {
            if (mDatePickerDialog != null) {
                mDatePickerDialog.dismiss();
            }
            mDatePickerDialog = CalendarDatePickerDialog.newInstance(this, mModel.endDate.year,
                    mModel.endDate.month, mModel.endDate.monthDay);
            mDatePickerDialog.setFirstDayOfWeek(Utils.getFirstDayOfWeekAsCalendar(getActivity()));
            mDatePickerDialog.setYearRange(Utils.YEAR_MIN, Utils.YEAR_MAX);
            mDatePickerDialog.show(getFragmentManager(), FRAG_TAG_DATE_PICKER);
        } else {
        	collectRecurrence();
        }
    }
    
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
    	super.onItemSelected(parent, view, position, id);
    	collectRecurrence();
    }
    
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
    	super.onCheckedChanged(buttonView, isChecked);
    	collectRecurrence();
    }
    
    public void onCheckedChanged(RadioGroup group, int checkedId) {
    	super.onCheckedChanged(group, checkedId);
    	collectRecurrence();
    }
    
    public void onDateSet(CalendarDatePickerDialog view, int year, int monthOfYear, int dayOfMonth) {
    	super.onDateSet(view, year, monthOfYear, dayOfMonth);
    	collectRecurrence();
    }
    
    public void collectRecurrence() {
        String rrule;
        if (mModel.recurrenceState == RecurrenceModel.STATE_NO_RECURRENCE) {
            rrule = null;
        } else {
            copyModelToEventRecurrence(mModel, mRecurrence);
            rrule = mRecurrence.toPerfectString();
    		mPage.getReviewData().putString(RecurrencePickerPage.RECURRENCE_DATA_KEY,
    				rrule);
    		mPage.notifyDataChanged();
        }
    }
}