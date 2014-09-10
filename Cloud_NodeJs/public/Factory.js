function Factory(){ 
   this.jsonObj;  
   
   this.setController = function(obj,sock){
	    this.jsonObj = obj;
        eval("var controllerObj = require('../controllers/"+obj.module+"Controller');");
        controllerObj.run(obj.object,sock);   	
   }

   this.setModel = function(requset){
	   eval("var model = require('../models/"+requset+"Model');");
       return model; 
   }
}
exports.Factory = new Factory();
