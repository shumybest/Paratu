function DeviceController(){ 
    //inherit Controller
    var Controller = require("../controllers/Controller");
    Controller.call(this);
    
    var model = this.model;

    this.create = function(obj,sock){
    	model.doCreate(obj,function(result){
    		if(result=="used"){
    			sock.write("{res:'device name has been used'}\n")
    		}else{
    			sock.write("{res:'create device "+result+"'}\n");
    		}
		});
    }
    
    this.delete = function(obj,sock){
    	model.doDelete(obj,function(result){
    		sock.write("{res:'delete device "+result+"'}\n")
		});
    }
    
    this.update = function(obj,sock){
    	model.doUpdate(obj,function(result){
    		if(obj.hasOwnProperty('value')){
    			sock.write("{res:'update device "+result+"'}\n")
    		}
    	/*	if(!sock.hasOwnProperty('coreid')){
    			sock.write("{res:'update device "+result+"'}\n")
    		}*/
		});
    }
    
    this.read = function(obj,sock){
    	model.doRead(obj,function(result){
			sock.write("{res:"+result+"}\n");
		});
    }
    
   /* this.editName = function(obj,sock){
    	model.doEditName(obj,function(result){
    		if(result=="used"){
    			sock.write("{res:'device name has been used'}\n")
    		}else{
    			sock.write("{res:'edit device "+result+"'}\n");
    		}
		});
    }*/

    this.findAll = function(obj,sock){
    	model.doFindAll(obj,function(result){	
    		var util = require('util');
    		var info = util.inspect(result.info);
    		if(result.status == "success"){
    			sock.write("{res:"+info.replace(/(^\s*)|(\s*$)/mg, "")+"}\n");
    		}else{
    			sock.write("{res:find devices error"}\n");
    		}
		});
    } 
}
module.exports = new DeviceController();
