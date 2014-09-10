var electricModel = require("../../models/electricModel");

exports.showElec = function(req,res){
   // console.log(req.body);
	electricModel.doShowElec(req.body,function(result){

        var disAccum = {xaxisValue: result.xaxisValue, xaxisType:result.xaxisType, yaxisValue:result.zaxisValue };
        var disOnTime ={xaxisValue: result.xaxisValue, xaxisType:result.xaxisType, yaxisValue:result.yaxisValue};
       // console.log("The info found in DB is: ");
       //console.log(result);
        res.send({elecAccum: disAccum, elecOnTime: disOnTime});
	});
};
