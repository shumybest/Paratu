var stub = require('./ifttt_dataInject');

var iftttModel = require("../../models/iftttModel");

var deviceModel = require("../../models/deviceModel");

var moderateModel = require("./encodeIftttRecipe");

/**
 * - load trigger device/app
 * */
exports.redirectAddRecipe = function(req, res){

    var triggerArray = stub.loadTriggerInfo();
    var triggerList = "";
    triggerArray.forEach( function(value, index){
        // humSensor = {type: "humSensor", deviceName:"湿度传感器一", coreId:"01023"};
        triggerList +=  "<option value=" + value.type + " id=" +value.coreId + " label=" +  value.deviceName + ">" +"</option>";
    });

    var reqData = {username: req.session.user.name};
    deviceModel.doFindAll( reqData, function( devices ) {
        var responseDeviceArray = devices.info;//eval("(" + devices + ")");
        responseDeviceArray.forEach( function(value, index){
            value.type = "device";
        });
        console.log("device find in iFTTT");
        console.log(responseDeviceArray);
        var Email = {type:"Email", devicename:"Email", coreid:"ALL"};
        responseDeviceArray.push(Email);

        //console.log(responseDeviceArray);

        var actionList = "";
        responseDeviceArray.forEach( function(value, index) {
            // var Paratu_Lighter_1 = {type:"P_Lighter", deviceName:"Lighter_1", coreId:"PL0805"};
            actionList += "<option class='actionList' value=" + value.type + " id=" +value.coreid + " label=" +  value.devicename + ">" +"</option>";
        });

        res.render('application/ifttt_operation/addRecipe', {triggerlist: triggerList, actionlist: actionList, layout: 'layout/dashboard_layout'});

    });

}

exports.createRecipe = function(req, res) {
    console.log("post add New Recipe");
    //console.log(req.body);
    console.log(moderateModel.encodeDataForRecipeInfo(req.body));
    iftttModel.doCreate( moderateModel.encodeDataForRecipeInfo(req.body), function( msg ){
        res.send( msg );
    });/**/
    //res.send();
}

exports.loadMainPage = function(req, res) {

    var reqData = { owner: req.session.user.name };
    iftttModel.doFindAll( reqData, function(data)
    {
        //console.log("do find All");
        //console.log( data );

        var recipeArray =  moderateModel.decodeDataForRecipeInfo( data.info );//moderateModel.decodeDataForRecipeInfo(stub.loadRecipeInfo());
        req.session.recipeArray = JSON.stringify( recipeArray );
        console.log("Sessions info");
        //console.log(typeof(req.session.recipeArray[0].triggerEvent.event));
        console.log(req.session.recipeArray);


        var recipeList = "<tr><td>#</td><td>激活状态</td><td>工作周期</td><td>触发源</td><td>触发事件</td><td>响应源</td><td>响应事件</td></tr>";
        recipeArray.forEach(function(value, index){
            recipeList += "<tr id=" + index + ">" +
                "<td>" + (index + 1) + "</td>" +
                "<td>"+ value.active +"</td>" +
                "<td>"+ value.triggerEvent.event.recurrence +"</td>" +
                "<td>"+ value.triggerEvent.type +"</td>" +
                "<td>"+ value.triggerEvent.event.time +"</td>" +
                "<td>"+ value.responseEvent.event.coreid +"</td>" +
                "<td>"+ value.responseEvent.event.operation + value.responseEvent.event.value +"</td></tr>";
        });

        var recipeInfo = moderateModel.extractRecipeInfoFromServer( recipeArray );

        res.render('application/ifttt_mainpage', {recipeList: recipeList,  recipeInfo: recipeInfo, layout: 'layout/dashboard_layout'});

    //}
    });
}


exports.renderEditRecipePage = function(req, res){
    var oneRecipe = (JSON.parse(req.session.recipeArray))[req.query.index];
    req.session.recipeSelected = oneRecipe;
   // console.log("Config for selected Recipe is: ");
    //console.log(req.session.recipeSelected);
    var recipeInfoArray = moderateModel.extractRecipeInfoFromServer( [oneRecipe] );
    res.render("application/ifttt_operation/editRecipe",{ recipeInfo: recipeInfoArray[0], layout:'layout/dashboard_layout'});
}

exports.ajaxSelectedGetRecipeInfo = function(req, res){
    //var index =
    //console.log("getRecipeInfo is called");
    //console.log(req.session.recipeSelected);
    console.log(req.session.recipeSelected);
    res.send(req.session.recipeSelected);
}

exports.editRecipe = function(req, res) {
    console.log("Received Edit Recipe: ");
    console.log(req.body);
    console.log(moderateModel.encodeDataForRecipeInfo(req.body));
    res.send();
};