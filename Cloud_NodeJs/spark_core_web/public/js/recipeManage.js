/**
 * Created by pdli on 14-5-21.
 */

function encodeDateTimerEventToCrontab( dateTimeJson ){
    var dateTimeStr = "";
    var dateTimeArray = (dateTimeJson.time).split('-');
    alert("encoding is called " + dateTimeArray);
    if(dateTimeJson.recurrence === "OnlyOnce"){
        dateTimeStr = dateTimeJson.time;
    } else if(dateTimeJson.recurrence === "EveryDay"){
        dateTimeStr = "";
        dateTimeStr += dateTimeArray.pop() + " ";
        dateTimeStr += dateTimeArray.pop() + " ";
        dateTimeStr += "*" + " ";
        dateTimeStr += "*" + " ";
        dateTimeStr += "*";
    } else if(dateTimeJson.recurrence === "Weekday"){
        dateTimeStr = "";
        dateTimeStr += dateTimeArray.pop() + " ";
        dateTimeStr += dateTimeArray.pop() + " ";
        dateTimeStr += "*" + " ";
        dateTimeStr += "*" + " ";
        dateTimeStr += "1,2,3,4,5";
    } else {
        alert("encoding recipe error, triggerEvent.event.recurrence is not recognized ");
    }

    return dateTimeStr;
}

function decodeDateTimerEventFromCrontab( dateTimeStr){

    var dateTimeJson = {time: "", recurrence:""};

    if( dateTimeStr.indexOf('-') > 1) {
        dateTimeJson.time = dateTimeStr;
        dateTimeJson.recurrence = "OnlyOnce";
        return dateTimeJson ;

    } else {

        var dateTimeArray = dateTimeStr.split(' ');
        dateTimeJson.time = now();
        //just care about EveryDay & OnlyOnce
        if ( "*" === dateTimeArray.pop()){
            //Week
        }
        if ( "*" === dateTimeArray.pop() ) {
            //Month
        }
        if( "*" === dateTimeArray.pop() ) {
            dateTimeJson.recurrence = "EveryDay";
        }
        // ignore Every hour and every Min
        dateTimeJson.time += "-" + dateTimeArray.pop();
        dateTimeJson.time += "-" + dateTimeArray.pop();
    }

    return dateTimeJson;
}


function encodeDataForRecipeInfo(){

    var triggerEvent = recipeInfoByEdit.triggerEvent;

    if(triggerEvent.type === "dateTimer") {
        triggerEvent.event.time = encodeDateTimerEventToCrontab(triggerEvent.event);
         delete triggerEvent.event['recurrence'];
    }

}

function decodeDataForRecipeInfo(){
    var triggerEvent = recipeInfoByLoad.triggerEvent;
    
    if(triggerEvent.type === "dateTimer"){
       //var test = decodeDateTimerEventFromCrontab(triggerEvent.event.time);
       // alert("Decode is called " + test.time + test.recurrence);
        triggerEvent.event = decodeDateTimerEventFromCrontab(triggerEvent.event.time);
       // alert("Decode is called " + recipeInfoByLoad.triggerEvent.event.time + recipeInfoByLoad.triggerEvent.event.recurrence);
    }
}

function loadRecipeRecFrame( frameId, triggerType ) {
    alert(triggerType);
    switch(triggerType) {
        case "dateTimer":
            $('#' + frameId).load('p_t_editDateTimerRec');
            break;
        case "weather":
            $('#' + frameId).load('p_t_editOthersRec');
            break;
        default:
            alert("triggerType not existed in loadRecipeRecFrame: " + triggerType);
            break;
    }

}

function loadTriggerEventFrame( frameId, triggerType) {
    switch(triggerType){
        case "dateTimer":
            $('#' + frameId).load('p_t_editTimer');
            break;
        case "weather":
            $('#' + frameId).load('p_t_editWeath');
            break;
        default :
            alert("triggerType not existed: " + triggerType);
            break;
    }
}

function loadResponseEventFrame ( frameId, responseType, optionCfg){
    switch ( responseType ) {
        case "device": //distribution class
            $('#' + frameId).load('p_r_switchDevice', optionCfg);
            break;
        case "Email" : //centralize class
            $('#' + frameId).load('p_a_editEmail');
            break;
        default :
            alert("responseType not existed: " + responseType);
            break;
    }
}