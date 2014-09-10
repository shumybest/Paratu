/**
 * Created by pdli on 14-5-8.
 * Function: Create class controlDrawElecChart
 */
//document.write("<script type='text/javascript' src='/js/drawElec.js'></"+"script>");

function ControlDrawElecChart() {}

ControlDrawElecChart.deviceSelectedInfo = {}; // {coreId: deviceName}
ControlDrawElecChart.startTimeSetInfo = now();
ControlDrawElecChart.endTimeSetInfo = now();
ControlDrawElecChart.elecAccum = {xaxisValue: [], xaxisType:"天", yaxisValue: {}};
ControlDrawElecChart.elecOnTime = {xaxisValue: [], xaxisType:"天", yaxisValue: {}};

ControlDrawElecChart.prototype.getDeviceJSON = function() {
    return ControlDrawElecChart.deviceSelectedInfo;
}

ControlDrawElecChart.defaultYaxisValue =  [{
    "name": "无设备或数据",
    "marker": {"symbol": 'circle'},
    "data": [11,12,0,11,0,11,14,15,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2,1,2,0,1,0,1,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2]
}];


//change xAxisType->[hour| day| month]
function getXAxisType(startTimeStr, endTimeStr) {
    var start = startTimeStr.split('-');
    var end = endTimeStr.split('-');
    var gap = 365*( parseInt(end[0]) - parseInt(start[0])) + 30* (parseInt(end[1]) - parseInt(start[1])) + (parseInt(end[2]) - parseInt(start[2]));
    if(gap >150) {
        return "month";
    } else if(gap > 5) {
        return "day" ;
    } else {
        return "hour";
    }
}

ControlDrawElecChart.prototype.drawChartWithAjaxRsp = function(coreId, isMulti)
{
    var self = this;
    var xAxisType = getXAxisType(ControlDrawElecChart.startTimeSetInfo, ControlDrawElecChart.endTimeSetInfo);
    if( coreId == "") {
        alert("coreId is empty");
        return;
    }
    $.ajax({
        type: "POST",
        url: '/device/showElec',
        data: {coreid: coreId, startday: ControlDrawElecChart.startTimeSetInfo,endday: ControlDrawElecChart.endTimeSetInfo, type:xAxisType  },//starttime: ControlDrawElecChart.startTimeSetInfo, endtime:ControlDrawElecChart.endTimeSetInfo},pdli
        dataType: 'json',
        success: function (data, textStatus) {
            if(jQuery.isEmptyObject(data.elecAccum.yaxisValue)){
                alert("No data found in DB");
                //drawCtr.resetToDefault();
            }
            drawCtr.insertLocalElecRecord(coreId, data, isMulti);
            drawCombineChart(self);
        }
    });
}

ControlDrawElecChart.prototype.selectOneDevice = function(coreId, devicename) {
    var self = this;
    self.markSelected(coreId, devicename);
    if (!this.isRecordExistedInLocal(coreId)){
        self.drawChartWithAjaxRsp([coreId], false);
    } else {
        //this.markSelected(coreId, devicename);
        drawCombineChart(self);
    }
}

ControlDrawElecChart.prototype.changeTimeZone = function(startTimeHtmlId, endTimeHtmlId){

    var self = this;
    var coreId = Object.keys(self.getDeviceJSON());

    self.setStartTime( $("#" +  startTimeHtmlId).val());
    self.setEndTime( $("#" + endTimeHtmlId).val());

    self.drawChartWithAjaxRsp(coreId, true);
}

//Input format: "#selectHtmlId"
ControlDrawElecChart.prototype.selectAllDevice = function(selectHtmlId){

    var options = $("#" + selectHtmlId);
    var self = this;
    self.clearDevice();
    $("#" + selectHtmlId+' option').each(function(){
        if ($(this).val() != "multiselect-all") { //ignore selectAll option
            self.markSelected($(this).val(), $(this).attr("label"));
        }
    });
    var coreId = Object.keys(this.getDeviceJSON());
    self.drawChartWithAjaxRsp(coreId, true);
}

ControlDrawElecChart.prototype.markSelected = function(coreId, deviceName){
    ControlDrawElecChart.deviceSelectedInfo[coreId] = deviceName;
}

ControlDrawElecChart.prototype.deleteDevice = function (coreId) {
    delete ControlDrawElecChart.deviceSelectedInfo[coreId];
    drawCombineChart(this);
};

ControlDrawElecChart.prototype.clearDevice = function() {
    ControlDrawElecChart.deviceSelectedInfo = {};
}

ControlDrawElecChart.prototype.resetToDefault = function () {
    Object.keys(ControlDrawElecChart.deviceSelectedInfo).forEach(function(key){
        delete ControlDrawElecChart.deviceSelectedInfo[key];
    });
    drawCombineChart(this);
}

function yaxisDataJSONtoArray( hashTable) {
    var result = new Array();
    Object.keys(hashTable).forEach(function (key) {
        if(ControlDrawElecChart.deviceSelectedInfo[key] != undefined) {
            result.push( {name: hashTable[key].name, data: hashTable[key].data, marker:hashTable[key].marker});
        }
    });
    return result;
}

ControlDrawElecChart.prototype.getType = function () {

    return ControlDrawElecChart.elecAccum.xaxisType;
    //return "天";
}

ControlDrawElecChart.prototype.getDrawAccumXaxis = function() {
    return ControlDrawElecChart.elecAccum.xaxisValue;
}

ControlDrawElecChart.prototype.getDrawOnTimeXaxis = function() {
    return ControlDrawElecChart.elecOnTime.xaxisValue;
}

ControlDrawElecChart.prototype.getDrawAccumData = function() {
    if(0 == this.getSelectedCount()) {
        return ControlDrawElecChart.defaultYaxisValue;
    } else {
        return yaxisDataJSONtoArray(ControlDrawElecChart.elecAccum.yaxisValue);
    }
}

ControlDrawElecChart.prototype.getDrawOnTimeData = function() {
    if(0 == this.getSelectedCount()) {
        return ControlDrawElecChart.defaultYaxisValue;
    } else {
        return yaxisDataJSONtoArray(ControlDrawElecChart.elecOnTime.yaxisValue);
    }
}

ControlDrawElecChart.prototype.insertLocalElecRecord = function(coreId, data, isMulti) {

    ControlDrawElecChart.elecAccum.xaxisValue = data.elecAccum.xaxisValue;
    ControlDrawElecChart.elecOnTime.xaxisValue = data.elecOnTime.xaxisValue;
    ControlDrawElecChart.elecAccum.xaxisType = data.elecAccum.xaxisType;
    ControlDrawElecChart.elecOnTime.xaxisType = data.elecOnTime.xaxisType;
    if(true == isMulti) {
        ControlDrawElecChart.elecAccum.yaxisValue = data.elecAccum.yaxisValue;
        ControlDrawElecChart.elecOnTime.yaxisValue = data.elecOnTime.yaxisValue;
    } else {
        ControlDrawElecChart.elecAccum.yaxisValue[coreId] = data.elecAccum.yaxisValue[coreId];
        ControlDrawElecChart.elecOnTime.yaxisValue[coreId] = data.elecOnTime.yaxisValue[coreId];
    }
}

ControlDrawElecChart.prototype.getSelectedCount = function() {
    return Object.keys(ControlDrawElecChart.deviceSelectedInfo).length;
}

ControlDrawElecChart.prototype.isRecordExistedInLocal = function(coreId) {
    if (undefined === ControlDrawElecChart.elecAccum.yaxisValue) {
        return false;
    } else {
        var isExisted = (ControlDrawElecChart.elecAccum.yaxisValue).hasOwnProperty(coreId);
        return isExisted;
    }
}

ControlDrawElecChart.prototype.setStartTime = function(timeValue)
{
    ControlDrawElecChart.startTimeSetInfo = timeValue;
}

ControlDrawElecChart.prototype.setEndTime = function(timeValue) {
    ControlDrawElecChart.endTimeSetInfo = timeValue;
}