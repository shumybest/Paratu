function ElectricModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.modelDB = this.getElectricModel();   
    this.tool = require('../public/Tool');
    //this.timetool = this.tool.timeAchieve();
}

ElectricModel.prototype.getElectricModel = function(){
    try{
        if(this.mongoose.model('Sc_electric')){
            return this.mongoose.model('Sc_electric');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            var Sc_electricSchema= new this.mongoose.Schema({
                coreid:{type : String , index : true},
                devicename:String,
                day:String,
                inmonth:String,
                totalofday:Number,
                data:[],
               // time:[],
                intervalvalue:[],
                totalofmonth:Number               
            }) ;

            return this.mongoose.model('Sc_electric',Sc_electricSchema);
        }
    }
}

/*
ElectricModel.prototype.doFindAll = function(request,callback){
	var self = this;
	var query_doc = {owner:request.owner};
	var option_doc = {_id: 0, __v: 0,coreid:1,devicename:1};
	self.distinct(self.modelDB,query_doc,"devicename",function(err,result){
	});
}
*/

ElectricModel.prototype.doSendElectric = function(request,callback){
	var self = this;
    var tool = self.tool;
    var day = tool.timeAchieve().day;
    var hour = tool.timeAchieve().hour;
    var month = tool.timeAchieve().month;
	var dataPush = [];
	var intervalPush = [];
	var supplementForData = [];
	var supplementForInterval = [];
	
	var process = function(preHour,hour,interval){
		for(preHour++;preHour<hour;preHour++){
			dataPush.push(0);
			intervalPush.push(interval);
		}
		dataPush.push(request.value);
	}
   
	var supplement = function(intervalvalue,doc){
		var supplement = 24 - doc.data.length;
		if(supplement>0){
			for(var i=0;i<supplement;i++){
				supplementForData.push(0);
				supplementForInterval.push(intervalvalue);
			}
			var update_doc = {_id:doc._id};
    		var updateContent = {$push:{data:{$each:supplementForData},intervalvalue:{$each:supplementForInterval}}};
    		self.findAndModify(self.modelDB,update_doc,updateContent,function(err,result){});
		}
	}
	
    var query_doc={coreid:request.coreid,day:day};  
    self.isFinded(self.modelDB,query_doc,function(err,res){
    	if(res){
    		var preHour = res.data.length;  
    		process(preHour,hour,res.intervalvalue[res.data.length-1]);
    		intervalPush.push(request.value+res.intervalvalue[res.intervalvalue.length-1]);
    		
    		var update_doc = {coreid:request.coreid,day:day};
    		var updateContent = {$push:{data:{$each:dataPush},intervalvalue:{$each:intervalPush}},$inc:{totalofday:request.value,totalofmonth:request.value}};
    		self.findAndModify(self.modelDB,update_doc,updateContent,function(err,result){
    				if(!result){
	    				callback("error");
	    	    	}else{
	    	    		callback("success");
	    	    	}
    		});
    	}else{
    		var addzero = hour;	
    		 //load device model
            var deviceModel = require("../models/deviceModel");
            var query_doc={coreid:request.coreid};
            deviceModel.isFinded(deviceModel.modelDB,query_doc, function (err,result) {
            	var devicename = result.devicename;
            	var pattern = new RegExp("^.*" + month + ".*$", "i");
            	var query_doc={coreid:request.coreid,day:pattern};
            	
                var option_doc = {__v:0,devicename:0};
                var sort_doc = {sort:{day:-1},limit:1};
                self.findCursor(self.modelDB,query_doc,option_doc,sort_doc,function(err,res){
                	if(res[0]){
                		var intervalvalue = res[0].intervalvalue[res[0].intervalvalue.length-1];
                		supplement(intervalvalue,res[0]);
                	
                		var preHour = 0;
                		process(preHour,hour,intervalvalue);
                		var totalofmonth = res[0].totalofmonth+request.value;
                		intervalPush.push(request.value+intervalvalue);
                	}else{
                		var option_doc = {__v:0,devicename:0};
                        var sort_doc = {sort:{day:-1},limit:1};
                        var query_doc={coreid:request.coreid};
                        self.findCursor(self.modelDB,query_doc,option_doc,sort_doc,function(err,res){
                        	 if(res[0]){
                        		var intervalvalue = res[0].intervalvalue[res[0].intervalvalue.length-1];
                         		supplement(intervalvalue,res[0]);
                        	 }
                        	 
                        });
                        
                		var preHour = 0,interval = 0;
                		process(preHour,hour,interval);
                		intervalPush.push(request.value);
                		var totalofmonth = request.value;
                	}
                	var insert_doc={coreid:request.coreid,devicename:devicename,day:day,inmonth:month,totalofday:request.value,totalofmonth:totalofmonth,data:dataPush,intervalvalue:intervalPush}; 
                	self.insert(self.modelDB,insert_doc,function(result){
            	    		callback(result.status);
            		});
                });
            });
    	}
    });
};

ElectricModel.prototype.doShowElec = function(request,callback){ 
	var self = this;
    var tool = self.tool;
	var start = request.startday;
	var end = request.endday;
	var starttimestamp = tool.timeAchieve().getTimestamp(start);
	var endtimestamp = tool.timeAchieve().getTimestamp(end);
	var electricinfo = {};
	var xaxisValue = [];
	var yaxisValue = {};
	var zaxisValue = {};
	var yaxisdata = {};
	var intervaldata = {};
	var yaxis = {};
	
	var re = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(start);
	//var re = /(\d{4})-(\d{1,2})?(?:-(\d{1,2}))/.exec(start);
	var startyear = parseInt(re[1]);
	var startmonth = parseInt(re[2]);
	var startday = parseInt(re[3]);
	re = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(end);
	var endyear = parseInt(re[1]);
	var endmonth = parseInt(re[2]);
	var endday = parseInt(re[3]);
	
	var EventProxy = require('eventproxy');
	var proxy = new EventProxy();
	
	var query_doc={coreid:{$in:request.coreid},day:{$gte:start,$lte:end}};
    var option_doc = {__v:0,_id:0};
    var sort_doc = {sort:{coreid:1,day:1}}
    var group = {
			   key: {"inmonth":1,"coreid":1},
			   cond: {day:{$gte:start,$lte:end}},
			   reduce: function(doc, out) {
				   if(doc.totalofmonth>out.totalofmonth){
					   out.totalofmonth = doc.totalofmonth;
					   out.devicename = doc.devicename;
					   out.coreid = doc.coreid;
				   }    
			   },
			   initial: {
				   totalofmonth: 0
			   }
			  // finalize: function(out) {
			 //      out.devicename = out.value;
			//   }
	};
    
    if(request.type == "hour" || request.type == "day"){
    	this.findCursor(self.modelDB,query_doc,option_doc,sort_doc,function(err,res){
        	proxy.emit("returndata", res);
        });
    	
    }else{
    	this.group(self.modelDB,group,function(err,res){
    		proxy.emit("returndata", res);
    	});
    }
    proxy.all("returndata",processdata);
    
	function processdata(res){
    	var docday = 0;
    	res.forEach(function(doc,index){
    		if(yaxis[doc.coreid] == undefined){
    			yaxis[doc.coreid] = [doc];
    		}else{
    			yaxis[doc.coreid].push(doc);
    		}
    	});
    	
		if(request.type == "hour"){
			for(var i=0;i<((endtimestamp-starttimestamp)/(24*60*60*1000)+1);i++){
				for(var j=1;j<25;j++){
					xaxisValue.push(j);
				}
			}
			var addzero = 0;

	    	for(var core in yaxis){
				if(yaxisdata[core] == undefined){
					yaxisdata[core] = [];
	    		}
				
				if(intervaldata[core] == undefined){
					intervaldata[core] = [];
	    		}
	    		
	    		var dayinterval = (tool.timeAchieve().getTimestamp(yaxis[core][0].day)-starttimestamp)/(24*60*60*1000);
	    		for(var i=0;i<dayinterval;i++){		
	    			var inputvalue = yaxis[core][0]["intervalvalue"][0];
	    			for(var j=0;j<24;j++){
	    				yaxisdata[core].push(0);	
	    				intervaldata[core].push(inputvalue);
	    			}	
	        	}
	    		
	    		yaxis[core].forEach(function(doc,index){
	        		if(index !=0){
	        			var daydistance = (tool.timeAchieve().getTimestamp(doc.day)-tool.timeAchieve().getTimestamp(docday))/(24*60*60*1000)-1;
	    				for(var i=0;i<daydistance;i++){
	    		    		for(var j=0;j<24;j++){
	    		    			yaxisdata[core].push(0);
	    	    				intervaldata[core].push(doc.intervalvalue[0]);
	    	    			}
	    		    	}
	        		}
	        		
	        		doc.data.forEach(function(datavalue,indexdata){	
	            		yaxisdata[doc.coreid].push(datavalue);
	        			addzero = 24 - doc.data.length;
	        		});
	        		doc.intervalvalue.forEach(function(datavalue,indexdata){	
	        			intervaldata[doc.coreid].push(datavalue);
	        		});
	        		
	        		if(index == yaxis[core].length-1){
	        			for(var i=0;i<addzero;i++){
	        				yaxisdata[doc.coreid].push(0);
	        				intervaldata[doc.coreid].push(doc.intervalvalue[doc.intervalvalue.length-1]);
	        			}
	        			var enddayinterval = (endtimestamp - tool.timeAchieve().getTimestamp(yaxis[core][index].day))/(24*60*60*1000);
	            		if(enddayinterval>0){
	            			for(var i=0;i<enddayinterval;i++){
	                			for(var j=0;j<24;j++){
	                				yaxisdata[doc.coreid].push(0);
	                				intervaldata[core].push(doc.intervalvalue[doc.intervalvalue.length-1]);
	                			}
	            			}
	            		}
	        		}
	        		yaxisValue[doc.coreid] = {name:doc.devicename,lineWidth:1,marker:{"radius": 3, "symbol": 'circle'},data:yaxisdata[doc.coreid]};
	        		zaxisValue[doc.coreid] = {name:doc.devicename,lineWidth:1,marker:{"radius": 3, "symbol": 'circle'},data:intervaldata[doc.coreid]};
	        		docday = doc.day;
	        	});
	    	}
	    	
	    	electricinfo["xaxisType"] = "小时";
	    	electricinfo["zaxisValue"] = zaxisValue;
		}else if(request.type == "day"){
			var monthday = tool.timeAchieve().dayInMonth(startmonth,startyear);
			var monthdistance = 12*(endyear-startyear)-startmonth+endmonth;
			var yeardistance = endyear - startyear;
			
			var day = startday;
			if(monthdistance == 0){
				for(;day<= endday;day++){
					xaxisValue.push(day);
				}
			}else if(monthdistance == 1){
				for(;day<= monthday;day++){
					xaxisValue.push(day);
				}
			}
			
			if(yeardistance ==0 && monthdistance >= 1){
				if(monthdistance > 1){
					for(var j=1;j< monthdistance;j++){
						var monthday = tool.timeAchieve().dayInMonth(j+startmonth,startyear);
						for(var m=1;m<= monthday ;m++){
							xaxisValue.push(m);
						}
					}
				}
				for(var j=1;j<=endday;j++){
					xaxisValue.push(j);
				}
			}	

			if(yeardistance > 0){
				for(var i=0;i<yeardistance+1;i++,startyear++){
					var startm = startmonth;
					if(startyear != endyear){
						for(var j=0;j<12-startm;j++){
							var monthday = tool.timeAchieve().dayInMonth(++startmonth,startyear);
							for(var m=1;m<= monthday ;m++){
								xaxisValue.push(m);
							}
						}
						startmonth = 0;
					}else{
						for(var j=1;j<endmonth;j++){
							var monthday = tool.timeAchieve().dayInMonth(++startmonth,startyear);
							for(var m=1;m<= monthday ;m++){
								xaxisValue.push(m);
							}
						}
					}
				}
				for(var j=1;j<=endday;j++){
					xaxisValue.push(j);
				}
			}
	    	
	    	for(var core in yaxis){
				if(yaxisdata[core] == undefined){
					yaxisdata[core] = [];
	    		}

	    		var dayinterval = (tool.timeAchieve().getTimestamp(yaxis[core][0].day)-starttimestamp)/(24*60*60*1000);
	    		
	    		for(var i=0;i<dayinterval;i++){
	    			yaxisdata[core].push(0);
	    		}
	    		
	    		yaxis[core].forEach(function(doc,index){
	        		if(index !=0){
	        			var daydistance = (tool.timeAchieve().getTimestamp(doc.day)-tool.timeAchieve().getTimestamp(docday))/(24*60*60*1000)-1
	        			if(daydistance > 0){
	        				for(var i=0;i<daydistance;i++){	
	        		    			yaxisdata[core].push(0);
	        		    	}
	        			}
	        		}
	    			yaxisdata[doc.coreid].push(doc.totalofday);
	        		
	        		if(index == yaxis[core].length-1){	
	            		var dayinterval = (endtimestamp - tool.timeAchieve().getTimestamp(yaxis[core][index].day))/(24*60*60*1000);
	            		for(var i=0;i<dayinterval;i++){
	            			yaxisdata[core].push(0);
	            		}
	        		}
	
	        		yaxisValue[doc.coreid] = {name:doc.devicename,lineWidth:1,marker:{"radius": 3, "symbol": 'circle'},data:yaxisdata[doc.coreid]};
	        		docday = doc.day;
	        	});
	    	}
	    	electricinfo["xaxisType"] = "天";
		}else if(request.type == "month"){
			var docmonth = 0;
			var monthdistance = 12*(endyear-startyear)-startmonth+endmonth;
			for(var i=0;i<monthdistance+1;i++){
				var month = parseInt(startmonth)+i;
				if(month%12 == 0){
					xaxisValue.push(12);
				}else{
					xaxisValue.push(month%12);
				}
			}
			for(var core in yaxis){
	    		yaxis[core] = yaxis[core].sort(function(a,b){return a["inmonth"]>b["inmonth"]?1:a["inmonth"]==b["inmonth"]?0:-1});
				if(yaxisdata[core] == undefined){
					yaxisdata[core] = [];
	    		}
	    		
	    		var re = /(\d{4})-(\d{1,2})/.exec(yaxis[core][0].inmonth);
	    		var inyear = parseInt(re[1])
	    		var inmonth = parseInt(re[2]);
	    		
				var monthdistance = 12*(inyear-startyear)-startmonth+inmonth;
				for(var i=0;i<monthdistance;i++){
					yaxisdata[core].push(0);
		    	}

	    		yaxis[core].forEach(function(doc,index){
	    			if(index !=0){
	    	    		var re = /(\d{4})-(\d{1,2})/.exec(doc.inmonth);
	    	    		var year1 = parseInt(re[1]);
	    	    		var month1 = parseInt(re[2]);
	    	    		var re = /(\d{4})-(\d{1,2})/.exec(docmonth);
	    	    		var year2 = parseInt(re[1]);
	    	    		var month2 = parseInt(re[2]);
	        			var monthdistance = 12*(year1-year2)-month2+month1-1;

	        			if(monthdistance > 0){
	        				for(var i=0;i<monthdistance;i++){	
	        		    			yaxisdata[core].push(0);
	        		    	}
	        			}
	        		}
	    			
	            	yaxisdata[core].push(doc.totalofmonth);

	            	if(index == yaxis[core].length-1){	
	            		var re = /(\d{4})-(\d{1,2})/.exec(yaxis[core][index].inmonth);
	            		var inyear = parseInt(re[1])
	            		var inmonth = parseInt(re[2]);            		
	            		var monthdistance = 12*(endyear-inyear)-inmonth+endmonth;

	        			for(var i=0;i<monthdistance;i++){
	        				yaxisdata[core].push(0);
	        	    	}
	        		}
	        		yaxisValue[doc.coreid] = {name:doc.devicename,marker:{symbol:'square'},data:yaxisdata[doc.coreid]};
	        		docmonth = doc.inmonth;
	    		});
	    	}
	    	electricinfo["xaxisType"] = "月";
		}
    	electricinfo["xaxisValue"] = xaxisValue;
    	electricinfo["yaxisValue"] = yaxisValue;
    	callback(electricinfo);
	};
}; 

module.exports = new ElectricModel();
