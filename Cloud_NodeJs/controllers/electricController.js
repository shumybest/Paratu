function ElectricController(){ 
    //inherit Controller
    var Controller = require("../controllers/Controller");
    Controller.call(this);
    
    var model = this.model;
    
    this.sendElectric = function(obj,sock){
    	console.log(obj);
    	model.doSendElectric(obj,function(result){
			console.log("send electric "+result);
		});
    };
    
    this.showElec = function(obj,sock){
    	model.doShowElec(obj,function(result){
			console.log(JSON.stringify(result));
		});
    };
    
  /*  this.findAll = function(obj,sock){
    	model.doFindAll(obj,function(result){
			console.log(JSON.stringify(result));
		});
    };*/
}
module.exports = new ElectricController();
