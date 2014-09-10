function DB(){
    var config = require("../configs/config");
    this.mongoose = require("mongoose");
    this.construct = function(){
    	this.mongoose.connection.close();
		this.mongoose.connect(config.mongoHost);
    	var db = this.mongoose.connection;

        if(arguments.length > 0){
         	var sock = arguments[0];
             db.on('error', function(){
            	console.error('connect to %s error: ', config.mongoHost, err.message);
             	sock.write("{res:'connection error'}\n");
        		process.exit(1);
             });
         }else{
         	db.on('error', console.error.bind(console, 'connection error:'));
         }
   
         /*db.once('open', function callback () {
             console.log("Database has been connected....");
         });*/
    };

    this.isFinded = function(modelDB,condition,callback){
    	modelDB.findOne(condition,function(err,res){
			    callback(err,res);
        });
    };

    this.insert = function(modelDB,condition,callback){
        var insertItem = new modelDB(condition);
        insertItem.save(function(err,item){
        	if(err){
        		callback({status:"error"});
        	}else{
        		callback({status:"success",info:item});
        	}
        });
    };
    
    this.delete = function(modelDB,condition,callback){
    	modelDB.remove(condition,function(err,res){
    		if(!res){
    			callback("error");
    		}else{
    			callback("success");
    		}
    	});
    };
    
    this.update = function(modelDB,condition,updateContent,callback){
    	modelDB.update(condition,updateContent,function(err,res){
    		if(!res){
    			console.log(res);
     	 		callback("error");
    		}else{
    			callback("success");
    		}
    	});
    };
    
    this.find= function(modelDB,condition,option,callback){
    	modelDB.findOne(condition,option,function(err,res){
     	 	callback(err,res);
        });
    };
    
    this.findAll= function(modelDB,condition,option,callback){
    	modelDB.find(condition,option,function(err,res){
	    	if(res){
	    		//var util = require('util');
	    		//var info = util.inspect(res);
	    		//sock.write("{res:"+ifttts.replace(/\s+/g, "")+"}\n")
	    		//callback({status:"success",info:ifttts.replace(/(^\s*)|(\s*$)/mg, "")});	
	    		//callback(info.replace(/(^\s*)|(\s*$)/mg, ""));
	    		//callback({status:"success",info:info.replace(/(^\s*)|(\s*$)/mg, "")});
	    		callback({status:"success",info:res});
	    	}else{
	    		callback({status:"error",info:""});
	    	}
        });
    };
    
    this.findCursor = function(modelDB,condition,option,sort,callback){
    	modelDB.find(condition,option,sort,function(err,res){
	    	callback(err,res)
    	});
    };
    
    this.group = function(modelDB,group,callback){
    	modelDB.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true, function(err, results) {
    		callback(err,results);
    	});
    }
    
    this.findAndModify = function(modelDB,query,update,callback){
    	modelDB.collection.findAndModify(query,[],update,{new: true, upsert: true},function(err, result){
    		callback(err,result);
    	});  
    }
    
    this.distinct = function(modelDB,query,condition,callback){
    	modelDB.distinct("coreid", query, function(err, result){
    		callback(err,result);
    	});
    	/*modelDB.find(query,option).distinct(, function(err, result){
    		callback(err,result);
    	}); */
    	
    }
}
module.exports = DB;
//exports.DB = new DB();

