function IftttModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
	//load counter model
	this.counter = require("../models/counterModel");

	this.modelDB = this.getIftttModel();
   // this.ifttt = {};
	
	this.rpc = require("../public/Rpc");
}


IftttModel.prototype.getIftttModel = function(){
	try{
        if(this.mongoose.model('Sc_ifttt')){
            return this.mongoose.model('Sc_ifttt');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            var Sc_iftttSchema = new this.mongoose.Schema({
            	_id:{type : Number, require : true,index : {unique : true }},
            	owner:String,
            	active: {type:Number,default:1}, 
            	triggerEvent : {},
            	responseEvent : {},
            	recipeRec : {}
            	//timer:String
            	//timer:{}
            }) ;  

            return this.mongoose.model('Sc_ifttt',Sc_iftttSchema);
        }
    }
};

IftttModel.prototype.doCreate = function(request,callback){
	var self = this;
	//self.rpc.invoke("get");
	self.counter.incrementCounter("ifttt",function(res){
		var insert_doc={_id:res,triggerEvent:request.triggerEvent,responseEvent:request.responseEvent,owner:request.owner,recipeRec:request.recipeRec};
		self.insert(self.modelDB,insert_doc,function(result){
			if(result.status=="success"){
				request["iftttid"] = res;
	    		eval("self."+request.triggerEvent.type+"(request)");
			}
			callback(result.status);
		});		
	});
};


IftttModel.prototype.doDelete = function(request,callback){
	var self = this;
	var query_doc = {_id:request.iftttId};
	this.delete(self.modelDB,query_doc,function(result){
		if(result=="success"){
			//self.cancelIfttt(request.iftttid);
			self.rpc.invoke("cancelIfttt",request.iftttid);
		}
	    callback(result);
	});
	
	
};

IftttModel.prototype.doStop = function(request,callback){
	var self = this;
 	var update_doc = {_id:request.iftttId}
 	var updateContent = {$set: {active:0}};
	this.update(self.modelDB,update_doc,updateContent,function(result){
		if(result=="success"){
			//self.cancelIfttt(request.iftttid);
			self.rpc.invoke("cancelIfttt",request.iftttid);
		}
	    callback(result);
 	});
};

IftttModel.prototype.doActive = function(request,callback){
	var self = this;
 	var update_doc = {_id:request.iftttId}
 	var updateContent = {$set: {active:1}};
	this.update(self.modelDB,update_doc,updateContent,function(result){
		if(result=="success"){
			eval("self."+request.triggerEvent.type+"(request)");
		}
	    callback(result);
 	});
};

IftttModel.prototype.doEdit = function(request,callback){
	var self = this;
	var EventProxy = require('eventproxy');
	var proxy = new EventProxy();
	proxy.all("delete","create",function(deletedata,createdata){
		if(deletedata == "success" && createdata == "success"){
			callback("success");
		}else{
			callback("error");
		}
	});
	self.doDelete(request,function(result){
		console.log("delete"+result);
		proxy.emit("delete", result);
	});
	self.doCreate(request,function(result){
		console.log("create"+result);
		proxy.emit("create", result);
	});
};

IftttModel.prototype.doFindAll = function(request,callback){
	var self = this;
	var query_doc = {owner:request.owner};
	var option_doc = {__v:0,owner:0};
	self.findAll(self.modelDB,query_doc,option_doc,function(result){
		callback(result);
	});
};

IftttModel.prototype.doLaunchIfttt = function(request){
	var self = this;
	var query_doc = {active:1};
	var option_doc = {__v:0,owner:0,active:0};
	self.findAll(self.modelDB,query_doc,option_doc,function(res){
		//var result = eval('(' + res + ')'); 
		if(res.status == "success"){
			var result = res.info;
			result.forEach(function(doc,index){
				doc["iftttid"] = doc._id;
	    		eval("self."+doc.triggerEvent.type+"(doc)");
	    	});
		}
	});
};

IftttModel.prototype.dateTimer = function(request){
	var self = this;
	//eval("self."+request.responseEvent.event.operation+"(request)");
	var time = request.recipeRec.rec;
	var timer = this.processTimer("processTurnOnOff",time,request);
	self.rpc.invoke("setForIfttt",{id:request.iftttid,timer:timer});
}

/*IftttModel.prototype.turnOnOff = function(request){
	var self = this;
	var tool = require('../public/Tool');
	if(request.triggerEvent.event.time.split("-").length == 2){
		var time = tool.timeAchieve().day+"-"+request.triggerEvent.event.time;
	}else{
		var time = request.triggerEvent.event.time;
	}
	var time = request.recipeRec.rec;
	//var timer = this.processTimer(/^\d+\-\d+?/,"processTurnOnOff",time,request);
	var timer = this.processTimer("processTurnOnOff",time,request);
	if(request.triggerEvent.type == "dateTimer"){
		//self.ifttt[request.iftttid] = timer;
		self.rpc.invoke("setForIfttt",{id:request.iftttid,timer:timer});
	}
}*/

/*
IftttModel.prototype.weather = function(request){
	var self = this;
    var timer;
	if(/\-/.test(request.triggerEvent.event.weathertime)){
		var tool = require('../public/Tool');
	    var timestamp  = tool.timeAchieve().getTimestamp(request.triggerEvent.event.weathertime);
	 	timer = setInterval(function(){
	 		var currenttimestamp = tool.timeAchieve().getTimestamp(tool.timeAchieve().time);
	 		if(currenttimestamp == timestamp){
	 			self.scrapy(request);
	 	 		console.log("liu3");
	 	 		delete self.ifttt[request.iftttid];
	 	 		clearInterval(timer);
	 		}
		},60000);
	}else{
		var later = require('later');
		var sched = later.parse.cron(request.triggerEvent.event.weathertime);
		//var sched =  later.parse.recur().every(5).second();
		timer = later.setInterval(function() {
			self.scrapy(request);
 	 		console.log("liu4");
		}, sched);
	}
	self.ifttt[request.iftttid] = timer;
}*/

IftttModel.prototype.weather = function(request){
	//var time = request.triggerEvent.event.weathertime;
	//if(/-/.test(request.recipeRec.rec)){
	//	var time = request.recipeRec.rec.split(" ");
	//	time = time[0];
	//}else{
		var time = request.recipeRec.rec;
	//}
	
	var timer = this.processTimer("scrapy",time,request);
	//this.ifttt[request.iftttid] = timer;
	this.rpc.invoke("setForIfttt",{id:request.iftttid,timer:timer});
}

IftttModel.prototype.scrapy = function(request){
	var self = this;
	var tool = require('../public/Tool');
	var scrapy = require('../public/Scrapy');
	var location  = request.triggerEvent.event.location.split("-");
	var province = location[0];
	var city = location[1];
	var url; 
	
	for(var loc in scrapy.location[province]){
		if(loc == city){
			url="http://www.weather.com.cn/weather/"+scrapy.location[province][loc]+".shtml";
			break;
		}
	}
	scrapy.get(url,function(data){
		var cheerio = require('cheerio');
	//	movie.name = $(content).find('span[property="v:itemreviewed"]').text();
	//	movie.director = $(content).find('#info span:nth-child(1) a').text();
		var html = data.toString();
	    $ = cheerio.load(html);
	  //  if(request.triggerEvent.event.moment=="daytime"){
	    	console.log($(".yuBaoTable").find('td:nth-child(4)').html());
	    	if(tool.unescape($(".yuBaoTable").find('td:nth-child(4) a').html()) == request.triggerEvent.event.weather){
	    		console.log("dsdsliu");
	    		//eval("self."+request.responseEvent.event.operation+"(request)");
	    		var operation = "process"+request.responseEvent.event.operation.substr(0,1).toUpperCase()+request.responseEvent.event.operation.substr(1);
	    		eval("self."+operation+"(request)");
	    	}
	  /*  }else if(request.triggerEvent.event.moment=="night"){
	    	console.log($('td[style="background-color:#ebeff8;"] a').eq(1).html());
	    	if(tool.unescape($('td[style="background-color:#ebeff8;"] a').eq(1).html()) == request.triggerEvent.event.weather){
		    	eval("self."+request.responseEvent.event.operation+"(request)");
		    }
	    }*/
	    
	   // console.log($(".yuBaoTable").find('td:nth-child(12)').html());
	  // console.log($('td[style="background-color:#ebeff8;"] a').eq(1).html());
	});
}

/*
IftttModel.prototype.turnOnOff = function(request){
	console.log("turn on");
	var self = this;	
	var timer;
    //load device model
    var deviceModel = require("../models/deviceModel");
    var req = {coreid:request.responseEvent.event.coreid,value:parseInt(request.responseEvent.event.value)};
    
	if(/^\d+\-\d+?/.test(request.triggerEvent.event.time)){
		var tool = require('../public/Tool');
		console.log("length:"+request.triggerEvent.event.time.split("-").length);
		if(request.triggerEvent.event.time.split("-").length == 2){
			var time = tool.timeAchieve().day+"-"+request.triggerEvent.event.time;
		}else{
			var time = request.triggerEvent.event.time;
		}
	    var timestamp  = tool.timeAchieve().getTimestamp(time);
	 	timer = setInterval(function(){
	 		var currenttimestamp = tool.timeAchieve().getTimestamp(tool.timeAchieve().time);
	 		if(currenttimestamp == timestamp){
	 			//eval("self."+request.responseEvent.event.operation+"(request.responseEvent.event)");
	 			deviceModel.doUpdate(req,null);
	 	 		console.log("liu1");
	 	 		if(request.triggerEvent.event,type == "dateTimer"){
	 	 			delete self.ifttt[request.iftttid];
	 	 		}
	 	 		clearInterval(timer);
	 		}
		},60000);
	}else{
		var later = require('later');
		console.log(request.triggerEvent.event.time);
		var sched = later.parse.cron(request.triggerEvent.event.time);
		//var sched =  later.parse.recur().every(5).second();
		timer = later.setInterval(function() {
			//eval("self."+request.responseEvent.event.operation+"(request.responseEvent.event)");
			deviceModel.doUpdate(req,null);
 	 		console.log("liu2");
		}, sched);
		
	}

	if(request.triggerEvent.type == "dateTimer"){
		self.ifttt[request.iftttid] = timer;
	}
}*/


IftttModel.prototype.processTurnOnOff = function(request){
	  //load device model
    var deviceModel = require("../models/deviceModel");
    var req = {coreid:request.responseEvent.event.coreid,value:parseInt(request.responseEvent.event.value)};
    deviceModel.doUpdate(req,null);
}

IftttModel.prototype.processTimer = function(dothing,time,request){
	var self = this;
    var timer;
	
	if(/-/.test(time)){
		var tool = require('../public/Tool');
	    var timestamp  = tool.timeAchieve().getTimestamp(time);
	 	timer = setInterval(function(){
	 		var currenttimestamp = tool.timeAchieve().getTimestamp(tool.timeAchieve().time);
	 		if(currenttimestamp == timestamp){
	 			eval("self."+dothing+"(request)");
	 	 		console.log("liu3");
	 	 		//delete self.ifttt[request.iftttid];
	 	 		self.rpc.invoke("cancelIfttt",request.iftttid);
	 	 		//clearInterval(timer);
	 		}
		},60000);
	}else{
		var later = require('later');
		//var sched = later.parse.cron(request.triggerEvent.event.time);
		var sched = later.parse.cron(time);
		//var sched =  later.parse.recur().every(5).second();
		timer = later.setInterval(function() {
			eval("self."+dothing+"(request)");
		}, sched);
	}
	return timer;
}

IftttModel.prototype.sendMail = function(){
	console.log("send email");
}

/*
IftttModel.prototype.cancelIfttt = function(iftttid){
	var self = this;
	if(self.ifttt[iftttid].hasOwnProperty('clear')){
 		self.ifttt[iftttid].clear();
 	}else{
 		clearInterval(self.ifttt[iftttid]);
 	}
 	delete self.ifttt[iftttid];
};*/
/*
IftttModel.prototype.cancelIfttt = function(timer){
	if(timer.hasOwnProperty('clear')){
 		timer.clear();
 	}else{
 		clearInterval(timer);
 	}
};
*/
module.exports = new IftttModel();

