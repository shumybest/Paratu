package com.doomonafireball.betterpickers.datepicker;

import com.doomonafireball.betterpickers.R;
import com.doomonafireball.betterpickers.datepicker.DatePickerDialogFragment.DatePickerDialogHandler;

import android.app.Activity;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.Vector;

/**
 * Dialog to set alarm time.
 */
public class DatePickerFragment extends Fragment {

    public static final String THEME_RES_ID_KEY = "DatePickerFragment_ThemeResIdKey";
    public static final String MONTH_KEY = "DatePickerFragment_MonthKey";
    public static final String DAY_KEY = "DatePickerFragment_DayKey";
    public static final String YEAR_KEY = "DatePickerFragment_YearKey";

    protected DatePicker mPicker;

    protected int mMonthOfYear = -1;
    protected int mDayOfMonth = 0;
    protected int mYear = 0;

    protected int mTheme = -1;
    protected View mDividerOne, mDividerTwo;
    protected int mDividerColor;
    protected ColorStateList mTextColor;
    protected int mButtonBackgroundResId;
    protected int mDialogBackgroundResId;
    private Vector<DatePickerFragmentHandler> mDatePickerFragmentHandlers = new Vector<DatePickerFragmentHandler>();

    /**
     * Create an instance of the Picker (used internally)
     *
     * @param reference an (optional) user-defined reference, helpful when tracking multiple Pickers
     * @param themeResId the style resource ID for theming
     * @param monthOfYear (optional) zero-indexed month of year to pre-set
     * @param dayOfMonth (optional) day of month to pre-set
     * @param year (optional) year to pre-set
     * @return a Picker!
     */
    public static DatePickerFragment newInstance(int reference, int themeResId, Integer monthOfYear,
            Integer dayOfMonth, Integer year) {
        final DatePickerFragment frag = new DatePickerFragment();
        Bundle args = new Bundle();
        args.putInt(THEME_RES_ID_KEY, themeResId);
        if (monthOfYear != null) {
            args.putInt(MONTH_KEY, monthOfYear);
        }
        if (dayOfMonth != null) {
            args.putInt(DAY_KEY, dayOfMonth);
        }
        if (year != null) {
            args.putInt(YEAR_KEY, year);
        }
        frag.setArguments(args);
        return frag;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle args = getArguments();
        if (args != null && args.containsKey(THEME_RES_ID_KEY)) {
            mTheme = args.getInt(THEME_RES_ID_KEY);
        }
        if (args != null && args.containsKey(MONTH_KEY)) {
            mMonthOfYear = args.getInt(MONTH_KEY);
        }
        if (args != null && args.containsKey(DAY_KEY)) {
            mDayOfMonth = args.getInt(DAY_KEY);
        }
        if (args != null && args.containsKey(YEAR_KEY)) {
            mYear = args.getInt(YEAR_KEY);
        }

        // Init defaults
        mTextColor = getResources().getColorStateList(R.color.dialog_text_color_holo_dark);
        mButtonBackgroundResId = R.drawable.button_background_dark;
        mDividerColor = getResources().getColor(R.color.default_divider_color_dark);
        mDialogBackgroundResId = R.drawable.dialog_full_holo_dark;

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
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.date_picker_fragment, null);
        mPicker = (DatePicker) v.findViewById(R.id.date_picker);
        mPicker.setDate(mYear, mMonthOfYear, mDayOfMonth);
        mPicker.setDateRightListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                for (DatePickerFragmentHandler handler : mDatePickerFragmentHandlers) {
                    handler.onFragmentDateSet(mPicker.getYear(), mPicker.getMonthOfYear(),
                            mPicker.getDayOfMonth());
                }
                final Activity activity = getActivity();
                final Fragment fragment = getTargetFragment();
                if (activity instanceof DatePickerDialogHandler) {
                    final DatePickerFragmentHandler act =
                            (DatePickerFragmentHandler) activity;
                    act.onFragmentDateSet(mPicker.getYear(), mPicker.getMonthOfYear(),
                            mPicker.getDayOfMonth());
                } else if (fragment instanceof DatePickerDialogHandler) {
                    final DatePickerFragmentHandler frag =
                            (DatePickerFragmentHandler) fragment;
                    frag.onFragmentDateSet(mPicker.getYear(), mPicker.getMonthOfYear(),
                            mPicker.getDayOfMonth());
                }
            }
        });

        mDividerOne = v.findViewById(R.id.divider_1);
        mDividerOne.setBackgroundColor(mDividerColor);
        mPicker.setTheme(mTheme);

        return v;
    }

    /**
     * This interface allows objects to register for the Picker's set action.
     */
    public interface DatePickerFragmentHandler {
        void onFragmentDateSet(int year, int monthOfYear, int dayOfMonth);
    }

    /**
     * Attach a Vector of handlers to be notified in addition to the Fragment's Activity and target Fragment.
     *
     * @param handlers a Vector of handlers
     */
    public void setDatePickerFragmentHandlers(Vector<DatePickerFragmentHandler> handlers) {
        mDatePickerFragmentHandlers = handlers;
    }
}