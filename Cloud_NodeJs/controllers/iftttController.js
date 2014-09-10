function IftttController(){ 
    //inherit Controller
    var Controller = require("../controllers/Controller");
    Controller.call(this);
    
    var model = this.model;

    this.create = function(obj,sock){
    	model.doCreate(obj,function(result){
    		sock.write("{res:'create ifttt "+result+"'}\n")
		});
    }
    
    this.delete = function(obj,sock){
    	model.doDelete(obj,function(result){
    		sock.write("{res:'delete ifttt "+result+"'}\n")
		});
    }
    
    this.stop = function(obj,sock){
    	model.doStop(obj,function(result){
    		sock.write("{res:'stop ifttt "+result+"'}\n")
		});
    }
    
    this.active = function(obj,sock){
    	model.doActive(obj,function(result){
    		sock.write("{res:'active ifttt "+result+"'}\n")
		});
    }
    
    this.edit = function(obj,sock){
    	model.doEdit(obj,function(result){
    		sock.write("{res:'edit ifttt "+result+"'}\n")
		});
    }
   
    this.findAll = function(obj,sock){
    	model.doFindAll(obj,function(result){	
    		var util = require('util');
    		var info = util.inspect(result.info);
    		if(result.status == "success"){
    			sock.write("{res:"+info.replace(/(^\s*)|(\s*$)/mg, "")+"}\n");
    		}else{
    			sock.write("{res:find ifttts error}\n");
    		}
		});
    } 
    
    this.launchIfttt = function(obj,sock){
    	model.doLaunchIfttt(obj);
    } 
}
module.exports = new IftttController();
