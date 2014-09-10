var deviceModel = require("../../models/deviceModel");


exports.loadActionInfo = function(req) {
    var reqData = {owner: req.session.user.name};

    deviceModel.doFindAll(reqData,function(data){

        var switchDevice = eval("("+data+")");
        switchDevice.forEach( function(value, index){
            value.type = "device";
        });

        var Email = {type:"Email", deviceName:"Email", coreId:"ALL"};

        switchDevice.push(Email);

        console.log(switchDevice);

        return switchDevice;
    });
    //console.log("after");

    //var Paratu_Lighter_1 = {type:"device", deviceName:"Lighter_1", coreId:"PL0805"};
    //var Email = {type:"Email", deviceName:"Email", coreId:"ALL"};
  //[Paratu_Lighter_1, Email];

}

exports.loadTriggerInfo = function() {
    //var triggerInfo = {type: "", deviceName:"", coreId:""};
    var dateTimer = {type: "dateTimer", deviceName:"时钟", coreId:"ALL"}
    var weather = {type: "weather", deviceName: "天气预报", coreId: "ALL"};
    var humSensor = {type: "humSensor", deviceName:"湿度传感器一", coreId:"01023"};
    //var triggerArray =

    return [dateTimer, weather, humSensor];
}

exports.loadRecipeInfo = function() {
    var recipeList = [
        {
            _id: "1",
            active: true,
            triggerEvent: {
                type: "dateTimer",
                event: {
                    time: "08:30"
                }
            },
            recipeRec: {
                rec: "2014-05-21-08-30"
            },
            responseEvent:{
                type: "device",
                event: {
                    coreid: "0123456789",
                    deviceName: "Lighter_1",
                    operation: "turnOnOff",
                    value: "1"
                }
            }
        },
        {
            _id: "2",
            active: true,
            triggerEvent: {
                type: "dateTimer",
                event: {
                    time: "11:45"
                }
            },
            recipeRec: {
                rec: "45 11 * * 1,2,3,4,5"
            },
            responseEvent:{
                type: "device",
                event: {
                    coreid: "789456123",
                    deviceName: "Lighter_2",
                    operation: "turnOnOff",
                    value: "0"
                }
            }
        },
        {
            _id: "13",
            active: false,
            triggerEvent: {
                type: "weather",
                event: {
                    temperature: 30,
                    recurrence: "Weekday"
                }
            },
            recipeRec: {
                rec: "45 11 * * 1,2,3,4,5"
            },
            responseEvent:{
                type: "Email",
                event: {
                    sendTo: "pengli.ccnu@gmail.com",
                    context: "Hello World, this is from STUB"
                }
            }
        }];

    return recipeList;
}