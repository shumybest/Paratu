/**
 * Created by pdli on 14-5-27.
 */
/**
 * Created by pdli on 14-5-21.
 */
function now() {
    var t = new Date();
    var mon = t.getMonth() + 1;
    var day = t.getDate();
    if(mon < 10) {
        mon = "0" + mon;
    }
    if (day< 10) {
        day = "0" + day;
    }
    return (t.getUTCFullYear() + "-" + mon + "-" + day);
}

function decodeDateFromCrontab ( dateTimeStr ) {

    var dateTimeJson = {disRec: "", rec:""};

    if( dateTimeStr.indexOf('*') > -1) {  //MultiTimes
        var dateTimeArray = dateTimeStr.split(/ |-|:/);
        dateTimeJson.recurrence = "MultiTimes";
        dateTimeJson.rec = dateTimeStr;
        dateTimeJson.disRec = "";
        dateTimeArray.forEach( function(value, index){
            dateTimeArray[index] = value.replace(/\*\//g, "");
        });
        //time
        //"45 11 * * 1,2,3,4,5"
        if( dateTimeArray[3] !== "*"){
            dateTimeJson.disRec += "每 " + dateTimeArray[3] + " 月 ";
        }
        if( dateTimeArray[2] !== "*"){
            dateTimeJson.disRec += "第 " + dateTimeArray[2] + " 日 ";
        }
        if( dateTimeArray[4] !== "*"){
            dateTimeJson.disRec += "每周 " + dateTimeArray[4] + " 日 ";
        }
        if( dateTimeArray[1] !== "*"){
            dateTimeJson.disRec += dateTimeArray[1] + ":";
        }
        if( dateTimeArray[0] !== "*"){
            dateTimeJson.disRec += dateTimeArray[0] + " 时";
        }

    } else { //onlyOnce, use 2014-05-27-16-18
        var timeArray = dateTimeStr.split(/-| |:/);
        dateTimeJson.rec = timeArray[0] + "-" + timeArray[1] + "-" + timeArray[2];
        dateTimeJson.disRec = timeArray[0] + "-" + timeArray[1] + "-" + timeArray[2] + " 的 " + timeArray[3] + ":" + timeArray[4] + " 时";
        dateTimeJson.recurrence = "OnlyOnce";
    }

    return dateTimeJson;
}

function isMultiTimesRecipe ( cfg ){
    if(cfg.indexOf('*') >  -1) {
        return true;
    } else {
        return false;
    }
}

exports.encodeDataForRecipeInfo = function( recipeData ){
    var data = recipeData;

    if(data.triggerEvent.type === "dateTimer") {

        if( isMultiTimesRecipe( data.recipeRec.rec ) ) {
            var timeArray = (data.triggerEvent.event.time).split(/:| |-/);
            data.recipeRec.rec = (data.recipeRec.rec).replace(/\S* \S*/, (timeArray[4] + " " + timeArray[3]));
        } else {
            data.recipeRec.rec = data.triggerEvent.event.time;
        }
        delete data.recipeRec['disRec'];
    }

    return data;
}

exports.decodeDataForRecipeInfo = function( dataArray ) {
    var data = dataArray;

    for (var i = 0; i< data.length; i++ ){
        console.log(i);
        data[i].recipeRec = decodeDateFromCrontab(data[i].recipeRec.rec);
        console.log( data[i].recipeRec );
    }
    return data;
}


/*******************************************************************************************************************************************/
function extractDesFromRecipeRecurrence(data){ //recipeRec: {rec, disRec}
    return  data.disRec;
}

function extractDesFromTriggerEvent (data) {
    var des = "";
    switch (data.type) {
        case "dateTimer" :
           //des += data.event.time;
            break;
        case "weather":
            des += " 当" + data.event.location +"的天气转为"+ data.event.weather +" 时";
            break;
        default : break;
    }
    return des;
}

function extractDesFromResponseEvent (data) {
    var des = "";
    switch (data.type) {
        case "device":
            if(data.event.value === "1") {
                des += " 打开 "  + data.event.deviceName;
            } else if(data.event.value === "0"){
                des += " 关闭 " + data.event.deviceName;
            }
        default : break;
    }
    return des;
}

function extractImgFromOneRecipeEvent ( data ){ //triggerEvent, responseEvent
    var img = "";
    switch(data.type){
        case "dateTimer":
            img = "/images/ifttt/Timer.png";
            break;
        case "weather":
            img = "/images/ifttt/Weather.png";
            break;
        case "device":
            img = "/images/ifttt/lighter.png";
            break;
        default :
            img = "/images/ifttt/alert.png";
            //console.log("translate img is falied " + data.type);
            break;
    }
    return img;
}

exports.extractRecipeInfoFromServer = function( data ){

    var recipeInServer = data;
    var recipeInfo = [];//{active: "true", des: "", triggerImg: "", responseImg: "", triggerId: "", indexInSession: ""};

    for ( var i=0 ; i< recipeInServer.length; i++){
        //console.log(recipeInServer[i]);
        var cfg = {active: "true", des: "", triggerImg: "", responseImg: "", triggerId: "", indexInSession: ""};
        cfg.indexInSession = i;
        cfg.active = recipeInServer[i].active;
        cfg.iftttId = recipeInServer[i]._id;
        cfg.des += extractDesFromRecipeRecurrence(recipeInServer[i].recipeRec);
        cfg.des += extractDesFromTriggerEvent(recipeInServer[i].triggerEvent);
        cfg.des += extractDesFromResponseEvent(recipeInServer[i].responseEvent);
        cfg.triggerImg = extractImgFromOneRecipeEvent(recipeInServer[i].triggerEvent);
        cfg.responseImg = extractImgFromOneRecipeEvent(recipeInServer[i].responseEvent);
        //console.log(cfg);
        recipeInfo.push(cfg);
    }

    return recipeInfo;
}