function DeviceModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.modelDB = this.getDeviceModel();
}

DeviceModel.prototype.getDeviceModel = function(){
	try{
        if(this.mongoose.model('Sc_device')){
            return this.mongoose.model('Sc_device');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            var Sc_deviceSchema = new this.mongoose.Schema({
            	coreid : String,
                devicename : String,
                value : {type:Number,default:0},
                isConnect : {type:Number,default:0},
                owner : String
            }) ;  

            return this.mongoose.model('Sc_device',Sc_deviceSchema);
        }
    }
};

DeviceModel.prototype.doCreate = function(request,callback){
	var self = this;
	 var insert_doc={coreid:request.coreid,devicename:request.devicename,owner:request.owner};
	 self.insert(self.modelDB,insert_doc,function(result){
			callback(result.status);
	 });
};

DeviceModel.prototype.doDelete = function(request,callback){
	var self = this;
	var delete_doc = {coreid:request.coreid}
	this.delete(self.modelDB,delete_doc,function(result){
		callback(result);
	});
};

DeviceModel.prototype.doUpdate = function(request,callback){
	var self = this;
	if(request.hasOwnProperty('value')){
		var coreFuntion = require("../public/CoreFunction");
		if(request.value==1){
			var setobj = {value:request.value};
			var info = coreFuntion.turnOn();
		}else{
			var setobj = {value:request.value};
			var info = coreFuntion.turnOff();
		}
		/* var dnode = require('dnode');
		 var d = dnode.connect(5004);
		 d.on('remote', function (remote) {
		     remote.transform(info.toString(),request.coreid);
		 });*/
		 var rpc = require("../public/Rpc");
		 rpc.invoke("transformInfo",{info:info.toString(),coreid:request.coreid});
	}else if(request.hasOwnProperty('isConnect')){
		var setobj = {isConnect:request.isConnect};
	}
 	
 	var update_doc = {coreid:request.coreid};
 	var updateContent = {$set:setobj};

 	this.update(self.modelDB,update_doc,updateContent,function(result){
 		if(callback){
 	 		callback(result);
 		}
 	});
};

DeviceModel.prototype.doRead = function(request,callback){
	var self = this;
	var query_doc = {coreid:request.coreid};
	var option = {__v:0,_id:0};
	this.find(self.modelDB,query_doc,option,function(err,result){
		if(result){
 	 		callback(result);
		}else{
			callback("error");
		}
	});
};

/*DeviceModel.prototype.doEditName = function(request,callback){
	var self = this;
	var query_doc={owner:request.owner,devicename:request.devicename};
	self.isFinded(self.modelDB,query_doc,function(err,res){
		 if(res){
			 callback("used");
		 }else{
			 var update_doc = {coreid:request.coreid};
			 var updateContent = {$set:{devicename:request.devicename}};
			 this.update(self.modelDB,update_doc,updateContent,function(result){
			 	 		callback(result);
			 });
		 }
	 }); 
 	
};*/

DeviceModel.prototype.doFindAll = function(request,callback){
	var self = this;
	var query_doc = {owner:request.username};
	var option_doc = {_id: 0, __v: 0};
	self.findAll(self.modelDB,query_doc,option_doc,function(result){
		callback(result);
	});
};


/*DeviceModel.prototype.doSerach = function(modelDB,request,callback){
	var self = this;
	var reg =new RegExp(request.devicename);
	var query_doc = {owner:request.username};   // req.body
	var option = {__v:0,_id:0};

	var results = [];
	modelDB.find(query_doc,option).exec(function(error, devices){
		if(error){
			callback("error");
		}else{
			devices.forEach(function(device,index){
				if(reg.test(device.devicename)){
					 results.push(device);
				}
			});
			
			var count = results.length;
			var tool = require("../public/Tool");
			var page = tool.pagination(count);
			callback({devices:results,page:page});
		}
	});
};
*/
module.exports = new DeviceModel();

