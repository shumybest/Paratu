﻿

(function ($) {

    var resultsName = "";
    var inputElement;
    var displayElement;

    $.fn.extend({
        cronGen: function ( inputData ) {
            var options = {showTime: false, cfg: ""};
            if( inputData ) {
                options.cfg = inputData;
            }

            if (/^(disValue|cfgValue)$/i.test(options.cfg)) {
                options.cfg = (options.cfg).toLowerCase();

                switch(options.cfg){
                    case "disvalue":
                        return displayElement.val();
                    case "cfgvalue":
                        return inputElement.val();
                    default:
                        break;
                }
            } else if( /^showTime/i.test(options.cfg)){
                options.cfg = (options.cfg).toLowerCase();
                options.showTime = true;
                console.log("hellow");

            } else if ( options.cfg ) {

                var settings = $.extend({
                    disTime: "",
                    cfgTime:""

                }, options.cfg);

                inputElement.val(settings.cfgTime);
                displayElement.val(settings.disTime);

                return;
            }

            //create top menu
            var cronContainer = $("<div/>", { id: "CronContainer", style: "display:none;width:300px;height:300px;" });
            var mainDiv = $("<div/>", { id: "CronGenMainDiv", style: "width:450px;height:270px;" });
            var topMenu = $("<ul/>", { "class": "nav nav-tabs", id: "CronGenTabs" });
            $('<li/>', { 'class': 'active' }).html($('<a id="MinutesTab" href="#Minutes">Minutes</a>')).appendTo(topMenu);
            $('<li/>').html($('<a id="HourlyTab" href="#Hourly">Hourly</a>')).appendTo(topMenu);
            $('<li/>').html($('<a id="DailyTab" href="#Daily">Daily</a>')).appendTo(topMenu);
            $('<li/>').html($('<a id="WeeklyTab" href="#Weekly">Weekly</a>')).appendTo(topMenu);
            $('<li/>').html($('<a id="MonthlyTab" href="#Monthly">Monthly</a>')).appendTo(topMenu);
            //$('<li/>').html($('<a id="YearlyTab" href="#Yearly">Yearly</a>')).appendTo(topMenu); pdli
            $(topMenu).appendTo(mainDiv);

            //create what's inside the tabs
            var container = $("<div/>", { "class": "container-fluid", "style": "margin-top: 10px" });
            var row = $("<div/>", { "class": "row-fluid" });
            var span12 = $("<div/>", { "class": "col-md-12" });
            var tabContent = $("<div/>", { "class": "tab-content" });

            //creating the minutesTab
            var minutesTab = $("<div/>", { "class": "tab-pane active", id: "Minutes" });
            $(minutesTab).append("Every&nbsp;");
            $("<input/>", { id: "MinutesInput", type: "text", value: "1", style: "width: 40px" }).appendTo(minutesTab);
            $(minutesTab).append("&nbsp;minute(s)");
            $(minutesTab).appendTo(tabContent);

            //creating the hourlyTab
            var hourlyTab = $("<div/>", { "class": "tab-pane", id: "Hourly" });

            var hourlyOption1 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "1", name: "HourlyRadio", checked: "checked" }).appendTo(hourlyOption1);
            $(hourlyOption1).append("&nbsp;Every&nbsp;");
            $("<input/>", { id: "HoursInput", type: "text", value: "1", style: "width: 40px" }).appendTo(hourlyOption1);
            $(hourlyOption1).append("&nbsp;hour(s)");
            $(hourlyOption1).appendTo(hourlyTab);

            var hourlyOption2 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "2", name: "HourlyRadio" }).appendTo(hourlyOption2);
            $(hourlyOption2).append("&nbsp;At&nbsp;");
            $(hourlyOption2).append('<select id="AtHours" class="hours" style="width: 60px"></select>');
            $(hourlyOption2).append('<select id="AtMinutes" class="minutes" style="width: 60px"></select>');
            $(hourlyOption2).appendTo(hourlyTab);

            $(hourlyTab).appendTo(tabContent);

            //craeting the dailyTab
            var dailyTab = $("<div/>", { "class": "tab-pane", id: "Daily" });

            var dailyOption1 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "1", name: "DailyRadio", checked: "checked" }).appendTo(dailyOption1);
            $(dailyOption1).append("&nbsp;Every&nbsp;");
            $("<input/>", { id: "DaysInput", type: "text", value: "1", style: "width: 40px" }).appendTo(dailyOption1);
            $(dailyOption1).append("&nbsp;day(s)");
            $(dailyOption1).appendTo(dailyTab);

            var dailyOption2 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "2", name: "DailyRadio" }).appendTo(dailyOption2);
            $(dailyOption2).append("&nbsp;Every week day&nbsp;");
            $(dailyOption2).appendTo(dailyTab);

            if(options.showTime) {
                $(dailyTab).append("Start time&nbsp;");
                $(dailyTab).append('<select id="DailyHours" class="hours" style="width: 60px"></select>');
                $(dailyTab).append('<select id="DailyMinutes" class="minutes" style="width: 60px"></select>');
            }

            $(dailyTab).appendTo(tabContent);

            //craeting the weeklyTab
            var weeklyTab = $("<div/>", { "class": "tab-pane", id: "Weekly" });
            var weeklyWell = $("<div/>", { "class": "well well-small" });

            var span31 = $("<div/>", { "class": "col-md-6 col-sm-6" });
            $("<input/>", { type: "checkbox", value: "1", name:"一"}).appendTo(span31);
            $(span31).append("&nbsp;Monday<br />");
            $("<input/>", { type: "checkbox", value: "3", name:"三" }).appendTo(span31);
            $(span31).append("&nbsp;Wednesday<br />");
            $("<input/>", { type: "checkbox", value: "5", name:"五"}).appendTo(span31);
            $(span31).append("&nbsp;Friday<br />");
            $("<input/>", { type: "checkbox", value: "7", name:"日" }).appendTo(span31);
            $(span31).append("&nbsp;Sunday");

            var span32 = $("<div/>", { "class": "col-md-6 col-sm-6" });
            $("<input/>", { type: "checkbox", value: "2", name:"二" }).appendTo(span32);
            $(span32).append("&nbsp;Tuesday<br />");
            $("<input/>", { type: "checkbox", value: "4", name:"四" }).appendTo(span32);
            $(span32).append("&nbsp;Thursday<br />");
            $("<input/>", { type: "checkbox", value: "6", name:"六" }).appendTo(span32);
            $(span32).append("&nbsp;Saturday");

            $(span31).appendTo(weeklyWell);
            $(span32).appendTo(weeklyWell);
            //Hack to fix the well box
            $("<br /><br /><br /><br />").appendTo(weeklyWell);

            $(weeklyWell).appendTo(weeklyTab);

            if(options.showTime) {
                $(weeklyTab).append("Start time&nbsp;");
                $(weeklyTab).append('<select id="WeeklyHours" class="hours" style="width: 60px"></select>');
                $(weeklyTab).append('<select id="WeeklyMinutes" class="minutes" style="width: 60px"></select>');
            }

            $(weeklyTab).appendTo(tabContent);

            //craeting the monthlyTab
            var monthlyTab = $("<div/>", { "class": "tab-pane", id: "Monthly" });

            var monthlyOption1 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "1", name: "MonthlyRadio", checked: "checked" }).appendTo(monthlyOption1);
            $(monthlyOption1).append("&nbsp;Day&nbsp");
            $("<input/>", { id: "DayOfMOnthInput", type: "text", value: "1", style: "width: 40px" }).appendTo(monthlyOption1);
            $(monthlyOption1).append("&nbsp;of every&nbsp;");
            $("<input/>", { id: "MonthInput", type: "text", value: "1", style: "width: 40px" }).appendTo(monthlyOption1);
            $(monthlyOption1).append("&nbsp;month(s)");
            $(monthlyOption1).appendTo(monthlyTab);

            var monthlyOption2 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "2", name: "MonthlyRadio" }).appendTo(monthlyOption2);
            $(monthlyOption2).append("&nbsp;");
            //$(monthlyOption2).append('<select id="WeekDay" class="day-order-in-month" style="width: 80px"></select>'); pdli
            $(monthlyOption2).append('<select id="DayInWeekOrder" class="week-days" style="width: 100px"></select>');
            $(monthlyOption2).append("&nbsp;of every&nbsp;");
            $("<input/>", { id: "EveryMonthInput", type: "text", value: "1", style: "width: 40px" }).appendTo(monthlyOption2);
            $(monthlyOption2).append("&nbsp;month(s)");
            $(monthlyOption2).appendTo(monthlyTab);

            if(options.showTime) {
                $(monthlyTab).append("Start time&nbsp;");
                $(monthlyTab).append('<select id="MonthlyHours" class="hours" style="width: 60px"></select>');
                $(monthlyTab).append('<select id="MonthlyMinutes" class="minutes" style="width: 60px"></select>');
            }
            $(monthlyTab).appendTo(tabContent);

            //craeting the yearlyTab
            var yearlyTab = $("<div/>", { "class": "tab-pane", id: "Yearly" });

            var yearlyOption1 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "1", name: "YearlyRadio", checked: "checked" }).appendTo(yearlyOption1);
            $(yearlyOption1).append("&nbsp;Every&nbsp");
            $(yearlyOption1).append('<select id="MonthsOfYear" class="months" style="width: 150px"></select>');
            $(yearlyOption1).append("&nbsp;in day&nbsp;");
            $("<input/>", { id: "YearInput", type: "text", value: "1", style: "width: 40px" }).appendTo(yearlyOption1);
            $(yearlyOption1).appendTo(yearlyTab);

            var yearlyOption2 = $("<div/>", { "class": "well well-small" });
            $("<input/>", { type: "radio", value: "2", name: "YearlyRadio" }).appendTo(yearlyOption2);
            $(yearlyOption2).append("&nbsp;The&nbsp;");
            $(yearlyOption2).append('<select id="DayOrderInYear" class="day-order-in-month" style="width: 80px"></select>');
            $(yearlyOption2).append('<select id="DayWeekForYear" class="week-days" style="width: 100px"></select>');
            $(yearlyOption2).append("&nbsp;of&nbsp;");
            $(yearlyOption2).append('<select id="MonthsOfYear2" class="months" style="width: 110px"></select>');
            $(yearlyOption2).appendTo(yearlyTab);

            if( options.showTime ) {
                $(yearlyTab).append("Start time&nbsp;");
                $(yearlyTab).append('<select id="YearlyHours" class="hours" style="width: 60px"></select>');
                $(yearlyTab).append('<select id="YearlyMinutes" class="minutes" style="width: 60px"></select>');
            }

            //$(yearlyTab).appendTo(tabContent); pdli
            $(tabContent).appendTo(span12);

            //creating the button and results input           
            resultsName = $(this).prop("id");
            $(this).prop("name", resultsName);

            $(span12).appendTo(row);
            $(row).appendTo(container);
            $(container).appendTo(mainDiv);
            $(cronContainer).append(mainDiv);

            var that = $(this);

            // Hide the original input
            that.hide();

            // Replace the input with an input group
            var $g = $("<div  id=\"pop_cronGen\" >").addClass("input-group");
            // Add an input
            var $i = $("<input>", { type: 'text', placeholder: 'Cron trigger', readonly: 'readonly',id: 'new-input' }).addClass("form-control").val($(that).val());
            $i.appendTo($g);

            // Add the button
            var $b = $("<button id=\"test_pdli\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-edit\"></i></button>");
            // Put button inside span
            var $s = $("<span style=\"width: 70%\" >").addClass("input-group-btn");
            //var $pd = $("</div>");
            $b.appendTo($s);
            $s.appendTo($g);

            $(this).before($g);

            inputElement = that;
            displayElement = $i;

            $i.click(function(){
                $b.popover('hide');
            });

            $b.popover({
                html: true,
                content: function () {
                    return $(cronContainer).html();
                },
                template: '<div class="popover" style="max-width:480px !important; width:480px"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
                placement: 'bottom'

            }).on('click', function (e) {
                    e.preventDefault();
                    //alert("pop over is active");
                    //alert("$b is " + $b.attr('id'));

                    fillDataOfMinutesAndHoursSelectOptions();
                    fillDayWeekInMonth();
                    fillInWeekDays();
                    fillInMonths();
                    $('#CronGenTabs a').click(function (e) {
                        e.preventDefault();
                        $(this).tab('show');
                        //generate( options );
                    });
                    $("#pop_cronGen select,input").change(function (e) {
                        generate( options );
                    });
                    $("#pop_cronGen input").focus(function (e) {
                        generate( options );
                    });
                    //generate( options );
                });
            return;
        }
    });


    var fillInMonths = function () {
        var days = [
            { text: "January", val: "1" },
            { text: "February", val: "2" },
            { text: "March", val: "3" },
            { text: "April", val: "4" },
            { text: "May", val: "5" },
            { text: "June", val: "6" },
            { text: "July", val: "7" },
            { text: "August", val: "8" },
            { text: "September", val: "9" },
            { text: "October", val: "10" },
            { text: "Novermber", val: "11" },
            { text: "December", val: "12" }
        ];
        $(".months").each(function () {
            fillOptions(this, days);
        });
    };

    var fillOptions = function (elements, options) {
        for (var i = 0; i < options.length; i++)
            $(elements).append("<option value='" + options[i].val + "' name='" + options[i].name +"'>" + options[i].text + "</option>");
    };
    var fillDataOfMinutesAndHoursSelectOptions = function () {
        for (var i = 0; i < 60; i++) {
            if (i < 24) {
                $(".hours").each(function () { $(this).append(timeSelectOption(i)); });
            }
            $(".minutes").each(function () { $(this).append(timeSelectOption(i)); });
        }
    };
    var fillInWeekDays = function () {
        var days = [
            { text: "Monday", val: "1", name: "一" },
            { text: "Tuesday", val: "2", name: "二" },
            { text: "Wednesday", val: "3", name:"三"},
            { text: "Thursday", val: "4", name:"四" },
            { text: "Friday", val: "5", name:"五"},
            { text: "Saturday", val: "6", name:"六" },
            { text: "Sunday", val: "7", name:"日" }
        ];
        $(".week-days").each(function () {
            fillOptions(this, days);
        });

    };
    var fillDayWeekInMonth = function () {
        var days = [
            { text: "First", val: "1" },
            { text: "Second", val: "2" },
            { text: "Third", val: "3" },
            { text: "Fourth", val: "4" }
        ];
        $(".day-order-in-month").each(function () {
            fillOptions(this, days);
        });
    };
    var displayTimeUnit = function (unit) {
        if (unit.toString().length == 1)
            return "0" + unit;
        return unit;
    };
    var timeSelectOption = function (i) {
        return "<option id='" + i + "'>" + displayTimeUnit(i) + "</option>";
    };

    var generate = function ( options ) {

        var activeTab = $("ul#CronGenTabs li.active a").prop("id");
        var results = "";
        var resultsDis = "";
        var resultsTmp = "";
        switch (activeTab) {
            case "MinutesTab":
                results = "*/" + $("#MinutesInput").val() + " * * * *";
                resultsDis = "每 " +  $("#MinutesInput").val() + " 分钟";
                break;
            case "HourlyTab":
                switch ($("input:radio[name=HourlyRadio]:checked").val()) {
                    case "1": //隔小时
                        results = "* */" + $("#HoursInput").val() + " * * *";
                        resultsDis = "每 " + $("#HoursInput").val() + " 小时";
                        break;
                    case "2": //at which time every day
                        results = "" + Number($("#AtMinutes").val()) + " " + Number($("#AtHours").val()) + " * * *";
                        resultsDis = "每天 " + Number($("#AtHours").val()) + ":" +  Number($("#AtMinutes").val()) + " 分";
                        break;
                }
                break;
            case "DailyTab":
                switch ($("input:radio[name=DailyRadio]:checked").val()) {
                    case "1":
                        results = "" + Number($("#DailyMinutes").val()) + " " + Number($("#DailyHours").val()) + " */" + $("#DaysInput").val() + " * *";
                        if( options.showTime ) {
                            resultsDis = "每 " + $("#DaysInput").val() + " 天的 " + Number($("#DailyHours").val()) + ":" + Number($("#DailyMinutes").val()) + " 分";
                        } else {
                            resultsDis = "每 " + $("#DaysInput").val() + " 天";
                        }
                        break;
                    case "2":
                        results = "" + Number($("#DailyMinutes").val()) + " " + Number($("#DailyHours").val()) + " * * 1-5";
                        if( options.showTime ) {
                            resultsDis = "每个工作日的 " + Number($("#DailyHours").val()) + ":" + Number($("#DailyMinutes").val()) + " 分";
                        } else {
                            resultsDis = "所有工作日";
                        }
                        break;
                }
                break;
            case "WeeklyTab":
                var selectedDays = "";
                var selectedArray = []
                $("#Weekly input:checkbox:checked").each(function () {
                    selectedDays += $(this).val() + ",";
                    selectedArray.push($(this).val());
                });
                if (selectedDays.length > 0)
                    selectedDays = selectedDays.substr(0, selectedDays.length - 1);
                results = "" + Number($("#WeeklyMinutes").val()) + " " + Number($("#WeeklyHours").val()) + " * * " + selectedDays + "";
                if( options.showTime ) {
                    resultsDis = "每周 " + selectedArray.sort() + " 的 " +  Number($("#WeeklyHours").val()) + ":" + Number($("#WeeklyMinutes").val()) + " 分";
                } else {
                    resultsDis = "每周 " + selectedArray.sort();
                }
                break;
            case "MonthlyTab":
                switch ($("input:radio[name=MonthlyRadio]:checked").val()) {
                    case "1":
                        results = "" + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " " + $("#DayOfMOnthInput").val() + " */" + $("#MonthInput").val() + " *";
                        if( options.showTime ) {
                            resultsDis = "每 " +  $("#MonthInput").val() + " 个月的第 " + $("#DayOfMOnthInput").val() + " 天的 " + Number($("#MonthlyHours").val())+ ":" + Number($("#MonthlyMinutes").val()) + " 分";
                        } else {
                            resultsDis = "每 " +  $("#MonthInput").val() + " 个月的第 " + $("#DayOfMOnthInput").val() + " 天";
                        }
                        break;
                    case "2":
                        results = "" + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " * */" + Number($("#EveryMonthInput").val()) + " " + $("#DayInWeekOrder").val();// + " *";
                        if( options.showTime ) {
                            resultsDis = "每 "+ Number($("#EveryMonthInput").val()) + " 月的周 " +  $("#DayInWeekOrder").val() + " 的 " + Number($("#MonthlyHours").val()) + ":" + Number($("#MonthlyMinutes").val()) + " 分";
                        } else {
                            resultsDis = "每 "+ Number($("#EveryMonthInput").val()) + " 月的周 " +  $("#DayInWeekOrder").val() ;
                        }
                        break;
                }
                break;
            /* case "YearlyTab":
             switch ($("input:radio[name=YearlyRadio]:checked").val()) {
             case "1":
             results = "0 " + Number($("#YearlyMinutes").val()) + " " + Number($("#YearlyHours").val()) + " " + $("#YearInput").val() + " " + $("#MonthsOfYear").val() + " ? *";
             break;
             case "2":
             results = "0 " + Number($("#YearlyMinutes").val()) + " " + Number($("#YearlyHours").val()) + " ? " + $("#MonthsOfYear2").val() + " " + $("#DayWeekForYear").val() + "#" + $("#DayOrderInYear").val() + " *";
             break;
             }
             break;*/
        }

        // Update original control

        if(results !== inputElement.val()){
            if(results !== "") {
                inputElement.val(results);
                displayElement.val(resultsDis);
                inputElement.change(); //it is trick to trigger change event, pdli
            }
        }

       /* if(inputElement.val() !== displayElement.val()){
            // Update display
        }*/
    };

})(jQuery);

