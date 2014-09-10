package com.iot.wizard.ui;

import com.doomonafireball.betterpickers.datepicker.DatePicker;
import com.doomonafireball.betterpickers.datepicker.DatePickerFragment;
import com.iot.paratu.R;
import com.iot.wizard.model.DatePickerPage;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.res.TypedArray;
import android.os.Bundle;
import android.text.format.Time;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class ParatuDatePickerFragment extends DatePickerFragment {
	
    private static final String ARG_KEY = "key";

    private PageFragmentCallbacks mCallbacks;
    private String mKey;
    private DatePickerPage mPage;

    public static ParatuDatePickerFragment create(String key, int themeResId, Integer monthOfYear,
            Integer dayOfMonth, Integer year) {
        Bundle args = new Bundle();		
        args.putInt(DatePickerFragment.THEME_RES_ID_KEY, themeResId);
        
        if (monthOfYear != null) {
            args.putInt(DatePickerFragment.MONTH_KEY, monthOfYear);
        }
        if (dayOfMonth != null) {
            args.putInt(DatePickerFragment.DAY_KEY, dayOfMonth);
        }
        if (year != null) {
            args.putInt(DatePickerFragment.YEAR_KEY, year);
        }
        args.putString(ARG_KEY, key);

		ParatuDatePickerFragment fragment = new ParatuDatePickerFragment();
        fragment.setArguments(args);
        
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle args = getArguments();
        mKey = args.getString(ARG_KEY);
        mPage = (DatePickerPage) mCallbacks.onGetPage(mKey);
    }

    @SuppressLint("Recycle")
	@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.activity_fragment_datepicker, container, false);
        ((TextView) rootView.findViewById(android.R.id.title)).setText(mPage.getTitle());
        
        if (mTheme != -1) {
            TypedArray a = getActivity().getApplicationContext()
                    .obtainStyledAttributes(mTheme, R.styleable.BetterPickersDialogFragment);

            mTextColor = a.getColorStateList(R.styleable.BetterPickersDialogFragment_bpTextColor);
            mButtonBackgroundResId = a.getResourceId(R.styleable.BetterPickersDialogFragment_bpButtonBackground,
                    mButtonBackgroundResId);
            mDividerColor = a.getColor(R.styleable.BetterPickersDialogFragment_bpDividerColor, mDividerColor);
            mDialogBackgroundResId = a
                    .getResourceId(R.styleable.BetterPickersDialogFragment_bpDialogBackground, mDialogBackgroundResId);
        }
        
        mPicker = (DatePicker) rootView.findViewById(R.id.date_picker);
        mPicker.setDate(mYear, mMonthOfYear, mDayOfMonth);
        mPicker.setTheme(mTheme);
        
        return rootView;
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

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        mPicker.setDateRightListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Time date = new Time();
				date.set(mPicker.getDayOfMonth(), mPicker.getMonthOfYear(), mPicker.getYear());
                
				mPage.getReviewData().putString(DatePickerPage.DATE_DATA_KEY,
						date.format("%Y-%m-%d"));
				mPage.notifyDataChanged();
			}
        });
    }
}