
var drawCtr = new ControlDrawElecChart();

function selectOneDevice(e) {
    //device starttime endtime
    drawCtr.selectOneDevice(e.val(), e.attr("label"));
}

function deselectDevice(e) {
    var count = drawCtr.getSelectedCount();
    if (count === 1 || e === "unSelectAll") {
        var defaultChart;
        drawCtr.resetToDefault();
        alert("What should we do, I have no idea");
    } else {
        drawCtr.deleteDevice(e.val());
    }
}

function changeTimeZone(e) {
    var start = $('#startdateInput').val();
    var end =  $('#enddateInput').val();

     $('#'+ e).datetimepicker('hide');

    if (compareDateInString(start, end)){ //start>end

        if (e === "startElecTime"){
            $('#enddateInput').val( start);
        }
        else {
            $('#startdateInput').val(end);
        }
    }

    drawCtr.changeTimeZone("startdateInput", "enddateInput");
}

function selectAllDevice(e) {
    drawCtr.selectAllDevice(e);
}


$(document).ready(function () {

    window.onload = function () {
        $("#startdateInput").val(now());
        $("#enddateInput").val(now());
        //{coreid: coreId, startday: ControlDrawElecChart.startTimeSetInfo,endday: ControlDrawElecChart.endTimeSetInfo, type:xAxisType  }
        var req = {coreid: ["9876543212"], startday: '2014-05-08', endday:"2014-05-08", type:"hour"};
        $.ajax({
            type: "POST",
            url: '/device/showElec',
            data: req,
            dataType: 'json',
            success: function (data, textStatus) {
                drawCtr.resetToDefault();
                drawColumn("showCustomerColumn");
            }
        });
    };

    <!-- Initialize the plugin: -->
    $('#deviceSelect').multiselect({
        includeSelectAllOption: true,
        maxHeight: 150,
        buttonWidth: 250,
        onChange: function (e, checked) {
            if(e.val() == "multiselect-all") {
                if(checked) {
                    //alert("select options clicked");
                    selectAllDevice("deviceSelect");
                } else { //unchecked
                    deselectDevice("unSelectAll");
                }
            } else {
                if (checked) {
                    selectOneDevice(e);
                } else {
                    deselectDevice(e);
                }
            }
        }
    });

    $('#startElecTime').datetimepicker({
        format: "yyyy-mm-dd", //"yyyy-mm-dd hh:ii",pdli
        autoclose: true,
        todayBtn: true,
        endDate: now(),
        pickerPosition: "bottom-left"
    }).on("changeDate",function(){
          changeTimeZone("startElecTime");

        });

    $('#endElecTime').datetimepicker({
        format: "yyyy-mm-dd",// hh:ii",pdli
        autoclose: true,
        todayBtn: true,
        endDate: now(),
        pickerPosition: "bottom-left"
    }).on("changeDate", function(){
            changeTimeZone("endElecTime");

        });


    /********************************/
}); //End of  $(document).ready(function